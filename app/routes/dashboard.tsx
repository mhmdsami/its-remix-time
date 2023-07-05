import { Display } from "~/components";
import { Outlet, useLoaderData } from "@remix-run/react";

// TODO: add meta function

// TODO: add loader function to get the participants

export default function Dashboard() {
  const participants = useLoaderData();

  return (
    <div className="min-h-[75vh] flex flex-col justify-around mt-10 gap-3">
      <Outlet />
      <Display participants={participants} />
    </div>
  );
}
