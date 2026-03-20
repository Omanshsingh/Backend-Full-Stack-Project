const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    Image: String,
    caption : String,

});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;