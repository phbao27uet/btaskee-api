export const SALT_ROUNDS = 11;

export const JWT_CONSTANTS = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
};

export const API_URL = process.env.API_URL;

export const RUNNING_COUNT = {
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 1,
  8: 0,
  9: 0,
  T: -2,
  J: -2,
  Q: -2,
  K: -2,
  A: -2,
};

export const DECKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
];

export const TOTAL_CARDS = 416; // 8 decks
