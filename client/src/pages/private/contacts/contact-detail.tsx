/** biome-ignore-all assist/source/organizeImports: <> */
import react from 'react';
import Body from '../../../components/body/body';
import { useLocation, useParams } from 'wouter';
import type { ContactItem, RateItem } from '../../../api/types';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../../../api/fetcher';
import DisplayBox from '../../../components/display/display-box';
import LinkStyle from '../../../components/input/links/link-style';
import LinkMain from '../../../components/input/links/link-main';
import InputField from '../../../components/input/input-field';
import RateSelector from '../../../components/input/rate-selector';
import useAuthHandler from '../../../hooks/auth-handler';

type PageMode = 'view' | 'add';

const ContactPage: react.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [_location, setLocation] = useLocation();
  const { displayCurrency } = useAuthHandler() ?? {};

  // Determine page mode based on URL
  const isAddMode = id === 'add';
  const mode: PageMode = isAddMode ? 'add' : 'view';
  const contactId = !isAddMode && id ? Number.parseInt(id, 10) : 0;

  // Fetch data
  const { data: contacts, error } = useSWR<ContactItem[]>(
    '/api/contacts',
    fetcher,
  );
  const { data: rates } = useSWR<RateItem[]>('/api/rates', fetcher);

  // Form state
  const [name, setName] = react.useState('');
  const [countryCode, setCountryCode] = react.useState('');
  const [calleeID, setCalleeID] = react.useState('');

  // Redirect to register if not authenticated
  react.useEffect(() => {
    if (error) {
      setLocation('/user/register');
    }
  }, [error, setLocation]);

  const contact =
    mode !== 'add' ? contacts?.find((c) => c.id === contactId) : null;

  // Initialize form with contact data in view mode
  react.useEffect(() => {
    if (contact) {
      setName(contact.name);
      setCountryCode(contact.countryCode.toString());
      setCalleeID(contact.calleeID.toString());
    }
  }, [contact]);

  // Handler functions
  const callContact = () => {
    if (contact) {
      setLocation(`/call/${contact.countryCode}/${contact.calleeID}`);
    }
  };

  const deleteContact = async () => {
    if (!contact) return;

    if (!confirm(`Delete ${contact.name}?`)) return;

    try {
      await fetcher(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
      });

      setLocation('/contacts');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  };

  const addContact = react.useCallback(async () => {
    if (!name.trim() || !countryCode.trim() || !calleeID.trim()) {
      alert('Please enter name, country code, and phone number');
      return;
    }

    try {
      await fetcher('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, countryCode, calleeID }),
      });

      mutate('/api/contacts');
      setLocation('/contacts');
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  }, [name, countryCode, calleeID, setLocation]);

  const updateContact = async () => {
    if (!name.trim() || !countryCode.trim() || !calleeID.trim()) {
      alert('Please enter name, country code, and phone number');
      return;
    }

    if (!contact) return;

    try {
      // Delete old contact
      await fetcher(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
      });

      // Create new contact with updated data
      await fetcher('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, countryCode, calleeID }),
      });

      mutate('/api/contacts');
      setLocation('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact');
    }
  };

  // Loading state
  if (!contacts && mode !== 'add') {
    return (
      <Body>
        <div>Loading contact...</div>
      </Body>
    );
  }

  // Contact not found (only for view mode)
  if (mode !== 'add' && !contact) {
    return (
      <Body>
        <DisplayBox title={<>Contact not found</>}>
          <div>This contact does not exist or has been deleted.</div>
          <LinkStyle href="/contacts" buttonText="Back to contacts" />
        </DisplayBox>
      </Body>
    );
  }

  // Render view/edit mode (editable form)
  if (mode === 'view' && contact) {
    return (
      <Body>
        <DisplayBox
          title={
            <div className="flex flex-row gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 mt-auto"
              >
                <title>Contacts</title>
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
              {contact.name}
            </div>
          }
          buttons={
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <LinkStyle onClick={deleteContact} buttonText="Remove" />

                <LinkMain onClick={updateContact} buttonText="Save" />
              </div>
            </div>
          }
        >
          {rates && (
            <RateSelector
              rates={rates}
              selectedCode={countryCode}
              onCodeSelect={setCountryCode}
              displayCurrency={displayCurrency}
            />
          )}

          <div className="style-title">Phone Number</div>
          <InputField
            placeholder="1234567890"
            value={calleeID}
            onChange={(e: react.ChangeEvent<HTMLInputElement>) =>
              setCalleeID(e.target.value)
            }
          />

          <div className="style-title">Name</div>
          <InputField
            placeholder="John Smith"
            value={name}
            onChange={(e: react.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </DisplayBox>
      </Body>
    );
  }

  // Render add mode
  return (
    <Body pageTitle="Add a contact">
      <DisplayBox
        title={
          <div className="flex flex-row gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 mt-auto"
            >
              <title>Contacts</title>
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            New Contact
          </div>
        }
        buttons={<LinkMain onClick={addContact} buttonText="Add contact" />}
      >
        {rates && (
          <RateSelector
            rates={rates}
            selectedCode={countryCode}
            onCodeSelect={setCountryCode}
            displayCurrency={displayCurrency}
          />
        )}

        <div className="style-title">Phone Number</div>
        <InputField
          placeholder="1234567890"
          value={calleeID}
          onChange={(e) => setCalleeID(e.target.value)}
        />

        <div className="style-title">Name</div>
        <InputField
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DisplayBox>
    </Body>
  );
};

export default ContactPage;
