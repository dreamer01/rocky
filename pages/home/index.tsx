import Image from 'next/image';
import Link from 'next/link';
import { useMachine } from '@xstate/react';
import type { NextPage } from 'next';

import { EVENTS, Values } from '../../utils/constants';
import rpsBotMachine from '../../utils/rpsBotMachine';
import ScoreBar from '../../components/ScoreBar';
import SelectGesture from '../../components/SelectGesture';
import Rules from '../../components/Rules';
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

const Home: NextPage = () => {
  const [machine, send] = useMachine(rpsBotMachine);

  const handleValue = (userValue: Values) => {
    send({ type: EVENTS.SELECT_VALUE, value: userValue });
  };

  const getMessage = (): string => {
    switch (machine.context.winner) {
      case 'user':
        return 'You Won 😎';
      case 'bot':
        return 'Bot Won 🤖';
      case 'ties':
        return 'Its a tie 👔';
      default:
        return 'Its a tie 👔';
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.wrapper}>
        <Header />
        {machine.context.score && machine.value !== 'idle' && (
          <ScoreBar activePlayer="user" score={machine.context.score} />
        )}

        {machine.value === 'idle' ? (
          <Rules play={() => send({ type: EVENTS.READY })} />
        ) : (
          <>
            <HandsView
              left={machine.context.userValue}
              right={machine.context.botValue}
              reset={() => send({ type: EVENTS.RESET })}
              duration={3000}
            />
            {!machine.context.userValue && (
              <SelectGesture
                className={Styles.handsBar}
                size="small"
                onSelect={handleValue}
              />
            )}
          </>
        )}
        {machine.context.winner && (
          <h1 className={Styles.winner}>{getMessage()} </h1>
        )}
      </div>
    </div>
  );
};

export default Home;
