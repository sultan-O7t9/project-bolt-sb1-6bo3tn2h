import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Define associations
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Post.belongsToMany(User, { through: 'PostLikes', as: 'likedBy' });

export default Post;