const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//This plugin has the necessary pswd and username fields
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
