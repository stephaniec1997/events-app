const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name:{type:String, unique: true, required: true},
  startDate:{type: Date, required:true},
  endDate:{type: Date, required:true},
  place:{type:String, required:false},
  description:{type: String, required:true},

}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
