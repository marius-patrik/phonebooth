/** biome-ignore-all assist/source/organizeImports: <> */
import react from 'react';
import Body from '../../components/body/body.js';
import InputField from '../../components/input/input-field.js';
import { Link } from 'wouter';
import type { UserItem, TransactionItem } from '../../api/types.js';
import useSWR from 'swr';
import { fetcher } from '../../api/fetcher.js';
import DisplayBox from '../../components/display/display-box.js';
import LinkStyle from '../../components/input/links/link-style.js';
import useAuthHandler from '../../hooks/auth-handler.js';
import useLogoutHandler from '../../hooks/logout-handler.js';
import TransactionCard from '../../components/cards/card-transaction.js';
import LinkMain from '../../components/input/links/link-main.js';
import { formatCurrency } from '../../functions/formatter.js';

const AccountPage: react.FC = () => {
  useAuthHandler();

  const { data: userData } = useSWR<UserItem>('/api/user', fetcher);
  const { data: transactionData } = useSWR<TransactionItem[]>(
    '/api/transactions',
    fetcher,
  );

  const { logout } = useLogoutHandler();

  const handleLogout = async (event: react.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    await logout();
  };

  const [depositAmount, setDepositAmount] = react.useState('');

  const handleDeposit = react.useCallback(async () => {
    const amountValue = Number(depositAmount);

    if (Number.isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid deposit amount greater than zero.');
      return;
    }

    try {
      // Request payment link from backend
      const response = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: amountValue }),
      });
      if (!response.ok) {
        alert('Failed to get payment link. Please try again.');
        return;
      }
      const result = await response.json();
      if (result.paymentLink) {
        window.location.href = result.paymentLink;
      } else {
        alert('No payment link received.');
      }
      setDepositAmount('');
    } catch (_error) {
      alert('Failed to process deposit. Please try again.');
    }
  }, [depositAmount]);

  return (
    <Body pageTitle="More">
      <DisplayBox
        title={
          <div className="flex flex-row gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 my-auto"
            >
              <title>Account</title>
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
            Account
          </div>
        }
        buttons={<LinkMain buttonText="Log out" onClick={handleLogout} />}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <div className="style-title flex flex-row gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 my-auto"
              >
                <title>Email icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                />
              </svg>
              {`Email: `}
            </div>
            {userData?.email}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row gap-1 style-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 my-auto"
              >
                <title>Currency</title>
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                  clipRule="evenodd"
                />
              </svg>
              Currency:
            </div>
            {`${userData?.currency} ${userData?.displayCurrency}`}
          </div>
        </div>
      </DisplayBox>

      <DisplayBox
        title={
          <div className="flex flex-row gap-1">
            <div className="flex flex-row gap-1 style-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 my-auto"
              >
                <title>Wallet</title>
                <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
              </svg>
              Wallet
            </div>
          </div>
        }
        buttons={
          <LinkStyle
            buttonText="Deposit"
            onClick={(event) => {
              event.preventDefault();
              handleDeposit();
            }}
          />
        }
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1 style-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <title>Funds</title>
              <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
              <path
                fillRule="evenodd"
                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
                clipRule="evenodd"
              />
              <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
            </svg>
            Funds:
          </div>
          {formatCurrency(
            userData?.balance ?? 0,
            userData?.displayCurrency ?? '$',
          )}
        </div>

        <InputField
          placeholder="Top Up Account"
          value={depositAmount}
          onChange={(event) => setDepositAmount(event.target.value)}
        />

        <Link href="/rates" className="style-link">
          See current rates
        </Link>
      </DisplayBox>

      <DisplayBox
        title={
          <div className="flex flex-row gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 my-auto"
            >
              <title>Transactions</title>
              <path
                fillRule="evenodd"
                d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z"
                clipRule="evenodd"
              />
              <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
            </svg>
            Transactions
          </div>
        }
      >
        <div className="grid grid-cols-3">
          <div className="style-title">Amount</div>

          <div className="style-title">Type</div>

          <div className="ml-auto style-title">Time</div>
        </div>

        {transactionData
          ?.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          .map((item) => (
            <TransactionCard
              key={item.id}
              transactionType={item.transactionType}
              price={item.price}
              timestamp={new Date(item.timestamp)}
              displayCurrency={item.displayCurrency}
            />
          ))}
      </DisplayBox>
    </Body>
  );
};

export default AccountPage;
