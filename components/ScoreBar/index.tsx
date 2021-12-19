import Image from 'next/image';

import Styles from './styles.module.css';

type ScoreBarTypes = {
  score: { [k in string]: number };
  activePlayer: string;
};

const ScoreBar = ({ score, activePlayer }: ScoreBarTypes) => {
  // REVIEW:HACK Left and Right Score Order
  const transform = () => {
    let scoreOrder = [];
    scoreOrder[0] = { name: activePlayer, score: score[activePlayer] };
    scoreOrder[1] = { name: 'ties', score: score['ties'] };
    let otherPlayer = Object.keys(score).filter(
      (name) => name !== activePlayer && name !== 'ties',
    )[0];
    scoreOrder[2] = { name: otherPlayer, score: score[otherPlayer] };
    return scoreOrder;
  };

  const scoreCard = transform();

  return (
    <div className={Styles.scoreBar}>
      {scoreCard.map(({ name }) => (
        <div key={name} className={Styles.playerSection}>
          {name === activePlayer && scoreCard[0].score > scoreCard[2].score && (
            <Image
              src="/assets/icon-trophy.svg"
              alt="Trophy"
              width={24}
              height={24}
            />
          )}
          <p
            style={
              name === activePlayer && scoreCard[0].score > scoreCard[2].score
                ? { marginLeft: 16 }
                : {}
            }
          >
            {name}
          </p>
          <p className={Styles.score}>{score[name]}</p>
          {name === scoreCard[2].name &&
            scoreCard[0].score < scoreCard[2].score && (
              <Image
                src="/assets/icon-trophy.svg"
                alt="Trophy"
                width={24}
                height={24}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default ScoreBar;
