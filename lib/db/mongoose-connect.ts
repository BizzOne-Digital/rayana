import mongoose from "mongoose";
import { DB_NAME } from "@/lib/constants";

const MONGODB_URI = process.env.MONGODB_URI;

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

const mongoUri: string = MONGODB_URI ?? "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      dbName: DB_NAME,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
