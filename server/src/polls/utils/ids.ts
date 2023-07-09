import { customAlphabet, nanoid } from 'nanoid';

// creates game code
export const createPollID = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);

// users id stored in database
export const createUserID = () => nanoid();

// each time nomination is submitted
export const createNominationID = () => nanoid(8);
