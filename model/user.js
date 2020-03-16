const mongoose = require("mongoose");
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


var nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 35],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    })
  ]

  var emailValidator = [
    validate({
      validator: 'isEmail',
      message: 'email should be between {ARGS[0]} and {ARGS[1]} characters',
    })
  ]



SALT_WORK_FACTOR = 10;
const UserSchema = new Schema({
  name: { type: String,required: true, validate: nameValidator },
  bgroup: { type: String },
  email: { type: String, unique: true ,required: true, validate: emailValidator},
  password: String,
  resetCheck:String,
  role: {
    type: String,
    enum: ["admin", "subadmin", "user"],
    default: "user"
  },
  is_deleted: { type: Boolean, default: false },

});


UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});





UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



module.exports = mongoose.model("adminapp", UserSchema);
