/** biome-ignore-all assist/source/organizeImports: <idc> */
import type React from 'react';
import Body from '../body/body';
import DisplayBox from '../display/display-box';
import LinkStyle from '../input/links/link-style';
import LinkMain from '../input/links/link-main';
import { formatCurrency } from '../../functions/formatter';
// ...existing code...

interface PostCallCompProps {
  callee: string;
  duration: string;
  rate: number;
  currency: string;
  cost: number;
  countryCode: string;
  status: string | null;
}

const PostCallComp: React.FC<PostCallCompProps> = ({
  callee,
  duration,
  rate,
  currency,
  cost,
  countryCode,
  status,
}) => {
  // Ensure rate and cost are numbers, defaulting to 0 if undefined/null
  const displayRate = typeof rate === 'number' ? rate : 0;
  const displayCost = typeof cost === 'number' ? cost : 0;
  const isFailed = status === 'failed';

  return (
    <Body pageTitle="Call Finished">
      <DisplayBox
        title={
          <div className="flex flex-row gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 "
              style={{ transform: 'rotate(135deg)' }}
            >
              <title>Dial</title>
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
            Call Finished
          </div>
        }
        buttons=<LinkMain
          onClick={() => location.reload()}
          buttonText="Call Again"
        />
      >
        <div className="flex flex-col">
          <div className="style-title">Callee:</div>
          {`+${countryCode} ${callee}`}
        </div>

        <div className="flex flex-col">
          <div className="style-title">Duration:</div>
          {isFailed ? 'No answer' : duration}
        </div>

        {!isFailed && (
          <>
            <div className="flex flex-col">
              <div className="style-title">Rate:</div>
              {formatCurrency(displayRate, currency)}/min
            </div>

            <div className="flex flex-col">
              <div className="style-title">Total:</div>
              {formatCurrency(displayCost, currency)}
            </div>
          </>
        )}
      </DisplayBox>
    </Body>
  );
};
export default PostCallComp;
