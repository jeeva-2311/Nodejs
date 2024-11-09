const Product = require('../models/products');
const mongoose = require('mongoose');

const get_all_products = (req, res, next) => {
    Product.find()
    .select("name price _id productImage")   
    .exec()
    .then((productlist) => {
        const response = {
            count: productlist.length, 
            products: productlist.map(product => ({
                name: product.name,
                price: product.price, 
                _id: product._id, 
                productImage: product.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + product._id
                }
            }))
        };
        res.status(200).json(response);
    })
    .catch(error => res.status(500).json({ error: error }));
}

const post_product =  (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), 
        name: req.body.name, 
        price: req.body.price, 
        productImage: req.file.path
    });

    product.save()
    .then(result => {
        res.status(200).json({
            message: 'Product is created',
            product: result,
            token: req.userData
        });
    })
    .catch(error => res.status(500).json({ error: error }));
}

const get_product = (req, res, next) => {
    Product.findById(req.params.productID)
    .select('name price _id productImage')
    .then(result => {
        result ? res.status(200).json(result) : res.status(404).json({ message: "This product is not added to db" });
    })
    .catch(error => res.status(500).json({ error: error }));
}

const patch_product = (req, res, next) => {
    const updateOps = {};
    req.body.forEach(ops => updateOps[ops.propName] = ops.value);
    
    Product.updateOne({ _id: req.params.productID }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({ 
            message: "Product is updated", 
            id: req.params.productID
        });
    })
    .catch(error => res.status(500).json({ error: error }));
}

const delete_product = (req, res, next) => {
    Product.deleteOne({ _id: req.params.productID })
    .exec()
    .then(result => {
        res.status(200).json({ 
            message: "Product is deleted", 
            id: req.params.productID
        });
    })
    .catch(error => res.status(500).json({ error: error }));
}

module.exports = {
    get_all_products, post_product, get_product, patch_product, delete_product
};
