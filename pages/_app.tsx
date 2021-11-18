import type { AppProps } from 'next/app';

import '../config/firebase';
import '../theme/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
