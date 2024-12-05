const express = require('express');
const {errorHandler} = require('./middleware/errorMiddleware');
const dotenv = require('dotenv').config();
const {connectDB} = require('./connect/database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/shelves', require('./routes/shelfRoutes'));

app.use(errorHandler);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
