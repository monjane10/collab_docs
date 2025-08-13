import express from 'express';
import './utils/database.js';
import sequelize from './utils/database.js';
import './models/index.js'; 
import router from './routes/index.js'; // Importa as rotas

const app = express();
//usar o express
app.use(express.json()); 
 // Usa as rotas definidas
app.use(router);



sequelize.authenticate()
  .then(() => {
    console.log('Conexão MySQL estabelecida com sucesso!');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Tabelas sincronizadas com sucesso!'))
  .catch(err => console.error('Erro ao conectar/sincronizar com MySQL:', err));

  
export default app;