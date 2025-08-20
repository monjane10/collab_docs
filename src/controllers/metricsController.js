import Document from '../models/Document.js';
import User from '../models/User.js';
import Revision from '../models/Revision.js';
import Permission from '../models/Permission.js';
import { Sequelize } from 'sequelize';

// Contagem de documentos
export const countDocuments = async (req, res) => {
  try {
    const count = await Document.count();
    res.json({ totalDocuments: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao contar documentos' });
  }
};

// Contagem de usuários
export const countUsers = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ totalUsers: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao contar usuários' });
  }
};

// Contagem de revisões
export const countRevisions = async (req, res) => {
  try {
    const count = await Revision.count();
    res.json({ totalRevisions: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao contar revisões' });
  }
};

// Contagem de permissões
export const countPermissions = async (req, res) => {
  try {
    const count = await Permission.count();
    res.json({ totalPermissions: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao contar permissões' });
  }
};

// Documentos mais editados
export const mostEditedDocuments = async (req, res) => {
  try {
    const docs = await Revision.findAll({
      attributes: [
        'documentId',
        [Revision.sequelize.fn('COUNT', Revision.sequelize.col('Revision.id')), 'editCount']
      ],
      include: [
        {
          model: Document,
          attributes: ['id', 'title']
        }
      ],
      group: ['Revision.documentId', 'Document.id'],
      order: [[Revision.sequelize.fn('COUNT', Revision.sequelize.col('Revision.id')), 'DESC']],
      limit: 5
    });

    const mappedDocs = docs.map(d => ({
      documentId: d.documentId,
      title: d.Document?.title ?? "Sem título",
      editCount: Number(d.get('editCount')) || 0
    }));

    res.json(mappedDocs);
  } catch (err) {
    console.error("Erro ao buscar documentos mais editados:", err);
    res.status(500).json({ error: "Erro ao buscar documentos mais editados" });
  }
};

// Usuários mais ativos
export const mostActiveUsers = async (req, res) => {
  try {
    // Consulta documentos criados
    const docsCreated = await Document.findAll({
      attributes: [
        'ownerId',
        [Document.sequelize.fn('COUNT', Document.sequelize.col('id')), 'createdDocs']
      ],
      group: ['ownerId']
    });

    // Consulta revisões feitas
    const revisionsMade = await Revision.findAll({
      attributes: [
        'editedById',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'editedDocs']
      ],
      group: ['editedById']
    });

    // Mapeia atividade por usuário
    const activityMap = {};

    docsCreated.forEach(d => {
      activityMap[d.ownerId] = {
        createdDocs: Number(d.get('createdDocs')),
        editedDocs: 0
      };
    });

    revisionsMade.forEach(e => {
      const userId = e.editedById;
      if (!activityMap[userId]) activityMap[userId] = { createdDocs: 0, editedDocs: 0 };
      activityMap[userId].editedDocs = Number(e.get('editedDocs'));
    });

    // Adiciona username
    const users = await User.findAll({ attributes: ['id', 'username'] });

    const result = users
      .map(u => {
        const activity = activityMap[u.id] || { createdDocs: 0, editedDocs: 0 };
        return {
          username: u.username,
          createdDocs: activity.createdDocs,
          editedDocs: activity.editedDocs,
          totalActions: activity.createdDocs + activity.editedDocs
        };
      })
      .sort((a, b) => b.totalActions - a.totalActions) // mais ativos primeiro
      .slice(0, 5); // top 5

    res.json(result);
  } catch (err) {
    console.error("Erro ao buscar usuários mais ativos:", err);
    res.status(500).json({ error: 'Erro ao buscar usuários mais ativos' });
  }
};
