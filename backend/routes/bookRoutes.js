const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const {protect} = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, bookController.insertBook)
    .get(protect, bookController.getAllBooks);
router.route('/drop')
    .delete(protect, bookController.deleteAllBooks);
router.route('/:id')
    .get(protect, bookController.getBookById)
    .put(protect, bookController.updateBook)
    .delete(protect, bookController.deleteBook);
router.route('/import')
    .post(protect, bookController.bulkAddBooks);

module.exports = router;