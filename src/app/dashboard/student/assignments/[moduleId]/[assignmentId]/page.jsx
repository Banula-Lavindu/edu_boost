'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { assignmentTemplateAPI, moduleAPI, progressAPI } from '@/lib/apiClient';

export default function AssignmentDetail() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const { moduleId, assignmentId } = params;

  const [assignment, setAssignment] = useState(null);
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState('');
  const [fileUpload, setFileUpload] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchAssignmentData();
    }
  }, [status, session, moduleId, assignmentId]);

  const fetchAssignmentData = async () => {
    try {
      setLoading(true);
      
      // Fetch assignment details
      const assignmentResponse = await assignmentTemplateAPI.getById(moduleId, assignmentId);
      setAssignment(assignmentResponse.assignmentTemplate);

      // Fetch module details
      const moduleResponse = await moduleAPI.getById(moduleId);
      setModule(moduleResponse.module);

      // Fetch student progress for this assignment
      const progressResponse = await progressAPI.get({ moduleId });
      const assignmentProgress = progressResponse.progress?.find(p => p.assignmentId === assignmentId);
      setProgress(assignmentProgress);

    } catch (error) {
      console.error('Error fetching assignment data:', error);
      setError('Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async () => {
    if (!submission.trim() && !fileUpload) {
      alert('Please provide a submission or upload a file');
      return;
    }

    try {
      setSubmitting(true);
      
      const progressData = {
        studentId: session.user.id,
        moduleId,
        assignmentId,
        score: 0, // Will be graded later by educator
        submissionData: {
          submission: submission.trim(),
          fileUrl: fileUpload ? await uploadFile(fileUpload) : null,
          submittedAt: new Date(),
          status: 'submitted'
        }
      };

      await progressAPI.record(progressData);
      
      // Refresh the assignment data to show updated progress
      await fetchAssignmentData();
      
      alert('Assignment submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFile = async (file) => {
    // This would typically upload to Firebase Storage or another service
    // For now, we'll return a placeholder URL
    return `uploads/${Date.now()}_${file.name}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to view this assignment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => router.push('/dashboard/student/assessments')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Assignment Not Found</h1>
          <p className="mb-4">The requested assignment could not be found.</p>
          <button 
            onClick={() => router.push('/dashboard/student/assessments')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const isSubmitted = progress && progress.status === 'submitted';
  const isOverdue = new Date() > new Date(assignment.dueDate);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/dashboard/student/assessments')}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Assessments
          </button>
          
          <div className="glass-effect p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{assignment.title}</h1>
                <p className="text-gray-300">{module?.title || 'Loading module...'}</p>
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  isSubmitted ? 'bg-green-500 text-white' : 
                  isOverdue ? 'bg-red-500 text-white' : 
                  'bg-orange-500 text-white'
                }`}>
                  {isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Active'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Due Date:</span>
                <p className="text-white font-semibold">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Max Score:</span>
                <p className="text-white font-semibold">{assignment.maxScore || 100} points</p>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <p className="text-white font-semibold capitalize">{assignment.type || 'Assignment'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Description */}
        <div className="glass-effect p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Assignment Description</h2>
          <div className="text-gray-300 whitespace-pre-wrap">
            {assignment.description || assignment.instructions || 'No description provided.'}
          </div>
        </div>

        {/* Submission Section */}
        {!isSubmitted && !isOverdue && (
          <div className="glass-effect p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Submit Assignment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Written Submission</label>
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Enter your assignment submission here..."
                  className="w-full h-40 p-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">File Upload (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {fileUpload && (
                  <p className="text-green-400 mt-2">Selected: {fileUpload.name}</p>
                )}
              </div>
              
              <button
                onClick={handleSubmission}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        )}

        {/* Submission Results */}
        {isSubmitted && progress && (
          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-4">Submission Details</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-400">Submitted:</span>
                <p className="text-white">
                  {new Date(progress.submittedAt).toLocaleString()}
                </p>
              </div>
              
              {progress.score !== undefined && (
                <div>
                  <span className="text-gray-400">Score:</span>
                  <p className="text-white font-semibold">
                    {progress.score} / {assignment.maxScore || 100}
                  </p>
                </div>
              )}
              
              {progress.feedback && (
                <div>
                  <span className="text-gray-400">Feedback:</span>
                  <p className="text-white whitespace-pre-wrap">{progress.feedback}</p>
                </div>
              )}
              
              {progress.submission && (
                <div>
                  <span className="text-gray-400">Your Submission:</span>
                  <div className="bg-slate-800 p-4 rounded-lg mt-2">
                    <p className="text-gray-300 whitespace-pre-wrap">{progress.submission}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overdue Message */}
        {isOverdue && !isSubmitted && (
          <div className="glass-effect p-6 rounded-xl border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-red-400 mb-2">Assignment Overdue</h2>
            <p className="text-gray-300">
              This assignment was due on {new Date(assignment.dueDate).toLocaleDateString()}. 
              Please contact your instructor if you need to submit late.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}