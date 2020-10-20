const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = {
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
  },
  password: {
    type: String,
    required: true,
  },
  completedRequest: {
    type: Number,
    default: 0,
  }
};

const UserSchema = new Schema(userModel);
<<<<<<< HEAD
module.exports = mongoose.model('users', UserSchema);
=======

module.exports = mongoose.model("User", UserSchema);
>>>>>>> 85980b0098e38692fdc029bf43a283dce32acf31
