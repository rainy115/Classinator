import { AssignmentValidationError } from "../../../../assignment/AssignmentService";
import { createAssignmentApi } from "../../../../assignment/createAssignmentApi";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const assignment = await createAssignmentApi().getById(id);
    if (!assignment) {
      return Response.json({ error: "Assignment not found." }, { status: 404 });
    }
    return Response.json(assignment.toJSON());
  } catch (error) {
    console.error("Unable to load assignment:", error);
    return Response.json({ error: "Unable to load assignment." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const input = await request.json();
    const assignment = await createAssignmentApi().update(id, input);
    if (!assignment) {
      return Response.json({ error: "Assignment not found." }, { status: 404 });
    }
    return Response.json(assignment.toJSON());
  } catch (error) {
    console.error("Unable to update assignment:", error);
    if (error instanceof AssignmentValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Unable to update assignment." }, { status: 500 });
  }
}
