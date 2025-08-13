export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}]`, err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    details: err.details || undefined
  });
}
