/** biome-ignore-all assist/source/organizeImports: <idc> */
import react from 'react';
import useSWR from 'swr';

import DialPad from '../../components/dial/dial-pad';
import DialDisplay from '../../components/dial/dial-display';
import Body from '../../components/body/body';
import { fetcher } from '../../api/fetcher';
import type { RateItem } from '../../api/types';
import useAuthHandler from '../../hooks/auth-handler';
import HeaderDesktop from '../../components/body/header-desktop';

const DialPage: react.FC = () => {
  useAuthHandler();

  const { data: rates } = useSWR<RateItem[]>('/api/rates', fetcher);
  const { displayCurrency } = useAuthHandler() ?? {};

  const [phoneNumber, setPhoneNumber] = react.useState('');
  const [countryCode, setCountryCode] = react.useState('');

  const onDialButtonClick = react.useCallback((digit: string) => {
    setPhoneNumber((prev) => prev + digit);
  }, []);

  const onCodeSelect = react.useCallback((code: string) => {
    setCountryCode(code);
    setPhoneNumber('');
  }, []);

  return (
    <Body header={<HeaderDesktop Pagetitle={'Dial'} />}>
      <DialDisplay
        rates={rates}
        selectedCode={countryCode}
        onCodeSelect={onCodeSelect}
        phoneNumber={phoneNumber}
        displayCurrency={displayCurrency}
      />

      <DialPad
        onDialButtonClick={onDialButtonClick}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        countryCode={countryCode}
      />
    </Body>
  );
};

export default DialPage;
