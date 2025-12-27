/** biome-ignore-all assist/source/organizeImports: <idc> */
import './global.css';

import type { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Switch } from 'wouter';

import DialPage from './pages/private/dial';
import IndexPage from './pages/public/rates';
import CallPage from './pages/private/call';
import HistoryPage from './pages/private/history';
import AccountPage from './pages/private/account';
import ContactsPage from './pages/private/contacts/contacts';
import ContactDetailPage from './pages/private/contacts/contact-detail';

import AuthPage from './pages/public/auth';

const App: FC = () => (
  <Switch>
    <Route path="/" component={IndexPage} />
    <Route path="/rates" component={IndexPage} />

    <Route path="/dial" component={DialPage} />
    <Route path="/call/:countryCode/:calleeID" component={CallPage} />

    <Route path="/auth" component={AuthPage} />

    <Route path="/account" component={AccountPage} />
    <Route path="/history" component={HistoryPage} />

    <Route path="/contacts" component={ContactsPage} />
    <Route path="/contacts/:id" component={ContactDetailPage} />
  </Switch>
);

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
