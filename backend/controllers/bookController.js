const Book = require('../models/bookModel');
const Shelf = require('../models/shelfModel');
const asyncHandler = require('express-async-handler');

const getBookById = asyncHandler(async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({message: 'Kitap bulunamadı'});
        }
        const shelves = await Shelf.find({'books.id': req.params.id});
        const shelfDetails = shelves.map(shelf => {
            const bookInShelf = shelf.books.find(b => b.id.toString() === req.params.id);
            return {
                location: shelf.location,
                barcode: shelf.barcode,
                count: bookInShelf ? bookInShelf.count : 0
            };
        });
        res.status(200).json({
            ...book.toObject(),
            shelfDetails: shelfDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Sunucu hatası (getBookById)'});
    }
});

const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const books = await Book.find();
        const shelves = await Shelf.find();
        const booksWithTotalCount = books.map(book => {
            const totalCount = shelves.reduce((acc, shelf) => {
                const matchingBook = shelf.books.find(b => b.id.toString() === book._id.toString());
                if (matchingBook) {
                    acc += parseInt(matchingBook.count);
                }
                return acc;
            }, 0);
            return {
                ...book.toObject(),
                totalCount: totalCount
            };
        });
        res.status(200).json(booksWithTotalCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Sunucu hatası (getAllBooks)'});
    }
});

const insertBook = asyncHandler(async (req, res) => {
    try {
        const {...rest} = req.body;
        const newBook = new Book(rest);
        await newBook.save();
        return res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({message: "Bu ISBN numarası zaten kullanılıyor."});
        } else if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({message: messages.join(", ")});
        }
        return res.status(500).json({message: "Sunucu hatası (insertBook)"});
    }
})

const updateBook = asyncHandler(async (req, res) => {
    try {
        const {id, ...rest} = req.body;
        delete rest._id;

        const updatedBook = await Book.findByIdAndUpdate(id, rest, {new: true});
        if (!updatedBook) {
            return res.status(404).json({message: "Güncellenecek kitap bulunamadı."});
        }
        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({message: messages.join(', ')});
        }
        return res.status(500).json({message: 'Sunucu hatası (updateBook)'});
    }
})

const deleteBook = asyncHandler(async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({message: "Kitap bulunamadı"});
        }
        await Shelf.updateMany(
            {"books.id": bookId},
            {$pull: {books: {id: bookId}}}
        );
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Sunucu hatası (deleteBook)"});
    }
});

const bulkAddBooks = asyncHandler(async (req, res) => {
    const books = req.body;
    try {
        const insertedBooks = await Book.insertMany(books);
        res.status(201).json({message: `${insertedBooks.length} kitap başarıyla eklendi.`});
    } catch (error) {
        console.error("Hata:", error);
        res.status(400).json({message: "Kitap eklenirken hata oluştu.", error: error.message});
    }
});

const deleteAllBooks = asyncHandler(async (req, res) => {
    await Book.deleteMany();
    res.status(200).json({message: "Tüm kitaplar başarıyla silindi!"});
});

module.exports = {getBookById, getAllBooks, updateBook, deleteBook, insertBook, bulkAddBooks, deleteAllBooks};
