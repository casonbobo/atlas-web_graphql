//Task 6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: String,
  description: String,
  projectID: String,
  completed: Boolean
});

module.exports = mongoose.model('Task', taskSchema);
