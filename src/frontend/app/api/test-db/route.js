import { getDatabase } from "../../../lib/mongodb";
export async function GET(request)
{
    const db = await getDatabase()
    const collections =  await db.listCollections().toArray()
    return Response.json(collections)
}