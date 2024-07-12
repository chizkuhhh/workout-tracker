// npm init -y
// npm install express dotenv mongoose cors bcrypt validator jsonwebtoken

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

// express app
const app = express();

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use(cors({
    origin:"http://localhost:4000"
}))

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // do this after it's been connected to the db
        // listen for requests
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log("Listening on port " + PORT);
        })
    })
    .catch((error) => {
        console.log(error);
    })