const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');

// Tu ruta de prueba original
router.get('/', (req, res) => { 
    res.json({ message: 'API working' }); 
});

// Tus rutas públicas originales
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.post('/login', userController.login);

// Tus rutas protegidas de usuarios originales
router.get('/users/:id', auth, userController.getUserById);
router.put('/users/:id', auth, userController.updateUser);
router.patch('/users/:id', auth, userController.updateUserStatus);
router.delete('/users/:id', auth, userController.deleteUser);
router.get('/users/:id/tasks', auth, userController.getUserTasks);

// Tus rutas protegidas de tareas originales
router.get('/tasks', auth, taskController.getTasks);
router.post('/tasks', auth, taskController.createTask);
router.get('/tasks/:id', auth, taskController.getTaskById);

module.exports = router;