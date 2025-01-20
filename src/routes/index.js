const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');

// Rutas públicas
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.post('/login', userController.login);

// Rutas protegidas de usuarios
router.get('/users/:id', auth, userController.getUserById);
router.put('/users/:id', auth, userController.updateUser);
router.patch('/users/:id', auth, userController.updateUserStatus);
router.delete('/users/:id', auth, userController.deleteUser);
router.get('/users/:id/tasks', auth, userController.getUserTasks);

// Rutas protegidas de tareas
router.get('/tasks', auth, taskController.getTasks);
router.post('/tasks', auth, taskController.createTask);
router.get('/tasks/:id', auth, taskController.getTaskById);
router.put('/tasks/:id', auth, taskController.updateTask);
router.patch('/tasks/:id', auth, taskController.updateTaskStatus);
router.delete('/tasks/:id', auth, taskController.deleteTask);

module.exports = router;