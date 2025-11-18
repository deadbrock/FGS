import { pool } from '../server.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/importacoes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Use CSV, XLSX, XLS ou JSON.'));
    }
  },
});

export const uploadMiddleware = upload.single('arquivo');

// ==========================================
// IMPORTAÇÃO DE ARQUIVOS
// ==========================================

export const importarArquivo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado',
      });
    }

    const { modulo, opcoes } = req.body;
    const arquivo = req.file;
    const inicioProcessamento = Date.now();

    // Determinar formato do arquivo
    const ext = path.extname(arquivo.originalname).toLowerCase();
    let formato = 'CSV';
    if (ext === '.xlsx') formato = 'XLSX';
    else if (ext === '.xls') formato = 'XLS';
    else if (ext === '.json') formato = 'JSON';

    // Processar arquivo baseado no formato
    let resultado;
    try {
      resultado = await processarArquivo(arquivo.path, formato, modulo);
    } catch (err) {
      // Limpar arquivo em caso de erro
      if (fs.existsSync(arquivo.path)) {
        fs.unlinkSync(arquivo.path);
      }
      throw err;
    }

    const tempoProcessamento = (Date.now() - inicioProcessamento) / 1000;

    // Determinar status
    let status = 'SUCESSO';
    if (resultado.linhasErro > 0 && resultado.linhasImportadas > 0) {
      status = 'PARCIAL';
    } else if (resultado.linhasImportadas === 0) {
      status = 'FALHA';
    }

    // Salvar histórico no banco
    let historicoId;
    try {
      const historicoResult = await pool.query(`
        INSERT INTO historico_importacoes (
          usuario, modulo, arquivo, formato, total_linhas, linhas_importadas,
          linhas_erro, status, tempo_processamento, mensagem_erro, dados_erro
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        req.user?.nome || 'Sistema',
        modulo || 'Geral',
        arquivo.originalname,
        formato,
        resultado.totalLinhas,
        resultado.linhasImportadas,
        resultado.linhasErro,
        status,
        tempoProcessamento,
        resultado.mensagemErro || null,
        JSON.stringify(resultado.erros || []),
      ]);
      historicoId = historicoResult.rows[0]?.id;
    } catch (err) {
      console.error('Erro ao salvar histórico:', err.message);
      // Continuar mesmo se não conseguir salvar histórico
    }

    // Limpar arquivo após processamento
    if (fs.existsSync(arquivo.path)) {
      fs.unlinkSync(arquivo.path);
    }

    res.json({
      success: true,
      data: {
        id: historicoId,
        totalLinhas: resultado.totalLinhas,
        linhasImportadas: resultado.linhasImportadas,
        linhasErro: resultado.linhasErro,
        status,
        tempoProcessamento,
        erros: resultado.erros || [],
        mensagemErro: resultado.mensagemErro,
      },
    });
  } catch (error) {
    console.error('Erro ao importar arquivo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao importar arquivo',
      message: error.message,
    });
  }
};

// Função auxiliar para processar arquivo
async function processarArquivo(caminhoArquivo, formato, modulo) {
  let resultado = {
    totalLinhas: 0,
    linhasImportadas: 0,
    linhasErro: 0,
    erros: [],
    mensagemErro: null,
  };

  try {
    if (formato === 'CSV') {
      resultado = await processarCSV(caminhoArquivo, modulo);
    } else if (formato === 'XLSX' || formato === 'XLS') {
      resultado = await processarExcel(caminhoArquivo, modulo);
    } else if (formato === 'JSON') {
      resultado = await processarJSON(caminhoArquivo, modulo);
    }
  } catch (err) {
    resultado.mensagemErro = err.message;
    throw err;
  }

  return resultado;
}

// Processar CSV
async function processarCSV(caminhoArquivo, modulo) {
  const csv = await import('csv-parser');
  const fs = await import('fs');
  const resultado = {
    totalLinhas: 0,
    linhasImportadas: 0,
    linhasErro: 0,
    erros: [],
  };

  return new Promise((resolve, reject) => {
    const linhas = [];
    fs.default
      .createReadStream(caminhoArquivo)
      .pipe(csv.default())
      .on('data', (row) => {
        linhas.push(row);
        resultado.totalLinhas++;
      })
      .on('end', async () => {
        try {
          // Processar cada linha
          for (let i = 0; i < linhas.length; i++) {
            try {
              await processarLinha(linhas[i], modulo, i + 1);
              resultado.linhasImportadas++;
            } catch (err) {
              resultado.linhasErro++;
              resultado.erros.push({
                linha: i + 1,
                erro: err.message,
                dados: linhas[i],
              });
            }
          }
          resolve(resultado);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

// Processar Excel
async function processarExcel(caminhoArquivo, modulo) {
  const XLSX = await import('xlsx');
  const fs = await import('fs');
  const resultado = {
    totalLinhas: 0,
    linhasImportadas: 0,
    linhasErro: 0,
    erros: [],
  };

  const workbook = XLSX.default.readFile(caminhoArquivo);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const linhas = XLSX.default.utils.sheet_to_json(worksheet);

  resultado.totalLinhas = linhas.length;

  // Processar cada linha
  for (let i = 0; i < linhas.length; i++) {
    try {
      await processarLinha(linhas[i], modulo, i + 1);
      resultado.linhasImportadas++;
    } catch (err) {
      resultado.linhasErro++;
      resultado.erros.push({
        linha: i + 1,
        erro: err.message,
        dados: linhas[i],
      });
    }
  }

  return resultado;
}

// Processar JSON
async function processarJSON(caminhoArquivo, modulo) {
  const fs = await import('fs');
  const resultado = {
    totalLinhas: 0,
    linhasImportadas: 0,
    linhasErro: 0,
    erros: [],
  };

  const conteudo = fs.default.readFileSync(caminhoArquivo, 'utf-8');
  const dados = JSON.parse(conteudo);
  const linhas = Array.isArray(dados) ? dados : [dados];

  resultado.totalLinhas = linhas.length;

  // Processar cada linha
  for (let i = 0; i < linhas.length; i++) {
    try {
      await processarLinha(linhas[i], modulo, i + 1);
      resultado.linhasImportadas++;
    } catch (err) {
      resultado.linhasErro++;
      resultado.erros.push({
        linha: i + 1,
        erro: err.message,
        dados: linhas[i],
      });
    }
  }

  return resultado;
}

// Processar uma linha de dados
async function processarLinha(dados, modulo, numeroLinha) {
  // Mapear dados baseado no módulo
  switch (modulo) {
    case 'colaboradores':
      return await processarColaborador(dados);
    case 'treinamentos':
      return await processarTreinamento(dados);
    case 'beneficios':
      return await processarBeneficio(dados);
    default:
      throw new Error(`Módulo ${modulo} não suportado`);
  }
}

// Processar colaborador
async function processarColaborador(dados) {
  // Validar campos obrigatórios
  if (!dados.nome && !dados.name) {
    throw new Error('Nome é obrigatório');
  }

  const nome = dados.nome || dados.name;
  const cpf = dados.cpf || dados.CPF;
  const email = dados.email || dados.Email;
  const cargo = dados.cargo || dados.Cargo || dados.funcao || dados.Funcao;

  // Verificar se já existe
  if (cpf) {
    const existe = await pool.query('SELECT id FROM colaboradores WHERE cpf = $1', [cpf]);
    if (existe.rows.length > 0) {
      // Atualizar existente
      await pool.query(`
        UPDATE colaboradores
        SET nome = $1, email = $2, cargo = $3, updated_at = NOW()
        WHERE cpf = $4
      `, [nome, email, cargo, cpf]);
    } else {
      // Criar novo
      await pool.query(`
        INSERT INTO colaboradores (nome, cpf, email, cargo, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [nome, cpf, email, cargo]);
    }
  } else {
    throw new Error('CPF é obrigatório para colaboradores');
  }
}

