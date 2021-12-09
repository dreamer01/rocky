import { useState } from 'react';

import Styles from './styles.module.css';

type AddPlayerProps = {
  addPlayer: any;
};

const AddPlayer = ({ addPlayer }: AddPlayerProps) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (name && pin) {
      addPlayer({ name, pin, wins: 0 });
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
        {/* <input type="number" placeholder="Enter Pin" /> */}
        <button className={Styles.btn} type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;
