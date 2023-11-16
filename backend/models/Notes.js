const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const NotesSchema = new Schema({
 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
  },
  timestamp:{
    type:Date,
    default:Date.now
}
});

module.exports = mongoose.model("notes", NotesSchema);
