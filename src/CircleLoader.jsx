import { useState, useRef } from "react";

const size = 200;
const radius = 90;

function toAngle360(angle) {
  if (angle > 0) {
    return angle;
  } else {
    return 2 * Math.PI + angle;
  }
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

// function toRadians(angle) {
//   return angle * (Math.PI / 180);
// }

export const CircleLoader = () => {
  const svg = useRef();
  const degree = useRef();
  const step = useRef();
  const [knobPosition, setKnobPosition] = useState({ x: 190, y: 100 });

  const handleMouseMove = (event) => {
    const { clientY, clientX } = event;
    event.preventDefault();
    const { x, y, width, height } = svg.current.getBoundingClientRect();
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const angle = Number(
      Math.atan2(clientY - centerY, clientX - centerX).toFixed(2)
    );

    const xPoint = Math.cos(angle) * radius + width / 2;
    const yPoint = Math.sin(angle) * radius + height / 2;

    const currentDegree = toDegrees(toAngle360(angle));

    if (step.current === 4 && currentDegree < 180) {
      return;
    }

    if (step.current === 1 && currentDegree > 180) {
      return;
    }

    if (currentDegree <= 90 && currentDegree >= 0) {
      step.current = 1;
    } else if (currentDegree <= 180 && currentDegree > 90) {
      step.current = 2;
    } else if (currentDegree <= 270 && currentDegree > 180) {
      step.current = 3;
    } else if (currentDegree <= 360 && currentDegree > 270) {
      step.current = 4;
    }

    setKnobPosition({ x: xPoint, y: yPoint });
    degree.current = currentDegree;
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="circleLoader">
      <svg
        ref={svg}
        style={{ backgroundColor: "lightblue" }}
        width={`${size}px`}
        height={`${size}px`}
        viewBox={`0 0 ${size} ${size}`}
        onMouseDown={handleMouseDown}
        xmlns="<http://www.w3.org/2000/svg>"
      >
        <g>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="2"
            stroke="tomato"
            fill="none"
          />
          <circle
            style={{
              cursor: "pointer",
            }}
            cx={knobPosition.x}
            cy={knobPosition.y}
            r="8"
            stroke="black"
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
};
