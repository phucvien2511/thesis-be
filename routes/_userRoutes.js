'use strict'

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/me", userController.getMe);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.put("/update/password", userController.updatePassword);


