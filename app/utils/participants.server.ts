import { db } from "~/utils/db.server";
import type { AddParticipant, Participant } from "~/types";

export const addParticipant = async (
  participant: AddParticipant,
  userId: string
) => {
  return (await db.participant.create({
    data: {
      ...participant,
      userId,
    },
  })) as Participant;
};

export const getParticipants = async (userId: string) => {
  return (await db.participant.findMany({
    where: {
      userId,
    },
  })) as Participant[];
};
