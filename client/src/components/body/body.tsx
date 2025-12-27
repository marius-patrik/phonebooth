/** biome-ignore-all assist/source/organizeImports: <idc> */
import type { FC, JSX, PropsWithChildren } from 'react';

import FooterMobile from './footer-mobile';
import HeaderMobile from './header-mobile';
import HeaderDesktop from './header-desktop';

const Body: FC<
  PropsWithChildren<{
    header?: JSX.Element | null;
    footer?: JSX.Element | null;
    pageTitle?: string;
  }>
> = ({ pageTitle = '', header, footer, children }) => {
  // Provide default header and footer if not supplied
  const defaultHeader = (
    <>
      <HeaderDesktop Pagetitle={pageTitle} />

      <div className="h-16 md:h-18" />

      <HeaderMobile Pagetitle={pageTitle} />
    </>
  );

  const defaultFooter = (
    <div className="mx-auto">
      <FooterMobile />
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-y-scroll overflow-x-hidden">
      {header ?? defaultHeader}

      <div className="flex flex-col px-2 gap-2 grow h-full">
        {children}
        <div className="pb-18" />
      </div>

      {footer ?? defaultFooter}
    </div>
  );
};
export default Body;
