import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({

    name :{
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    price:{
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price cannot be negative']
        
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'NGN'], // Add more currencies as needed
        default: 'USD'
    },
     frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], // Add more frequencies as needed
     },
     category: {
        type: String,
        enum: ['Entertainment', 'Productivity', 'Health', 'Education', 'Sports', 'News', 'Finance'], // Add more categories as needed
        required: [true, 'Subscription category is required']
     },
     paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cryptocurrency'], // Add more payment methods as needed
        required: [true, 'Payment method is required'],
        trim: true
        },
        status: {
            type: String,
            enum: ['Active', 'Paused', 'Cancelled', 'Expired'], // Add more statuses as needed
            default: 'Active'
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
            validate: {
                validator: function(value) {
                    return value <= new Date();
                },
                message: 'Start date cannot be in the future'
            }
        }, renewalDate: {
            type: Date,
            required: [true, 'Renewal date is required'],
            validate: {
                validator: function(value) {
                    return value > this.startDate;
                },
                message: 'Renewal date cannot be before the start date'
            }
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Subscription must be associated with a user'],
            index: true

        }

}, {timestamps: true});


//Auto-calculate renewal date is missing
subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate && this.frequency) {
        const renewalPeriod = {
            'Daily': 1,
            'Weekly': 7,
            'Monthly': 30,
            'Yearly': 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }

    if (!this.renewalDate , new Date()){
        this.status = 'Expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;