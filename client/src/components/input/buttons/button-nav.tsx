import type { FC, PropsWithChildren } from 'react';
import { Link } from 'wouter';

interface FooterButtonProps {
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const FooterButton: FC<PropsWithChildren<FooterButtonProps>> = ({
  href = '',
  children,
  className,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className={`justify-center items-center text-xs hover:scale-110 transition-transform flex w-10 mx-auto flex-col ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default FooterButton;
