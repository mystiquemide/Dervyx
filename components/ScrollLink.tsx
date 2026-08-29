"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, MouseEventHandler } from "react";

type ScrollLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  targetId: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function ScrollLink({ targetId, onClick, ...props }: ScrollLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || window.location.pathname !== "/") return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  return <Link href={`/#${targetId}`} {...props} onClick={handleClick} />;
}
