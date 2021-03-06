import React, { useEffect, useState } from 'react';
import { ref, onValue, set, runTransaction } from 'firebase/database';

import type { Player, GameData } from '../../pages/play/[gameId]';
import { database } from '../../config/firebase';
import { VALUES } from '../../utils/constants';
import HandsView from '../HandsView';
import SelectGesture from '../SelectGesture';
import ScoreBar from '../ScoreBar';

import Styles from './styles.module.css';

type PlayGroundProps = {
  player: string;
  gameId: string;
};

const PlayGround = ({ gameId, player }: PlayGroundProps) => {
  const [gameData, setGameData] = useState<GameData | null>(null);

  const otherPlayerName =
    gameData &&
    gameData.players.length === 2 &&
    gameData.players.filter((p) => p.name !== player)[0].name;

  const findWinner = (): string => {
    if (gameData && otherPlayerName) {
      const currentPlayer = gameData.currentRound.players[player];
      let winner = 'ties';

      if (
        gameData &&
        currentPlayer.value !==
          gameData.currentRound.players[otherPlayerName].value
      ) {
        switch (currentPlayer.value) {
          case VALUES.ROCK:
            if (
              gameData.currentRound.players[otherPlayerName].value ===
              VALUES.PAPER
            ) {
              winner = otherPlayerName;
            } else winner = player;
            break;
          case VALUES.PAPER:
            if (
              gameData.currentRound.players[otherPlayerName].value ===
              VALUES.SCISSOR
            ) {
              winner = otherPlayerName;
            } else winner = player;
            break;
          case VALUES.SCISSOR:
            if (
              gameData.currentRound.players[otherPlayerName].value ===
              VALUES.ROCK
            ) {
              winner = otherPlayerName;
            } else winner = player;
            break;
        }
      }
      return winner;
    } else return 'ties';
  };

  // Set Score and reset current round
  const reset = () => {
    if (gameData && otherPlayerName) {
      const updatedData = { ...gameData };
      if (gameData.currentRound.winner === 'ties') {
        updatedData.meta.ties = updatedData.meta.ties + 1;
      } else {
        updatedData.players?.forEach((player) => {
          if (player.name === gameData.currentRound.winner) {
            player.wins = player.wins + 1;
          }
        });
      }

      updatedData.currentRound = {
        winner: '',
        players: {
          [player]: { status: 'ready' },
          [otherPlayerName]: { status: 'ready' },
        },
      };
      set(ref(database, 'games/' + gameId), updatedData);
    }
  };

  // Find Winner and set it on cloud store
  const setWinner = () => {
    const winner = findWinner();
    runTransaction(ref(database, 'games/' + gameId), (gameData) => {
      if (gameData) {
        if (!gameData.currentRound.winner) {
          gameData.currentRound.winner = winner;
          return gameData;
        }
      }
    });
  };

  // Read game data from cloud store
  useEffect(() => {
    const gamesRef = ref(database, 'games/' + gameId);
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      data && setGameData(data);
    });
  }, [gameId]);

  useEffect(() => {
    const p2 =
      gameData &&
      gameData.players.length === 2 &&
      gameData.players.filter((p) => p.name !== player)[0].name;
    if (
      p2 &&
      gameData.currentRound &&
      gameData.currentRound.players[player] &&
      gameData.currentRound.players[player].value &&
      gameData.currentRound.players[p2] &&
      gameData.currentRound.players[p2].value &&
      !gameData.currentRound.winner
    ) {
      setWinner();
    }
  }, [gameData, player]);

  // TODO: Set Player ready for next round use online not ready
  const setReady = () => {
    if (gameData) {
      let updatedRound;
      const { currentRound } = gameData;
      if (currentRound && currentRound.players) {
        updatedRound = {
          ...currentRound,
          players: {
            ...(currentRound.players ? currentRound.players : {}),
            ...{ [player]: { status: 'ready' } },
          },
        };
      } else {
        updatedRound = { players: { [player]: { status: 'ready' } } };
      }
      set(ref(database, 'games/' + gameId + '/currentRound'), updatedRound);
    }
  };

  const isPlayerReady = (): boolean => {
    if (gameData && gameData.players) {
      const playerDetails = gameData.players.find((p) => p.name === player);
      if (playerDetails?.status === 'online') return true;
      else return false;
    } else return false;
  };

  // Player status check to start game
  const allPlayersReady = (): boolean => {
    let startGame = true;
    if (gameData && gameData.players.length === 2) {
      gameData.players.forEach((p: Player) => {
        if (p.status === 'online') {
          // console.log(p.name, ' ready.');
        } else {
          startGame = false;
          return false; // Won't return from parent fxn will break forEach
        }
      });
    } else {
      startGame = false;
    }
    return startGame;
  };

  const selectValue = (value: string): void => {
    if (gameData && gameData.currentRound) {
      set(
        ref(
          database,
          'games/' + gameId + '/currentRound/players/' + player + '/value',
        ),
        value,
      );
    }
  };

  const getMessage = (winner: string) => {
    if (winner === 'ties') return 'Its a tie ????';
    else if (winner === player) return 'You Won ????';
    else return `${winner} Won ????`;
  };

  const getScores = () => {
    const currentPlayer = gameData?.players.find((p) => p.name === player);
    const otherPlayer = gameData?.players.find((p) => p.name !== player);
    if (gameData && currentPlayer && otherPlayer) {
      return {
        [currentPlayer.name]: currentPlayer.wins || 0,
        ['ties' as string]: gameData.meta.ties || 0,
        [otherPlayer.name]: otherPlayer.wins || 0,
      };
    } else return {};
  };

  if (!gameData && !otherPlayerName) return null;
  const { currentRound } = gameData;

  return (
    <div>
      <h3>
        {allPlayersReady() ? (
          <ScoreBar activePlayer={player} score={getScores()} />
        ) : (
          `Welcome ${player}`
        )}
      </h3>
      {gameData.players.length === 2 && allPlayersReady() && currentRound ? (
        <div>
          <HandsView
            left={currentRound.players[player].value || ''}
            right={
              currentRound.players[player].value
                ? currentRound.players[otherPlayerName as string].value || ''
                : ''
            }
            {...(currentRound.winner ? { reset: reset, duration: 3000 } : {})}
          />
          {!currentRound.players[player].value && (
            <SelectGesture
              className={Styles.handsBar}
              size="small"
              onSelect={selectValue}
            />
          )}

          {currentRound.winner && (
            <h1 className={Styles.winner}>
              {getMessage(currentRound.winner)}{' '}
            </h1>
          )}
        </div>
      ) : (
        <div>
          {isPlayerReady() ? (
            <p> Waiting for other player !</p>
          ) : (
            <button className={Styles.ready} onClick={setReady}>
              Ready
            </button>
          )}
          <h3>Instructions</h3>
          <ul>
            <li>Once both player are ready, the round will start.</li>
            <li>Each round will be of 10 seconds.</li>
            <li>
              {`Within 10 second player can select from "Rock" "Paper" and
              "Scissor"`}
            </li>
            <li>After 10 sec the winner of the round will be announced</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(PlayGround);
