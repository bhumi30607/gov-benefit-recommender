import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import defaultSchemes from "../utils/defaultSchemes.js";

const getMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const isHostedEnvironment =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER_SERVICE_ID) ||
    Boolean(process.env.RENDER_EXTERNAL_URL);

  if (isHostedEnvironment) {
    throw new Error("MONGODB_URI is required in hosted environments like Render");
  }

  return "mongodb://127.0.0.1:27017/gov-benefit-recommender";
};

const connectDb = async () => {
  try {
    const mongoUri = getMongoUri();
    const connection = await mongoose.connect(mongoUri);
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
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDb;
