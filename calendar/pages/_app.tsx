import { PlanProvider } from "@/components/providers/PlanProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlanProvider>
      <Component {...pageProps} />
    </PlanProvider>
  );
}