import { MongoClient } from 'mongodb';

const globalForMongo = globalThis;

export async function getDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not configured');
    }

    if (!globalForMongo.mongoClientPromise) {
        globalForMongo.mongoClientPromise = new MongoClient(uri).connect();
    }

    const client = await globalForMongo.mongoClientPromise;
    return client.db(process.env.MONGODB_DB || 'classinator');
}