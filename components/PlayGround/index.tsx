import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ref, onValue, set, runTransaction } from 'firebase/database';

import { database } from '../../config/firebase';
import type { Player, GameData } from '../../pages/play/[gameId]';
import Styles from './styles.module.css';
import HandsView from '../HandsView';
import SelectGesture from '../SelectGesture';
import ScoreBar from '../ScoreBar';
import type { Score } from '../ScoreBar';

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

  const findWinner = () => {
    const currentPlayer = gameData.currentRound[player];
    let winner = 'ties';

    if (
      gameData &&
      currentPlayer.value !== gameData.currentRound[otherPlayerName].value
    ) {
      switch (currentPlayer.value) {
        case 'rock':
          if (gameData.currentRound[otherPlayerName].value === 'paper') {
            winner = otherPlayerName;
          } else winner = player;
          break;
        case 'paper':
          if (gameData.currentRound[otherPlayerName].value === 'scissors') {
            winner = otherPlayerName;
          } else winner = player;
          break;
        case 'scissors':
          if (gameData.currentRound[otherPlayerName].value === 'rock') {
            winner = otherPlayerName;
          } else winner = player;
          break;
      }
    }
    return winner;
  };

  // Set Score and reset current round
  const reset = () => {
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
      [player]: { status: 'ready' },
      [otherPlayerName]: { status: 'ready' },
    };
    set(ref(database, 'games/' + gameId), updatedData);
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
      gameData.currentRound[player] &&
      gameData.currentRound[player].value &&
      gameData.currentRound[p2] &&
      gameData.currentRound[p2].value &&
      !gameData.currentRound.winner
    ) {
      setWinner();
    }
  }, [gameData, player]);

  // Set Player ready for next round
  const setReady = () => {
    if (gameData) {
      let updatedData = gameData;
      updatedData.currentRound = {
        ...gameData.currentRound,
        ...{ [player]: { status: 'ready' } },
      };
      set(ref(database, 'games/' + gameId), updatedData);
    }
  };

  const isPlayerReady = (): boolean => {
    if (
      gameData &&
      gameData.currentRound &&
      gameData.currentRound[player] &&
      gameData.currentRound[player].status === 'ready'
    )
      return true;
    else return false;
  };

  // Player status check to start game
  const allPlayersReady = (): boolean => {
    let startGame = true;
    if (gameData && gameData.players.length === 2) {
      gameData.players.forEach((p: Player) => {
        if (
          gameData.currentRound &&
          gameData.currentRound[p.name] &&
          gameData.currentRound[p.name].status === 'ready'
        ) {
          // console.log(p.name, ' ready.');
        } else {
          startGame = false;
          return false;
        }
      });
    } else {
      startGame = false;
    }
    return startGame;
  };

  const selectValue = (value: string): void => {
    if (
      gameData &&
      gameData.currentRound &&
      gameData.currentRound[player] &&
      gameData.currentRound[player].status === 'ready'
    ) {
      let updatedData = { ...gameData };
      updatedData.currentRound[player].value = value;
      set(ref(database, 'games/' + gameId), updatedData);
    }
  };

  const getMessage = (winner: string) => {
    if (winner === 'ties') return 'Its a tie 👔';
    else if (winner === player) return 'You Won 😎';
    else return `${winner} Won 😔`;
  };

  const getScores = (): Score[] => {
    const currentPlayer = gameData?.players.find((p) => p.name === player);
    const otherPlayer = gameData?.players.find((p) => p.name !== player);
    return [
      { name: currentPlayer.name, score: currentPlayer.wins || 0 },
      { name: 'Ties', score: gameData?.meta.ties },
      { name: otherPlayer.name, score: otherPlayer.wins || 0 },
    ];
  };

  if (!gameData) return null;

  return (
    <div>
      <h3>
        {allPlayersReady() ? (
          <ScoreBar scores={getScores()} />
        ) : (
          `Welcome ${player}`
        )}
      </h3>
      {gameData.players.length === 2 &&
      allPlayersReady() &&
      gameData.currentRound ? (
        <div>
          <HandsView
            left={gameData.currentRound[player].value || ''}
            right={
              gameData.currentRound[player].value
                ? gameData.currentRound[otherPlayerName].value || ''
                : ''
            }
            {...(gameData.currentRound.winner
              ? { reset: reset, duration: 3000 }
              : {})}
          />
          {!gameData.currentRound[player].value && (
            <SelectGesture
              className={Styles.handsBar}
              size="small"
              onSelect={selectValue}
            />
          )}

          {gameData.currentRound.winner && (
            <h1 className={Styles.winner}>
              {getMessage(gameData.currentRound.winner)}{' '}
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
