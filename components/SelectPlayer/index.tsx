import React, { useState } from 'react';

import type { Player } from '../../pages/play/[gameId]';
import Styles from './styles.module.css';

type SelectPlayerProps = {
  players: Player[];
  selectPlayer: (playerName: string) => void;
};

const SelectPlayer = ({ players, selectPlayer }: SelectPlayerProps) => {
  const [player, selectOption] = useState('');
  const [pin, setPin] = useState('');
  const getUuid = (): string => Math.random().toString(36).substr(2, 12);

  const checkPin = () => {
    const playerDetails = players.find((p) => p.name === player) || null;
    if (playerDetails && playerDetails.pin === pin) selectPlayer(player);
  };

  const newGame = () => {
    window.location.href = window.location.origin + '/play/' + getUuid();
  };

  if (players.length !== 2) return null;
  return (
    <div>
      <p>Welcome Back!</p>
      <p> Please select your name and enter pin to play another round</p>
      <select
        className={`${Styles.input} ${Styles.select}`}
        defaultValue={'placeholder'}
        onChange={(e) => selectOption(e.target.value)}
      >
        <option disabled value="placeholder">
          Select Player
        </option>
        {players.map((player: Player) => (
          <option key={player.name} value={player.name}>
            {player.name}
          </option>
        ))}
      </select>
      {player && (
        <div>
          <input
            className={Styles.input}
            type="number"
            placeholder="Enter your pin."
            onChange={(e) => setPin(e.target.value)}
          />
          <button
            className={`${Styles.btn} ${Styles.enter}`}
            onClick={checkPin}
          >
            Enter
          </button>
        </div>
      )}
      <p>Or</p>
      <p>Start a new game with another player.</p>
      <button className={Styles.btn} onClick={newGame}>
        New Game
      </button>
    </div>
  );
};

export default SelectPlayer;
