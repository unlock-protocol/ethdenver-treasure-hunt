import Image from "next/image";
import { Button } from "./Button";

interface ScreenProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

export const Screen = ({ title, description, image, onClick }: ScreenProps) => {
  return (
    <div className="grow container mx-auto max-w-4xl flex flex-col md:mt-8">
      <Image alt="treasure hunt" width="1920" height="2335" src={image} />

      <div className="text-white w-full flex mt-4 mb-8 flex-col md:flex-row">
        <div className="md:w-2/3 mb-6">
          <h1 className="text-7xl font-oswald uppercase font-semibold">
            {title}
          </h1>
          <p className="mb-2 mt-4 text-2xl">{description}</p>
        </div>
        <div className="grow">
          <Button
            onClick={onClick}
            className="w-full border-none bg-white text-black border-0 font-semibold"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
