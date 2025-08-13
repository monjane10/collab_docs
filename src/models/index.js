// models/index.js
import User from './User.js';
import Document from './Document.js';
import Revision from './Revision.js';
import Permission from './Permission.js';

// Associações
Document.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Document.belongsToMany(User, { as: 'collaborators', through: 'DocumentCollaborators' });
Revision.belongsTo(Document, { foreignKey: 'documentId' });
Revision.belongsTo(User, { foreignKey: 'editedById' });
Permission.belongsTo(User, { foreignKey: 'userId' });
Permission.belongsTo(Document, { foreignKey: 'documentId' });

export { User, Document, Revision, Permission };
