/** biome-ignore-all assist/source/organizeImports: <idc> */
import type react from 'react';

const DisplayBox: react.FC<
  react.PropsWithChildren<{
    title?: react.JSX.Element;
    buttons?: React.JSX.Element;
  }>
> = ({ title, children, buttons }) => {
  return (
    <div
      className={`style-glass rounded-4xl p-3 mx-4 sm:min-w-md sm:mx-auto gap-2 flex flex-col max-w-lg`}
      id="display box"
    >
      <div className="style-title-center p-2">{title}</div>

      <div className="style-description flex flex-col gap-2 mx-2">
        {children}
      </div>

      <div className="flex flex-col gap-2 md:flex-wrap">{buttons}</div>
    </div>
  );
};
export default DisplayBox;
