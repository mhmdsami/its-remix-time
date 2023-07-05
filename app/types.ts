export type User = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  createdParticipants: Participant[];
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  userId: string | null;
};

export type AddParticipant = Pick<Participant, "name" | "email">;
