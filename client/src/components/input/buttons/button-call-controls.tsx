import type { FC, MouseEventHandler } from 'react';

interface CallControlsProps {
  endCall: () => void;
  mute: boolean;
  toggleMute: () => void;
}

const CallControls: FC<CallControlsProps> = ({ endCall, mute, toggleMute }) => {
  // Reuse AudioContext for reliable beep
  const playBeep = (frequency: number) => {
    const audioContext = new window.AudioContext();
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
    }, 100);
  };

  const handleToggleMute: MouseEventHandler<HTMLButtonElement> = () => {
    playBeep(mute ? 880 : 440);
    toggleMute();
  };

  const baseClasses =
    'text-3xl font-medium place-content-center text-center w-16 h-16 transition-transform';

  const hangButton = (
    <button
      className={`${baseClasses} border bg-red-600/80 border-red-300/30 shadow-lg backdrop-blur-xs rounded-full hover:scale-101 active:scale-101 dark:bg-red-600/80 dark:border-red-300/30 transition-transform p-2`}
      type="button"
      onClick={endCall}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-8 m-auto"
        style={{ transform: 'rotate(135deg)' }}
      >
        <title>Phone icon</title>
        <path
          fillRule="evenodd"
          d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const muteButton = (
    <button
      className={`${baseClasses} style-glass`}
      type="button"
      onClick={handleToggleMute}
    >
      {mute ? (
        <div className="relative w-8 h-8 m-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute size-8"
          >
            <title>Unmute icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="6 5 18 18"
            strokeWidth={1}
            stroke="currentColor"
            className="absolute size-12 mb-2 rotate-25"
          >
            <title>Slash</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 20.247 6-16.5"
            />
          </svg>
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="size-8 m-auto"
        >
          <title>Mute icon</title>
          <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
          <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="flex flex-row items-center justify-center gap-2 fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 mr-10">
      {muteButton}
      {hangButton}
    </div>
  );
};

export default CallControls;
