var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// Category Routes

router.get('/categories', categoryController.getCategories);
router.get('/category/add', categoryController.addCategory)
router.post('/category/add', catchErrors(categoryController.createCategory));
router.get('/category/:slug', catchErrors(categoryController.displayCategory));
router.get('/category/:slug/edit', catchErrors(categoryController.getCategory));
router.post('/category/:slug/edit', catchErrors(categoryController.updateCategory));
router.get(`/category/:slug/delete`, catchErrors(categoryController.deleteCategory));

// Need routes for sub-categories



// Item Routes

router.get('/add', catchErrors(itemController.addItem));
router.post(`/add`, catchErrors(itemController.createItem));
router.get(`/add/:id`, catchErrors(itemController.getItem));
router.post(`/add/:id`, catchErrors(itemController.updateItem));
router.get(`/delete/:id`, catchErrors(itemController.deleteItem));

// User Routes

// login
// register
// logout
// dashboard
// edit 

router.get('/register', userController.registerForm);
router.get('/login', userController.loginForm);

// Month View - Show total amount budgeted and total amount spent
// Leftover money for savings - https://dribbble.com/shots/3685757-Finance-App-New-Budget/attachments/825117


module.exports = router;
