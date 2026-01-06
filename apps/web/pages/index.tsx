import Head from "next/head";
import TypingTest from "../components/TypingTest";

export default function Home() {
  return (
    <>
      <Head>
        <title>TypeForge</title>
        <meta name="description" content="A minimalist typing speed test" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-5xl">
          <TypingTest />
        </div>
      </main>
    </>
  );
}