// Processar treinamento
async function processarTreinamento(dados) {
  if (!dados.nome && !dados.name && !dados.titulo && !dados.titulo) {
    throw new Error('Nome/Título do treinamento é obrigatório');
  }

  const nome = dados.nome || dados.name || dados.titulo || dados.titulo;
  const descricao = dados.descricao || dados.description || '';
  const cargaHoraria = parseInt(dados.carga_horaria || dados.cargaHoraria || dados.horas || '0');

  await pool.query(`
    INSERT INTO treinamentos (nome, descricao, carga_horaria, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (nome) DO UPDATE
    SET descricao = $2, carga_horaria = $3, updated_at = NOW()
  `, [nome, descricao, cargaHoraria]);
}

// Processar benefício
async function processarBeneficio(dados) {
  if (!dados.nome && !dados.name) {
    throw new Error('Nome do benefício é obrigatório');
  }

  const nome = dados.nome || dados.name;
  const valor = parseFloat(dados.valor || dados.value || '0');
  const categoria = dados.categoria || dados.category || 'OUTROS';

  await pool.query(`
    INSERT INTO beneficios_tipos (nome, categoria, valor_padrao, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (nome) DO UPDATE
    SET categoria = $2, valor_padrao = $3, updated_at = NOW()
  `, [nome, categoria, valor]);
}

