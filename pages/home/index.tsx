import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NextPage } from 'next';

import ScoreBar from '../../components/ScoreBar';
import SelectGesture from '../../components/SelectGesture';
import HandsView from '../../components/HandsView';
import Styles from './styles.module.css';

const Home: NextPage = () => {
  const [userValue, selectValue] = useState('');
  const [botValue, setBotValue] = useState('');
  const [winner, setWinner] = useState('');
  const [scores, setScores] = useState([
    { name: 'You', score: 0 },
    { name: 'Ties', score: 0 },
    { name: 'Bot', score: 0 },
  ]);

  // After UserValue Generate BotValue
  useEffect(() => {
    if (userValue) {
      const botValue = Math.floor(Math.random() * 3) + 1;
      switch (botValue) {
        case 1:
          setBotValue('rock');
          break;
        case 2:
          setBotValue('paper');
          break;
        case 3:
          setBotValue('scissors');
          break;
      }
    }
  }, [userValue]);

  // Find Winner
  useEffect(() => {
    if (botValue && userValue) {
      if (botValue === userValue) {
        setWinner('tie');
      } else {
        switch (botValue) {
          case 'rock':
            if (userValue === 'paper') {
              setWinner('user');
            } else setWinner('bot');
            break;
          case 'paper':
            if (userValue === 'scissors') {
              setWinner('user');
            } else setWinner('bot');
            break;
          case 'scissors':
            if (userValue === 'rock') {
              setWinner('user');
            } else setWinner('bot');
            break;
          default:
            setWinner('user');
            break;
        }
      }
    }
  }, [botValue, userValue]);

  // Update Score and Reset Round
  useEffect(() => {
    if (winner) {
      let newScore = [...scores];
      switch (winner) {
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
      setTimeout(() => {
        console.log('Resetting...', { userValue, botValue, winner });
        selectValue('');
        setBotValue('');
        setWinner('');
      }, 3000);
    }
  }, [winner]);

  const getMessage = (): string => {
    switch (winner) {
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

  const getUuid = (): string => Math.random().toString(36).substr(2, 12);

  return (
    <div className={Styles.container}>
      <div className={Styles.wrapper}>
        <div className={Styles.header}>
          <Image src="/assets/logo.svg" alt="RPS" width={100} height={75} />
          <Link href={`/play/${getUuid()}`} passHref>
            <p className={Styles.playBtn}>Play With Friend</p>
          </Link>
        </div>
        <ScoreBar scores={scores} />
        <HandsView left={userValue} right={botValue} />
        {!userValue && (
          <SelectGesture
            className={Styles.handsBar}
            size="small"
            onSelect={selectValue}
          />
        )}
        {winner && <h1 className={Styles.winner}>{getMessage()} </h1>}
      </div>
    </div>
  );
};

export default Home;
