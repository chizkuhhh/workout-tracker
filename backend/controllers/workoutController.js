const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

// get all workouts
const getWorkouts = async (req, res) => {
    const user_id = req.user._id;

    // ".sort({createdAt: -1})" sorts in descending order (newest at top)
    const workouts = await Workout.find({user_id}).sort({createdAt: -1});
    res.status(200).json(workouts);
}

// get a single workout
const getWorkout = async (req, res) => {
    const {id} = req.params;

    // check if id is a valid id (mongoose type id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Workout does not exist!'});
    }

    const workout = await Workout.findById(id);
    if (!workout) {
        // use return to stop running the rest of the code below
        return res.status(404).json({error: 'Workout does not exist!'});
    }

    res.status(200).json(workout);
}

// create a new workout
const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body;

    let emptyFields = []; // detect empty fields when user creates a workout

    if (!title) {
        emptyFields.push('title');
    }

    if (!load) {
        emptyFields.push('load');
    }

    if (!reps) {
        emptyFields.push('reps');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all fields!', emptyFields});
    }

    // add new document to db
    try {
        const user_id = req.user._id;
        const workout = await Workout.create({title, load, reps, user_id});
        res.status(200).json(workout);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

// delete a workout
const deleteWorkout = async (req, res) => {
    const {id} = req.params;

    // check if id is a valid id (mongoose type id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Workout does not exist!'});
    }

    const workout = await Workout.findOneAndDelete({_id: id});

    if (!workout) {
        // use return to stop running the rest of the code below
        return res.status(404).json({error: 'Workout does not exist!'});
    }

    res.status(200).json(workout);
}

// update a workout
const updateWorkout = async (req, res) => {
    const {id} = req.params;

    // check if id is a valid id (mongoose type id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Workout does not exist!'});
    }

    const workout = await Workout.findByIdAndUpdate({_id: id}, {
        ...req.body // spreads the properties of req.body into THIS object and updates on the document with the said id
    })

    if (!workout) {
        // use return to stop running the rest of the code below
        return res.status(404).json({error: 'Workout does not exist!'});
    }

    res.status(200).json(workout);
}

module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}