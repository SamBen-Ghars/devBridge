const express = require("express");
const router = express.Router();
const validationUserMiddleware = require("../middlewares/validationUserMiddleware");
const userController = require("../controllers/userController");

// Route pour créer un utilisateur
router.post("/register", validationUserMiddleware, userController.register);
router.post("/login", userController.login);
router.get('/allusers', userController.getAllUsers);
router.get('/oneuser/:id', userController.getOneUser);
router.post('/newuser',  userController.createUser);
router.put('/updateuser/:id', validationUserMiddleware, userController.updateUser);
router.delete('/deleteuser/:id', userController.deleteUser);
module.exports = router;