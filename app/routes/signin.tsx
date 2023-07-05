import { Form, useActionData } from "@remix-run/react";

type ActionData = {
  formError?: string;
};

// TODO: add meta function

// TODO: action to create a user session

export default function SignIn() {
  let actionData = useActionData<ActionData | undefined>();

  return (
    <div className="flex flex-col gap-3 min-h-[75vh] items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <input
          name="username"
          type="text"
          placeholder="username"
          className="bg-secondary w-56 px-2 py-1 rounded-md border border-highlight"
        />
        <input
          name="password"
          type="password"
          placeholder="password"
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
          Sign In
        </button>
      </Form>
    </div>
  );
}
