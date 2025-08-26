"use client";
import { useState, useEffect } from "react";

export default function HealthCheck() {
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState("");
  const [procrastination, setProcrastination] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // For entry animations

  useEffect(() => {
    setIsMounted(true); // Trigger fade-in animation on mount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // You will save this data to your backend later
    console.log({
      mood, stress, procrastination, sleepHours
    });

    setSubmitted(true);
    // Optionally reset form after submission if needed
    // setMood("");
    // setStress("");
    // setProcrastination("");
    // setSleepHours("");
  };

  return (
    <>
      <style jsx>{`
        /* Importing new fonts */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;500;600&display=swap');

        /* Glass-effect for white background with slight transparency */
        .glass-effect {
          background-color: rgba(255, 255, 255, 0.8); /* Predominantly white, slight transparency */
          backdrop-filter: blur(8px) saturate(180%); /* Reduced blur slightly for white */
          -webkit-backdrop-filter: blur(8px) saturate(180%); /* Safari support */
          border: 1px solid rgba(0, 0, 0, 0.08); /* Subtle border for definition */
          box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.15); /* Lighter, but present shadow */
          transition: all 0.3s ease-in-out; /* Smooth transition for glass effect properties */
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

        /* Button hover effect (consistent with other components) */
        .btn-hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.4); /* Cyan glow */
        }

        /* Animation for form/submission message */
        @keyframes formFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .form-animated {
            animation: formFadeIn 0.7s ease-out forwards;
            animation-delay: 0.8s; /* Delay after header and divider */
        }
      `}</style>
      <div className="main-font"> {/* Apply the main font for overall consistency */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 header-font animated-entry">
          Health Check
        </h1>
        {/* Animated Divider */}
        <div className="w-full h-[2px] bg-blue-600 rounded-full mb-8 animated-divider"></div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className={`glass-effect p-8 rounded-xl shadow-lg space-y-6 form-animated`}>
            <div>
              <label htmlFor="mood-select" className="font-semibold text-gray-800 mb-2 block">Mood:</label>
              <select
                id="mood-select"
                className="block w-full border border-gray-300 p-3 rounded-lg mt-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                required
              >
                <option value="">Select your mood</option>
                <option value="happy">😄 Happy</option>
                <option value="neutral">😐 Neutral</option>
                <option value="stressed">😓 Stressed</option>
                <option value="sad">😔 Sad</option>
              </select>
            </div>

            <div>
              <label htmlFor="stress-input" className="font-semibold text-gray-800 mb-2 block">Stress Level (1-5):</label>
              <input
                id="stress-input"
                type="number"
                min="1"
                max="5"
                className="block w-full border border-gray-300 p-3 rounded-lg mt-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="procrastination-input" className="font-semibold text-gray-800 mb-2 block">Procrastination Level (1-5):</label>
              <input
                id="procrastination-input"
                type="number"
                min="1"
                max="5"
                className="block w-full border border-gray-300 p-3 rounded-lg mt-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={procrastination}
                onChange={(e) => setProcrastination(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="sleep-input" className="font-semibold text-gray-800 mb-2 block">Average Sleep Hours (per day):</label>
              <input
                id="sleep-input"
                type="number"
                min="0"
                max="24"
                className="block w-full border border-gray-300 p-3 rounded-lg mt-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out btn-hover-effect focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Submit Health Check
            </button>
          </form>
        ) : (
          <div className={`glass-effect p-8 rounded-xl shadow-lg text-center text-xl font-semibold bg-emerald-100 text-emerald-700 form-animated`}>
            Thank you! Your health check has been submitted.
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out btn-hover-effect focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit Another
            </button>
          </div>
        )}
      </div>
    </>
  );
}
