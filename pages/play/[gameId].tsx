import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ref, onValue, set } from 'firebase/database';
import type { NextPage } from 'next';

import { database } from '../../config/firebase';
import AddPlayer from '../../components/AddPlayer';
import SelectPlayer from '../../components/SelectPlayer';
import PlayGround from '../../components/PlayGround';
import Styles from './styles.module.css';
import Rules from '../../components/Rules';

export type Player = {
  name: string;
  pin: string;
  wins: number;
  id: number;
};

export type GameData = {
  players: Player[];
  meta: {
    ties: number;
  };
  currentRound: {
    [k in string]: {
      value?: string;
      status: string;
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

  useEffect(() => {
    // Read game data from store
    const gamesRef = ref(database, 'games/' + gameId);
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      data && setGameData(data);
      setLoading(false);
    });
  }, [gameId]);

  // Add Player if not in game data
  const addPlayer = (player: Player): void => {
    const players = [...(gameData ? gameData.players : []), player];
    const meta = { ...(gameData ? gameData.meta : {}), ...{ ties: 0 } };
    set(ref(database, 'games/' + gameId), {
      ...gameData,
      players,
      meta,
    });
    setActivePlayer(player.name);
  };

  // Select one Player for current session
  const selectPlayer = (playerSelected: string): void => {
    setActivePlayer(playerSelected);
  };

  const checkPin = (playerName: string) => {
    const playerDetails =
      gameData.players.find((p) => p.name === playerName) || null;
    if (playerDetails && playerDetails.pin === pin) setActivePlayer(playerName);
  };

  // Reset Round
  const endRound = (): void => {
    const updatedData = { ...gameData };
    updatedData.currentRound = {};
    set(ref(database, 'games/' + gameId), updatedData);
  };

  if (!gameId) return null;

  return (
    <div className={Styles.container}>
      <div className={Styles.wrapper}>
        <div className={Styles.header}>
          <Image src="/assets/logo.svg" alt="RPS" width={100} height={75} />
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
                  <PlayGround gameId={gameId} player={activePlayer} />
                ) : (
                  <AddPlayer addPlayer={addPlayer} />
                )
              ) : activePlayer ? (
                <PlayGround gameId={gameId} player={activePlayer} />
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