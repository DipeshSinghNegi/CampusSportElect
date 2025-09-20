const { Schema, Types, models, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    votedCategories: [{
      category: {
        type: String,
        enum: [
          "Volleyball Secretary Boys",
          "Volleyball Secretary Girls", 
          "Cricket Secretary",
          "Indoor Games Secretary",
          "Overall Sports Secretary"
        ],
      },
      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
      },
      candidate: {
        type: Types.ObjectId,
        ref: "Candidate",
      },
      votedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = models.User || model("User", userSchema);

module.exports = User;
