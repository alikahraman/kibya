const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.route('/')
    .get(protect, userController.getUsers)
    .post(protect, userController.registerUser)
router.route('/:id')
    .delete(protect, userController.deleteUser);

module.exports = router;
