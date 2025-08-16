import { Server } from 'socket.io';
import Document from '../models/Document.js';
import Revision from '../models/Revision.js';


export function setupCollabSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {

    // Entrar numa sala de documento
    socket.on('joinDocument', async ({ documentId, userId }) => {
      socket.join(`document_${documentId}`);
      
      // Carrega documento e envia para o usuário que entrou
      const document = await Document.findByPk(documentId);
      if (document) {
        socket.emit('documentLoaded', document); // <--- evento correto para frontend
      }

      socket.to(`document_${documentId}`).emit('userJoined', { userId });
    });

    // Edição colaborativa
    socket.on('editDocument', async ({ documentId, content, userId }) => {
      const document = await Document.findByPk(documentId);
      if (document) {
        await Revision.create({ documentId, content: document.content, editedById: userId });
        document.content = content;
        await document.save();
        io.to(`document_${documentId}`).emit('documentUpdated', { content, userId });
      }
    });

    // Sair da sala
    socket.on('leaveDocument', ({ documentId, userId }) => {
      socket.leave(`document_${documentId}`);
      socket.to(`document_${documentId}`).emit('userLeft', { userId });
    });
  });
}
