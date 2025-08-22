import app from './app.js';
import http from 'http';
import { setupCollabSocket } from './socket/collab.js';

const PORTA = process.env.PORTA || 3000;

// Cria o servidor HTTP e passa para o Socket.IO
const server = http.createServer(app);
setupCollabSocket(server);

app.get('/', (req, res) => {
  res.send(  res.send(`
    <h1>Collab Docs Backend</h1>
    <p>O backend está rodando corretamente!</p>
    <p>Endpoints disponíveis:</p>
    <ul>
      <li>/users</li>
      <li>/documents</li>
      <li>/login</li>
      <li>/register</li>
    </ul>
  `));
});

server.listen(PORTA, () => {
  console.log(`Servidor rodando na porta: http://localhost:${PORTA}`);
});
