// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var TracksSchema = new Schema({

  artist: {
    type: String,
    required: true,

  },
 //title is required to be unique so we don't get the same tracks everytime we scrape
  title: {
    type: String,
    required: true,
    unique: true
  
  },

  image: {
    type: String,
   
  },

  saved:{
    type: Boolean,
    default: false,
  },
  //This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Tracks = mongoose.model("Tracks", TracksSchema);

// Export the model
module.exports = Tracks;