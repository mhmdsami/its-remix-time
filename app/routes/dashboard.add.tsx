import { requireUserId } from "~/utils/session.server";
import { addParticipant } from "~/utils/participants.server";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";

type ActionData = {
  formError?: string;
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Add Participant | It's Remix Time!" },
    {
      name: "description",
      content: "Add a participant to the It's Remix Time!",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUserId(request);

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const email = form.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    return {
      formError: "Form not submitted correctly.",
    };
  }

  await addParticipant({ name, email }, userId);
  return null;
};

export default function DashboardAdd() {
  const actionData = useActionData<ActionData | undefined>();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-center">Add Participant</h1>
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <input
          name="name"
          type="text"
          placeholder="name"
          className="bg-secondary w-56 px-2 py-1 rounded-md border border-highlight"
        />
        <input
          name="email"
          type="email"
          placeholder="email"
          className="bg-secondary w-56 px-2 py-1 rounded-md border border-highlight"
        />
        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData?.formError}
            </p>
          ) : null}
        </div>
        <button type="submit" className="btn">
          Add
        </button>
      </Form>
    </div>
  );
}
