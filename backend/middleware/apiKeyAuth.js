// =============================================
// MIDDLEWARE DE AUTENTICAÇÃO VIA API KEY
// =============================================
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const expectedApiKey = process.env.FGS_API_KEY;

  // Se não houver API key configurada, permitir acesso (modo desenvolvimento)
  if (!expectedApiKey) {
    console.warn('⚠️  FGS_API_KEY não configurada. Permitindo acesso sem autenticação.');
    return next();
  }

  // Se houver API key configurada, validar
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Não autorizado',
      message: 'API key inválida ou ausente'
    });
  }

  next();
};

