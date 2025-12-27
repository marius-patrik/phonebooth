import { Link } from 'wouter';
import OtherCallButton from '../input/links/link-call-again';

export interface ContactCardProps {
  callee: string;
  contactName?: string;
  contactId?: number;
  countryCode: string;
}

const ContactCard: React.FC<React.PropsWithChildren<ContactCardProps>> = ({
  callee,
  contactName,
  contactId,
  countryCode,
}) => {
  return (
    <Link
      href={`/contacts/${contactId}`}
      id="contact-card"
      className="flex flex-row grow hover:scale-101 active:scale-101 transition-transform"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-12 mr-auto my-auto"
      >
        <title>Callee avatar</title>
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          clipRule="evenodd"
        />
      </svg>

      <div
        className="flex flex-row py-2 p-1 grow items-center border-t w-full border-zinc-700"
        id="border"
      >
        <div className="grid grid-col my-auto mr-2">
          <div className="style-title">{contactName}</div>
          <div className="style-description flex flex-row text-xs"></div>
        </div>

        <div className="ml-auto mr-1 text-right">
          <div className="style-description text-xs">
            {`+${countryCode} ${callee}`}
          </div>
        </div>

        <OtherCallButton countryCode={countryCode} calleeID={callee} />
      </div>
    </Link>
  );
};
export default ContactCard;
