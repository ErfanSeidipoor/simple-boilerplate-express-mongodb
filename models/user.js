const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define Schema
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String,
})

// Create The Model Class
const ModelClass = mongoose.model('user',userSchema)

// Export the models
module.exports = ModelClass;