import type react from 'react';
import type { RateItem } from '../../api/types';
import { formatCurrency } from '../../functions/formatter';

interface RateSelectorProps {
  rates: RateItem[];
  selectedCode: string;
  onCodeSelect: (code: string) => void;
  displayCurrency: string | undefined;
}

const RateSelector: react.FC<RateSelectorProps> = ({
  rates,
  selectedCode,
  onCodeSelect,
  displayCurrency,
}) => {
  return (
    <select
      value={selectedCode}
      onChange={(e) => onCodeSelect(e.target.value)}
      className="glass-panel w-full md:w-auto glass-panel style-title-center style-description"
    >
      <option className="text-black bg-white" value="">
        Select country code
      </option>
      {rates.map((rate) => (
        <option key={rate.id} className="text-black bg-white" value={rate.code}>
          +{rate.code} - {rate.country} (
          {formatCurrency(rate.price, displayCurrency ?? '$')}/min)
        </option>
      ))}
    </select>
  );
};

export default RateSelector;
