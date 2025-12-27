import react from 'react';
import { formatCurrency } from '../../functions/formatter';
import OtherCallButton from '../input/links/link-call-again';

export interface HistoryCardProps {
  calleeID: string;
  countryCode: string;
  contactName?: string;
  startTime: Date;
  endTime: Date | null;
  price: number | null | undefined;
  timestamp: Date;
  displayCurrency: string;
  status: 'ringing' | 'connected' | 'hanging' | 'over' | 'failed';
  rate: string | number;
}

const HistoryCard: react.FC<react.PropsWithChildren<HistoryCardProps>> = ({
  startTime,
  endTime,
  calleeID = 'Unknown Caller',
  countryCode,
  contactName,
  price = 0,
  timestamp = new Date(),
  displayCurrency = '$',
  status = 'failed',
  rate = 0,
}) => {
  // Real-time duration counter for active calls
  const [currentTime, setCurrentTime] = react.useState(Date.now());

  react.useEffect(() => {
    // Only update timer for active calls (ringing or connected)
    if (status === 'ringing' || status === 'connected') {
      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Calculate duration based on current time for active calls, or endTime for completed calls
  const durationInSeconds = endTime
    ? Math.floor(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000,
      )
    : Math.floor((currentTime - new Date(startTime).getTime()) / 1000);

  const duration = `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60 < 10 ? '0' : ''}${(durationInSeconds ?? 0) % 60}`;
  // ...existing code...
  return (
    <div
      id="history-card"
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
        className="flex flex-row grow items-center border-t p-1 w-full border-zinc-700"
        id="border"
      >
        <div className="grid grid-col my-auto mr-2">
          <div className="style-title">
            {contactName ? (
              <div className="flex flex-row gap-1">
                {contactName}{' '}
                <div className="style-description my-auto">
                  {`+${countryCode} ${calleeID}`}
                </div>
              </div>
            ) : (
              `+${countryCode} ${calleeID}`
            )}
          </div>
          <div className="style-description flex flex-row text-xs">
            {status === 'failed' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3 my-auto mr-1"
              >
                <title>Failed call icon</title>
                <path
                  fillRule="evenodd"
                  d="M15.22 3.22a.75.75 0 0 1 1.06 0L18 4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L19.06 6l1.72 1.72a.75.75 0 0 1-1.06 1.06L18 7.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L16.94 6l-1.72-1.72a.75.75 0 0 1 0-1.06ZM1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3 my-auto mr-1"
              >
                <title>Call icon</title>
                <path
                  fillRule="evenodd"
                  d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-4.72 4.72a.75.75 0 1 1-1.06-1.06l4.72-4.72h-2.69a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {duration}, {formatCurrency(price ?? 0, displayCurrency)},{' '}
            {formatCurrency(Number(rate), displayCurrency)}/min
          </div>
        </div>

        <div className="ml-auto mr-1 text-right">
          <div className="style-description text-xs">
            {(() => {
              const now = new Date();
              const isToday = timestamp.toDateString() === now.toDateString();
              if (isToday) {
                return timestamp.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
              }
              const day = String(timestamp.getDate()).padStart(2, '0');
              const month = String(timestamp.getMonth() + 1).padStart(2, '0');
              const year = timestamp.getFullYear();
              return `${day}.${month}.${year}`;
            })()}
          </div>
        </div>

        <OtherCallButton
          countryCode={countryCode}
          calleeID={calleeID}
        ></OtherCallButton>
      </div>
    </div>
  );
};
export default HistoryCard;
