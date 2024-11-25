const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/critterkeeper', {}).then(() => {
    console.log('Connected to the MongoDB database.');
  }).catch(err => {
    console.error('Error connecting to the database:', err);
  })
;

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
  volunteer_notes: { type: String, required: true }
});

const Critter = mongoose.model('Critter', critterSchema, 'critters');

app.get('/', async (req, res) => {
  try {
    const critters = await Critter.find();
    res.render('index', { critters });
  } catch (err) {
    console.error('Error fetching critters:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});