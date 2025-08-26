"use client";
import { useState, useEffect } from "react";

export default function GoalsTracker() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsMounted(true);
    fetchGoals();
  }, []);

  const fetchGoals = () => {
    // Dummy data — connect to backend later
    const data = [
      { goal: "Complete Web Technologies Chapter 4", completed: false },
      { goal: "Submit Database Assignment", completed: true },
      { goal: "Revise Cybersecurity Labs", completed: false },
      { goal: "Finish all Programming Fundamentals exercises", completed: false },
      { goal: "Review Computer Networks lecture notes", completed: true },
      { goal: "Prepare for Web Technologies project presentation", completed: false },
      { goal: "Practice Python coding challenges for 2 hours", completed: false },
      { goal: "Read 2 articles on recent cybersecurity threats", completed: true },
      { goal: "Outline next steps for Data Structures final exam", completed: false },
      { goal: "Schedule a session with AI Mentor for Algorithms", completed: false },
      { goal: "Complete Mobile App Development UI design for prototype", completed: true },
      { goal: "Research Cloud Computing deployment strategies", completed: false },
    ];
    setGoals(data);
  };

  const toggleGoal = (index) => {
    const updated = [...goals];
    updated[index].completed = !updated[index].completed;
    setGoals(updated);
  };

  const addGoal = () => {
    if (!newGoal.trim()) return; // Prevent adding empty goals
    setGoals([...goals, { goal: newGoal, completed: false }]);
    setNewGoal("");
  };

  const totalCompleted = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals === 0 ? 0 : Math.round((totalCompleted / totalGoals) * 100);

  return (
    <>
      <style jsx>{`
        /* Importing new fonts */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;500;600&display=swap');

        /* Animation for individual goal cards */
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .goal-card-animated {
          animation: fadeInSlideUp 0.6s ease-out forwards;
        }

        /* Glass-effect for white background with slight transparency */
        .glass-effect {
          background-color: rgba(255, 255, 255, 0.8); /* Predominantly white, slight transparency */
          backdrop-filter: blur(8px) saturate(180%); /* Reduced blur slightly for white */
          -webkit-backdrop-filter: blur(8px) saturate(180%); /* Safari support */
          border: 1px solid rgba(0, 0, 0, 0.08); /* Subtle border for definition */
          box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.15); /* Lighter, but present shadow */
          transition: all 0.3s ease-in-out; /* Smooth transition for glass effect properties */
        }

        /* Hover effect for glass cards */
        .glass-effect:hover {
          background-color: rgba(255, 255, 255, 0.9); /* More opaque on hover */
          border-color: rgba(0, 0, 0, 0.15); /* Slightly darker border on hover */
          box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.25); /* More pronounced shadow on hover */
        }

        /* Updated Fonts */
        .main-font {
            font-family: 'Lato', sans-serif; /* Body text font */
        }
        .header-font {
            font-family: 'Montserrat', sans-serif; /* Headers font */
        }

        /* Basic fade-in for the main component heading */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-entry {
          animation: fadeIn 0.8s ease-out forwards;
        }

        /* New: Divider animation */
        @keyframes drawLine {
          from { width: 0%; }
          to { width: 100%; }
        }

        .animated-divider {
            animation: drawLine 1s ease-out forwards;
            animation-delay: 0.5s; /* Delay after heading appears */
        }

        /* Progress bar fill animation */
        @keyframes progressBarFill {
            from { width: 0%; }
            to { width: var(--progress-width, 0%); } /* Use CSS variable for target width */
        }
        .progress-bar-animated {
            animation: progressBarFill 1.5s ease-out forwards;
        }

        /* Button hover effect */
        .btn-hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.4); /* Cyan glow */
        }
      `}</style>
      <div className="main-font"> {/* Apply the main font */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 header-font animated-entry"> {/* Changed heading color */}
          My Goals
        </h1>
        {/* Animated Divider */}
        <div className="w-full h-[2px] bg-blue-600 rounded-full mb-8 animated-divider"></div> {/* Changed divider color */}

        {/* Overall Completion Section */}
        <div className={`glass-effect p-6 rounded-xl shadow-lg mb-8
            transform ${isMounted ? 'goal-card-animated' : 'opacity-0 scale-95'}`}
            style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Overall Completion</h2>
          <div className="w-full bg-gray-300 rounded-full h-6 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-600 h-6 rounded-full text-white font-bold text-center flex items-center justify-center progress-bar-animated"
              style={{ width: `${completionRate}%`, '--progress-width': `${completionRate}%` }}
            >
              {completionRate > 5 ? `${completionRate}%` : ''} {/* Only show percentage if bar is wide enough */}
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            You have completed <span className="font-semibold text-emerald-600">{totalCompleted}</span> out of <span className="font-semibold text-blue-700">{totalGoals}</span> goals.
          </p>
        </div>

        {/* Add New Goal Section */}
        <div className={`glass-effect p-6 rounded-xl shadow-lg mb-8
            transform ${isMounted ? 'goal-card-animated' : 'opacity-0 scale-95'}`}
            style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Goal</h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="flex-1 border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter new goal..."
            />
            <button
              onClick={addGoal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out btn-hover-effect focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Goal
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((g, idx) => (
            <div
              key={idx}
              className={`glass-effect p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center
                transform hover:scale-[1.01] transition-all duration-300
                ${isMounted ? 'goal-card-animated' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: `${0.3 + idx * 0.07}s` }} // Staggered animation for each goal
            >
              <span className={`flex-1 text-gray-800 text-lg ${g.completed ? 'line-through text-gray-500' : ''}`}>
                {g.goal}
              </span>
              <button
                onClick={() => toggleGoal(idx)}
                className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-200 ease-in-out btn-hover-effect ${g.completed ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {g.completed ? "Completed" : "Mark Done"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
