const express = require('express');
const mongoose = require('mongoose');
const uri = 'mongodb://mongo:27017/critterkeeper';
const bodyParser = require('body-parser');
const session = require('express-session');
const argon2 = require('argon2');
const path = require('path');

const Critter = require('./models/Critter');
const User = require('./models/User');
const startup = require('./scripts/startup');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./src/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'dev-secret-key',
  resave: false,
  saveUninitialized: true,
}));

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    startup();
  })
  .catch((err) => console.error('Error connecting to the database:', err));

// index of critters
app.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const sort = req.query.sort || 'desc';
    const sortOrder = sort === 'asc' ? 1 : -1;
    const critters = await Critter.find({ user: req.session.user.id }).sort({ rescue_date: sortOrder });

    res.render('index', { critters, sort, user: req.session.user });
  } catch (err) {
    console.error('Error fetching critters:', err);
    res.status(500).send('Internal Server Error');
  }
});

// edit critter
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

// update critter
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

// get new critter page
app.get('/new_critter', (req, res) => {
  res.render('new_critter');
});

// add new critter
app.post('/new_critter', async (req, res) => {

  const currentUser = req.session.user;
  const newCritter = new Critter(
    {
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
    user: currentUser.id,
    }
  );
  try {
    await newCritter.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error adding critter:', err);
    res.status(500).send('Internal Server Error');
  }
});

// get login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).render('login', { error: 'An error occurred. Please try again.' });
  }
});

// logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/logout?message=loggedOut');
  });
});

// get registration page
app.get('/register', (req, res) => {
  res.render('registration', { error: null });
});

// user registration
app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.render('registration', { error: 'Passwords do not match!' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('registration', { error: 'Username already taken!' });
    }
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.render('registration', { error: 'Email is already in use!' });
      }
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).render('registration', { error: 'An error occurred. Please try again.' });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});