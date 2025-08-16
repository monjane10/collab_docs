import app from './app.js';
import http from 'http';
import { setupCollabSocket } from './socket/collab.js';

const PORTA = process.env.PORTA || 3000;

// Cria o servidor HTTP e passa para o Socket.IO
const server = http.createServer(app);
setupCollabSocket(server);

server.listen(PORTA, () => {
  console.log(`Servidor rodando na porta: http://localhost:${PORTA}`);
});
