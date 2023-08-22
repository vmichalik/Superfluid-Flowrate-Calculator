import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

type TooltipProps = {
  tooltipMessage: string;
  children?: React.ReactNode;
};

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
      style={{ cursor: 'pointer', color: '#1DB227' }}
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

const Confetti = dynamic(() => import('react-confetti'), { ssr: false }); // Dynamically import the react-confetti component

const FlowRateConverter: React.FC = () => {
  const [flowRate, setFlowRate] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<string>('month');
  const [conversionRate, setConversionRate] = useState<string>('0');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confettiWidth, setConfettiWidth] = useState(0);
  const [confettiHeight, setConfettiHeight] = useState(0);
  const [expand, setExpand] = useState<boolean>(false);
  const tooltipMessage = 'Token values onchain are usually referenced in Wei, so multiplied by 10^18';
  
  const handleFlowRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowRate(Number(e.target.value));
  };

  const handleTimeUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeUnit(e.target.value);
  };

  const formatNumber = (number: string) => {
    return Number.parseFloat(number).toLocaleString('fullwide', { useGrouping: false });
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

    const convertedRate = formatNumber((flowRateInSeconds * Math.pow(10, 18)).toFixed(0));

    setConversionRate(convertedRate);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
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
      updateWindowDimensions();
      window.addEventListener('resize', updateWindowDimensions);
      return () => {
        window.removeEventListener('resize', updateWindowDimensions);
      };
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-start justify-start py-2">
      {typeof window !== 'undefined' && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={showConfetti ? 200 : 0}
        />
      )}      
      <header className="flex items-start justify-start px-10 py-4">
        <img src="https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/xhwcodrzvkpktyzwfjjw" alt="Logo" style={{ width: '30%' }} />
      </header>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold">Flow Rate Calculator</h1>
        <p className="mt-3 text-2xl">
          Input your flow rate in tokens to convert it to a per second rate in{' '}
          <Tooltip tooltipMessage={tooltipMessage}>
            <span style={{ color: 'green-500' }}>Wei</span>
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
          <button onClick={handleConvert} className="rounded-md bg-green-500 text-white p-2">
            Convert
          </button>
          <div className={`rounded-md bg-gray-200 p-2 flex items-center justify-between overflow-wrap break-word ${expand ? 'h-auto' : 'max-h-36 overflow-hidden'}`} onClick={() => setExpand(!expand)}>
            <p className={`${expand ? 'break-all' : 'break-normal'}`}>
              Tokens per Second: {' '}
<input
  type="text"
  value={conversionRate}
  readOnly
  style={{ border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.5rem' }}
/>            </p>
            <button onClick={handleCopy} className="bg-gray-400 text-white rounded-md p-2 ml-2">
              Copy
            </button>
          </div>
        </div>
      </main>
<footer className="flex w-full items-center justify-center">
  <ul className="flex space-x-4 justify-center">
    <li>
      <a
        href="https://docs.superfluid.finance"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 underline"
      >
        Docs
      </a>
    </li>
    <li>
      <a
        href="http://discord.superfluid.finance"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 underline"
      >
        Discord
      </a>
    </li>
  </ul>
</footer>
    </div>
  );
};

export default function Home() {
  return <FlowRateConverter />;
}
