// src/api/index.ts
export { authAPI } from './modules/auth';
export { teamsAPI, performersAPI } from './modules/teams';
export { lessonsAPI } from './modules/lessons';
export { exercisesAPI } from './modules/exercises';
export { evaluationsAPI } from './modules/evaluations';
export { analyticsAPI } from './modules/analytics';
export { practiceAPI } from './modules/practice';
export { attendanceAPI } from './modules/attendance';
export { focusAreasAPI } from './modules/focusAreas';

// Re-export types
export type {
  AttendanceRequest,
  BulkAttendanceRequest,
  AttendanceResponse
} from './modules/attendance';