//import mongoose
const mongoose = require('mongoose');

//create and establish connection to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/inTheKnow_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//export db connection
module.exports = mongoose.connection;