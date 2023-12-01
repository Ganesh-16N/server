
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
// 

router.post('/api/users', userController.createUser);
router.get('/api/users', userController.getAllUsers);
router.get('/api/users/:id', userController.getUserById);
router.patch('/api/users/:id', userController.updateUserById);
router.delete('/api/users/:id', userController.deleteUserById);

module.exports = router;
