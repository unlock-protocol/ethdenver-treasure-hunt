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
import { LoaderIcon } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const network = 137;

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
  tweet: `🗺 I will participate in the @UnlockProtocol Treasure Hunt for @EthereumDenver! Join me! `,
  index: -1, // Not started!
};

interface ScreenType {
  title: string;
  description: string;
  image: string;
  cta: string;
  index: number;
  tweet?: string;
  action?: () => void;
}

const provider = new ethers.providers.JsonRpcBatchProvider(
  `https://rpc.unlock-protocol.com/${network}`
);

export default function Home() {
  const { user, login, purchase } = useAuth();
  const [screen, setScreen] = useState<ScreenType>(startingScreen);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const advance = useCallback(
    async (index: number) => {
      if (!user) {
        return login();
      }

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
                title: "Treasure Hunt!",
                locks: {
                  [status[index].lock]: {
                    name: `Key ${index + 1}: ${status[index].title}`,
                    network,
                    emailRequired: index == 0 || index == 4,
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
          tweet: status[index].tweet,
          title: status[index].title,
          description: status[index].unlocked.description,
          image: `/images/screens/${index + 1}/unlocked.png`,
          cta: index == 4 ? "" : "Move to the next adventure!",
          action: () => {
            advance(index + 1);
          },
        });
      }
    },
    [user, login, purchase]
  );

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      if (!user) {
        setScreen({
          ...startingScreen,
        });
      } else if (Number(router.query.screen) > -1) {
        await advance(Number(router.query.screen));
      } else {
        //
        const lock = new ethers.Contract(
          screens[0].lock,
          PublicLockV12.abi,
          provider
        );
        const hasStarted = await lock.getHasValidKey(user);
        if (hasStarted) {
          setScreen({
            ...startingScreen,
            cta: "Resume your hunt!",
          });
        } else {
          setScreen({
            ...startingScreen,
            cta: "Start your hunt!",
          });
        }
      }
      setLoading(false);
    };
    run();
  }, [user, router.query]);

  const loaded = router.isReady && !loading;

  return (
    <>
      <Head>
        <title>ETHDenver Treasure Hunt</title>
        <meta
          name="description"
          content="Unlock Protocol invites you to join the ETHDenver treasure hunt. Participants will experience the IRL NFT experience by unlocking stops and be rewarded with a refreshing treat at the end!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:title" content="ETHDenver Treasure Hunt" />
        <meta property="twitter:title" content="ETHDenver Treasure Hunt" />

        <meta
          property="og:description"
          content="Unlock Protocol invites you to join the ETHDenver treasure hunt. Participants will experience the IRL NFT experience by unlocking stops and be rewarded with a refreshing treat at the end!"
        />

        <meta
          property="twitter:description"
          content="Unlock Protocol invites you to join the ETHDenver treasure hunt. Participants will experience the IRL NFT experience by unlocking stops and be rewarded with a refreshing treat at the end!"
        />
        <meta
          property="og:image"
          content="https://ethdenver.unlock-protocol.com/images/preview.png"
        />
      </Head>
      <main className="flex mx-auto flex-col px-0 text-black min-h-screen">
        <Header />
        {!loaded && (
          <div className="flex justify-center	items-center h-screen	">
            <LoaderIcon />
          </div>
        )}
        {loaded && (
          <Screen action={() => advance(screen.index + 1)} {...screen} />
        )}
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
