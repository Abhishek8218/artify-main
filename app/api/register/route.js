// Import necessary modules
import { connectToDB } from "@mongodb/database";
import { User } from "@models/User";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

// Replace the existing POST function with the updated one
export async function POST(req) {
  try {
    /* Connect to MongoDB */
    await connectToDB();

    const data = await req.formData();

    /* Take information from the form */
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const file = data.get("profileImage");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* Hash the password */
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    /* Create a new User */
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: buffer,
    });

    /* Save new User */
    await newUser.save();

    /* Send a success message */
    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Fail to create new User!" },
      { status: 500 }
    );
  }
}
