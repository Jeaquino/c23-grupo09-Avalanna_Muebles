const {body} = require('express-validator');
const {getJson} = require("../utility/jsonMethod");
const users= getJson('users.json')

module.exports = [
    body('NameAndSurname').notEmpty().withMessage('El campo no puede estar vacío').bail()
    .isLength({min:3,max:50}).withMessage('El valor ingresado debe tener al menos 3 caracteres y maximo 30').bail(),

    body('email').notEmpty().withMessage('El campo no puede estar vacío').bail()
    .isEmail().withMessage("Debe ser un correo con formato válido").bail(),
 
    
    body('phoneNumber').notEmpty().withMessage('El campo no puede estar vacío').bail()
    .isLength({min:8,max:12}).withMessage('El valor ingresado debe tener al menos 8 caracteres y maximo 12').bail(),

    body("age").isInt().withMessage(`Debe escribir una edad en números`)
   
   
];