const fs = require("fs");
const path = require("path");
const {getJson, setJson} = require("../utility/jsonMethod")
const productsFilePath = path.join(__dirname, '../data/products.json');

const getjson = () => {
	const productsFilePath = path.join(__dirname, '../data/products.json');
	const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	return products
}


const productsController = {
    detail:(req,res) => {
        const id = req.params.id;        
        const products = getJson("products.json")
        const product = products.find(elemento => elemento.id == id);
        const calc = product.price - ((product.price * product.discount) / 100)
        res.render("products/productDetail", {title: product.name, product, calc})
    },
    formulario:(req,res) => {
        
        res.render("products/crear-formulario", {title:"formulario"})
    },

    store:(req,res) =>{
    	const producto = req.body;
		producto.id = Date.now();
        producto.image = req.file.filename;
		const products = getjson();
		products.push(producto)
		

		const json= JSON.stringify(products);
		fs.writeFileSync(productsFilePath,json, "utf-8");
		res.redirect(`/products`);

    },


    edform:(req,res) => {
        
        res.render("products/edform", {title:"edform"})
    },
    cart:(req,res)=>{
        res.render("products/productCart", {title:"Carrito de compra"});
    },
    dashboard:(req,res) => {
        const propiedades = ["id", "image", "name", "price"];
        const products = getJson("products.json");
        res.render("products/dashboard", {title: "Dashboard", products, propiedades})
    },
    products:(req,res) =>{
        const products = getJson("products.json");
        res.render("products/products", {title: "Todos los productos", products});
    },
    categories:(req,res)=>{
        const {category} = req.params;
        const products = getJson("products.json");
        const productsCategorized = products.filter(product=>{
            return product.category == category.toLowerCase()
        });
        res.render("products/categories", {title: category, productsCategorized, category})
    }
}


module.exports = productsController