const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orders')

/* 
All four routes are correctly routed to each of their controller function. 
Authentication can be added to any route by adding check-auth middleware
*/

router.get('/', orderControllers.get_all_orders);
router.post('/', orderControllers.post_order);
router.get('/:orderID', orderControllers.get_order);
router.delete('/:orderID', orderControllers.delete_order);

module.exports = router;