import Permission from '../models/Permission.js';
import Document from '../models/Document.js';

export function isAdmin(req, res, next) {
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Acesso restrito a administradores.' });
}

export async function isOwner(req, res, next) {
  const document = await Document.findByPk(req.params.id || req.params.documentId);
  if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });
  if (document.ownerId === req.user.id || req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Apenas o proprietário e o administrador podem executar esta ação.' });
}

export async function hasWriteAccess(req, res, next) {
  const documentId = req.params.id || req.params.documentId;
  if (!documentId) {
    return res.status(400).json({ error: 'documentId é obrigatório para verificação de permissão.' });
  }
  if (req.user.role === 'admin') return next();
  const permission = await Permission.findOne({ where: { userId: req.user.id, documentId } });
  if (permission && (permission.access === 'write' || permission.access === 'admin')) return next();
  return res.status(403).json({ error: 'Acesso de escrita negado.' });
}
