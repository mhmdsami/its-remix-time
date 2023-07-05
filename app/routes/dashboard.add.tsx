import { Form, useActionData } from "@remix-run/react";

type ActionData = {
  formError?: string;
};

// TODO: add meta function

// TODO: add loader function to authorize the user

// TODO: add action function to add a participant

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
