const express = require('express')
const mongoose = require('mongoose')
const dotenv  = require("dotenv")
dotenv.config()
const app = express();

const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');


app.use(express.json())
app.use('/users', usersRoutes);
app.use('/movies', moviesRoutes);


const connectionString = process.env.MONGO_URI
console.log(connectionString)

mongoose.connect(connectionString).then(() => { console.log('database connected')
  }).catch((err) => { console.log(err) })


app.listen(3000, () => console.log("App running."))