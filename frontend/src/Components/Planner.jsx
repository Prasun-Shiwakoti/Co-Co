import React from "react";
import "../index.css";

const Planner = ({ weekData }) => {
  // Helper function to calculate box color based on duration
  const getBoxColor = (duration) => {
    if (duration > 2.5) return "bg-red-500"; // High priority (> 4 hrs)
    if (duration > 1.75) return "bg-orange-400"; // Medium priority (> 2.5 hrs)
    else return "bg-green-500"; // Low priority (<= 2.5 hrs)
  };

  // Helper function to calculate relative width of each subject box based on duration
  const getBoxWidth = (duration) => {
    const minWidth = 80; // Minimum width for small durations
    const scaleFactor = 40; // Scale factor to make boxes grow with duration
    return `${minWidth + duration * scaleFactor}px`;
  };

  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="p-5 flex space-x-6 relative">
        {weekData.map((dayData, dayIndex) => (
          <div
            key={dayIndex}
            className="flex flex-col space-y-4 items-center relative"
          >
            {/* Day Label */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Day {dayIndex + 1}</h4>
              <hr className="w-full border-2 border-blue-900 mb-2" />
            </div>

            {/* Vertical Line */}
            {dayIndex > 0 && (
              <div className="absolute -left-3 top-0 h-full border border-blue-900" />
            )}

            {/* Subject Boxes */}
            <div className="space-y-2 flex flex-col gap-2 items-start">
              {dayData.map((subject, subIndex) => (
                <div
                  key={subIndex}
                  className={`text-white px-2 py-2 rounded flex flex-col items-center justify-center ${getBoxColor(
                    subject.duration
                  )}`}
                  style={{
                    width: getBoxWidth(subject.duration),
                  }}
                >
                  <div>{subject.sub}</div>
                  <div>{`${subject.duration} hrs`}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
