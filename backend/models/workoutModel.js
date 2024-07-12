const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// sets properties for EACH workout document in the db
const workoutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, 
{
    // automatically adds when the document was created
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);