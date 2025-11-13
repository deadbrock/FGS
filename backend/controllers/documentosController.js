import { pool } from '../server.js';
import fs from 'fs';
import path from 'path';
import { uploadsDir } from '../config/multer.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// LISTAR DOCUMENTOS
// =============================================

export const getDocumentos = async (req, res) => {
  try {
    const {
      colaborador_id,
      tipo_documento,
      status_validade, // 'VALIDO', 'VENCIDO', 'PROXIMO_VENCIMENTO'
      limit = 50,
      offset = 0
    } = req.query;

    let query = `
      SELECT 
        d.*,
        c.nome_completo as colaborador_nome,
        c.cpf as colaborador_cpf
      FROM documentos d
      JOIN colaboradores c ON d.colaborador_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (colaborador_id) {
      query += ` AND d.colaborador_id = $${paramIndex}`;
      params.push(colaborador_id);
      paramIndex++;
    }

    if (tipo_documento) {
      query += ` AND d.tipo_documento = $${paramIndex}`;
      params.push(tipo_documento);
      paramIndex++;
    }

    // Filtro por status de validade
    if (status_validade === 'VENCIDO') {
      query += ` AND d.data_validade IS NOT NULL AND d.data_validade < CURRENT_DATE`;
    } else if (status_validade === 'PROXIMO_VENCIMENTO') {
      query += ` AND d.data_validade IS NOT NULL AND d.data_validade >= CURRENT_DATE AND d.data_validade <= CURRENT_DATE + INTERVAL '60 days'`;
    } else if (status_validade === 'VALIDO') {
      query += ` AND (d.data_validade IS NULL OR d.data_validade >= CURRENT_DATE)`;
    }

    query += ` ORDER BY d.created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM documentos d WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (colaborador_id) {
      countQuery += ` AND d.colaborador_id = $${countIndex}`;
      countParams.push(colaborador_id);
      countIndex++;
    }

    if (tipo_documento) {
      countQuery += ` AND d.tipo_documento = $${countIndex}`;
      countParams.push(tipo_documento);
      countIndex++;
    }

    if (status_validade === 'VENCIDO') {
      countQuery += ` AND d.data_validade IS NOT NULL AND d.data_validade < CURRENT_DATE`;
    } else if (status_validade === 'PROXIMO_VENCIMENTO') {
      countQuery += ` AND d.data_validade IS NOT NULL AND d.data_validade >= CURRENT_DATE AND d.data_validade <= CURRENT_DATE + INTERVAL '60 days'`;
    } else if (status_validade === 'VALIDO') {
      countQuery += ` AND (d.data_validade IS NULL OR d.data_validade >= CURRENT_DATE)`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar documentos',
      message: error.message
    });
  }
};

// =============================================
// BUSCAR POR ID
// =============================================

export const getDocumentoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        d.*,
        c.nome_completo as colaborador_nome,
        c.cpf as colaborador_cpf
      FROM documentos d
      JOIN colaboradores c ON d.colaborador_id = c.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar documento',
      message: error.message
    });
  }
};

// =============================================
// UPLOAD DE DOCUMENTO
// =============================================

