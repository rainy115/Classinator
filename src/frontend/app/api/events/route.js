import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import createEventApi from "../../../event/createEventApi";

export async function GET(request) // rtrn all saved personal events
{
    const eventApi = createEventApi();

    const events = await eventApi.getEvents();
    
    return Response.json(events);
}

export async function POST(request)
{
    const data = await request.json() 
    
    const eventApi = createEventApi();
    const result = await eventApi.createEvent(data);
    
    return Response.json(result);
}

export async function PATCH(request)
{
    const data = await request.json()
   
    const eventApi = createEventApi();
    const result = await eventApi.updateEvent(data.id, data);
    
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