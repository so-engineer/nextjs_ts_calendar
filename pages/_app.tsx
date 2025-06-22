import { PlanProvider } from '@/components/context/PlanContext';
import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlanProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PlanProvider>
  );
}
