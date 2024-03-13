const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");

router.get('/', userController.index);
router.get('/register', userController.register_get);
router.get('/login', userController.login_get);
router.get('/users', userController.all_users);
router.get('/records', userController.show_records);
router.get('/records/clear', userController.clear_records);
router.get('/card-id/:id', userController.card_event);
router.get('/delete-users', userController.clear_users);
router.get('/create-user', userController.create_user_get);
router.get('/users/:id', userController.show_user);

module.exports = router;
