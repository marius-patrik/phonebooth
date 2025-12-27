import type react from 'react';

interface DialInputProps {
  value: string;
}

const DialInput: react.FC<DialInputProps> = ({ value }) => {
  return <div className=" text-3xl text-center h-10">{value}</div>;
};

export default DialInput;
