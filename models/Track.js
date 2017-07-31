// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Track schema
var TrackSchema = new Schema({
  artist: {
    type: String,
    required: true,
  },
 //title is required to be unique so we don't get the same tracks everytime we scrape
  title: {
    type: String,
    unique: true,
    required: true
  },
  id: {
    type: String
  },
 sourceLink: {
    type: String
  },
  source: {
    type: String   
  },
  saved: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Array
  },
  //This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Track model with the TrackSchema
var Track = mongoose.model("Track", TrackSchema);

// Export the model
module.exports = Track;