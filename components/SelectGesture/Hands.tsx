import Image from 'next/image';

import type { HandSizes, Values } from '../../utils/constants';

import Styles from './styles.module.css';

type HandsProps = {
  size: HandSizes;
  type: Values;
  onSelect: (value: Values) => void;
};

const Hands = ({ size = 'small', type, onSelect }: HandsProps): JSX.Element => {
  return (
    <button
      className={`${Styles.hands} ${Styles[size]} ${Styles[type]} `}
      onClick={() => onSelect(type)}
    >
      <Image
        src={`/assets/icon-${type.toLowerCase()}.svg`}
        alt={type}
        width={98}
        height={118}
      />
    </button>
  );
};

export default Hands;
