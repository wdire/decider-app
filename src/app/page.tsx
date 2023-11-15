"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [animActive, setAnimActive] = useState(true);

  useEffect(() => {
    if (animActive) {
      setTimeout(() => {
        setAnimActive(false);
      }, 10000);
    }
  }, [animActive]);

  const handleTitleMouseEnter = () => {
    if (animActive === false) {
      setAnimActive(true);
    }
  };

  return (
    <div className="flex items-center h-full">
      <div className="max-w-full lg:max-w-4xl mx-auto p-3.5 sm:p-8 text-center">
        <h1
          className={clsx(
            "inline-block text-4xl font-extrabold mb-4 transition-colors animated-title",
            {
              "active text-zinc-200/50": animActive,
              "text-[#404040]": !animActive,
            }
          )}
          onMouseEnter={() => handleTitleMouseEnter()}
        >
          <span>D</span>
          <span>e</span>
          <span>c</span>
          <span>i</span>
          <span>d</span>
          <span>e</span>
          <span>r</span>
          <span>&nbsp;</span>
          <span>A</span>
          <span>p</span>
          <span>p</span>
          <span>?</span>
        </h1>

        <p className="text-gray-800 mb-6 sm:max-w-[385px] max-w-full mx-auto">
          that specializes in the art of random selection
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-200 p-4 rounded-md text-center">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">
              Movie Night Dilemmas?
            </h3>
            <p className="text-gray-700">
              Import your IMDb watchlist and let the app do the heavy lifting.
              Movie night is saved! 🍿✨
            </p>
          </div>

          <div className="bg-purple-200 p-4 rounded-md text-center flex items-center justify-center">
            <h3 className="text-xl font-semibold text-purple-600 ">
              I will <i>decide</i> what to add next..
            </h3>
          </div>
        </div>
        <style jsx>
          {`
            @keyframes rainbowAnimation {
              0% {
                color: #923a3a;
              }
              6.25% {
                color: #d44f4f;
              }
              12.5% {
                color: #ff6347;
              }
              18.75% {
                color: #ffa07a;
                transform: skew(-5deg);
              }
              25% {
                color: #ffd700;
              }
              31.25% {
                color: #d2d200;
                transform: skew(5deg);
              }
              37.5% {
                color: #7fff00;
              }
              43.75% {
                color: #32cd32;
                transform: skew(-5deg);
              }
              50% {
                color: #008000;
              }
              56.25% {
                color: #4169e1;
                transform: skew(5deg);
              }
              62.5% {
                color: #483d8b;
              }
              68.75% {
                color: #800080;
              }
              75% {
                color: #ff69b4;
              }
              81.25% {
                color: #db7093;
              }
              87.5% {
                color: #00ced1;
              }
              93.75% {
                color: #20b2aa;
              }
              97.5% {
                color: #ff0066;
              }
              100% {
                color: #404040;
              }
            }

            .animated-title.active span {
              display: inline-block;
              animation: rainbowAnimation 6s forwards steps(1);
            }

            .animated-title span:nth-child(1) {
              animation-delay: 0.3s;
            }
            .animated-title span:nth-child(2) {
              animation-delay: 0.6s;
            }
            .animated-title span:nth-child(3) {
              animation-delay: 0.9s;
            }
            .animated-title span:nth-child(4) {
              animation-delay: 1.2s;
            }
            .animated-title span:nth-child(5) {
              animation-delay: 1.5s;
            }
            .animated-title span:nth-child(6) {
              animation-delay: 1.8s;
            }
            .animated-title span:nth-child(7) {
              animation-delay: 2.1s;
            }
            .animated-title span:nth-child(8) {
              animation-delay: 2.4s;
            }
            .animated-title span:nth-child(9) {
              animation-delay: 2.7s;
            }
            .animated-title span:nth-child(10) {
              animation-delay: 3s;
            }
            .animated-title span:nth-child(11) {
              animation-delay: 3.3s;
            }
            .animated-title span:nth-child(12) {
              animation-delay: 3.6s;
            }
          `}
        </style>
      </div>
    </div>
  );
}
