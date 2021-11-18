import Hands from './Hands';
import Styles from './styles.module.css';

type Props = {
  className?: string;
  size: 'small' | 'large';
  onSelect: (value: string) => void;
};

const SelectGesture = ({ className, size, onSelect }: Props): JSX.Element => {
  return (
    <div className={className}>
      <Hands size={size} type="rock" onSelect={onSelect} />
      <Hands size={size} type="paper" onSelect={onSelect} />
      <Hands size={size} type="scissors" onSelect={onSelect} />
    </div>
  );
};

export default SelectGesture;
