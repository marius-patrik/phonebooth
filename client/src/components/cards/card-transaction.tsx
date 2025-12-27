import type { FC, PropsWithChildren } from 'react';
import { formatCurrency } from '../../functions/formatter';

interface TransactionCardProps {
  transactionType: string;
  price: number;
  timestamp: Date;
  displayCurrency: string;
}

const TransactionCard: FC<PropsWithChildren<TransactionCardProps>> = ({
  transactionType = 'Unknown Transaction',
  price = 0,
  timestamp = '',
  displayCurrency = '$',
}) => {
  return (
    <div className="grid grid-cols-3">
      <div className="">{formatCurrency(price, displayCurrency)}</div>

      <div className="">{transactionType}</div>

      <div className="ml-auto">
        {(timestamp as Date).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </div>
    </div>
  );
};
export default TransactionCard;
