# CritterKeeper
A web application that tracks a volunteer’s wildlife rescue cases using Nodejs, MongoDB, and EJS.
Inspired by a very busy summer, I wanted an application other than a spreadsheet to track how many rescue cases I was involved in.
In the near future, I would like to implement more sorting on the main view, charts/graphs, and some improvements for user experience such as being able to manage their account.

# To Run App
Run `docker-compose up -d` to initialize.

# API Docs
To read the API Documentation in either Postman format or OpenApi Spec, check the 'API Docs' folder.

# JSON Database Files
To examine the database JSON files, you'll find them in 'src\critterkeeper_db'.

# Startup Script
There is a startup script that will run as soon as the server connects.
The startup script will populate the Mongo database with the JSON files, but if not you can import them via compass or another method of your choosing.

The startup script isn't required as each critter entry is meant to be individually linked to whichever user adds it.