let mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useCreateIndex', true)

let UserSchema = new Schema({
    Email: {
        type: String,
        unique: true,
        requires: true
    },
    UserName: {
        type: String,
        requires: true
    },
    Password: {
        type: String,
        requires: true
    },
    LastConnection: {
        type: Array,
        requires: false
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


let userModel = mongoose.model('User', UserSchema)
module.exports = userModel