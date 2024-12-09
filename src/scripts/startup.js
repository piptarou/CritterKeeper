const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Critter = require('../models/Critter');
const User = require('../models/User');
const { Types } = mongoose;

const startup = async () => {
  try {
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../critterkeeper_db/users.json'), 'utf8'));
    const crittersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../critterkeeper_db/critters.json'), 'utf8'));

    console.log('Starting data import from JSON files...');

    for (const userData of usersData) {
      try {
        userData._id = new Types.ObjectId(userData._id.$oid);

        const existingUser = await User.findOne({ _id: userData._id });
        if (!existingUser) {
          const newUser = new User(userData);
          await newUser.save();
          console.log(`User created: ${userData.username}`);
        } else {
          console.log(`User already exists: ${userData.username}`);
        }
      } catch (err) {
        console.error(`Error creating user ${userData.username}:`, err);
      }
    }

    for (const critterData of crittersData) {
      try {
        critterData._id = new Types.ObjectId(critterData._id.$oid);
        critterData.user = new Types.ObjectId(critterData.user.$oid);
        critterData.rescue_date = new Date(critterData.rescue_date.$date);

        if (!critterData.case_number || !critterData.rescue_date || !critterData.user) {
          console.error('Invalid critter data:', critterData);
          continue;
        }

        const existingCritter = await Critter.findOne({ case_number: critterData.case_number });
        if (!existingCritter) {
          const newCritter = new Critter(critterData);
          await newCritter.save();
          console.log(`Critter created: ${critterData.case_number}`);
        } else {
          console.log(`Critter already exists: ${critterData.case_number}`);
        }
      } catch (err) {
        console.error(`Error creating critter ${critterData.case_number}:`, err);
      }
    }
    console.log('Data import completed successfully');
  } catch (err) {
    console.error('Error during data import:', err);
  }
};

module.exports = startup;