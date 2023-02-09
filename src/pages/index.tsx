import Head from "next/head";
import { Inter } from "@next/font/google";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { BiLoader as Loader } from "react-icons/bi";
import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/Button";

const inter = Inter({ subsets: ["latin"] });

interface FormData {
  email: string;
}

export default function Home() {
  const tweetIntent = new URL("https://twitter.com/intent/tweet");
  tweetIntent.searchParams.set(
    "text",
    `🗺 I will participate in the @UnlockProtocol Treasure Hunt for @EthereumDenver! Join me! `
  );
  tweetIntent.searchParams.set("url", "https://ethdenver.unlock-protocol.com/");

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
      <main className="flex container mx-auto flex-col px-2 md:px-8 text-black min-h-screen bg-beige">
        <Header />
        <div className="grow container mx-auto max-w-4xl flex flex-col md:flex-row md:mt-8">
          <div className="md:mr-16">
            <Image
              alt="treasure hunt"
              width="1920"
              height="2335"
              src="/images/hero.svg"
            ></Image>
          </div>
          <div className="text-lg">
            <p className="mb-2">
              Embark on a thrilling adventure to uncover a treasure like no
              other! Using cutting-edge NFT, you will unlock and redeem the
              drink of your dreams.{" "}
            </p>
            <p className="mb-2">
              Explore uncharted territories and solve puzzles to find the hidden
              keys that will unlock the treasure trove of beverages. So grab
              your 🗺️ and 🧭, and get ready for the ultimate treasure hunt to
              quench your thirst!
            </p>
            <Button className="w-full mt-4">Get Started</Button>
          </div>
        </div>
        <footer className="flex-none pt-16 text-center font-semibold text-4xl w-full pb-16 flex flex-col">
          <span className="mt-6 text-lg font-light">Unlock Labs. ♥</span>
        </footer>
      </main>
    </>
  );
}
