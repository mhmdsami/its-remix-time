import type { Participant as ParticipantType } from "~/types";

interface DisplayProps {
  participants: ParticipantType[];
}

export default function Display({ participants }: DisplayProps) {
  return (
    <div className="flex flex-col gap-2">
      {participants.length > 0 ? (
        <div className="flex flex-col gap-2 w-4/5 mx-auto">
          <h1 className="text-2xl font-bold text-center my-3">Participants</h1>
          <div className="grid grid-cols-7 gap-2">
            <div className="btn col-span-2 truncate">Id</div>
            <div className="btn col-span-2">Name</div>
            <div className="btn col-span-2">Email</div>
            <div className="btn col-span-1">Created At</div>
          </div>
          {participants.map(({ id, name, email, createdAt }) => (
            <div key={id} className="grid grid-cols-7 gap-2">
              <div className="btn col-span-2 truncate">{id}</div>
              <div className="btn col-span-2">{name}</div>
              <div className="btn col-span-2">{email}</div>
              <div className="btn col-span-1">
                {new Date(createdAt).toDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex items-center justify-center font-bold text-2xl">
          No participants added yet!
        </p>
      )}
    </div>
  );
}
