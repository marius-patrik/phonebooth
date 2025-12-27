import type react from 'react';
import Body from '../../components/body/body';
import DisplayLoadBar from '../../components/display/display-loading-bar';

const LoadingPage: react.FC = () => {
  return (
    <Body>
      <div className="">
        <DisplayLoadBar></DisplayLoadBar>
      </div>
    </Body>
  );
};
export default LoadingPage;
