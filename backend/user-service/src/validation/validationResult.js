const { validationResult , param } = require('express-validator');
const checkValidation = (req , res , next)=>{
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next()
}


const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid userId: must be a valid MongoDB ObjectId'),
];


module.exports = {
    checkValidation,
    validateUserId
};