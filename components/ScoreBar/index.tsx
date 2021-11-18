import Image from 'next/image';

import Styles from './styles.module.css';

export interface Score {
  name: string;
  score: number;
}

type ScoreBarTypes = {
  scores: Score[];
};

const ScoreBar = ({ scores }: ScoreBarTypes) => {
  if (scores.length)
    return (
      <div className={Styles.scoreBar}>
        <div className={Styles.playerSection}>
          <p>{scores[0].name}</p>
          <p className={Styles.score}>{scores[0].score}</p>
          {scores[0].score > scores[2].score && (
            <Image
              src="/assets/icon-trophy.svg"
              alt="Trophy"
              width={24}
              height={24}
            />
          )}
        </div>
        <div className={Styles.playerSection}>
          <p>Ties</p>
          <p className={Styles.score}>{scores[1].score}</p>
        </div>
        <div className={Styles.playerSection}>
          {scores[0].score < scores[2].score && (
            <Image
              src="/assets/icon-trophy.svg"
              alt="Trophy"
              width={24}
              height={24}
            />
          )}
          <p className={Styles.score}>{scores[2].score}</p>
          <p>{scores[2].name}</p>
        </div>
      </div>
    );
  else return null;
};

export default ScoreBar;
