import type { FC, PropsWithChildren } from 'react';
import { formatCurrency } from '../../functions/formatter';

interface RateCardProps {
  country: string;
  code: string;
  price: number;
  currency?: string;
}

const RateCard: FC<PropsWithChildren<RateCardProps>> = ({
  country = 'Unknown Country',
  code = 'NaN',
  price = 0,
  currency = '$',
}) => {
  return (
    <div className="grid grid-cols-[1fr_5fr_1fr] gap-2">
      <div>{code}</div>

      <div className="mr-auto">{country}</div>

      <div className="ml-auto">{formatCurrency(price, currency)}/min</div>
    </div>
  );
};
export default RateCard;
