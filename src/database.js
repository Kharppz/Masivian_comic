//require a npm package
const mongoose = require('mongoose')
const URI = 'mongodb://localhost/mern-task'

mongoose.connect(URI).then(db => console.log('Data base is connected')).catch(err => console.error(err))

module.exports = mongoose