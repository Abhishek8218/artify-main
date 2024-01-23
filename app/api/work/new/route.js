// Import necessary modules
import { connectToDB } from "@mongodb/database";
import { Work } from "@models/Work";

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.formData();

    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    const photos = data.getAll("workPhotos");

    const workPhotos = [];

    for (const photo of photos) {
      const size = photo.size; 
      if (size === undefined || size === 0) {
        console.warn("Skipping image with undefined size.");
        continue;
      }
      const buffer = await readPhotoData(photo);
      workPhotos.push(buffer);
    }

    const newWork = new Work({
      creator,
      category,
      title,
      description,
      price,
      workPhotos,
    });
    

    await newWork.save();

    return new Response(JSON.stringify(newWork), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new Work", { status: 500 });
  }
}

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

