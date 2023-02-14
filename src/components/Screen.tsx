import Image from "next/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Button } from "./Button";

interface ScreenProps {
  title: string;
  description: string;
  image: string;
  cta: string;
  action: () => void;
}

export const Screen = ({
  title,
  description,
  image,
  cta,
  action,
}: ScreenProps) => {
  return (
    <div className="grow container mx-auto max-w-4xl flex flex-col md:mt-8">
      <Image alt="treasure hunt" width="1920" height="2335" src={image} />

      <div className="text-white w-full flex mt-4 mb-8 flex-col md:flex-row">
        <div className="md:w-2/3 mb-6">
          <h1 className="text-7xl font-oswald uppercase font-semibold">
            {title}
          </h1>

          <div className="mb-2 mt-4 text-2xl markdown">
            {/* eslint-disable-next-line react/no-children-prop */}
            <ReactMarkdown children={description} />
          </div>
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
