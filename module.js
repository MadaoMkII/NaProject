var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/myDatabase");

autoIncrement.initialize(connection);
mongoose.Promise = global.Promise;
var bookSchema = new Schema({
    // author: { type: Schema.Types.ObjectId, ref: 'Author' },
    title: String,
    genre: String,
    publishDate: Date, id: Number
});
bookSchema.plugin(autoIncrement.plugin, {model: 'Book', field: 'bookId'});

var Book = connection.model('Book', bookSchema);
new Book({
    title: 'das',
    genre: 'sadad',
    publishDate: new Date()
}).save((err, data) => {

    console.log(data);
});