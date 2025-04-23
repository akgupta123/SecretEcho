const { validationResult , param } = require('express-validator');
const checkValidation = (req)=>{
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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