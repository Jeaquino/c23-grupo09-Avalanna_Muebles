const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productsController");
const { group } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null,path.join(__dirname, "../../public/img") )
    },
    filename: (req, file, cb)=>{

        cb(null, "group-" + Date.now() + path.extname(file.originalname))
    }

})

const upload = multer({ storage });

/* GET home page. */
router.get('/', productController.products);
router.get('/detail/:id', productController.detail);
router.get('/sections/:category', productController.categories);

router.get('/formCreate', productController.formulario)
router.post('/formCreate',upload.single("image"), productController.store)

router.get('/productCart', productController.cart)

router.get('/formEdit/:id', productController.edform)
router.put('/formEdit/:id', productController.update)

router.get('/dashboard', productController.dashboard)



module.exports = router;
