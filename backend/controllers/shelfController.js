const Shelf = require('../models/shelfModel');
const Book = require('../models/bookModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const insertShelf = asyncHandler(async (req, res) => {
    try {
        const {...rest} = req.body;
        const newShelf = new Shelf(rest);
        await newShelf.save();
        return res.status(201).json(newShelf);
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({message: messages.join(", ")});
        }
        return res.status(500).json({message: "Sunucu hatası (insertShelf)"});
    }
})

const getAllShelves = asyncHandler(async (req, res) => {
    try {
        const shelves = await Shelf.find();
        res.status(200).json(shelves);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Sunucu Hatası (getAllShelves)'});
    }
})

const getShelfWithBooksById = asyncHandler(async (req, res) => {
    try {
        const pipeline = [
            {
                $match: {_id: new mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $unwind: {
                    path: "$books",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    "books.id": {$toObjectId: "$books.id"}
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "books.id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: {
                    path: "$bookDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    location: 1,
                    barcode: 1,
                    "books.count": "$books.count",
                    "bookDetails._id": 1,
                    "bookDetails.title": 1,
                    "bookDetails.isbn": 1,
                    "bookDetails.author": 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    location: {$first: "$location"},
                    barcode: {$first: "$barcode"},
                    books: {
                        $push: {
                            count: "$books.count",
                            bookDetails: "$bookDetails"
                        }
                    }
                }
            }
        ];
        const result = await Shelf.aggregate(pipeline);
        if (!result.length) {
            return res.status(404).json({message: "Raf Bulunamadı!"});
        }
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Sunucu Hatası (getShelfWithBooksById)'});
    }
})

const addBookToShelf = asyncHandler(async (req, res) => {
    const {isbn, count, increment, reset, decrease} = req.body;
    const shelfId = req.params.id;
    const book = await Book.findOne({isbn});
    if (!book) {
        res.status(404);
        throw new Error("Kitap bulunamadı!");
    }
    const shelf = await Shelf.findById(shelfId);
    if (!shelf) {
        res.status(404);
        throw new Error("Raf bulunamadı!");
    }
    const existingBookIndex = shelf.books.findIndex(
        (shelfBook) => shelfBook.id.toString() === book._id.toString()
    );
    if (existingBookIndex < 0) {
        if (reset && count === 0) {
            return res.status(400).json({message: "Sıfır adet kitap eklenemez!"});
        }
        shelf.books.push({id: book._id, count});
        await shelf.save();
        return res.status(200).json(shelf);
    }
    if (increment) {
        shelf.books[existingBookIndex].count += count;
    } else if (decrease) {
        const newCount = shelf.books[existingBookIndex].count - count;
        if (newCount <= 0) {
            shelf.books.splice(existingBookIndex, 1);
        } else {
            shelf.books[existingBookIndex].count = newCount;
        }
    } else if (reset) {
        if (count === 0) {
            shelf.books.splice(existingBookIndex, 1);
        } else {
            shelf.books[existingBookIndex].count = count;
        }
    }
    await shelf.save();
    return res.status(200).json(shelf);
});

const updateShelf = asyncHandler(async (req, res) => {
    try {
        const {id, ...rest} = req.body;
        delete rest._id;
        const updatedShelf = await Shelf.findByIdAndUpdate(id, rest, {new: true});
        if (!updatedShelf) {
            return res.status(404).json({message: 'Güncellenecek Kitap Bulunamadı'});
        }
        return res.status(200).json(updatedShelf);
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({message: messages.join(", ")});
        }
        return res.status(500).json({message: 'Sunucu Hatası (updateShelf)'});
    }
})

const deleteShelf = asyncHandler(async (req, res) => {
    try {
        await Shelf.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Sunucu Hatası (deleteShelf)'});
    }
})

const bulkAddShelves = asyncHandler(async (req, res) => {
    const shelves = req.body;
    const insertedShelves = await Shelf.insertMany(shelves);
    res.status(201).json({message: `${insertedShelves.length} kitap başarıyla eklendi.`});
});

const bulkAddBooksToShelves = asyncHandler(async (req, res) => {
    const {bookEntries} = req.body;
    if (!Array.isArray(bookEntries) || bookEntries.length === 0) {
        res.status(400);
        throw new Error("Geçerli bir giriş listesi sağlayın!");
    }
    const errors = [];
    const updates = [];
    for (const entry of bookEntries) {
        const {isbn, barcode, count} = entry;
        if (!isbn || !barcode || typeof count !== "number" || count < 0) {
            errors.push({entry, error: "Eksik veya hatalı veri"});
            continue;
        }
        const book = await Book.findOne({isbn});
        if (!book) {
            errors.push({entry, error: "Kitap bulunamadı"});
            continue;
        }
        const shelf = await Shelf.findOne({barcode});
        if (!shelf) {
            errors.push({entry, error: "Raf bulunamadı"});
            continue;
        }
        const existingBookIndex = shelf.books.findIndex(
            (shelfBook) => shelfBook.id.toString() === book._id.toString()
        );
        if (existingBookIndex >= 0) {
            shelf.books[existingBookIndex].count += count;
        } else {
            shelf.books.push({id: book._id, count});
        }
        try {
            await shelf.save();
            updates.push({entry, success: true});
        } catch (err) {
            errors.push({entry, error: "Rafa kaydedilirken hata oluştu"});
        }
    }
    res.status(200).json({
        message: "Toplu kitap ekleme işlemi tamamlandı",
        updates,
        errors,
    });
});

const deleteAllShelves = asyncHandler(async (req, res) => {
    await Shelf.deleteMany();
    res.status(200).json({message: "Tüm raflar başarıyla silindi!"});
});

module.exports = {
    insertShelf,
    addBookToShelf,
    getAllShelves,
    getShelfWithBooksById,
    updateShelf,
    deleteShelf,
    bulkAddShelves,
    deleteAllShelves,
    bulkAddBooksToShelves
};