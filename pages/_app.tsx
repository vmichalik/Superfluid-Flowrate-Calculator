import '../styles/globals.css'
import type { AppProps } from 'next/app'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ fontFamily: 'GT Walsheim Pro' }}>
      <Component {...pageProps} />
    </div>
  );
}
export default MyApp;