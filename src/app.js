const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://172.16.0.118:27017/rescues', {}).then(() => {
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
  console.log('Received request to /');
  try {

    const critters = await Critter.find();

    // Generate HTML output
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Critter Keeper</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h1 class="mt-5">Wildlife Rescue Data</h1>
          <table class="table table-striped mt-3">
            <thead>
              <tr>
                <th>Rescue Date</th>
                <th>Case Number</th>
                <th>Number</th>
                <th>Rescue Role</th>
                <th>Animal</th>
                <th>Life Stage</th>
                <th>Conservation Status</th>
                <th>Priginal Location</th>
                <th>Volunteer Notes</th>
                <th>KM Driven</th>
              </tr>
            </thead>
            <tbody>
            `;

    players.forEach(row => {
      html += `
          <tr>
          <td>${row.rescue_date}</td>
          <td>${row.case_number}</td>
          <td>${row.critter_count}</td>
          <td>${row.rescue_role}</td>
          <td>${row.animal_type}</td>
          <td>${row.animal_age}</td>
          <td>${row.conservation_status}</td>
          <td>${row.original_location}</td>
          <td>${row.volunteer_notes}</td>
          <td>${row.km_driven}</td>
          </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
