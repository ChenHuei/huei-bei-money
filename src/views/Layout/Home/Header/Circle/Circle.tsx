import { PropsWithChildren } from "react";

type BgType = "white" | "primary" | "primaryDarker";

interface CircleProps {
  bg: BgType;
}

const BG_CLASS: Record<BgType, string> = {
  white: "bg-white",
  primary: "bg-primary",
  primaryDarker: "bg-primaryDarker",
};

function Circle(props: PropsWithChildren<CircleProps>) {
  const { bg = "white", children } = props;
  const bgClass = BG_CLASS[bg];

  return (
    <div
      className={`flex justify-center items-center w-full h-full p-2 rounded-full shadow-md ${bgClass}`}
    >
      {children}
    </div>
  );
}

export default Circle;
export type { CircleProps };
