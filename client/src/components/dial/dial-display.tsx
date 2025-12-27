/** biome-ignore-all assist/source/organizeImports: <idc> */
import react from 'react';
import DialInput from '../input/dial-input';
import RateSelector from '../input/rate-selector';
import type { RateItem } from '../../api/types';

interface DialDisplayProps {
  rates: RateItem[] | undefined;
  selectedCode: string;
  onCodeSelect: (code: string) => void;
  phoneNumber: string;
  displayCurrency: string | undefined;
}

const DialDisplay: react.FC<DialDisplayProps> = ({
  rates,
  selectedCode,
  onCodeSelect,
  phoneNumber,
  displayCurrency,
}) => {
  // Detect country code from phone number by matching against available rates
  // Sort rates by code length (descending) to match longest codes first
  const detectedRate = react.useMemo(() => {
    if (!rates || !phoneNumber || typeof phoneNumber !== 'string') return null;

    const sortedRates = [...rates].sort(
      (a, b) => b.code.length - a.code.length,
    );
    return sortedRates.find((rate) => phoneNumber.startsWith(rate.code));
  }, [rates, phoneNumber]);

  // Auto-update selector when detected rate changes
  react.useEffect(() => {
    if (detectedRate && detectedRate.code !== selectedCode) {
      onCodeSelect(detectedRate.code);
    }
  }, [detectedRate, selectedCode, onCodeSelect]);

  return (
    <div className="flex flex-col mx-auto mb-2 mt-auto">
      {rates && (
        <RateSelector
          rates={rates}
          selectedCode={selectedCode}
          onCodeSelect={onCodeSelect}
          displayCurrency={displayCurrency}
        />
      )}

      <DialInput value={phoneNumber} />
    </div>
  );
};

export default DialDisplay;
