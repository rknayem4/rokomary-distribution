import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("rokomary-distribution");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },

      retailer: {
        type: "string",
        required: false,
      },

      address: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  advanced: {
    database: {
      joins: true,
    },
  },

  plugins: [
    admin(),
  ],
});