import { createAssignmentApi } from "../../../assignment/createAssignmentApi";

export async function GET() {
  try {
    const assignments = await createAssignmentApi().list();
    return Response.json(assignments.map((assignment) => assignment.toJSON()));
  } catch (error) {
    console.error("Unable to load assignments:", error);
    return Response.json({ error: "Unable to load assignments." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const input = await request.json();
    const assignment = await createAssignmentApi().create(input);
    return Response.json(assignment.toJSON(), { status: 201 });
  } catch (error) {
    console.error("Unable to create assignment:", error);
    return Response.json({ error: "Unable to create assignment." }, { status: 500 });
  }
}
