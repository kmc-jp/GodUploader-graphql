import React from "react";
import { Link as RouterLink, LinkProps } from "react-router";

import { useNavigate } from "../contexts/NavigationContext";

const isModifiedEvent = (e: React.MouseEvent) =>
  e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;

type Props = LinkProps & { ref?: React.Ref<HTMLAnchorElement> };

export const Link = ({
  to,
  replace,
  onClick,
  children,
  ref,
  ...props
}: Props) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !isModifiedEvent(e) &&
      !(props.target && props.target !== "_self")
    ) {
      e.preventDefault();
      navigate(to, replace);
    }
  };

  return (
    <RouterLink
      to={to}
      replace={replace}
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

Link.displayName = "Link";
