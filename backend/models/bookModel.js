const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    isbn: {type: String, required: [true, 'ISBN numrasını giriniz'], unique: true},
    title: {type: String, required: [true, 'Kitabın ismi boş geçilemez']},
    author: {type: String, required: [true, 'Yazar boş geçilemez']},
    publisher: {type: String, required: [true, 'Yayınevi boş geçilemez']},
    size: {type: String, required: [true, 'Ebat giriniz']},
    coverType: {type: String, required: [true, 'Kapak türünü giriniz']},
    price: {type: String, required: [true, 'Fiyatını giriniz']},
}, {
    timestamps: true
}, {
    versionKey: false
});

module.exports = mongoose.model("Book", bookSchema);
