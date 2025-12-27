/** biome-ignore-all assist/source/organizeImports: <> */
import type react from 'react';
import Body from '../../../components/body/body';
import type { ContactItem } from '../../../api/types';
import useSWR from 'swr';
import { fetcher } from '../../../api/fetcher';
import useAuthHandler from '../../../hooks/auth-handler';
import ContactCard from '../../../components/cards/card-contact';
import HeaderDesktop from '../../../components/body/header-desktop';
import HeaderMobile from '../../../components/body/header-mobile';
import { Link } from 'wouter';

const ContactsPage: react.FC = () => {
  useAuthHandler();

  const { data: contacts } = useSWR<ContactItem[]>('/api/contacts', fetcher);
  const safeContacts = contacts ?? [];

  const pageTitle = `Contacts (${safeContacts.length})`;

  return (
    <Body
      header={
        <>
          <div className="h-16 md:h-18" />

          <HeaderDesktop Pagetitle={pageTitle}>
            <Link
              className="flex p-3 style-title-center w-full md:w-auto style-glass justify-center place-content-center"
              href="/contacts/add"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <title>Add contact</title>
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
              </svg>
            </Link>
          </HeaderDesktop>

          <HeaderMobile Pagetitle={pageTitle} />

          <div className="visible md:hidden fixed top-2 right-2 z-50">
            <Link
              className="flex p-3 style-title-center w-full md:w-auto style-glass justify-center place-content-center"
              href="/contacts/add"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <title>Add contact</title>
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
              </svg>
            </Link>
          </div>
        </>
      }
      pageTitle={pageTitle}
    >
      {safeContacts.length === 0 ? (
        <div className="style-description style-title-center">
          You don't have any contacts. Add one above.
        </div>
      ) : (
        <div className="flex flex-col">
          {safeContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              callee={contact.calleeID.toString()}
              countryCode={contact.countryCode.toString()}
              contactName={contact.name}
              contactId={contact.id}
            />
          ))}
        </div>
      )}
    </Body>
  );
};

export default ContactsPage;
