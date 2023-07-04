import { Display } from "~/components";
import { requireUserId } from "~/utils/session.server";
import { getParticipants } from "~/utils/participants.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import type { Participant } from "~/types";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dashboard | It's Remix Time!" },
    { name: "description", content: "Dashboard for It's Remix Time!" },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<Participant[]> => {
  const userId = await requireUserId(request);

  return await getParticipants(userId);
};

export default function Dashboard() {
  const participants = useLoaderData<typeof loader>();

  return (
    <div className="min-h-[75vh] flex flex-col justify-around mt-10 gap-3">
      <Outlet />
      <Display participants={participants} />
    </div>
  );
}
