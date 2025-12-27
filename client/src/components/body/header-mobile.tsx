/** biome-ignore-all assist/source/organizeImports: <> */
import type react from 'react';
import { Link } from 'wouter';

const HeaderMobile: react.FC<{ Pagetitle?: string }> = ({ Pagetitle }) => {
  const handleback = (
    event: react.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    window.history.back();
  };

  return (
    <div className="md:invisible fixed z-50 top-2 left-2 w-full">
      <div className="flex flex-row gap-2">
        <div className="">
          <Link
            id="linkstyle"
            onClick={handleback}
            href={''}
            className="flex p-2 style-title-center w-full md:w-auto style-glass justify-center place-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <title>back</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
        </div>

        <div className="flex text-center grow items-center w-auto">
          {Pagetitle}
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
