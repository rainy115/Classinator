import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request)
{
    const db = await getDatabase()
    const eventsCollection = db.collection("events")
    const events = await eventsCollection.find({}).toArray()
    
    return Response.json(events);
}

export async function POST(request)
{
    const data = await request.json()
   
    const db = await getDatabase();
    const eventsCollection = db.collection("events")

    const result = await eventsCollection.insertOne(data);
    
    return Response.json(result);
}

export async function PATCH(request)
{
    const data = await request.json()
   
    const db = await getDatabase();
    const eventsCollection = db.collection("events")

	const eventId = new ObjectId(data.id);
    
    const result = await eventsCollection.updateOne({ _id: eventId}, {$set: {title: data.title } });
    
    return Response.json(result);
}

export async function DELETE(request)
{
    const data = await request.json()
   
    const db = await getDatabase();
    const eventsCollection = db.collection("events")

    const eventId = new ObjectId(data.id);

	const result = await eventsCollection.deleteOne({ _id: eventId });      
    return Response.json(result);
}