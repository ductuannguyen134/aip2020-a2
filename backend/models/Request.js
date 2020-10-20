const mongoose = require("mongoose");
const User = require("./User");
const Prize = require("./Prize");
const Schema = mongoose.Schema;

const requestModel = {
  requestContent: {
    type: String,
    required: true,
  },
  requestFavors: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rewards: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "Prize",
          },
          quantity: {
            type: Number,
          },
        },
      ],
    },
  ],
  resolverID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  resolverProof: {
    type: String,
  },
};

const RequestSchema = new Schema(requestModel);
<<<<<<< HEAD
module.exports = mongoose.model('requests', RequestSchema);
=======

module.exports = mongoose.model("Request", RequestSchema);
>>>>>>> 85980b0098e38692fdc029bf43a283dce32acf31
