"use client"

import type { PropsWithChildren} from "react";
import { useEffect, useRef } from "react";

type MainProps = PropsWithChildren & {
  onBottomReached?: () => void;
};

export function Main(props: MainProps) {
  const { children, onBottomReached } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const bottomReached =
        window.innerHeight + window.scrollY >= ref.current.offsetHeight - 100;

      if (bottomReached) {
        onBottomReached?.();
      }
    };

    if (!onBottomReached) return;

    const element = ref.current;
    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, [onBottomReached]);

  return (
    <div className="flex flex-col items-center grow overflow-auto md:row-start-2 md:col-start-2" ref={ref}>{children}</div>
  );
}
