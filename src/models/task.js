const mongoose = require('mongoose')
const { Schema } = mongoose

const TaskSchema = new Schema({
    title:{type:String,required:true},
    image:{type:String,required:true},
    score:{type:Number,required:true}
})

module.exports = mongoose.model('Task', TaskSchema,'task')