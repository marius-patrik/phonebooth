import React, { useCallback } from "react";
import { Button } from "liqid";

interface DialButtonProps {
  digit: string;
  onClick: (digit: string) => void;
}

const DialButton: React.FC<DialButtonProps> = ({ digit, onClick }) => {
  const onDialButtonClick = useCallback(() => {
    const playDTMFTone = (digit: string) => {
      const audioContext = new window.AudioContext();
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Lower volume
      gainNode.connect(audioContext.destination);

      const frequencies: { [key: string]: [number, number] } = {
        "1": [697, 1209],
        "2": [697, 1336],
        "3": [697, 1477],
        "4": [770, 1209],
        "5": [770, 1336],
        "6": [770, 1477],
        "7": [852, 1209],
        "8": [852, 1336],
        "9": [852, 1477],
        "0": [941, 1336],
      };

      const freqs = frequencies[digit];
      if (!freqs) {
        return;
      }

      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();

      oscillator1.type = "sine";
      oscillator2.type = "sine";

      oscillator1.frequency.setValueAtTime(freqs[0], audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(freqs[1], audioContext.currentTime);

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);

      oscillator1.start();
      oscillator2.start();

      // Stop the tone after a short duration
      setTimeout(() => {
        oscillator1.stop();
        oscillator2.stop();
        audioContext.close();
      }, 200); // 100ms duration
    };

    playDTMFTone(digit);
    onClick(digit);
  }, [digit, onClick]);

  return (
    <Button
      variant="glass"
      className="text-3xl font-medium flex items-center justify-center w-16 h-16"
      onClick={onDialButtonClick}
      type="button">
      {digit}
    </Button>
  );
};

export default DialButton;