export const uploadDocumento = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado'
      });
    }

    const {
      colaborador_id,
      tipo_documento,
      numero_documento,
      data_emissao,
      data_validade,
      observacoes
    } = req.body;

    if (!colaborador_id || !tipo_documento) {
      // Deletar arquivo se validação falhar
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: colaborador_id, tipo_documento'
      });
    }

    // Verificar se colaborador existe
    const colaboradorCheck = await pool.query(
      'SELECT id FROM colaboradores WHERE id = $1',
      [colaborador_id]
    );

    if (colaboradorCheck.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    const id = uuidv4();
    const arquivo_url = `/uploads/${req.file.filename}`;

    const result = await pool.query(`
      INSERT INTO documentos (
        id, colaborador_id, tipo_documento, numero_documento,
        data_emissao, data_validade, arquivo_nome, arquivo_url,
        arquivo_tamanho, arquivo_tipo, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id,
      colaborador_id,
      tipo_documento,
      numero_documento,
      data_emissao || null,
      data_validade || null,
      req.file.originalname,
      arquivo_url,
      req.file.size,
      req.file.mimetype,
      observacoes || null
    ]);

    console.log('✅ Documento enviado:', req.file.originalname);

    res.status(201).json({
      success: true,
      message: 'Documento enviado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    // Deletar arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erro ao fazer upload de documento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload de documento',
      message: error.message
    });
  }
};

// =============================================
// DOWNLOAD DE DOCUMENTO
// =============================================

export const downloadDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar documento no banco
    const result = await pool.query(
      'SELECT * FROM documentos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    const documento = result.rows[0];
    const filePath = path.join(uploadsDir, path.basename(documento.arquivo_url));

    // Verificar se arquivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo físico não encontrado no servidor'
      });
    }

    // Enviar arquivo
    res.download(filePath, documento.arquivo_nome, (err) => {
      if (err) {
        console.error('Erro ao fazer download:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Erro ao fazer download do arquivo'
          });
        }
      } else {
        console.log('✅ Download realizado:', documento.arquivo_nome);
      }
    });

  } catch (error) {
    console.error('Erro ao fazer download:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer download',
      message: error.message
    });
  }
};

// =============================================
// ATUALIZAR METADADOS
// =============================================

export const updateDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero_documento,
      data_emissao,
      data_validade,
      observacoes
    } = req.body;

    const existsCheck = await pool.query(
      'SELECT id FROM documentos WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (numero_documento !== undefined) {
      updates.push(`numero_documento = $${paramIndex++}`);
      values.push(numero_documento);
    }

    if (data_emissao !== undefined) {
      updates.push(`data_emissao = $${paramIndex++}`);
      values.push(data_emissao);
    }

    if (data_validade !== undefined) {
      updates.push(`data_validade = $${paramIndex++}`);
      values.push(data_validade);
    }

    if (observacoes !== undefined) {
      updates.push(`observacoes = $${paramIndex++}`);
      values.push(observacoes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE documentos
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Documento atualizado');

    res.json({
      success: true,
      message: 'Documento atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar documento',
      message: error.message
    });
  }
};

// =============================================
// DELETAR DOCUMENTO
// =============================================

export const deleteDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar documento
    const docResult = await pool.query(
      'SELECT * FROM documentos WHERE id = $1',
      [id]
    );

    if (docResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    const documento = docResult.rows[0];
    const filePath = path.join(uploadsDir, path.basename(documento.arquivo_url));

    // Deletar do banco de dados
    await pool.query('DELETE FROM documentos WHERE id = $1', [id]);

    // Deletar arquivo físico (se existir)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ Arquivo físico deletado:', filePath);
    }

    console.log('✅ Documento deletado do banco');

    res.json({
      success: true,
      message: 'Documento deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar documento',
      message: error.message
    });
  }
};

// =============================================
// ESTATÍSTICAS
// =============================================

export const getEstatisticasDocumentos = async (req, res) => {
  try {
    // Total de documentos
    const totalDocs = await pool.query('SELECT COUNT(*) FROM documentos');

    // Por tipo
    const porTipo = await pool.query(`
      SELECT tipo_documento, COUNT(*) as total
      FROM documentos
      GROUP BY tipo_documento
      ORDER BY total DESC
    `);

    // Documentos vencidos
    const vencidos = await pool.query(`
      SELECT COUNT(*) FROM documentos
      WHERE data_validade IS NOT NULL AND data_validade < CURRENT_DATE
    `);

    // Documentos próximos ao vencimento (60 dias)
    const proximosVencimento = await pool.query(`
      SELECT COUNT(*) FROM documentos
      WHERE data_validade IS NOT NULL 
        AND data_validade >= CURRENT_DATE 
        AND data_validade <= CURRENT_DATE + INTERVAL '60 days'
    `);

    // Colaboradores sem documentos obrigatórios
    const semDocumentos = await pool.query(`
      SELECT c.id, c.nome_completo
      FROM colaboradores c
      WHERE c.status = 'ATIVO'
        AND NOT EXISTS (
          SELECT 1 FROM documentos d 
          WHERE d.colaborador_id = c.id 
            AND d.tipo_documento IN ('RG', 'CPF', 'CTPS')
        )
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        totalDocumentos: parseInt(totalDocs.rows[0].count),
        porTipo: porTipo.rows,
        vencidos: parseInt(vencidos.rows[0].count),
        proximosVencimento: parseInt(proximosVencimento.rows[0].count),
        colaboradoresSemDocumentos: semDocumentos.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de documentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

