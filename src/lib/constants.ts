export const INSTITUTION_NAME = "Apex Institute of Technology & Management";
export const INSTITUTION_SHORT = "Apex Academy";

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Management Studies (MBA)",
  "Basic Sciences & Humanities",
];

export const COURSES = [
  { code: "BTECH-CSE", name: "B.Tech Computer Science & Engineering", department: "Computer Science & Engineering" },
  { code: "BTECH-IT", name: "B.Tech Information Technology", department: "Information Technology" },
  { code: "BTECH-ECE", name: "B.Tech Electronics & Communication", department: "Electronics & Communication" },
  { code: "BCA", name: "Bachelor of Computer Applications (BCA)", department: "Computer Science & Engineering" },
  { code: "MBA", name: "Master of Business Administration (MBA)", department: "Management Studies (MBA)" },
];

export const CLASSES = [
  "Year 1 / 1st Year",
  "Year 2 / 2nd Year",
  "Year 3 / 3rd Year",
  "Year 4 / 4th Year",
];

export const SECTIONS = ["Section A", "Section B", "Section C"];

export const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export const ACADEMIC_SESSIONS = [
  "2025-2026",
  "2024-2025",
  "2023-2024",
];

export const SUBJECTS = [
  { code: "CS-501", name: "Database Management Systems", course: "B.Tech Computer Science & Engineering", semester: "Semester 5" },
  { code: "CS-502", name: "Computer Networks & Protocols", course: "B.Tech Computer Science & Engineering", semester: "Semester 5" },
  { code: "CS-503", name: "Software Engineering & Agile Methodologies", course: "B.Tech Computer Science & Engineering", semester: "Semester 5" },
  { code: "CS-504", name: "Operating Systems Principles", course: "B.Tech Computer Science & Engineering", semester: "Semester 5" },
  { code: "CS-505", name: "Cloud Computing & DevOps", course: "B.Tech Computer Science & Engineering", semester: "Semester 5" },
  { code: "CS-301", name: "Data Structures & Algorithms", course: "B.Tech Computer Science & Engineering", semester: "Semester 3" },
  { code: "CS-302", name: "Discrete Mathematical Structures", course: "B.Tech Computer Science & Engineering", semester: "Semester 3" },
  { code: "IT-301", name: "Web Technologies & Full Stack Development", course: "B.Tech Information Technology", semester: "Semester 3" },
  { code: "MBA-101", name: "Organizational Behavior & HR Strategy", course: "Master of Business Administration (MBA)", semester: "Semester 1" },
  { code: "MBA-102", name: "Financial Accounting & Business Analytics", course: "Master of Business Administration (MBA)", semester: "Semester 1" },
];

export const PERIODS = [
  { number: "1", label: "Period 1 (09:00 AM - 10:00 AM)", start: "09:00", end: "10:00" },
  { number: "2", label: "Period 2 (10:00 AM - 11:00 AM)", start: "10:00", end: "11:00" },
  { number: "3", label: "Period 3 (11:15 AM - 12:15 PM)", start: "11:15", end: "12:15" },
  { number: "4", label: "Period 4 (12:15 PM - 01:15 PM)", start: "12:15", end: "13:15" },
  { number: "5", label: "Period 5 (02:00 PM - 03:00 PM)", start: "14:00", end: "15:00" },
  { number: "6", label: "Period 6 (03:00 PM - 04:00 PM)", start: "15:00", end: "16:00" },
];

export const ATTENDANCE_STATUS_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  PRESENT: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300", badge: "bg-emerald-100 text-emerald-800" },
  ABSENT: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-300", badge: "bg-rose-100 text-rose-800" },
  LATE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", badge: "bg-amber-100 text-amber-800" },
  LEAVE: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-300", badge: "bg-sky-100 text-sky-800" },
};
