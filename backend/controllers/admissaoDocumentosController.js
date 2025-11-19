import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { uploadsDir } from '../config/multer.js';

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

    const { admissao_id, documento_id } = req.body;

    if (!admissao_id || !documento_id) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: admissao_id, documento_id'
      });
    }

    // Verificar se documento existe
    const docResult = await pool.query(
      'SELECT * FROM admissao_documentos WHERE id = $1 AND admissao_id = $2',
      [documento_id, admissao_id]
    );

    if (docResult.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    const documento = docResult.rows[0];

    // Atualizar documento
    const arquivo_url = `/uploads/${req.file.filename}`;
    
    await pool.query(
      `UPDATE admissao_documentos
      SET arquivo_url = $1,
          arquivo_nome = $2,
          arquivo_tamanho = $3,
          arquivo_tipo = $4,
          status = 'RECEBIDO',
          data_recebimento = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5`,
      [
        arquivo_url,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        documento_id
      ]
    );

    res.json({
      success: true,
      message: 'Documento enviado com sucesso',
      data: {
        id: documento_id,
        arquivo_url,
        status: 'RECEBIDO'
      }
    });
  } catch (error) {
    console.error('Erro ao fazer upload de documento:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload de documento',
      message: error.message
    });
  }
};

// =============================================
// APROVAR/REPROVAR DOCUMENTO
// =============================================
export const validarDocumento = async (req, res) => {
  try {
    const { documento_id } = req.params;
    const { status, observacoes_validacao } = req.body;

    if (!status || !['APROVADO', 'REPROVADO'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status deve ser APROVADO ou REPROVADO'
      });
    }

    const validadoPor = req.user?.id;

    const result = await pool.query(
      `UPDATE admissao_documentos
      SET status = $1,
          validado_por = $2,
          data_aprovacao = CASE WHEN $1 = 'APROVADO' THEN CURRENT_TIMESTAMP ELSE NULL END,
          observacoes_validacao = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [status, validadoPor, observacoes_validacao || null, documento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Documento não encontrado'
      });
    }

    res.json({
      success: true,
      message: `Documento ${status.toLowerCase()} com sucesso`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao validar documento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao validar documento',
      message: error.message
    });
  }
};

// =============================================
// LISTAR DOCUMENTOS TEMPLATE
// =============================================
export const getDocumentosTemplate = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM admissao_documentos_template
      WHERE ativo = true
      ORDER BY ordem`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar documentos template:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar documentos template',
      message: error.message
    });
  }
};

