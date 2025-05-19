import outputs from "../../amplify_outputs.json";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
