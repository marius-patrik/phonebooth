/** biome-ignore-all assist/source/organizeImports: <idc> */
import react from 'react';
import Body from '../../components/body/body';
import InputField from '../../components/input/input-field';
import { fetcher } from '../../api/fetcher';
import DisplayBox from '../../components/display/display-box';
import { useLocation } from 'wouter';
import LinkStyle from '../../components/input/links/link-style';
import LinkMain from '../../components/input/links/link-main';

const AuthPage: react.FC = () => {
  const [email, setEmail] = react.useState('');
  const [code, setCode] = react.useState('');
  const [step, setStep] = react.useState<'email' | 'code'>('email');
  const [loading, setLoading] = react.useState(false);
  const [error, setError] = react.useState<string | null>(null);
  const [_location, setLocation] = useLocation();

  const handleSendEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetcher('/api/user/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStep('code');
    } catch {
      setError('Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetcher('/api/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      setLocation('/account');
    } catch {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Body>
      {step === 'email' ? (
        <DisplayBox
          title={<>Log In or Sign Up</>}
          buttons={
            <LinkStyle
              buttonText={loading ? 'Sending...' : 'Send Code'}
              onClick={handleSendEmail}
              disabled={loading || !email}
            />
          }
        >
          <InputField
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Email address"
            type="email"
            disabled={loading}
          />
          Enter your email address to receive a verification code.
        </DisplayBox>
      ) : (
        <DisplayBox
          title={<>Enter Verification Code</>}
          buttons={
            <LinkMain
              buttonText={loading ? 'Verifying...' : 'Verify Code'}
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
            />
          }
        >
          <InputField
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value)
            }
            placeholder="6-digit code"
            type="text"
            disabled={loading}
          />
          Please enter the code sent to your email address to verify your
          identity.
          {error && <div className="text-red-400">{error}</div>}
        </DisplayBox>
      )}
    </Body>
  );
};

export default AuthPage;
