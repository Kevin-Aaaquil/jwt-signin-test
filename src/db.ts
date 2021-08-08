import { MongoClient, Db } from "mongodb";
import config from "./config";
let db: Db;

const connect = async (): Promise<Db> => {
  const client = new MongoClient(config.MONGODB_URI, {
    ignoreUndefined: true,
  });
  console.log("✅ : database connected");
  return client.db(config.DB_NAME || "test");
};

export default async (): Promise<Db> => {
  if (!db) {
    db = await connect();
    return db;
  }
  return db;
};
