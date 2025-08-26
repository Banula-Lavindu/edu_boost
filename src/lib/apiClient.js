// lib/apiClient.js
import { getSession } from 'next-auth/react';

// Helper function to check authentication
export async function checkAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('User not authenticated');
  }
  return session;
}

// Helper function to make authenticated API calls
export async function apiCall(url, options = {}) {
  try {
    // Check if user is authenticated
    await checkAuth();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for NextAuth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Specific API functions
export const moduleAPI = {
  getAll: () => apiCall('/api/modules'),
  getById: (id) => apiCall(`/api/modules/${id}`),
  create: (data) => apiCall('/api/modules', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/modules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/modules/${id}`, { method: 'DELETE' }),
};

export const assignmentTemplateAPI = {
  getByModule: (moduleId) => apiCall(`/api/modules/${moduleId}/assignment-templates`),
  getById: (moduleId, assignmentId) => apiCall(`/api/modules/${moduleId}/assignment-templates/${assignmentId}`),
  create: (moduleId, data) => apiCall(`/api/modules/${moduleId}/assignment-templates`, { method: 'POST', body: JSON.stringify(data) }),
  update: (moduleId, assignmentId, data) => apiCall(`/api/modules/${moduleId}/assignment-templates/${assignmentId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (moduleId, assignmentId) => apiCall(`/api/modules/${moduleId}/assignment-templates/${assignmentId}`, { method: 'DELETE' }),
  activate: (moduleId, assignmentId, dueDate) => apiCall(`/api/modules/${moduleId}/assignment-templates/${assignmentId}/activate`, { method: 'POST', body: JSON.stringify({ dueDate }) }),
  deactivate: (moduleId, assignmentId) => apiCall(`/api/modules/${moduleId}/assignment-templates/${assignmentId}/activate`, { method: 'DELETE' }),
};

export const courseAPI = {
  getAll: () => apiCall('/api/courses'),
  getById: (id) => apiCall(`/api/courses/${id}`),
  create: (data) => apiCall('/api/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/courses/${id}`, { method: 'DELETE' }),
};

export const batchAPI = {
  getAll: () => apiCall('/api/batches'),
  getById: (id) => apiCall(`/api/batches/${id}`),
  create: (data) => apiCall('/api/batches', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/batches/${id}`, { method: 'DELETE' }),
};

export const assessmentAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/api/assessments?${searchParams}`);
  },
  getById: (id) => apiCall(`/api/assessments/${id}`),
  create: (data) => apiCall('/api/assessments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/assessments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/assessments/${id}`, { method: 'DELETE' }),
};

export const progressAPI = {
  get: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/api/student-progress?${searchParams}`);
  },
  getStudentProgress: (studentId) => apiCall(`/api/student-progress?studentId=${studentId}`),
  record: (data) => apiCall('/api/student-progress', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/student-progress/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const studentAPI = {
  getAll: () => apiCall('/api/students'),
  getDashboard: () => apiCall('/api/student/dashboard'),
  getEnrollments: () => apiCall('/api/student/enrollments'),
  getProfile: () => apiCall('/api/me'),
  getActiveAssignments: () => apiCall('/api/student/active-assignments'),
  create: (data) => apiCall('/api/students', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/students/${id}`, { method: 'DELETE' }),
};

export const educatorAPI = {
  getAll: () => apiCall('/api/educators'),
  create: (data) => apiCall('/api/educators', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/educators/${id}`, { method: 'DELETE' }),
  getModules: (id) => apiCall(`/api/educators/${id}/modules`),
  assignModules: (id, moduleIds) => apiCall(`/api/educators/${id}/modules`, { method: 'POST', body: JSON.stringify({ moduleIds }) }),
  removeModules: (id, moduleIds) => apiCall(`/api/educators/${id}/modules`, { method: 'DELETE', body: JSON.stringify({ moduleIds }) }),
  getStudents: (id) => apiCall(`/api/educators/${id}/students`),
  getAssessments: (id) => apiCall(`/api/educators/${id}/assessments`),
};

export const adminAPI = {
  getPendingStudents: () => apiCall('/api/admin/pending-students'),
  getPendingEducators: () => apiCall('/api/admin/pending-educators'),
  approveStudent: (studentId) => apiCall('/api/admin/approve-student', { method: 'POST', body: JSON.stringify({ studentId }) }),
  approveEducator: (educatorId) => apiCall('/api/admin/approve-educator', { method: 'POST', body: JSON.stringify({ educatorId }) }),
  rejectUser: (userId) => apiCall('/api/admin/reject-user', { method: 'POST', body: JSON.stringify({ userId }) }),
};

export default { moduleAPI, assignmentTemplateAPI, courseAPI, batchAPI, assessmentAPI, progressAPI, studentAPI, educatorAPI, adminAPI };