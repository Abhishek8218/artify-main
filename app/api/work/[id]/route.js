// Import necessary modules
import { connectToDB } from "@mongodb/database";
import { Work } from "@models/Work";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const work = await Work.findById(params.id).populate("creator");

    if (!work) return new Response("The Work Not Found", { status: 404 });

    return new Response(JSON.stringify(work), { status: 200 });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
};






// Replace the existing PATCH function with the updated one



export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const data = await req.formData();

    /* Extract info from the data */
    const creator = data.get("creator");

    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    /* Get an array of uploaded photos */
    const photos = data.getAll("workPhotos");

    console.log("Received photos:", photos);
    const existingWork = await Work.findById(params.id);

    if (!existingWork) {
      console.error("The Work Not Found");
      return new Response("The Work Not Found", { status: 404 });
    }
    const existingPhotos = existingWork.workPhotos || [];
    const workPhotos = existingPhotos.slice();
    // const workPhotos = [];

    /* Process and store each photo */
    for (const photo of photos) {
      const size = photo.size;
      console.log("Type of photo:", typeof photo);

      if (size === undefined || size === 0) {
        console.warn("Skipping image with undefined size.");
        continue;
      }

      const buffer = await readPhotoData(photo);
      workPhotos.push(buffer);
    }

    console.log("Processed workPhotos:", workPhotos);

    /* Find the existing Work */
    

    /* Update the Work with the new data */
    existingWork.category = category;
    existingWork.title = title;
    existingWork.description = description;
    existingWork.price = price;
    existingWork.workPhotos = workPhotos.map(photo => Buffer.from(photo));

    await existingWork.save();

    // Return a success response
    console.log("Successfully updated the Work");
    return new Response("Successfully updated the Work", { status: 200 });
  } catch (err) {
    console.error("Error updating the Work:", err);
    // Return an error response
    return new Response("Error updating the Work", { status: 500 });
  }
};




export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Work.findByIdAndDelete(params.id);

    return new Response("Successfully deleted the Work", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Error deleting the Work", { status: 500 });
  }
};











async function readPhotoData(photo) {
  try {
    if (Buffer.isBuffer(photo)) {
      return photo;
    }

    if (photo instanceof Blob) {
      const arrayBuffer = await new Response(photo).arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    if (typeof photo === 'string') {
      // Assuming photo is a base64-encoded string
      return Buffer.from(photo, 'base64');
    }

    console.error("Unrecognized photo type:", typeof photo);
    throw new Error("Invalid photo data: unrecognized type");
  } catch (error) {
    console.error("Error in readPhotoData:", error);
    throw new Error("Invalid photo data");
  }
}