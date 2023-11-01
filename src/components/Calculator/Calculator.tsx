/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { evaluate } from 'mathjs';

const BUTTON_LIST = [
  ['C', '%', '/', '←'],
  [7, 8, 9, '*'],
  [4, 5, 6, '-'],
  [1, 2, 3, '+'],
  [0, '.', '=', 'OK'],
];

interface CalculatorProps {
  price: number | string;
  onConfirm: (number: number) => void;
}

function Calculator(props: CalculatorProps) {
  const { price, onConfirm } = props;
  const [current, setCurrent] = useState(price.toString());

  useEffect(() => {
    setCurrent(price.toString());
  }, [price]);

  const handleButtonClick = (type: string) => {
    const lastLetter = current.slice(-1);

    switch (type) {
      case 'C':
        setCurrent('0');
        break;
      case '%':
        try {
          setCurrent(evaluate(`${current}/100`).toString());
        } catch (e) {
          setCurrent('NaN');
        }
        break;
      case '←':
        setCurrent(current === '0' ? current : current.slice(0, -1) || '0');
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        if (Number(current) === 0 && type === '-') {
          setCurrent(type);
          break;
        }
        if (
          (lastLetter === '*' && type === '-') ||
          (lastLetter === '/' && type === '-')
        ) {
          setCurrent(current + type);
          break;
        }
        setCurrent(
          ['+', '-', '*', '/'].includes(lastLetter)
            ? current.slice(0, -1) + type
            : current + type
        );
        break;
      case '.':
        if (lastLetter !== '.') {
          setCurrent(current + type);
        }
        break;
      case '=':
        try {
          setCurrent(evaluate(current).toString());
        } catch (e) {
          setCurrent('NaN');
        }
        break;
      case 'OK':
        onConfirm(evaluate(current));
        break;
      default:
        setCurrent(current === '0' ? type : current + type);
        break;
    }
  };

  return (
    <div className="w-80 h-full p-4 rounded bg-secondary">
      <div className="w-full h-20 flex justify-center items-center mb-4 px-4 font-bold text-2xl text-white bg-primary rounded">
        {current}
      </div>
      <div className="w-full h-full grid grid-cols-4 grid-rows-5 gap-4">
        {BUTTON_LIST.flat().map((btn) => (
          <div
            key={btn}
            className={`p-4 text-center text-white bg-primaryDarker rounded ${
              btn === 'OK' && 'bg-highlight'
            }`}
            aria-hidden
            onClick={() => handleButtonClick(btn.toString())}
          >
            {btn}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
export type { CalculatorProps };
