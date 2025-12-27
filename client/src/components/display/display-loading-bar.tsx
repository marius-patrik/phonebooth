import type react from 'react';

const DisplayLoadBar: react.FC = () => (
  <div className="w-full flex justify-center items-center py-4">
    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-2 bg-blue-500 animate-pulse rounded-full w-1/2" />
    </div>
  </div>
);

export default DisplayLoadBar;
