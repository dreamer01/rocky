import { HandSizes, VALUES, Values } from '../../utils/constants';
import Hands from './Hands';

type Props = {
  className?: string;
  size: HandSizes;
  onSelect: (value: Values) => void;
};

const SelectGesture = ({ className, size, onSelect }: Props): JSX.Element => {
  return (
    <div className={className}>
      <Hands size={size} type={VALUES.ROCK} onSelect={onSelect} />
      <Hands size={size} type={VALUES.PAPER} onSelect={onSelect} />
      <Hands size={size} type={VALUES.SCISSOR} onSelect={onSelect} />
    </div>
  );
};

export default SelectGesture;
