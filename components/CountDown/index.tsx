import { useState } from 'react';

import useInterval from '../../utils/useInterval';
import Styles from './styles.module.css';

type Props = {
  duration: number;
  onEnd?: () => void;
};

const CountDown = ({ duration, onEnd }: Props) => {
  const [countdown, setCountdown] = useState(duration / 1000);

  const tick = () => {
    if (countdown === 1 && intervalId) {
      onEnd && onEnd();
      window.clearInterval(intervalId);
    }
    setCountdown((c) => c - 1);
  };

  const intervalId = useInterval(tick, 1000);
  return <h1 className={Styles.countdown}>{countdown}</h1>;
};

export default CountDown;
