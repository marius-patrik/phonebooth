/** biome-ignore-all assist/source/organizeImports: <> */
import React from 'react';
import useSWR from 'swr';
import Body from '../body/body';
import CallControlButton from '../input/buttons/button-call-controls';
import RateSelector from '../input/rate-selector';
import { fetcher } from '../../api/fetcher';
import type { RateItem } from '../../api/types';

interface RingCompProps {
  callee: string;
  endCall: () => void;
  toggleMute: () => void;
  callId: number | null;
  countryCode: string;
  mute: boolean;
  connectCall: () => void;
  displayCurrency?: string;
}

const RingComp: React.FC<RingCompProps> = ({
  callee,
  endCall,
  callId,
  countryCode,
  toggleMute,
  mute,
  connectCall,
  displayCurrency,
}) => {
  const { data: rates } = useSWR<RateItem[]>('/api/rates', fetcher);

  React.useEffect(() => {
    const audioContext = new window.AudioContext();
    let oscillator1: OscillatorNode | null = null;
    let oscillator2: OscillatorNode | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const playRingTone = () => {
      if (oscillator1 || oscillator2) {
        return;
      }
      oscillator1 = audioContext.createOscillator();
      oscillator2 = audioContext.createOscillator();
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      oscillator1.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(480, audioContext.currentTime);
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.connect(audioContext.destination);
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator1.start();
      oscillator2.start();
    };

    const stopRingTone = () => {
      if (oscillator1) {
        oscillator1.stop();
        oscillator1.disconnect();
        oscillator1 = null;
      }
      if (oscillator2) {
        oscillator2.stop();
        oscillator2.disconnect();
        oscillator2 = null;
      }
    };

    const ring = () => {
      playRingTone();
      setTimeout(stopRingTone, 2000); // Ring for 2 seconds
    };

    ring(); // Initial ring
    intervalId = setInterval(ring, 6000); // Ring every 6 seconds (2 on, 4 off)

    return () => {
      stopRingTone();
      if (intervalId) {
        clearInterval(intervalId);
      }
      audioContext.close();
    };
  }, []);

  const handleConnect = async () => {
    if (!callId) {
      console.error('No call ID available to connect');
      return;
    }
    try {
      await fetcher('/api/call/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId }),
      });
      connectCall();
    } catch (error) {
      console.error('Failed to connect call:', error);
    }
  };

  return (
    <Body header={<div></div>} footer={<div></div>}>
      <div className="style-title-center mt-24">
        {`+${countryCode} ${callee}`}
      </div>

      <div className="style-description style-title-center">Ringing</div>

      {/* Temporary button for simulating an answer */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={handleConnect}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Simulate Answer
        </button>
      </div>

      <div className="flex flex-row gap-2 p-2 bottom-0">
        <CallControlButton
          endCall={endCall}
          toggleMute={toggleMute}
          mute={mute}
        />
      </div>
    </Body>
  );
};
export default RingComp;
