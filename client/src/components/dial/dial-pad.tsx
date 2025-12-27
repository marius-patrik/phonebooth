/** biome-ignore-all assist/source/organizeImports: <> */
import DeleteButton from '../input/buttons/button-delete';
import DialButton from '../input/buttons/button-dial';
import CallButton from '../input/links/link-call';

import { useEffect } from 'react';

interface DialPadCompProps {
  onDialButtonClick: (digit: string) => void;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  countryCode: string;
}

const DialPad: React.FC<DialPadCompProps> = ({
  onDialButtonClick,
  phoneNumber,
  setPhoneNumber,
  countryCode,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (/^[0-9]$/.test(e.key)) {
        onDialButtonClick(e.key);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDialButtonClick]);

  return (
    <div className="grid grid-cols-3 gap-2 mx-auto mb-auto">
      <DialButton onClick={onDialButtonClick} digit="1" />
      <DialButton onClick={onDialButtonClick} digit="2" />
      <DialButton onClick={onDialButtonClick} digit="3" />

      <DialButton onClick={onDialButtonClick} digit="4" />
      <DialButton onClick={onDialButtonClick} digit="5" />
      <DialButton onClick={onDialButtonClick} digit="6" />

      <DialButton onClick={onDialButtonClick} digit="7" />
      <DialButton onClick={onDialButtonClick} digit="8" />
      <DialButton onClick={onDialButtonClick} digit="9" />

      <div></div>
      <DialButton onClick={onDialButtonClick} digit="0" />
      <div></div>

      <div></div>
      <CallButton calleeID={phoneNumber} countryCode={countryCode}></CallButton>
      <DeleteButton onClick={setPhoneNumber} value={phoneNumber} />
    </div>
  );
};
export default DialPad;
