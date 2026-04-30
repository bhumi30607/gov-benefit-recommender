import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import defaultSchemes from "../utils/defaultSchemes.js";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    const existingSchemes = await Scheme.find({}, { schemeName: 1 }).lean();
    const existingSchemeNames = new Set(existingSchemes.map((scheme) => scheme.schemeName));
    const missingSchemes = defaultSchemes.filter(
      (scheme) => !existingSchemeNames.has(scheme.schemeName)
    );

    if (missingSchemes.length > 0) {
      await Scheme.insertMany(missingSchemes);
    }
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
