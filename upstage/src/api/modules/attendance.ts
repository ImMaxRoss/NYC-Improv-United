// src/api/modules/attendance.ts
import { api } from '../service';

export interface AttendanceRequest {
  performerId: number;
  isPresent: boolean;
}

export interface BulkAttendanceRequest {
  performerIds: number[];
}

export interface AttendanceResponse {
  practiceSessionId: number;
  performerId: number;
  performerFirstName: string;
  performerLastName: string;
}

export const attendanceAPI = {
  // Record single attendance
  recordAttendance: async (sessionId: number, data: AttendanceRequest): Promise<void> => {
    try {
      return await api.post<void>(`/attendance/sessions/${sessionId}`, data);
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw error;
    }
  },

  // Bulk update attendance
  updateBulkAttendance: async (sessionId: number, performerIds: number[]): Promise<void> => {
    try {
      return await api.post<void>(`/attendance/sessions/${sessionId}/bulk`, { performerIds });
    } catch (error) {
      console.error('Error updating bulk attendance:', error);
      throw error;
    }
  },

  // Get attendees for a session
  getAttendees: async (sessionId: number): Promise<AttendanceResponse[]> => {
    try {
      return await api.get<AttendanceResponse[]>(`/attendance/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      throw error;
    }
  }
};