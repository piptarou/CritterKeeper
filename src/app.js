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
    rescue_date: Date,
    case_number: Number,
    critter_count: Number,
    rescue_role: String,
    animal_type: String,
    animal_age: String,
    conservation_status: String,
    original_location: String,
    volunteer_notes: String,
    km_driven: Number
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