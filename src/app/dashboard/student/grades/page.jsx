"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function MyGrades() {
  const { data: session } = useSession();
  const [grades, setGrades] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsMounted(true);
    if (session?.user?.role === 'student') {
      fetchGrades();
    }
  }, [session]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      
      // Fetch student progress which contains grades
       const progressResponse = await fetch('/api/student-progress', {
         credentials: 'include'
       });
       
       if (!progressResponse.ok) {
         throw new Error('Failed to fetch grades');
       }
       
       const progressData = await progressResponse.json();
       
       // Also fetch enrollments to get module names
       const enrollmentsResponse = await fetch('/api/student/enrollments', {
         credentials: 'include'
       });
      
      let moduleMap = {};
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        enrollmentsData.enrollments.forEach(course => {
          course.modules.forEach(module => {
            moduleMap[module.id] = module.title || module.name;
          });
        });
      }
      
      // Transform progress data to grades format
      const transformedGrades = progressData.progress?.map(progress => ({
        moduleName: moduleMap[progress.moduleId] || 'Unknown Module',
        grade: progress.score || 0
      })) || [];
      
      setGrades(transformedGrades);
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError(err.message);
      // Fallback to empty array
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (grade) => {
    if (grade >= 80) return { label: "Excellent", color: "bg-emerald-500", textColor: "text-emerald-600" };
    if (grade >= 65) return { label: "Good", color: "bg-blue-500", textColor: "text-blue-600" };
    if (grade >= 50) return { label: "At Risk", color: "bg-amber-400", textColor: "text-amber-600" };
    return { label: "Fail", color: "bg-red-500", textColor: "text-red-600" };
  };

  // Calculate summary statistics
  const totalModules = grades.length;
  const passedModules = grades.filter(g => g.grade >= 50).length;
  const averageGrade = totalModules === 0 ? 0 : (grades.reduce((sum, g) => sum + g.grade, 0) / totalModules).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 text-lg">Loading grades...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <button 
            onClick={fetchGrades}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* Importing new fonts */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;500;600&display=swap');

        /* Animation for individual grade cards */
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .grade-card-animated {
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

        /* Progress bar fill animation for grades */
        @keyframes gradeProgressBarFill {
            from { width: 0%; }
            to { width: var(--grade-width, 0%); } /* Use CSS variable for target width */
        }
        .grade-progress-bar-animated {
            animation: gradeProgressBarFill 1.5s ease-out forwards;
        }

      `}</style>
      <div className="main-font"> {/* Apply the main font */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 header-font animated-entry"> {/* Changed heading color */}
          My Grades
        </h1>
        {/* Animated Divider */}
        <div className="w-full h-[2px] bg-blue-600 rounded-full mb-8 animated-divider"></div> {/* Changed divider color */}

        {/* New: Summary Section for Grades */}
        <div className={`glass-effect p-6 rounded-xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-6
            transform ${isMounted ? 'grade-card-animated' : 'opacity-0 scale-95'}`}
            style={{ animationDelay: '0.1s' }}>
          <div className="text-center">
            <p className="text-gray-600 text-lg">Total Modules</p>
            <p className="text-blue-700 text-5xl font-extrabold header-font mt-2">{totalModules}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-lg">Passed Modules</p>
            <p className="text-emerald-600 text-5xl font-extrabold header-font mt-2">{passedModules}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-lg">Average Grade</p>
            <p className="text-blue-700 text-5xl font-extrabold header-font mt-2">{averageGrade}%</p>
          </div>
        </div>

        <div className="space-y-6">
          {grades.map((g, idx) => {
            const status = getStatus(g.grade);
            return (
              <div
                key={idx}
                className={`glass-effect p-6 rounded-xl shadow-lg space-y-3
                  transform hover:scale-[1.01] transition-all duration-300
                  ${isMounted ? 'grade-card-animated' : 'opacity-0 scale-95'}`}
                style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
              >
                <h2 className="text-xl font-semibold text-gray-800">{g.moduleName}</h2> {/* Text color change */}

                <div className="relative w-full bg-gray-300 h-6 rounded-full"> {/* Background for progress bar track */}
                  <div
                    className={`${status.color} h-6 rounded-full grade-progress-bar-animated flex items-center justify-center`}
                    style={{ width: `${g.grade}%`, '--grade-width': `${g.grade}%` }}
                  >
                    <span className="font-bold text-white">{g.grade}%</span> {/* Ensure grade text is visible */}
                  </div>
                </div>

                <div className="text-sm font-semibold text-gray-700"> {/* Text color change */}
                  Status: <span className={status.textColor}>{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
