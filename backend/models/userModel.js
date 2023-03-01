const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
        // maxLength: [23, "Password must not be more than 23 characters"]
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?size=626&ext=jpg&ga=GA1.1.1236538767.1671957240"
    },
    phone: {
        type: String,
        default: "+234"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "Bio"
    }
}, {
    timestamps: true,
}
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
     
    if(!this.isModified("password")) {
        return next();
    }
    
    // Hash password
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(this.password, salt)
     this.password = hashedPassword;

});


const User = mongoose.model("User", userSchema)
module.exports = User