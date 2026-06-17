import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minlength: [3, 'User Name must be at least 3 characters long'],
        maxlength: [50, 'User Name must be at most 50 characters long']
    },
     email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, 'User Email must be at least 5 characters long'],
        maxlength: [100, 'User Email must be at most 100 characters long'],
        match: [/\S+@\S+\.\S+/, 'User Email must be a valid email address']
     }, 
     password:{
        type: String,
        required: [true, 'User Password is required'],
        minLength: [5, 'User Password must be at least 6 characters long']

     }
    }, { timestamps: true } );

const User = mongoose.model('User', userSchema);

export default User;

