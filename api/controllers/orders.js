// Import Order and Product models and mongoose
const Order = require('../models/orders');
const mongoose = require('mongoose');
const Product = require('../models/products');

// Get all orders with selected fields
const get_all_orders = (req, res, next) => {
    Order.find()
    .select("quantity product _id")   
    .exec()
    .then((orderlist) => {
        const response = {
            count: orderlist.length, 
            orders: orderlist.map(order => ({
                orderID: order._id,
                productID: order.product, 
                quantity: order.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + order._id
                }
            }))
        };
        res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err }));
}

// Create a new order after verifying product existence
const post_order = (req, res, next) => {
    // Check if product exists before creating an order
    Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    });

    // Create a new order
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productID, 
        quantity: req.body.quantity
    });

    // Save the order to the database
    order.save()
    .then(() => {
        res.status(200).json({
            message: "Order is created",
            order: {
                orderID: order._id,
                productID: order.product,
                quantity: order.quantity
            }
        });
    })    
    .catch(err => res.status(500).json({ error: err }));
}

// Get details of a specific order by ID
const get_order = (req, res, next) => {
    Order.findById(req.params.orderID)
    .populate('product') // Populate product details in order
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => res.status(500).json({ error: err }));
}

// Delete a specific order by ID
const delete_order = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderID })
    .exec()
    .then(() => res.status(200).json({ message: "Order deleted" }))
    .catch(err => res.status(500).json({ error: err }));
}

// Export the functions for use in routes
module.exports = {
    get_all_orders,
    post_order,
    get_order,
    delete_order
};
