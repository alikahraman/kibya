const mongoose = require('mongoose');
const shelfSchema = new mongoose.Schema({
    location: {type: String, required: [true, 'Lokasyon Adı Giriniz'], unique: true},
    barcode: {type: String, required: [true, 'Raf Barkodu Giriniz']},
    books: [{
        id: {type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true},
        count: {type: Number, required: true},
        _id: false,
    }],
}, {
    versionKey: false
});

module.exports = mongoose.model('Shelf', shelfSchema);