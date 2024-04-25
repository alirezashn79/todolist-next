import Alert from "@/components/alert";
import Theme from "@/components/theme";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Theme />
      <Alert />
      <Component {...pageProps} />
    </>
  );
}
