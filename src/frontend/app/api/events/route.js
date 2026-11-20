import { getDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

function nextDateKey(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    const nextDate = new Date(year, month - 1, day + 1);
    return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;
}

function timeFromDateTime(value) {
    if (typeof value !== "string") return "";
    return value.match(/T(\d{2}:\d{2})/)?.[1] ?? "";
}

function validTime(value) {
    return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function normalizeEventData(data) {
    const eventDate = data.eventDate
        ?? data.date
        ?? (typeof data.start === "string" ? data.start.slice(0, 10) : "");
    const startTime = data.startTime ?? timeFromDateTime(data.start);
    const endTime = data.endTime ?? timeFromDateTime(data.end);

    const [year, month, day] = typeof eventDate === "string" ? eventDate.split("-").map(Number) : [];
    const parsedEventDate = typeof eventDate === "string" ? new Date(`${eventDate}T00:00:00`) : null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)
        || !parsedEventDate
        || parsedEventDate.getFullYear() !== year
        || parsedEventDate.getMonth() !== month - 1
        || parsedEventDate.getDate() !== day) {
        return { error: "Choose a valid event date." };
    }
    if ((startTime && !validTime(startTime)) || (endTime && !validTime(endTime))) {
        return { error: "Enter a valid event start and end time." };
    }

    const nextDate = nextDateKey(eventDate);
    const normalizedEvent = { ...data };
    delete normalizedEvent.eventDate;
    delete normalizedEvent.date;
    delete normalizedEvent.startTime;
    delete normalizedEvent.endTime;
    delete normalizedEvent.id;
    normalizedEvent.startTimeProvided = Boolean(startTime);
    normalizedEvent.endTimeProvided = Boolean(endTime);

    if (!startTime && !endTime) {
        normalizedEvent.start = eventDate;
        normalizedEvent.end = nextDate;
        normalizedEvent.allDay = true;
    } else {
        normalizedEvent.start = `${eventDate}T${startTime || "00:00"}:00`;
        normalizedEvent.end = endTime
            ? `${eventDate}T${endTime}:00`
            : `${nextDate}T00:00:00`;
        if (startTime && endTime && endTime <= startTime) {
            normalizedEvent.end = `${nextDate}T${endTime}:00`;
        }
        normalizedEvent.allDay = false;
    }

    return { value: normalizedEvent };
}

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
    const normalized = normalizeEventData(data);
    if (normalized.error) return Response.json({ error: normalized.error }, { status: 400 });
    const normalizedEvent = normalized.value;

    const db = await getDatabase();
    const eventsCollection = db.collection("events")

    const result = await eventsCollection.insertOne(normalizedEvent);
    
    return Response.json({ ...normalizedEvent, id: result.insertedId.toString() }, { status: 201 });
}

export async function PATCH(request)
{
    const data = await request.json()
    if (!ObjectId.isValid(data.id)) {
        return Response.json({ error: "Choose a valid event." }, { status: 400 });
    }
    if (!data.eventDate && !data.date && !data.start) {
        const db = await getDatabase();
        const eventsCollection = db.collection("events");
        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(data.id) },
            { $set: { title: data.title } },
        );
        if (result.matchedCount === 0) {
            return Response.json({ error: "Event not found." }, { status: 404 });
        }
        return Response.json({ id: data.id, title: data.title });
    }
    const normalized = normalizeEventData(data);
    if (normalized.error) return Response.json({ error: normalized.error }, { status: 400 });
   
    const db = await getDatabase();
    const eventsCollection = db.collection("events")

    const eventId = new ObjectId(data.id);
    
    const result = await eventsCollection.updateOne({ _id: eventId}, { $set: normalized.value });
    if (result.matchedCount === 0) {
        return Response.json({ error: "Event not found." }, { status: 404 });
    }
    return Response.json({ ...normalized.value, id: data.id });
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
