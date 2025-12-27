import type react from 'react';
import Body from '../../components/body/body';

const ErrorPage: react.FC<{ error: Error }> = ({ error }: { error: Error }) => {
  return (
    <Body>
      <div className="text-red-500">
        <div>Error occurred:</div>
        <div>{error?.message || JSON.stringify(error)}</div>
      </div>
    </Body>
  );
};
export default ErrorPage;
