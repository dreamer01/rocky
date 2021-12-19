import Image from 'next/image';

import Styles from './styles.module.css';

type Props = {
  close?: () => void;
  play?: () => void;
};

const Rules = ({ close, play }: Props) => {
  return (
    <div className={Styles.overlay}>
      <div className={Styles.modal}>
        <div className={Styles.header}>
          <h3>Rules</h3>
          {close && (
            <Image
              onClick={close}
              className={Styles.close}
              src="/assets/icon-close.svg"
              alt="Rules"
              width={20}
              height={20}
            />
          )}
        </div>
        <Image
          src="/assets/image-rules.svg"
          alt="Rules"
          width={304}
          height={270}
        />
      </div>
      {play && (
        <button className={Styles.readyBtn} onClick={play}>
          Ready
        </button>
      )}
    </div>
  );
};

export default Rules;
