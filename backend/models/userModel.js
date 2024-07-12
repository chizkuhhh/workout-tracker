const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // can't signup with same email address
    },
    password: {
        type: String,
        required: true
    }
})

// static signup method
userSchema.statics.signup = async function (email, password) { // can't use arrow function kasi 'this' keyword won't work in it
    // validation
    if (!email || !password) {
        throw Error('All fields must be filled!');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid!');
    }

    if (!validator.isStrongPassword(password)) {
        // minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        throw Error('Password not strong enough!');
    }

    const exists = await this.findOne({email});

    if (exists) {
        throw Error('Email already in use!');
    }

    // hash the password
    const salt = await bcrypt.genSalt(10); // default value is 10; the higher the salt factor, the longer it takes to hack/login
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({email, password: hash});

    return user;
}

// static login method
userSchema.statics.login = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error('All fields must be filled!');
    }

    const user = await this.findOne({email});

    if (!user) {
        throw Error('Email is not associated with any account!');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password!');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);