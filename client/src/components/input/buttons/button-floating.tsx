import type { FC, PropsWithChildren } from 'react';
import LinkStyle from '../links/link-style';

interface ButtonFloatingProps {
  href: string;
  buttontext: string;
}

const ButtonFloating: FC<PropsWithChildren<ButtonFloatingProps>> = ({
  href,
  buttontext,
}) => {
  return <LinkStyle href={href} buttonText={buttontext} />;
};

export default ButtonFloating;
