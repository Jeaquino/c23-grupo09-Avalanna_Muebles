const db = require("../../database/models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const apiProductsController = {
  detail: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (!Number.isInteger(id)) {
        throw new Error("Por favor ingrese un numero entero");
      }

      const product = await db.Product.findByPk(id, {
        include: { association: "categories" },
      });

      if (!product) {
        throw new Error("El ID ingresado no corresponde a ningun producto");
      }

      return res.status(200).send(product);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  store: async (req, res) => {
    const producto = req.body;

    producto.image = req.file.filename;

    db.Product.create(producto)
      .then((product) => {
        res.redirect(`/products`);
      })

      .catch((err) => console.log(err));
  },

  destroy: async (req, res) => {
    const id  = parseInt(req.params.id);

    try {

      if(!Number.isInteger(id)){
        throw new Error('Los ID corresponde a numeros enteros, ingrese el valor correcto')
      }
      
      const producto = await db.Product.findOne({
        where: {
          id,
        },
      });

      if (producto) {
        
        fs.unlink(
          path.join(__dirname, `../../../public/img/${producto.image}`),
          (err) => {
            if (err) throw err;
          }
        );

        await db.Product.destroy({
          where: {
            id,
          },
        });

        res.status(200).send("El producto ID fue eliminado");

      }else{
        throw new Error("El ID indicado no corresponde a un producto existente")
      }
    } catch (e) {
      res.status(400).send(e.message)
    }
  },

  list: async (req, res) => {
    //Destructo los query params y defino valores por defecto si no existen
    let { limit = 10, page = 1, search } = req.query;

    //Parseo el string
    limit = parseInt(limit);

    //calculo el valor de inicio
    const offset = limit * (parseInt(page) - 1);
    const arraySearch = [
      {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
    //Defino una busqueda base
    const query = { limit, offset, include: { association: "categories" } };
    let idCategorie;
    // Declaro la sentencia de busqueda por si la preciso
    const where = {
      [Op.or]: arraySearch,
    };

    //Agrego la sentencia de busqueda si llego un valor en search
    if (search) {
      query.where = where;

      //busco si existe una categoria que coincida con el valor ingresado
      idCategorie = await db.Category.findOne({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });

      //verifico el resultado
      if (idCategorie) {
        //Creo el objeto que va a ser el nuevo filtro
        idCategorie = idCategorie.id;

        const serachCategory = {
          categoryId: {
            [Op.like]: `${idCategorie}`,
          },
        };

        //Agrego el Filtro
        arraySearch.push(serachCategory);
      }
    }

    try {
      //Metodo que me permite buscar y contar el total de elementos
      const products = await db.Product.findAndCountAll(query);
      return res.status(200).send(products);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  processUpdate: async (req, res) => {
    const { id } = req.params;
    let avatar = "";
    await db.Product.findByPk(id).then((resp) => {
      if (resp.dataValues.image) {
        avatar = resp.dataValues.image;
      } else {
        avatar = "default.jpg";
      }
    });
    const { name, price, description, extradescription, discount } = req.body;
    db.Product.update(
      {
        name: name,
        price: +price,
        description: description,
        extradescripcion: extradescription,
        discount: +discount,
        image: req.file ? req.file.filename : avatar,
      },
      {
        where: {
          id,
        },
      }
    )
      .then((resp) => {
        res.redirect(`/products/detail/${id}`);
      })
      .catch((err) => console.log(err));
  },
};

module.exports = apiProductsController;
