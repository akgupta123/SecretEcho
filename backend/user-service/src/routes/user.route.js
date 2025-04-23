const express = require("express");
const { checkValidation } = require("../validation/validationResult");
const userValidationRules = require("../validation/user.validation");
const userController = require("../controller/user.controller")
const router = express.Router();

router.post("/signup", userValidationRules, checkValidation, userController.createSignUp);

router.post("/login", userValidationRules, checkValidation, userController.login);
router.get("/:userId", userController.userDetail);
module.exports = router;
