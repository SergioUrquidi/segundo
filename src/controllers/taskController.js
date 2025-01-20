const { Task } = require('../models');

const taskController = {
  // Get user tasks
  getTasks: async (req, res) => {
    try {
      const tasks = await Task.findAll({
        where: { userId: req.user.id }
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create task
  createTask: async (req, res) => {
    try {
      const task = await Task.create({
        name: req.body.name,
        userId: req.user.id
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get task by ID
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update task
  updateTask: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await task.update({ name: req.body.name });
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update task status
  updateTaskStatus: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await task.update({ done: req.body.done });
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete task
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await task.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = taskController;