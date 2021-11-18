import Image from 'next/image';

import Styles from './styles.module.css';

type HandsProps = {
  size: 'small' | 'large';
  type: string;
  onSelect: (value: string) => void;
};

const Hands = ({ size = 'small', type, onSelect }: HandsProps): JSX.Element => {
  return (
    <button
      className={`${Styles.hands} ${Styles[size]} ${Styles[type]} `}
      onClick={() => onSelect(type)}
    >
      <Image
        src={`/assets/icon-${type}.svg`}
        alt={type}
        width={98}
        height={118}
      />
    </button>
  );
};

export default Hands;
