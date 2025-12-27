/** biome-ignore-all assist/source/organizeImports: <> */
import type react from 'react';
import useSWR from 'swr';
import Body from '../../components/body/body';
import HistoryCard from '../../components/cards/card-history';
import { fetcher } from '../../api/fetcher';
import type { CallItem, RateItem } from '../../api/types';
import type { ContactItem } from '../../api/types';
import useAuthHandler from '../../hooks/auth-handler';

const HistoryPage: react.FC = () => {
  useAuthHandler();

  const { data: calls } = useSWR<CallItem[]>('/api/calls', fetcher);
  const { data: contacts } = useSWR<ContactItem[]>('/api/contacts', fetcher);
  const { data: rates } = useSWR<RateItem[]>('/api/rates', fetcher);

  const displayCurrency = useAuthHandler()?.displayCurrency || 'USD';

  // Build a lookup map for phoneNumber -> contact name
  const contactMap = (contacts ?? []).reduce<Record<string, string>>(
    (acc, contact) => {
      acc[`${contact.countryCode}${contact.calleeID}`] = contact.name;
      return acc;
    },
    {},
  );

  const rateMap = (rates ?? []).reduce<Record<string, number>>((acc, rate) => {
    acc[String(rate.code)] = rate.price;
    return acc;
  }, {});

  return (
    <Body pageTitle="History">
      {calls && calls.length > 0 ? (
        calls
          .sort(
            (a, b) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
          )
          .map((item) => {
            const contactName =
              contactMap[`${item.countryCode}${item.calleeID}`] ?? undefined;
            const rate = rateMap[String(item.countryCode)] ?? 0;

            return (
              <HistoryCard
                key={item.id}
                timestamp={new Date(item.startTime)}
                startTime={new Date(item.startTime)}
                endTime={item.endTime ? new Date(item.endTime) : null}
                calleeID={item.calleeID}
                countryCode={item.countryCode}
                contactName={contactName}
                price={item.price}
                displayCurrency={displayCurrency}
                status={item.status}
                rate={rate}
              />
            );
          })
      ) : (
        <div className="style-description style-title-center">
          You have not made any calls so far.
        </div>
      )}
    </Body>
  );
};

export default HistoryPage;
