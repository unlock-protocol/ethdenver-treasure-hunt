import Head from "next/head";
import { Inter } from "@next/font/google";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { BiLoader as Loader } from "react-icons/bi";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface FormData {
  email: string;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ email }: FormData) => {
    setIsLoading(true);
    const portalId = "19942922";
    const formId = "d4d22cb2-32fa-4b37-b148-5c5ab9206931";

    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: [
          {
            name: "email",
            value: email,
          },
        ],
      }),
    };

    await fetch(endpoint, options)
      .then(() => {
        toast.success(
          "Thanks! Your email has been added! We'll be in touch soon!",
          {
            icon: "✅",
          }
        );
      })
      .catch((_) => {
        toast.error("Something wrong happened! Please try again!", {
          icon: "❌",
        });
      });
    reset({ email: "" }); // asynchronously reset your form values
    setIsLoading(false);
  };

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
      <main className="min-h-screen bg-no-repeat bg-cover	bg-[url('/images/im-signup-bg.png')] bg-black flex flex-col md:flex-row">
        <Toaster />
        <div className="md:grow flex items-center justify-items-center justify-center	bg-black/30 ">
          <Image
            className=""
            alt="hero"
            width="700"
            height="700"
            src="/images/img-hero.svg"
          ></Image>
        </div>
        <div className="md:w-96 gap-4 px-8 text-white flex flex-col items-center justify-items-center justify-center py-10">
          <h1 className="text-6xl font-semibold w-full ">Ʉnlock</h1>
          <p>
            Unlock Protocol invites you to participate in the{" "}
            <strong>ETHDenver treasure hunt</strong>. Participants will
            experience the IRL NFT experience by unlocking stops and be rewarded
            with a refreshing treat at the end!
          </p>
          <form
            className="w-full flex flex-col  gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p>Sign up for latest updates:</p>
            <input
              defaultValue=""
              {...register("email", { required: true })}
              className="h-12 rounded-full px-4  text-black"
              placeholder="hello@domain.tld"
              type="email"
            />
            {errors.email && <span>This field is required</span>}

            <button
              disabled={isLoading}
              className="h-12 rounded-full px-4 bg-blue font-semibold flex items-center justify-items-center justify-center"
              type="submit"
            >
              Register
              {isLoading && <Loader></Loader>}
            </button>
          </form>
          <ul className="w-full flex flex-col flex-grow">
            <li>
              <Link
                rel="noreferrer"
                target="_blank"
                className="underline"
                href={tweetIntent}
              >
                Share this on Twitter
              </Link>
            </li>
            <li>
              <Link
                rel="noreferrer"
                target="_blank"
                className="underline"
                href="https://unlock-protocol.com/"
              >
                Learn more about Unlock Protocol
              </Link>
            </li>
          </ul>
          <footer className="bottom-0	place-self-end	">
            Interested in collaborating on this experience?{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="underline"
              href="mailto:hello@unlock-protocol.com"
            >
              Contact us
            </a>
            .
          </footer>
        </div>
      </main>
    </>
  );
}
