const { body } = require('express-validator');

exports.userValidator = [
    body('fullname').not().isEmpty().withMessage("Please Fillup Your Name"),
    body('username').not().isEmpty().withMessage("fill up your user name"),
    body('email').not().isEmpty().isEmail().withMessage("fill up the email"),
    body('password').isLength({min:6}).withMessage("Password must have atleast 6 characters"),
    body('gender').not().isEmpty().withMessage("please choose your Gender")
];

exports.logInValidator = [
    body('email').not().isEmpty().isEmail().withMessage("fill up the email"),
    body('password').isLength({min:6}).withMessage("Password must have atleast 6 characters"),
]