export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  createdParticipants: Participant[];
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  createdBy: User;
  createdById: string;
}
