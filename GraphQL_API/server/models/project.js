//Task 6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: String,
  description: String,
  completed: Boolean
});

module.exports = mongoose.model('Project', projectSchema);
