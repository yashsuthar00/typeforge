import Head from "next/head";
import TypingTest from "../components/TypingTest";
import styles from "./index.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>TypeForge - Typing Speed Test</title>
        <meta name="description" content="Practice and improve your typing speed with TypeForge" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.logo}>⌨️ TypeForge</h1>
        </header>
        <TypingTest />
      </main>
    </>
  );
}
