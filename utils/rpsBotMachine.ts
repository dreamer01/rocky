import { createMachine, assign, send } from 'xstate';
import { VALUES, EVENTS } from './constants';
import type { Values, Events } from './constants';

export interface RPSContext {
  userValue: string;
  botValue: string;
  winner: string;
  score?: {
    [k in string]: number;
  };
}

export type RPSState = {
  value: 'idle' | 'ready' | 'error' | 'reset';
  context: RPSContext;
};

export type RPSEvent = {
  type: Events;
  value?: Values;
};

const VALID_VALUES: { [k in Values]: true } = {
  ROCK: true,
  PAPER: true,
  SCISSOR: true,
};

const initialValues = {
  userValue: '',
  botValue: '',
  winner: '',
};

const rpsMachine = createMachine<RPSContext, RPSEvent, RPSState>(
  {
    id: 'rps',
    initial: 'idle',
    context: {
      ...initialValues,
      score: {
        bot: 0,
        user: 0,
        ties: 0,
      },
    },
    states: {
      idle: {
        on: {
          READY: 'ready',
        },
      },
      ready: {
        on: {
          SELECT_VALUE: [
            {
              cond: 'validValue',
              target: 'winner',
              actions: ['setValues', 'setWinner', 'updateScore'],
            },
            { target: 'error' },
          ],
        },
      },
      error: {
        after: { 1000: 'ready' },
      },
      winner: {
        on: {
          RESET: 'reset',
        },
      },
      reset: {
        entry: ['resetValues'],
        always: { target: 'ready' },
      },
    },
  },
  {
    guards: {
      validValue: (_, evt): boolean => {
        if (evt.value) return VALID_VALUES[evt.value] || false;
        else return false;
      },
    },
    actions: {
      setValues: assign<RPSContext, RPSEvent>({
        userValue: (_, evt: RPSEvent) => {
          if (evt.value) return evt.value;
          else return '';
        },
        botValue: () => {
          const botNumber = Math.floor(Math.random() * 3) + 1;
          let botValue = '';
          switch (botNumber) {
            case 1:
              botValue = VALUES.ROCK;
              break;
            case 2:
              botValue = VALUES.PAPER;
              break;
            case 3:
              botValue = VALUES.SCISSOR;
              break;
          }
          return botValue;
        },
      }),
      setWinner: assign({
        winner: (ctx, _) => {
          const { userValue, botValue } = ctx;
          let winner = '';
          if (botValue === userValue) {
            winner = 'ties';
          } else {
            switch (botValue as Values) {
              case VALUES.ROCK:
                if (userValue === VALUES.PAPER) {
                  winner = 'user';
                } else winner = 'bot';
                break;
              case VALUES.PAPER:
                if (userValue === VALUES.SCISSOR) {
                  winner = 'user';
                } else winner = 'bot';
                break;
              case VALUES.SCISSOR:
                if (userValue === VALUES.ROCK) {
                  winner = 'user';
                } else winner = 'bot';
                break;
              default:
                winner = 'user';
                break;
            }
          }
          return winner;
        },
      }),
      updateScore: assign({
        score: (ctx, _) => {
          const { score, winner } = ctx;
          let updateScore = { ...score };
          updateScore[winner] = updateScore[winner] + 1;
          return updateScore;
        },
      }),
      triggerReset: send(EVENTS.RESET),
      resetValues: assign(initialValues),
    },
  },
);

export default rpsMachine;
