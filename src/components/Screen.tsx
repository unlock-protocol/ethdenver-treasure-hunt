import Link from "next/link";
import Image from "next/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Button, buttonClasses } from "./Button";
import { screens } from "@/lib/screens";

interface ScreenProps {
  index: number;
  title: string;
  description: string;
  image: string;
  cta: string;
  tweet?: string;
  action: () => void;
}

export const Screen = ({
  index, // index of the screen we are on! (starts at -1)
  title,
  description,
  tweet,
  image,
  cta,
  action,
}: ScreenProps) => {
  const tweetIntent = new URL("https://twitter.com/intent/tweet");
  tweetIntent.searchParams.set("text", tweet || "");
  tweetIntent.searchParams.set("via", "unlockProtocol");
  tweetIntent.searchParams.set("url", "https://ethdenver.unlock-protocol.com/");

  return (
    <div className="grow container mx-auto max-w-4xl flex flex-col md:mt-8">
      <Image alt="treasure hunt" width="1920" height="2335" src={image} />
      <ul className="flex w-full gap-2 my-2">
        {[...Array(6)].map((x, i) => {
          const isActive = index + 1 >= i;
          const bgColor = isActive ? "bg-white" : "bg-white/50";
          const textColor = isActive ? "text-black" : "text-black/50";

          return (
            <li
              key={i}
              className={`flex grow ${bgColor} justify-center items-center h-6`}
            >
              {!isActive && (
                <span
                  className={`hidden md:flex text-centerF font-semibold ${textColor}`}
                >
                  {i > 0 ? screens[i - 1].title : "Treasure Hunt"}
                </span>
              )}
              {isActive && (
                <Link
                  href={`?screen=${i - 1}`}
                  className={`hidden md:flex text-centerF font-semibold ${textColor}`}
                >
                  {i > 0 ? screens[i - 1].title : "Treasure Hunt"}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <div className="text-white w-full flex mt-4 mb-8 flex-col md:flex-row">
        <div className="md:w-2/3 mb-6">
          <h1 className="text-7xl font-oswald uppercase font-semibold">
            {title}
          </h1>

          <div className="mb-2 mt-4 text-2xl markdown">
            <ReactMarkdown
              /* eslint-disable-next-line react/no-children-prop */
              children={description}
              linkTarget="_blank"
            />
          </div>
          {tweet && (
            <p className="mt-6 text-center md:text-left">
              <Link
                rel="noreferrer"
                target="_blank"
                className={`${buttonClasses} enabled:hover:bg-red enabled:bg-darkred border-yellow border text-yellow py-2 px-4 rounded-full whitespace-nowrap undefined`}
                href={tweetIntent}
              >
                Share this on Twitter
              </Link>
            </p>
          )}
        </div>
        {cta && (
          <div className="grow">
            <Button
              onClick={action}
              className="w-full border-none bg-white text-black border-0 font-semibold"
            >
              {cta}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
