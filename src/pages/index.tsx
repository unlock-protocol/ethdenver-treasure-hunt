import Head from "next/head";
import { ethers } from "ethers";
import PublicLockV12 from "@unlock-protocol/contracts/dist/abis/PublicLock/PublicLockV12.json";
import { screens } from "@/lib/screens";

import { Inter } from "@next/font/google";
import { useCallback, useEffect, useState } from "react";
import {
  SiTwitter as Twitter,
  SiDiscord as Discord,
  SiGithub as Github,
} from "react-icons/si";
import Link from "next/link";
import Header from "@/components/Header";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

// TODO: CHANGE ME!
const network = 5;

interface FormData {
  email: string;
}

const startingScreen = {
  title: "Treasure hunt",
  description: `Explore uncharted territories and solve puzzles to find the
        hidden keys that will unlock the treasure trove of beverages. So
        grab your 🗺️ and 🧭, and get ready for the ultimate treasure
        hunt to quench your thirst!`,
  image: "/images/hunt-hero.png",
  cta: "Get Started",
  index: -1, // Not started!
};

interface ScreenType {
  title: string;
  description: string;
  image: string;
  cta: string;
  index: number;
  action?: () => void;
}

export default function Home() {
  const { user, login, purchase } = useAuth();
  const [screen, setScreen] = useState<ScreenType>(startingScreen);
  const router = useRouter();

  const advance = useCallback(
    async (index: number) => {
      if (!user) {
        return login();
      }

      const provider = new ethers.providers.JsonRpcBatchProvider(
        `https://rpc.unlock-protocol.com/${network}`
      );

      const status = await Promise.all(
        screens.map(async (s) => {
          const lock = new ethers.Contract(s.lock, PublicLockV12.abi, provider);
          return {
            ...s,
            hasUnlocked: await lock.getHasValidKey(user),
          };
        })
      );
      const isUnlocked = status[index].hasUnlocked;
      if (!isUnlocked) {
        setScreen({
          index,
          title: status[index].title,
          description: status[index].locked.description,
          image: `/images/screens/${index + 1}/locked.png`,
          cta: "Unlock it!",
          action: () => {
            purchase(
              {
                title: "Let's open the Box!",
                locks: {
                  [status[index].lock]: {
                    name: status[index].title,
                    network,
                    emailRequired: index == 1 || index == 4,
                    skipRecipient: true,
                    password: true,
                  },
                },
                expectedAddress: user,
                pessimistic: true,
              },
              {
                screen: index.toString(),
              }
            );
          },
        });
      } else {
        setScreen({
          index,
          title: status[index].title,
          description: status[index].unlocked.description,
          image: `/images/screens/${index + 1}/unlocked.png`,
          cta: index == 4 ? "" : "Open the next lock!",
          action: () => {
            advance(index + 1);
          },
        });
      }
    },
    [user, login, purchase]
  );

  useEffect(() => {
    if (!user) {
      setScreen({
        ...startingScreen,
      });
    } else if (Number(router.query.screen) > 0) {
      advance(Number(router.query.screen));
    } else {
      setScreen({
        ...startingScreen,
        cta: "Resume your hunt!",
      });
    }
  }, [user, router.query]);

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
      <main className="flex mx-auto flex-col px-0 text-black min-h-screen">
        <Header />
        <Screen action={() => advance(screen.index + 1)} {...screen}></Screen>
        <footer className="text-white mt-8 flex-none pt-16 text-center font-semibold text-4xl w-full pb-16 flex flex-col bg-darkgray">
          <p className="mt-6 text-lg font-light">
            Built with ♥ by{" "}
            <Link className="underline" href="https://unlock-protocol.com">
              Unlock Labs
            </Link>{" "}
            in collaboration with{" "}
          </p>
          <ul className="mt-8 flex space-x-8 justify-items-center justify-center	">
            <li>
              <Image
                alt="Coinvise"
                width="200"
                height="40"
                src={"/images/coinvise.svg"}
              ></Image>
            </li>
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
