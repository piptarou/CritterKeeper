const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/critterkeeper', {}).then(() => {
  console.log('Connected to the MongoDB database.');
}).catch(err => {
  console.error('Error connecting to the database:', err);
});

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
  volunteer_notes: { type: String, required: false }
});

const Critter = mongoose.model('Critter', critterSchema, 'critters');

// index route
app.get('/', async (req, res) => {
  try {
    const critters = await Critter.find();
    res.render('index', { critters });
  } catch (err) {
    console.error('Error fetching critters:', err);
    res.status(500).send('Internal Server Error');
  }
});

// edit route
app.get('/edit/:case_number', async (req, res) => {
  const caseNumber = req.params.case_number;
  try {
    const critter = await Critter.findOne({ case_number: caseNumber });
    if (!critter) {
      return res.status(404).send('Critter not found');
    }
    res.render('edit', { critter });
  } catch (err) {
    console.error('Error fetching critter:', err);
    res.status(500).send('Server Error');
  }
});

// update route
app.post('/update/:case_number', async (req, res) => {
  const caseNumber = req.params.case_number;
  try {
    const updatedCritter = await Critter.findOneAndUpdate(
      { case_number: caseNumber },
      {
        rescue_date: req.body.rescue_date,
        rescue_role: req.body.rescue_role,
        critter_count: req.body.critter_count,
        animal_type: req.body.animal_type,
        animal_age: req.body.animal_age,
        conservation_status: req.body.conservation_status,
        original_location: req.body.original_location,
        km_driven: req.body.km_driven,
        volunteer_notes: req.body.volunteer_notes,
      },
      { new: true }
    );
    if (!updatedCritter) {
      return res.status(404).send('Critter not found');
    }
    res.redirect('/');
  } catch (err) {
    console.error('Error updating critter:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/new_critter', (req, res) => {
  res.render('new_critter');
});

// delete critter
app.post('/delete/:case_number', async (req, res) => {
  const caseNumber = req.params.case_number;
  try {
    const critter = await Critter.findOneAndDelete({ case_number: caseNumber });
    if (!critter) {
      return res.status(404).send('Critter not found');
    }
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting critter');
  }
});

// add new critter
app.post('/new_critter', async (req, res) => {
  const newCritter = new Critter({
    rescue_date: req.body.rescue_date,
    case_number: req.body.case_number,
    rescue_role: req.body.rescue_role,
    critter_count: req.body.critter_count,
    animal_type: req.body.animal_type,
    animal_age: req.body.animal_age,
    conservation_status: req.body.conservation_status,
    original_location: req.body.original_location,
    km_driven: req.body.km_driven,
    volunteer_notes: req.body.volunteer_notes,
  });
  try {
    await newCritter.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error adding critter:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});