import { Router } from 'express';
import { createDocument, listDocuments, getDocumentDetails, updateDocument, deleteDocument } from '../controllers/documentsController.js';
import { authenticateJWT } from '../midlewares/auth.js';
import { isOwner, hasWriteAccess } from '../midlewares/authorization.js';


const documentsRouter = Router();

// Criar documento (apenas quem tem acesso de escrita)
documentsRouter.post('/', authenticateJWT,createDocument);

// Listar documentos (apenas autenticados)
documentsRouter.get('/', authenticateJWT, listDocuments);

// Detalhes do documento (apenas autenticados)
documentsRouter.get('/:id', authenticateJWT, getDocumentDetails);

// Atualizar documento (apenas quem tem acesso de escrita)
documentsRouter.put('/:id', authenticateJWT, hasWriteAccess, updateDocument);

// Remover documento (apenas owner ou admin)
documentsRouter.delete('/:id', authenticateJWT, isOwner, deleteDocument);

export default documentsRouter;
