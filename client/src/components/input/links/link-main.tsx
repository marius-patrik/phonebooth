import type React from 'react';
import type { FC, MouseEventHandler } from 'react';
import { Link } from 'wouter';

interface LinkBigProps {
  bg?: string;
  hoverBg?: string;
  buttonText?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children?: React.ReactNode;
  disabled?: boolean;
}

const LinkMain: FC<LinkBigProps> = ({
  buttonText,
  children,
  href = '',
  onClick,
  disabled = false,
}) => {
  return (
    <Link
      id="linkstyle"
      onClick={onClick}
      href={href}
      className="flex p-3 style-title-center w-full md:w-auto grow text-center style-glass-highlight justify-center place-content-center"
      aria-disabled={disabled}
    >
      {children ? children : buttonText}
    </Link>
  );
};
export default LinkMain;
