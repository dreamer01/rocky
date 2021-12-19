export const STATUS = {
  online: 'online',
  offline: 'offline',
};

export const VALUES: { [k in Values]: Values } = {
  ROCK: 'ROCK',
  PAPER: 'PAPER',
  SCISSOR: 'SCISSOR',
};

export const EVENTS: { [k in Events]: Events } = {
  SELECT_VALUE: 'SELECT_VALUE',
  RESET: 'RESET',
  READY: 'READY',
};

export const HAND_SIZES = {
  small: 'small',
  large: 'large',
};

export type Values = 'ROCK' | 'PAPER' | 'SCISSOR';

export type Status = keyof typeof STATUS;

export type Events = 'SELECT_VALUE' | 'RESET' | 'READY';

export type HandSizes = keyof typeof HAND_SIZES;
