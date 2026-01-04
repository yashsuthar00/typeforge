import Head from "next/head";
import TypingTest from "../components/TypingTest";

export default function Home() {
  return (
    <>
      <Head>
        <title>TypeForge</title>
        <meta name="description" content="A minimalist typing speed test" />
      </Head>
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <TypingTest />
        </div>
      </main>
    </>
  );
}
