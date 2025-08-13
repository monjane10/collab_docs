import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  access: {
    type: DataTypes.ENUM('read', 'write', 'admin'),
    defaultValue: 'read'
  }
}, {
  timestamps: false
});

export default Permission;
