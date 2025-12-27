/** biome-ignore-all assist/source/organizeImports: <idc> */
import { useLocation, useParams } from 'wouter';
import { useState, useEffect, useRef } from 'react';
import PostCallComp from '../../components/call/call-finished';
import CallActive from '../../components/call/call-active';
import RingComp from '../../components/call/call-ring';
import { fetcher } from '../../api/fetcher';
import type React from 'react';

type CallState = 'ringing' | 'connected' | 'hanging';

const CallPage: React.FC = () => {
  const { countryCode, calleeID } = useParams<{
    countryCode: string;
    calleeID: string;
  }>();
  const [_location, setLocation] = useLocation();
  const [callState, setCallState] = useState<CallState>('ringing');
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  const [callId, setCallId] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [cost, setCost] = useState(0);
  const [rate, setRate] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mute, setMute] = useState(false);

  const duration = `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60 < 10 ? '0' : ''}${durationInSeconds % 60}`;

  // Timer for connected calls
  useEffect(() => {
    if (callState !== 'connected') return;

    const timer = setInterval(() => {
      setTimer((v) => v + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [callState]);

  const toggleMute = () => {
    setMute((v) => !v);
  };

  // Initiate call on mount and poll for status
  useEffect(() => {
    const initiateAndPoll = async () => {
      if (!countryCode || !calleeID) {
        console.error('countryCode or calleeID is missing');
        setLocation('/dial');
        return;
      }
      let currentCallId: number | null = null;

      try {
        // 1. Initiate call to get a callId
        const ringResponse = await fetcher('/api/call/ring', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            countryCode: countryCode,
            calleeID: calleeID,
          }),
        });

        currentCallId = ringResponse.callId;
        setCallId(currentCallId);

        // 2. Poll for call status
        pollIntervalRef.current = setInterval(async () => {
          if (!currentCallId) return;
          try {
            const statusResponse = await fetcher(
              `/api/call/status/${currentCallId}`,
            );
            if (statusResponse.status === 'connected') {
              setCallState('connected');
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
              }
            } else if (
              ['hanging', 'failed', 'over'].includes(statusResponse.status)
            ) {
              // Call ended before connection
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
              }
              setLocation('/dial');
            }
          } catch (error) {
            console.error('Error polling call status:', error);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
            setLocation('/dial');
          }
        }, 2000); // Poll every 2 seconds
      } catch (error) {
        console.error('Failed to initiate call:', error);
        alert('Failed to initiate call. Please check your balance.');
        setLocation('/dial');
      }
    };

    initiateAndPoll();

    // Cleanup: cancel all pending timeouts/intervals
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [setLocation, countryCode, calleeID]);

  const handleLocalConnect = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setCallState('connected');
  };

  const endCall = async () => {
    // Clear pending timeouts
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    if (!callId) {
      console.error('No call ID available');
      setLocation('/'); // Go back to dial or home if no call ID
      return;
    }

    try {
      // First, hang up the call regardless of its current state (ringing or connected)
      // This transitions the call to a "hanging" state on the backend.
      await fetcher('/api/call/hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId }),
      });

      // Only after successfully hanging up, then try to complete the call.
      const response = await fetcher('/api/call/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId }),
      });

      setCallState('hanging'); // Update frontend state after successful backend operations
      setFinalStatus(response.status);
      setDurationInSeconds(response.durationSeconds);
      setCost(response.cost ?? 0);
      setRate(response.rate ?? 0);
      setDisplayCurrency(response.displayCurrency);
    } catch (error) {
      console.error('Error ending call:', error);
      alert('An error occurred while ending the call.');
      setLocation('/'); // Redirect in case of error
    }
  };

  if (callState === 'ringing') {
    return (
      <RingComp
        mute={mute}
        callee={calleeID}
        endCall={endCall}
        callId={callId}
        countryCode={countryCode}
        toggleMute={toggleMute}
        connectCall={handleLocalConnect}
        displayCurrency={displayCurrency}
      />
    );
  }

  if (callState === 'hanging') {
    return (
      <PostCallComp
        callee={calleeID}
        countryCode={countryCode}
        duration={duration}
        rate={rate}
        currency={displayCurrency}
        cost={cost}
        status={finalStatus}
      />
    );
  }

  return (
    <CallActive
      callee={calleeID}
      countryCode={countryCode}
      time={timer}
      endCall={endCall}
      mute={mute}
      toggleMute={toggleMute}
    />
  );
};

export default CallPage;
