const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkauth = require('../Middleware/check-auth');
const productControllers = require('../controllers/products');

// Configure file storage and filtering for product images
const filestorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const filter = (req, file, cb) => cb(null, true);
const upload = multer({
    storage: filestorage, 
    fileFilter: filter, 
    limits: { fileSize: 1024 * 1024 * 5 }
});

/* 
All four routes are correctly routed to each of their controller function. 
Authentication can be added to any route by adding check-auth middleware. 
As an example, checkauth is already added to post route
*/

router.get('/', productControllers.get_all_products);
router.post('/', checkauth, upload.single('productImage'), productControllers.post_product);
router.get('/:productID', productControllers.get_product);
router.patch('/:productID', productControllers.patch_product);
router.delete('/:productID', productControllers.delete_product );

module.exports = router;