// ==========================================
// EXPORTAÇÃO DE DADOS
// ==========================================

export const exportarDados = async (req, res) => {
  try {
    const { modulo, formato, filtros } = req.body;

    if (!modulo || !formato) {
      return res.status(400).json({
        success: false,
        error: 'Módulo e formato são obrigatórios',
      });
    }

    // Buscar dados do módulo
    let dados;
    switch (modulo) {
      case 'colaboradores':
        dados = await exportarColaboradores(filtros);
        break;
      case 'treinamentos':
        dados = await exportarTreinamentos(filtros);
        break;
      case 'beneficios':
        dados = await exportarBeneficios(filtros);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Módulo ${modulo} não suportado`,
        });
    }

    // Gerar arquivo baseado no formato
    let arquivo;
    let nomeArquivo;
    let contentType;

    if (formato === 'CSV') {
      arquivo = gerarCSV(dados);
      nomeArquivo = `${modulo}_${Date.now()}.csv`;
      contentType = 'text/csv';
    } else if (formato === 'XLSX') {
      arquivo = await gerarExcel(dados);
      nomeArquivo = `${modulo}_${Date.now()}.xlsx`;
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (formato === 'JSON') {
      arquivo = Buffer.from(JSON.stringify(dados, null, 2));
      nomeArquivo = `${modulo}_${Date.now()}.json`;
      contentType = 'application/json';
    } else {
      return res.status(400).json({
        success: false,
        error: `Formato ${formato} não suportado`,
      });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
    res.send(arquivo);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao exportar dados',
      message: error.message,
    });
  }
};

// Exportar colaboradores
async function exportarColaboradores(filtros) {
  let query = 'SELECT * FROM colaboradores WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (filtros?.ativo !== undefined) {
    query += ` AND ativo = $${paramIndex}`;
    params.push(filtros.ativo);
    paramIndex++;
  }

  if (filtros?.cargo) {
    query += ` AND cargo ILIKE $${paramIndex}`;
    params.push(`%${filtros.cargo}%`);
    paramIndex++;
  }

  query += ' ORDER BY nome';

  const result = await pool.query(query, params);
  return result.rows;
}

// Exportar treinamentos
async function exportarTreinamentos(filtros) {
  let query = 'SELECT * FROM treinamentos WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (filtros?.ativo !== undefined) {
    query += ` AND ativo = $${paramIndex}`;
    params.push(filtros.ativo);
    paramIndex++;
  }

  query += ' ORDER BY nome';

  const result = await pool.query(query, params);
  return result.rows;
}

// Exportar benefícios
async function exportarBeneficios(filtros) {
  let query = 'SELECT * FROM beneficios_tipos WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (filtros?.ativo !== undefined) {
    query += ` AND ativo = $${paramIndex}`;
    params.push(filtros.ativo);
    paramIndex++;
  }

  if (filtros?.categoria) {
    query += ` AND categoria = $${paramIndex}`;
    params.push(filtros.categoria);
    paramIndex++;
  }

  query += ' ORDER BY nome';

  const result = await pool.query(query, params);
  return result.rows;
}

// Gerar CSV
function gerarCSV(dados) {
  if (!dados || dados.length === 0) {
    return '';
  }

  const headers = Object.keys(dados[0]);
  const linhas = [headers.join(',')];

  dados.forEach((row) => {
    const valores = headers.map((header) => {
      const valor = row[header];
      if (valor === null || valor === undefined) return '';
      const str = String(valor);
      // Escapar vírgulas e aspas
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    linhas.push(valores.join(','));
  });

  return linhas.join('\n');
}

// Gerar Excel
async function gerarExcel(dados) {
  const XLSX = await import('xlsx');
  const worksheet = XLSX.default.utils.json_to_sheet(dados);
  const workbook = XLSX.default.utils.book_new();
  XLSX.default.utils.book_append_sheet(workbook, worksheet, 'Dados');
  return XLSX.default.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// ==========================================
// HISTÓRICO DE IMPORTAÇÕES
// ==========================================

export const getHistoricoImportacoes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        usuario,
        modulo,
        arquivo,
        formato,
        total_linhas,
        linhas_importadas,
        linhas_erro,
        status,
        tempo_processamento,
        mensagem_erro,
        created_at
      FROM historico_importacoes
      ORDER BY created_at DESC
      LIMIT 100
    `);

    const historico = result.rows.map((row) => ({
      id: row.id,
      dataHora: row.created_at,
      usuario: row.usuario,
      modulo: row.modulo,
      arquivo: row.arquivo,
      formato: row.formato,
      totalLinhas: parseInt(row.total_linhas || '0'),
      linhasImportadas: parseInt(row.linhas_importadas || '0'),
      linhasErro: parseInt(row.linhas_erro || '0'),
      status: row.status,
      tempoProcessamento: parseFloat(row.tempo_processamento || '0'),
      mensagemErro: row.mensagem_erro,
    }));

    res.json({
      success: true,
      data: historico,
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    
    // Se a tabela não existir, retornar array vazio
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      return res.json({
        success: true,
        data: [],
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico',
      message: error.message,
    });
  }
};

export const getDetalhesImportacao = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT * FROM historico_importacoes WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Importação não encontrada',
      });
    }

    const row = result.rows[0];
    const detalhes = {
      id: row.id,
      dataHora: row.created_at,
      usuario: row.usuario,
      modulo: row.modulo,
      arquivo: row.arquivo,
      formato: row.formato,
      totalLinhas: parseInt(row.total_linhas || '0'),
      linhasImportadas: parseInt(row.linhas_importadas || '0'),
      linhasErro: parseInt(row.linhas_erro || '0'),
      status: row.status,
      tempoProcessamento: parseFloat(row.tempo_processamento || '0'),
      mensagemErro: row.mensagem_erro,
      erros: row.dados_erro ? JSON.parse(row.dados_erro) : [],
    };

    res.json({
      success: true,
      data: detalhes,
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar detalhes',
      message: error.message,
    });
  }
};

