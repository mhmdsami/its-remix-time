import { ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center m-10 text-lg font-medium">
      <div className="flex flex-col gap-2 w-72 p-10 rounded-lg bg-secondary border border-highlight">
        <a
          className="flex items-center gap-2 hover:translate-x-2 transition-all ease-in-out duration-100"
          href="https://remix.run"
        >
          <ArrowRight />
          <div className="hover:underline">Remix Docs</div>
        </a>
        <a
          className="flex items-center gap-2 hover:translate-x-2 transition-all ease-in-out duration-100"
          href="https://github.com/mhmdsami/its-remix-time"
        >
          <ArrowRight />
          <div className="hover:underline">View the Repo</div>
        </a>
      </div>
    </div>
  );
}
