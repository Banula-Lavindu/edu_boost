"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import mlApiClient from "@/lib/mlApiClient";

export default function PersonalizedPlanner() {
  const { data: session, status } = useSession();
  const [planner, setPlanner] = useState({});
  const [isMounted, setIsMounted] = useState(false); // For entry animations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsMounted(true);
    if (session?.user?.id) {
      fetchPlanner();
    }
  }, [session]);

  const fetchPlanner = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await mlApiClient.getStudentPlanner(session.user.id);
      
      // Map ML backend response to frontend expected format
      const mappedData = {
        studyHoursPerWeek: data.study_plan?.recommended_hours || 20,
        onlineResources: data.online_resources?.map(resource => ({
          name: resource.resource_title,
          link: resource.resource_url
        })) || [],
        books: data.book_recommendations?.map(book => book.resource_title) || [],
        physicalPlan: data.study_plan?.physical_plan || "No physical plan available",
        emotionalPlan: data.study_plan?.emotional_plan || "No emotional plan available",
        // miniGoals removed as requested
      };
      
      setPlanner(mappedData);
    } catch (error) {
      console.error('Error fetching personalized planner:', error);
      setError('Failed to load personalized planner. Please try again later.');
      
      // Fallback to dummy data if ML backend is unavailable
      const fallbackData = {
        studyHoursPerWeek: 20,
        onlineResources: [
          { name: "W3Schools - Web Technologies", link: "https://www.w3schools.com" },
          { name: "SQLBolt - Database Practice", link: "https://sqlbolt.com" },
          { name: "MDN Web Docs - JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
          { name: "Codecademy - Python", link: "https://www.codecademy.com/learn/learn-python-3" },
        ],
        books: [
          "Introduction to Database Systems",
          "Computer Networking: A Top-Down Approach",
          "Clean Code: A Handbook of Agile Software Craftsmanship",
          "Algorithms Unlocked",
          "Cybersecurity Essentials",
        ],
        physicalPlan: "Walk 30 mins daily, minimum 7 hours sleep, drink 2.5L water daily, light stretching.",
        emotionalPlan: "Practice mindfulness meditation 10 mins daily, limit screen time 1 hour before sleep, schedule weekly mentor check-ins, journal thoughts twice a week.",
        // miniGoals removed as requested
      };
      setPlanner(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // toggleMiniGoal function removed as mini goals section was removed

  return (
    <>
      <style jsx>{`
        /* Importing new fonts */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;500;600&display=swap');

        /* Animation for individual planner sections/cards */
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .planner-section-animated {
          animation: fadeInSlideUp 0.6s ease-out forwards;
        }

        .mini-goal-animated {
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

        /* Button hover effect */
        .btn-hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.4); /* Cyan glow */
        }
      `}</style>
      <div className="main-font"> {/* Apply the main font for overall consistency */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800 header-font animated-entry">
           Personalized Planner
          </h1>
          <button
            onClick={fetchPlanner}
            disabled={loading}
            className="btn-hover-effect px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        {/* Animated Divider */}
        <div className="w-full h-[2px] bg-blue-600 rounded-full mb-8 animated-divider"></div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading your personalized planner...</p>
          </div>
        )}

        {/* Main Content - Only show when not loading */}
        {!loading && (
        <>
        {/* Data Source Indicator */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">📚 Showing fallback recommendations. ML backend temporarily unavailable.</p>
          </div>
        )}
        
        {!error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">🤖 Personalized recommendations powered by AI based on your learning progress.</p>
          </div>
        )}

        {/* Weekly Study Plan Section */}
        <div className={`glass-effect p-6 rounded-xl shadow-lg mb-6
            transform ${isMounted ? 'planner-section-animated' : 'opacity-0 scale-95'}`}
            style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Weekly Study Plan</h2>
          <p className="text-gray-700">Recommended Study Hours: <strong className="font-bold text-blue-700">{planner.studyHoursPerWeek} hours/week</strong></p>
        </div>

        {/* Book Recommendations & Online Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`glass-effect p-6 rounded-xl shadow-lg
              transform ${isMounted ? 'planner-section-animated' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Book Recommendations</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {planner.books?.map((book, idx) => (
                <li key={idx}>{book}</li>
              ))}
            </ul>
          </div>

          <div className={`glass-effect p-6 rounded-xl shadow-lg
              transform ${isMounted ? 'planner-section-animated' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Online Resources</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {planner.onlineResources?.map((res, idx) => (
                <li key={idx}>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200">{res.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Physical & Emotional Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`glass-effect p-6 rounded-xl shadow-lg
              transform ${isMounted ? 'planner-section-animated' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Physical Plan</h2>
            <p className="text-gray-700">{planner.physicalPlan}</p>
          </div>

          <div className={`glass-effect p-6 rounded-xl shadow-lg
              transform ${isMounted ? 'planner-section-animated' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Emotional Plan</h2>
            <p className="text-gray-700">{planner.emotionalPlan}</p>
          </div>
        </div>

        {/* Mini Goals Section removed as requested */}
        </>
        )}
      </div>
    </>
  );
}
