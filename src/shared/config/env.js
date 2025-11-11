export const config = {
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  enableProctoring: import.meta.env.VITE_ENABLE_PROCTORING === 'true',
  defaultExamDuration: parseInt(import.meta.env.VITE_DEFAULT_EXAM_DURATION) || 5400000,
  maxViolations: parseInt(import.meta.env.VITE_MAX_VIOLATIONS) || 3,
  autoSaveInterval: parseInt(import.meta.env.VITE_AUTO_SAVE_INTERVAL) || 30000,
};
