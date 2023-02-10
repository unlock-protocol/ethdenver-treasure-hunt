import Head from "next/head";
import { Inter } from "@next/font/google";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import {
  SiTwitter as Twitter,
  SiDiscord as Discord,
  SiGithub as Github,
} from "react-icons/si";
import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

interface FormData {
  email: string;
}

export default function Home() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [started, setStarted] = useState(false);

  const getStarted = () => {
    // If user is logged in, get the "stage" in which they are?
    // ie get whic locks they have unlocked
    // based on that, set the screen to be the right one!

    if (isAuthenticated) {
      setStarted(true);
    } else {
      login();
    }
  };

  return (
    <>
      <Head>
        <title>EthDenver&apos;s Treasure Hunt</title>
        <meta
          name="description"
          content="Unlock Protocol invites you to participate in the ETHDenver treasure hunt. Participants will experience the IRL NFT experience by unlocking stops and be rewarded with a refreshing treat at the end!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="EthDenver's Treasure Hunt" />
        <meta
          property="og:description"
          content="Unlock Protocol invites you to participate in the ETHDenver treasure hunt. Participants will experience the IRL NFT experience by unlocking stops and be rewarded with a refreshing treat at the end!"
        />
        <meta
          property="og:image"
          content="https://ethdenver.unlock-protocol.com/images/preview.png"
        />
      </Head>
      <Toaster />
      <main className="flex mx-auto flex-col px-0 text-black min-h-screen">
        <Header />
        <Screen
          title="Treasure hunt"
          description="Explore uncharted territories and solve puzzles to find the
                hidden keys that will unlock the treasure trove of beverages. So
                grab your 🗺️ and 🧭, and get ready for the ultimate treasure
                hunt to quench your thirst!"
          image="/images/hunt-hero.png"
          onClick={getStarted}
        ></Screen>
        <footer className="text-white mt-8 flex-none pt-16 text-center font-semibold text-4xl w-full pb-16 flex flex-col bg-darkgray">
          <p className="mt-6 text-lg font-light">
            Built with ♥ by{" "}
            <Link className="underline" href="https://unlock-protocol.com">
              Unlock Labs
            </Link>{" "}
            in collaboration with{" "}
          </p>
          <ul>
            <li>Coinvise</li>
          </ul>
          <ul className="mt-8 flex space-x-8 justify-items-center justify-center	">
            <li>
              <Link target="_blank" href="https://twitter.com/unlockprotocol">
                <Twitter />
              </Link>
            </li>
            <li>
              <Link target="_blank" href="https://discord.unlock-protocol.com">
                <Discord />
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="https://github.com/unlock-protocol/unlock"
              >
                <Github />
              </Link>
            </li>
          </ul>
        </footer>
      </main>
    </>
  );
}
