const mongoose = require('mongoose');

const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        minlength: [3, 'Username too short! (It should be at least 3 symbols)']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password too weak! (It should be at least 8 symbols)']
    },
    salt: String
});

userSchema
    .path('email')
    .validate(
        (value) => validator.isEmail(value)
        , 'Invalid email'
    );

userSchema
    .pre('save', function (next) {

        const trimmedEmail = validator.trim(this.email);
        const escapedEmail = validator.escape(trimmedEmail);
        const normalizedEmail = validator.normalizeEmail(escapedEmail);
        this.email = normalizedEmail;

        this.username = validator.escape(this.username);

        this.password = validator.escape(this.password);
        this.password = validator.trim(this.password);

        this.salt = crypto.randomBytes(16).toString('hex');

        const hash = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`)
            .toString(`hex`)

        this.password = hash;

        next();
    });
    
userSchema.methods.validPassword = function (password) {

    const currentHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);

    return this.password === currentHash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;