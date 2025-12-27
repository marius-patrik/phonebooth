/** biome-ignore-all assist/source/organizeImports: <> */
import Body from '../body/body';
import CallControls from '../input/buttons/button-call-controls';

interface CallCompProps {
  callee: string;
  countryCode: string;
  time: number;
  endCall: () => void;
  toggleMute: () => void;
  mute: boolean;
}
const CallActive: React.FC<CallCompProps> = ({
  callee,
  countryCode,
  time,
  endCall,
  toggleMute,
  mute,
}) => {
  return (
    <Body header={<div></div>} footer={<div></div>}>
      <div className="style-title-center mt-24">{`+${countryCode} ${callee}`}</div>

      <div className="style-description style-title-center">
        {Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}
        {time % 60}
      </div>

      <CallControls endCall={endCall} mute={mute} toggleMute={toggleMute} />
    </Body>
  );
};

export default CallActive;
