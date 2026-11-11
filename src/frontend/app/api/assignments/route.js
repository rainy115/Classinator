import { getDatabase } from "../../../lib/mongodb";

export async function GET(request)
{
    const db = await getDatabase();

    const assignmentsCollection = db.collection("assignments");
	const assignments = await assignmentsCollection.find({}).toArray();

	return Response.json(assignments);
}
export async function POST(request)
{
	const data = await request.json();

	if (!data.title?.trim() || !data.dueDate || Number.isNaN(Date.parse(data.dueDate)))
	{
		return Response.json(
			{ error: "Invalid assignment name/date" },
			{ status: 400 }
		);
	}

	const db = await getDatabase();
	const assignmentsCollection = db.collection("assignments");

	const result = await assignmentsCollection.insertOne(data);

	return Response.json(result, { status: 201 });
}