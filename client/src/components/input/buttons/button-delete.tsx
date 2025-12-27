/** biome-ignore-all assist/source/organizeImports: <idc> */
import { useCallback, type FC } from 'react';
import { useRef } from 'react';

interface DialButtonProps {
  value: string;
  onClick: (digit: string) => void;
}

const DeleteButton: FC<DialButtonProps> = ({ value, onClick }) => {
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  const onDeleteButtonClick = useCallback(() => {
    const stringValue = String(value || '');
    const newValue = stringValue.slice(0, -1);
    onClick(newValue);
  }, [value, onClick]);

  const handleMouseDown = () => {
    holdTimeout.current = setTimeout(() => {
      onClick(''); // Clear field on long press
    }, 500);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  return (
    <button
      type="button"
      className="text-3xl font-semibold hover:scale-101 active:scale-101 transition-transform"
      onClick={onDeleteButtonClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
        className="size-8 m-auto"
      >
        <title>Delete icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
        />
      </svg>
    </button>
  );
};

export default DeleteButton;
