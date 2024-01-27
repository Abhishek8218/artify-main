// Import necessary modules
import { Schema, model, models } from "mongoose";

// Modify the WorkSchema to store images as binary data
const WorkSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  // Store images as Binary data
  workPhotos: [{ type: Buffer }],
  
});

const Work = models.Work || model("Work", WorkSchema);
export  {Work} ;
