const { User, Task } = require('../models');
const { generateToken } = require('../utils/jwt');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'status']
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create user
  createUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.create({ username, password });
      res.status(201).json({
        id: user.id,
        username: user.username,
        status: user.status
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      
      if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'username', 'status']
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ username, password });
      res.json({
        id: user.id,
        username: user.username,
        status: user.status
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update user status
  updateUserStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ status });
      res.json({
        id: user.id,
        username: user.username,
        status: user.status
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user tasks
  getUserTasks: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{
          model: Task,
          as: 'tasks'
        }]
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user.tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;