import Image from 'next/image';

import CountDown from '../CountDown';
import Styles from './styles.module.css';

type Props = {
  className?: string;
  left: string;
  right: string;
  reset?: () => void;
  duration?: number;
};

const HandsView = ({
  className,
  left,
  right,
  reset,
  duration,
}: Props): JSX.Element => {
  return (
    <div className={`${Styles.wrapper} ${className}`}>
      <div className={`${Styles.imageView} ${left ? '' : Styles.animateLeft} `}>
        {left ? (
          <Image
            src={`/assets/left-${left.toLowerCase()}.webp`}
            className={Styles.selectedOption}
            alt="Hand"
            width={1080}
            height={1080}
          />
        ) : (
          <Image
            src="/assets/left-rock.webp"
            alt="Hand"
            width={1080}
            height={1080}
          />
        )}
      </div>
      {duration && left && right && (
        <CountDown onEnd={reset} duration={duration} />
      )}
      <div
        className={`${Styles.imageView} ${right ? '' : Styles.animateRight} `}
      >
        {right ? (
          <Image
            src={`/assets/right-${right.toLowerCase()}.webp`}
            className={Styles.selectedOption}
            alt="Hand"
            width={1080}
            height={1080}
          />
        ) : (
          <Image
            src="/assets/right-rock.webp"
            alt="Hand"
            width={1080}
            height={1080}
          />
        )}
      </div>
    </div>
  );
};

export default HandsView;