export const downloadRelatorioImportacao = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT * FROM historico_importacoes WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Importação não encontrada',
      });
    }

    const row = result.rows[0];
    const erros = row.dados_erro ? JSON.parse(row.dados_erro) : [];

    // Gerar CSV com erros
    const csv = gerarCSV(erros);
    const nomeArquivo = `relatorio_erros_${id}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
    res.send(csv);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório',
      message: error.message,
    });
  }
};

// ==========================================
// TEMPLATES DE EXPORTAÇÃO
// ==========================================

export const getTemplatesExportacao = async (req, res) => {
  try {
    // Templates padrão
    const templates = [
      {
        id: '1',
        nome: 'Colaboradores Completos',
        descricao: 'Exporta todos os dados dos colaboradores',
        modulo: 'colaboradores',
        formato: 'XLSX',
        campos: ['nome', 'cpf', 'email', 'cargo', 'departamento', 'data_admissao'],
        ativo: true,
      },
      {
        id: '2',
        nome: 'Treinamentos Ativos',
        descricao: 'Exporta apenas treinamentos ativos',
        modulo: 'treinamentos',
        formato: 'CSV',
        campos: ['nome', 'descricao', 'carga_horaria', 'data_inicio'],
        ativo: true,
      },
      {
        id: '3',
        nome: 'Benefícios por Categoria',
        descricao: 'Exporta benefícios agrupados por categoria',
        modulo: 'beneficios',
        formato: 'JSON',
        campos: ['nome', 'categoria', 'valor_padrao'],
        ativo: true,
      },
    ];

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar templates',
      message: error.message,
    });
  }
};

