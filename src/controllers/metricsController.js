export const mostActiveUsers = async (req, res) => {
  const users = await Revision.findAll({
    attributes: ['editedById', [Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'editCount']],
    group: ['editedById'],
    order: [[Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'DESC']],
    limit: 5
  });
  res.json(users);
};
import Document from '../models/Document.js';
import User from '../models/User.js';
import Revision from '../models/Revision.js';
import Permission from '../models/Permission.js';

export const countDocuments = async (req, res) => {
  const count = await Document.count();
  res.json({ totalDocuments: count });
};

export const countUsers = async (req, res) => {
  const count = await User.count();
  res.json({ totalUsers: count });
};

export const countRevisions = async (req, res) => {
  const count = await Revision.count();
  res.json({ totalRevisions: count });
};

export const countPermissions = async (req, res) => {
  const count = await Permission.count();
  res.json({ totalPermissions: count });
};

export const mostEditedDocuments = async (req, res) => {
  const docs = await Revision.findAll({
    attributes: ['documentId', [Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'editCount']],
    group: ['documentId'],
    order: [[Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'DESC']],
    limit: 5
  });
  res.json(docs);
};
