import jwt from 'jsonwebtoken';
import { pool } from '../server.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// =============================================
// MIDDLEWARE DE AUTENTICAÇÃO JWT
// =============================================
export const authenticateToken = async (req, res, next) => {
  try {
    // Obter token do header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido'
      });
    }

    // Verificar e decodificar token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error('❌ [AUTH] Token inválido:', err.message);
        return res.status(403).json({
          success: false,
          error: 'Token inválido ou expirado'
        });
      }

      // Buscar usuário completo no banco
      try {
        const result = await pool.query(
          'SELECT id, nome, email, role, cargo, departamento FROM users WHERE id = $1',
          [decoded.id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Usuário não encontrado'
          });
        }

        // Adicionar usuário ao request
        req.user = result.rows[0];
        
        console.log('✅ [AUTH] Usuário autenticado:', {
          id: req.user.id,
          nome: req.user.nome,
          role: req.user.role,
          departamento: req.user.departamento
        });

        next();
      } catch (dbError) {
        console.error('❌ [AUTH] Erro ao buscar usuário:', dbError);
        return res.status(500).json({
          success: false,
          error: 'Erro ao validar autenticação'
        });
      }
    });
  } catch (error) {
    console.error('❌ [AUTH] Erro no middleware:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro no processo de autenticação'
    });
  }
};

// =============================================
// MIDDLEWARE DE AUTORIZAÇÃO POR ROLE
// =============================================
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`⚠️  [AUTH] Acesso negado para role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para acessar este recurso',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// =============================================
// MIDDLEWARE DE AUTORIZAÇÃO POR DEPARTAMENTO
// =============================================
export const authorizeDepartments = (...allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    if (!allowedDepartments.includes(req.user.departamento)) {
      console.warn(`⚠️  [AUTH] Acesso negado para departamento: ${req.user.departamento}`);
      return res.status(403).json({
        success: false,
        error: 'Seu departamento não tem permissão para acessar este recurso',
        requiredDepartments: allowedDepartments,
        userDepartment: req.user.departamento
      });
    }

    next();
  };
};

