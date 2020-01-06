let mongoose = require('mongoose')

const CharacterSchema = new mongoose.Schema({
    
    UserID: {
        type: String,
        required: true
    },
    Name: {
        type: Array,
        required: true
    },
    Class: {
        type: Array,
        required: false
    },
    Level: {
        type: Number,
        required: false
    },
    CreatedAt: {
        type: Number,
        requires: false
    },
    UpdatedAt: {
        type: Number,
        requires: false
    },
})

let CharacterModel = mongoose.model('Command', CharacterSchema)
module.exports = CharacterModel
