import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Post from './Post.js';

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Media.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Media, { foreignKey: 'postId' });

export default Media;