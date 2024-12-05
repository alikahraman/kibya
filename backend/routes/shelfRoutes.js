const express = require('express');
const router = express.Router();
const shelfController = require('../controllers/shelfController');
const {protect} = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, shelfController.insertShelf)
    .get(protect, shelfController.getAllShelves);
router.route('/drop')
    .delete(protect, shelfController.deleteAllShelves);
router.route('/:id')
    .get(protect, shelfController.getShelfWithBooksById)
    .put(protect, shelfController.updateShelf)
    .delete(protect, shelfController.deleteShelf);
router.route('/:id/addbook')
    .put(protect, shelfController.addBookToShelf);
router.route('/import')
    .post(protect, shelfController.bulkAddShelves);
router.route('/import/bookstoshelves')
    .post(protect, shelfController.bulkAddBooksToShelves);

module.exports = router;