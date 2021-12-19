import { useState } from 'react';

import type { Player } from '../../pages/play/[gameId]';
import { STATUS } from '../../utils/constants';
import Styles from './styles.module.css';

type AddPlayerProps = {
  addPlayer: (player: Player) => void;
};

const AddPlayer = ({ addPlayer }: AddPlayerProps) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (name && pin) {
      addPlayer({ name, pin, wins: 0, status: STATUS.online });
    }
  };

  return (
    <div>
      <h3>Add Details To Play</h3>
      <form id="addPlayer" onSubmit={handleSubmit} className={Styles.form}>
        <input
          className={Styles.input}
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          className={Styles.input}
          type="number"
          placeholder="Enter 4 Digit Pin"
          minLength={4}
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <br />
        <button className={Styles.btn} type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;
