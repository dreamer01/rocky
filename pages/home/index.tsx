import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NextPage } from 'next';

import ScoreBar from '../../components/ScoreBar';
import SelectGesture from '../../components/SelectGesture';
import HandsView from '../../components/HandsView';

import Styles from './styles.module.css';

const Header = (): JSX.Element => {
  const getUuid = (): string => Math.random().toString(36).substring(2, 12);
  return (
    <div className={Styles.header}>
      <Image src="/assets/logo.svg" alt="RPS" width={60} height={45} />

      <Link href={`/play/${getUuid()}`} passHref>
        <p className={Styles.playBtn}>Play With Friend</p>
      </Link>
    </div>
  );
};

const initialState = {
  userValue: '',
  botValue: '',
  winner: '',
};

const Home: NextPage = () => {
  const [state, setState] = useState(initialState);

  const [scores, setScores] = useState([
    { name: 'You', score: 0 },
    { name: 'Ties', score: 0 },
    { name: 'Bot', score: 0 },
  ]);

  // Update Score and Reset Round
  useEffect(() => {
    if (state.winner) {
      let newScore = [...scores];
      switch (state.winner) {
        case 'user':
          newScore[0].score = ++newScore[0].score;
          setScores(newScore);
          break;
        case 'tie':
          newScore[1].score = ++newScore[1].score;
          setScores(newScore);
          break;
        case 'bot':
          newScore[2].score = ++newScore[2].score;
          setScores(newScore);
          break;
      }
    }
  }, [state.winner]);

  const handleValue = (userValue: string) => {
    if (userValue) {
      const botNumber = Math.floor(Math.random() * 3) + 1;
      let botValue = '';
      let winner = '';
      switch (botNumber) {
        case 1:
          botValue = 'rock';
          break;
        case 2:
          botValue = 'paper';
          break;
        case 3:
          botValue = 'scissors';
          break;
      }
      if (botValue === userValue) {
        winner = 'tie';
      } else {
        switch (botValue) {
          case 'rock':
            if (userValue === 'paper') {
              winner = 'user';
            } else winner = 'bot';
            break;
          case 'paper':
            if (userValue === 'scissors') {
              winner = 'user';
            } else winner = 'bot';
            break;
          case 'scissors':
            if (userValue === 'rock') {
              winner = 'user';
            } else winner = 'bot';
            break;
          default:
            winner = 'user';
            break;
        }
      }
      setState({ userValue, botValue, winner });
    }
  };

  const getMessage = (): string => {
    switch (state.winner) {
      case 'user':
        return 'You Won 😎';
      case 'bot':
        return 'Bot Won 🤖';
      case 'tie':
        return 'Its a tie 👔';
      default:
        return 'Its a tie 👔';
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.wrapper}>
        <Header />
        <ScoreBar scores={scores} />
        <HandsView
          left={state.userValue}
          right={state.botValue}
          reset={() => setState(initialState)}
          duration={3000}
        />
        {!state.userValue && (
          <SelectGesture
            className={Styles.handsBar}
            size="small"
            onSelect={handleValue}
          />
        )}
        {state.winner && <h1 className={Styles.winner}>{getMessage()} </h1>}
      </div>
    </div>
  );
};

export default Home;
