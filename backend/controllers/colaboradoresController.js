import { pool } from '../server.js';

// =============================================
// GET ALL - Listar todos os colaboradores
// =============================================
export const getColaboradores = async (req, res) => {
  try {
    const { 
      status, 
      cargo, 
      departamento, 
      local_trabalho,
      search,
      limit = 50,
      offset = 0 
    } = req.query;

    let query = `
      SELECT 
        id, nome_completo, cpf, email, celular, cargo, departamento,
        data_admissao, status, local_trabalho, salario, avatar,
        created_at, updated_at
      FROM colaboradores
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    // Filtro por status
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filtro por cargo
    if (cargo) {
      query += ` AND cargo ILIKE $${paramIndex}`;
      params.push(`%${cargo}%`);
      paramIndex++;
    }

    // Filtro por departamento
    if (departamento) {
      query += ` AND departamento ILIKE $${paramIndex}`;
      params.push(`%${departamento}%`);
      paramIndex++;
    }

    // Filtro por local de trabalho (estado)
    if (local_trabalho) {
      query += ` AND local_trabalho = $${paramIndex}`;
      params.push(local_trabalho);
      paramIndex++;
    }

    // Busca global
    if (search) {
      query += ` AND (
        nome_completo ILIKE $${paramIndex} OR
        cpf ILIKE $${paramIndex} OR
        email ILIKE $${paramIndex} OR
        matricula ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Ordenação e paginação
    query += ` ORDER BY nome_completo ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM colaboradores WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (status) {
      countQuery += ` AND status = $${countIndex}`;
      countParams.push(status);
      countIndex++;
    }
    if (cargo) {
      countQuery += ` AND cargo ILIKE $${countIndex}`;
      countParams.push(`%${cargo}%`);
      countIndex++;
    }
    if (departamento) {
      countQuery += ` AND departamento ILIKE $${countIndex}`;
      countParams.push(`%${departamento}%`);
      countIndex++;
    }
    if (local_trabalho) {
      countQuery += ` AND local_trabalho = $${countIndex}`;
      countParams.push(local_trabalho);
      countIndex++;
    }
    if (search) {
      countQuery += ` AND (
        nome_completo ILIKE $${countIndex} OR
        cpf ILIKE $${countIndex} OR
        email ILIKE $${countIndex} OR
        matricula ILIKE $${countIndex}
      )`;
      countParams.push(`%${search}%`);
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
    console.error('Erro ao buscar colaboradores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaboradores',
      message: error.message
    });
  }
};

// =============================================
// GET BY ID - Buscar colaborador por ID
// =============================================
export const getColaboradorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM colaboradores WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar colaborador:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaborador',
      message: error.message
    });
  }
};

// =============================================
// CREATE - Criar novo colaborador
// =============================================
export const createColaborador = async (req, res) => {
  try {
    const {
      // Dados Pessoais
      nome_completo,
      cpf,
      rg,
      data_nascimento,
      sexo,
      estado_civil,
      nacionalidade,
      naturalidade,
      
      // Contatos
      email,
      telefone,
      celular,
      whatsapp,
      
      // Endereço
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      
      // Dados Contratuais
      matricula,
      data_admissao,
      cargo,
      departamento,
      centro_custo,
      local_trabalho,
      tipo_contrato,
      jornada_trabalho,
      salario,
      banco,
      agencia,
      conta,
      tipo_conta,
      
      // Dados Adicionais
      pis_pasep,
      ctps_numero,
      ctps_serie,
      ctps_uf,
      titulo_eleitor,
      cnh,
      cnh_categoria,
      cnh_validade,
      
      // Dependentes
      nome_mae,
      nome_pai,
      quantidade_dependentes,
      
      // Dados Educacionais
      escolaridade,
      
      // Outros
      observacoes,
      user_id
    } = req.body;

    // Validações
    if (!nome_completo || !cpf || !data_nascimento || !data_admissao || !cargo) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome_completo, cpf, data_nascimento, data_admissao, cargo'
      });
    }

    // Verificar se CPF já existe
    const cpfCheck = await pool.query(
      'SELECT id FROM colaboradores WHERE cpf = $1',
      [cpf]
    );

    if (cpfCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'CPF já cadastrado'
      });
    }

    // Verificar se matrícula já existe (se fornecida)
    if (matricula) {
      const matriculaCheck = await pool.query(
        'SELECT id FROM colaboradores WHERE matricula = $1',
        [matricula]
      );

      if (matriculaCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Matrícula já cadastrada'
        });
      }
    }

    const result = await pool.query(`
      INSERT INTO colaboradores (
        nome_completo, cpf, rg, data_nascimento, sexo, estado_civil,
        nacionalidade, naturalidade, email, telefone, celular, whatsapp,
        cep, logradouro, numero, complemento, bairro, cidade, estado,
        matricula, data_admissao, cargo, departamento, centro_custo,
        local_trabalho, tipo_contrato, jornada_trabalho, salario,
        banco, agencia, conta, tipo_conta,
        pis_pasep, ctps_numero, ctps_serie, ctps_uf,
        titulo_eleitor, cnh, cnh_categoria, cnh_validade,
        nome_mae, nome_pai, quantidade_dependentes,
        escolaridade,
        observacoes, user_id, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46, $47
      )
      RETURNING *
    `, [
      nome_completo, cpf, rg, data_nascimento, sexo, estado_civil,
      nacionalidade, naturalidade, email, telefone, celular, whatsapp,
      cep, logradouro, numero, complemento, bairro, cidade, estado,
      matricula, data_admissao, cargo, departamento, centro_custo,
      local_trabalho, tipo_contrato, jornada_trabalho, salario,
      banco, agencia, conta, tipo_conta,
      pis_pasep, ctps_numero, ctps_serie, ctps_uf,
      titulo_eleitor, cnh, cnh_categoria, cnh_validade,
      nome_mae, nome_pai, quantidade_dependentes || 0,
      escolaridade,
      observacoes, user_id, req.user?.id || null
    ]);

    console.log('✅ Colaborador criado:', result.rows[0].nome_completo);

    res.status(201).json({
      success: true,
      message: 'Colaborador criado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar colaborador',
      message: error.message
    });
  }
};

// =============================================
// UPDATE - Atualizar colaborador
// =============================================
export const updateColaborador = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar se colaborador existe
    const colaboradorCheck = await pool.query(
      'SELECT id FROM colaboradores WHERE id = $1',
      [id]
    );

    if (colaboradorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    // Verificar CPF duplicado (se estiver sendo alterado)
    if (updates.cpf) {
      const cpfCheck = await pool.query(
        'SELECT id FROM colaboradores WHERE cpf = $1 AND id != $2',
        [updates.cpf, id]
      );

      if (cpfCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'CPF já cadastrado para outro colaborador'
        });
      }
    }

    // Construir query dinâmica
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Lista de campos permitidos
    const allowedFields = [
      'nome_completo', 'cpf', 'rg', 'data_nascimento', 'sexo', 'estado_civil',
      'nacionalidade', 'naturalidade', 'email', 'telefone', 'celular', 'whatsapp',
      'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado',
      'matricula', 'data_admissao', 'data_demissao', 'cargo', 'departamento',
      'centro_custo', 'local_trabalho', 'tipo_contrato', 'jornada_trabalho',
      'salario', 'banco', 'agencia', 'conta', 'tipo_conta',
      'pis_pasep', 'ctps_numero', 'ctps_serie', 'ctps_uf',
      'titulo_eleitor', 'cnh', 'cnh_categoria', 'cnh_validade',
      'nome_mae', 'nome_pai', 'quantidade_dependentes',
      'escolaridade',
      'status', 'motivo_desligamento', 'avatar', 'observacoes'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    // Adicionar updated_by
    fields.push(`updated_by = $${paramIndex}`);
    values.push(req.user?.id || null);
    paramIndex++;

    // Adicionar ID para WHERE
    values.push(id);

    const query = `
      UPDATE colaboradores
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Colaborador atualizado:', result.rows[0].nome_completo);

    res.json({
      success: true,
      message: 'Colaborador atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar colaborador',
      message: error.message
    });
  }
};

// =============================================
// DELETE - Deletar colaborador
// =============================================
export const deleteColaborador = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se colaborador existe
    const colaboradorCheck = await pool.query(
      'SELECT nome_completo FROM colaboradores WHERE id = $1',
      [id]
    );

    if (colaboradorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    // Deletar colaborador (CASCADE vai deletar relacionamentos)
    await pool.query('DELETE FROM colaboradores WHERE id = $1', [id]);

    console.log('✅ Colaborador deletado:', colaboradorCheck.rows[0].nome_completo);

    res.json({
      success: true,
      message: 'Colaborador deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar colaborador:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar colaborador',
      message: error.message
    });
  }
};

// =============================================
// ESTATÍSTICAS - Dados gerais
// =============================================
export const getEstatisticas = async (req, res) => {
  try {
    // Total de colaboradores
    const total = await pool.query('SELECT COUNT(*) FROM colaboradores WHERE status = $1', ['ATIVO']);
    
    // Por gênero
    const porGenero = await pool.query(`
      SELECT sexo, COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO'
      GROUP BY sexo
    `);

    // Por estado
    const porEstado = await pool.query(`
      SELECT local_trabalho, COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho IS NOT NULL
      GROUP BY local_trabalho
      ORDER BY total DESC
    `);

    // Por cargo
    const porCargo = await pool.query(`
      SELECT cargo, COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO'
      GROUP BY cargo
      ORDER BY total DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        total: parseInt(total.rows[0].count),
        porGenero: porGenero.rows,
        porEstado: porEstado.rows,
        porCargo: porCargo.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

