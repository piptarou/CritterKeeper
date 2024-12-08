const mongoose = require('mongoose');

const critterSchema = new mongoose.Schema({
  case_number: { type: String, required: true, unique: true },
  rescue_date: { type: Date, required: true },
  rescue_role: { type: String, required: true },
  critter_count: { type: Number, required: true },
  animal_type: { type: String, required: true },
  animal_age: { type: String, required: true },
  conservation_status: { type: String, required: true },
  original_location: { type: String, required: true },
  km_driven: { type: Number, required: true },
  volunteer_notes: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Critter', critterSchema, 'critters');