import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import type { NextPage } from 'next';

import { database } from '../../config/firebase';
import AddPlayer from '../../components/AddPlayer';
import SelectPlayer from '../../components/SelectPlayer';
import PlayGround from '../../components/PlayGround';
import Rules from '../../components/Rules';

import Styles from './styles.module.css';

export type Player = {
  name: string;
  pin: string;
  wins: number;
  status: string;
};

export type GameData = {
  players: Player[];
  meta: {
    ties: number;
  };
  currentRound: {
    winner: string;
    players: {
      [k in string]: {
        value?: string;
        status: string;
      };
    };
  };
};

const Game: NextPage = () => {
  const router = useRouter();
  const { gameId } = router.query;

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [activePlayer, setActivePlayer] = useState('');
  const [pin, setPin] = useState('');
  const [winner, setWinner] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRules, toggleRules] = useState(false);

  const gamesRef = ref(database, 'games/' + gameId);

  // REVIEW: Don't use gameRef in dependency array.
  useEffect(() => {
    // Read game data from store
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      data && setGameData(data);
      setLoading(false);
    });
  }, [gameId]);

  useEffect(() => {
    if (activePlayer && gameData) {
      let updatedPlayers = gameData.players.map((p) => {
        if (p.name === activePlayer) {
          p.status = 'online';
        }
        return p;
      });
      set(gamesRef, { ...gameData, players: updatedPlayers });
      updatedPlayers =
        gameData &&
        gameData.players.map((p) => {
          if (p.name === activePlayer) p.status = 'offline';
          return p;
        });
      if (updatedPlayers) {
        const offlineData = { ...gameData, ...{ players: updatedPlayers } };
        console.log(offlineData);
        onDisconnect(gamesRef).update(offlineData);
      }
    }
  }, [activePlayer]);

  // Add Player if not in game data and update status
  const addPlayer = (player: Player): void => {
    const players = [...(gameData ? gameData.players : []), player];
    const meta = { ...(gameData ? gameData.meta : {}), ...{ ties: 0 } };
    const currentRound = {
      ...(gameData ? gameData.currentRound : { winner: '' }),
      players: {
        ...(gameData
          ? gameData.currentRound
            ? gameData.currentRound.players
            : {}
          : {}),
        ...{ [player.name]: { value: '' } },
      },
    };
    set(gamesRef, {
      ...gameData,
      currentRound,
      players,
      meta,
    });
    setActivePlayer(player.name);
  };

  // Select one Player for current session
  const selectPlayer = (playerSelected: string): void => {
    setActivePlayer(playerSelected);
  };

  // Check pin and update status
  const checkPin = (playerName: string) => {
    if (gameData) {
      const playerDetails =
        gameData.players.find((p) => p.name === playerName) || null;
      if (playerDetails && playerDetails.pin === pin) {
        setActivePlayer(playerName);
      }
    }
  };

  if (!gameId) return null;

  return (
    <div className={Styles.container}>
      <div className={Styles.wrapper}>
        <div className={Styles.header}>
          <Image src="/assets/logo.svg" alt="RPS" width={60} height={45} />
          <div>
            <p>Game : {gameId} </p>
            <button
              className={Styles.rulesBtn}
              onClick={() => toggleRules(true)}
            >
              Rules
            </button>
          </div>
        </div>

        <div className={Styles.playground}>
          {loading ? (
            <p>Initializing...</p>
          ) : (
            <div>
              {!gameData || gameData.players.length < 1 ? (
                activePlayer ? (
                  <PlayGround gameId={gameId as string} player={activePlayer} />
                ) : (
                  <AddPlayer addPlayer={addPlayer} />
                )
              ) : activePlayer ? (
                <PlayGround gameId={gameId as string} player={activePlayer} />
              ) : gameData.players.length === 2 ? (
                <SelectPlayer
                  players={gameData.players}
                  selectPlayer={selectPlayer}
                />
              ) : (
                <div>
                  <p>
                    Are you{' '}
                    <strong className={Styles.playerName}>
                      {gameData.players[0].name}{' '}
                    </strong>
                    ? Please enter your pin to play.
                  </p>

                  <input
                    className={Styles.input}
                    type="number"
                    onChange={(e) => setPin(e.target.value)}
                  />
                  <button
                    className={Styles.btn}
                    onClick={() => checkPin(gameData.players[0].name)}
                  >
                    Enter
                  </button>

                  <p>Or</p>
                  <AddPlayer addPlayer={addPlayer} />
                </div>
              )}
            </div>
          )}

          {showRules && <Rules close={() => toggleRules(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Game;
