const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Place = require("./models/Place");

const seedPlaces = [
  {
    name: "Central Library",
    description: "Main study and reference library on campus",
    category: "library",
    location: "Near Academic Block",
    lat: 16.4978,
    lng: 80.5001,
  },
  {
    name: "Boys Hostel A",
    description: "Primary boys hostel building",
    category: "hostel",
    location: "North Residential Zone",
    lat: 16.4968,
    lng: 80.4986,
  },
  {
    name: "Computer Lab 1",
    description: "Programming and DBMS lab for CSE students",
    category: "lab",
    location: "Block C, First Floor",
    lat: 16.4982,
    lng: 80.5009,
  },
  {
    name: "Classroom B204",
    description: "Lecture hall for second year classes",
    category: "classroom",
    location: "Block B, Second Floor",
    lat: 16.4975,
    lng: 80.5005,
  },
  {
    name: "Student Activity Center",
    description: "Common area for clubs, events, and student meetings",
    category: "general",
    location: "Near Open Amphitheatre",
    lat: 16.4969,
    lng: 80.4998,
  },
  {
    name: "Main Canteen",
    description: "Best food on campus",
    category: "canteen",
    location: "Near Block A",
    lat: 16.4973,
    lng: 80.4992,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const user = await User.findOne({ email: "sameer@test.com" });

    if (!user) {
      console.log("No user found with email sameer@test.com");
      process.exit(1);
    }

    // optional: clear old places first
    await Place.deleteMany({});
    console.log("Old places removed");

    const placesWithUser = seedPlaces.map((place) => ({
      ...place,
      createdBy: user._id,
    }));

    await Place.insertMany(placesWithUser);
    console.log("Sample places inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();