import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

type TooltipProps = {
  tooltipMessage: string;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltipMessage, children }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer', color: 'blue' }}
    >
      {children}
      {showTooltip && (
        <span
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            top: '20px',
            left: '5px',
            zIndex: 9999,
          }}
        >
          {tooltipMessage}
        </span>
      )}
    </span>
  );
};

const FlowRateConverter: React.FC = () => {
  const [flowRate, setFlowRate] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<string>('month'); // Change default time unit to 'month'
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // Add showConfetti state
  const [confettiWidth, setConfettiWidth] = useState(0);
  const [confettiHeight, setConfettiHeight] = useState(0);
  const tooltipMessage = 'Tokens onchain are actually 10^-18';

  const handleFlowRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowRate(Number(e.target.value));
  };

  const handleTimeUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeUnit(e.target.value);
  };

  const handleConvert = () => {
    let flowRateInSeconds = 0;
    switch (timeUnit) {
      case 'second':
        flowRateInSeconds = flowRate;
        break;
      case 'minute':
        flowRateInSeconds = flowRate / 60;
        break;
      case 'hour':
        flowRateInSeconds = flowRate / 3600;
        break;
      case 'day':
        flowRateInSeconds = flowRate / 86400;
        break;
      case 'month':
        flowRateInSeconds = flowRate / (86400 * (365 / 12));
        break;
      case 'year':
        flowRateInSeconds = flowRate / (86400 * 365);
        break;
      default:
        flowRateInSeconds = 0;
        break;
    }
    const convertedRate = (flowRateInSeconds * Math.pow(10, 18)).toFixed();
    setConversionRate(Number(convertedRate));
    setShowConfetti(true); // Show confetti after conversion
    setTimeout(() => setShowConfetti(false), 1000); // Stop confetti after 1 second

  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(conversionRate.toString());
  };

  useEffect(() => {
    const updateWindowDimensions = () => {
      if (typeof window !== 'undefined') {
        setConfettiWidth(window.innerWidth);
        setConfettiHeight(window.innerHeight);
      }
    };
    if (typeof window !== 'undefined') {
      updateWindowDimensions(); // Get initial window dimensions
      window.addEventListener('resize', updateWindowDimensions); // Update dimensions on window resize

      return () => {
        window.removeEventListener('resize', updateWindowDimensions); // Clean up event listener on component unmount
      };
    }
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {typeof window !== 'undefined' && (
        <Confetti // Add Confetti component
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={showConfetti ? 200 : 0} // Show confetti only when showConfetti is true
        />
      )}
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold">Flow Rate Calculator</h1>
        <p className="mt-3 text-2xl">
          Input your flow rate in tokens to convert it to a per second rate in{' '}
          <Tooltip tooltipMessage={tooltipMessage}>
            <span style={{ color: 'blue' }}>Wei</span>
          </Tooltip>
        </p>
        <br></br>
        <div className="flex flex-col space-y-2">
          <label className="rounded-md bg-gray-200 p-2">
            Flow Rate: {' '}
            <input
              type="number"
              value={flowRate}
              onChange={handleFlowRateChange}
              className="rounded-md border-gray-300 border p-2"
            />
            <span className="ml-2">Time Unit:</span> {' '}
            <select
              value={timeUnit}
              onChange={handleTimeUnitChange}
              className="rounded-md border-gray-300 border p-2"
            >
              <option value="second">Second</option>
              <option value="minute">Minute</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
          <button onClick={handleConvert} className="rounded-md bg-blue-500 text-white p-2">
            Convert
          </button>
          <div className="rounded-md bg-gray-200 p-2 flex items-center justify-between">
            <p>
              Tokens per Second: {conversionRate}{' '}
              <Tooltip tooltipMessage={tooltipMessage}>
                <span style={{ color: 'blue' }}>Wei</span>
              </Tooltip>
            </p>
            <button onClick={handleCopy} className="bg-blue-500 text-white rounded-md p-2 ml-2">
              Copy
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Export the corrected component as the default export
export default function Home() {
  return <FlowRateConverter />;
}
