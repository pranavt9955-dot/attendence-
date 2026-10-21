import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing records to ensure clean slate
  await prisma.auditLog.deleteMany({});
  await prisma.assignmentAttachment.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.attendanceSession.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const adminHashedPassword = await bcrypt.hash("Admin@123", 10);
  const studentHashedPassword = await bcrypt.hash("Student@123", 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@school.edu",
      username: "admin",
      password: adminHashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created: admin@school.edu / Admin@123");

  // 2. Create Students
  const studentsData = [
    {
      fullName: "Aryan Sharma",
      email: "student1@school.edu",
      username: "aryan.sharma",
      admissionNumber: "ADM-2023-0101",
      rollNumber: "CS-21",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      gender: "Male",
      dateOfBirth: "2003-05-14",
      mobileNumber: "+91 98765 43210",
      fatherName: "Rajesh Sharma",
      motherName: "Sunita Sharma",
      guardianContact: "+91 98765 43211",
      residentialAddress: "Flat 402, Green Valley Heights, Sector 62, Noida, UP",
      admissionDate: "2023-08-01",
      remarks: "Academic merit scholarship holder, coding club lead",
    },
    {
      fullName: "Priya Patel",
      email: "student2@school.edu",
      username: "priya.patel",
      admissionNumber: "ADM-2023-0102",
      rollNumber: "CS-22",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      gender: "Female",
      dateOfBirth: "2003-11-20",
      mobileNumber: "+91 98765 43212",
      fatherName: "Dinesh Patel",
      motherName: "Rekha Patel",
      guardianContact: "+91 98765 43213",
      residentialAddress: "B-12, Orchid Residency, South City 1, Gurugram, HR",
      admissionDate: "2023-08-01",
      remarks: "Class representative, 9.4 CGPA",
    },
    {
      fullName: "Rohan Gupta",
      email: "student3@school.edu",
      username: "rohan.gupta",
      admissionNumber: "ADM-2023-0103",
      rollNumber: "CS-23",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      gender: "Male",
      dateOfBirth: "2004-02-18",
      mobileNumber: "+91 98765 43214",
      fatherName: "Sanjay Gupta",
      motherName: "Kavita Gupta",
      guardianContact: "+91 98765 43215",
      residentialAddress: "H-89, Preet Vihar, Delhi 110092",
      admissionDate: "2023-08-02",
      remarks: "Sports captain - Badminton team",
    },
    {
      fullName: "Ananya Verma",
      email: "student4@school.edu",
      username: "ananya.verma",
      admissionNumber: "ADM-2023-0104",
      rollNumber: "CS-24",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      gender: "Female",
      dateOfBirth: "2003-09-09",
      mobileNumber: "+91 98765 43216",
      fatherName: "Alok Verma",
      motherName: "Meenakshi Verma",
      guardianContact: "+91 98765 43217",
      residentialAddress: "A-45, Indirapuram, Ghaziabad, UP",
      admissionDate: "2023-08-02",
      remarks: "Robotics club member",
    },
    {
      fullName: "Kabir Mehta",
      email: "student5@school.edu",
      username: "kabir.mehta",
      admissionNumber: "ADM-2023-0105",
      rollNumber: "CS-25",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      gender: "Male",
      dateOfBirth: "2003-07-25",
      mobileNumber: "+91 98765 43218",
      fatherName: "Naveen Mehta",
      motherName: "Sangeeta Mehta",
      guardianContact: "+91 98765 43219",
      residentialAddress: "D-19, Saket, New Delhi 110017",
      admissionDate: "2023-08-03",
      remarks: "Web developer student mentor",
    },
    {
      fullName: "Sneha Reddy",
      email: "student6@school.edu",
      username: "sneha.reddy",
      admissionNumber: "ADM-2023-0106",
      rollNumber: "CS-51",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section B",
      semester: "Semester 5",
      academicSession: "2025-2026",
      gender: "Female",
      dateOfBirth: "2003-12-11",
      mobileNumber: "+91 98765 43220",
      fatherName: "Ramesh Reddy",
      motherName: "Madhavi Reddy",
      guardianContact: "+91 98765 43221",
      residentialAddress: "Tower 3, Cyber Park View, Sector 48, Gurugram",
      admissionDate: "2023-08-03",
      remarks: "AI enthusiast",
    },
    {
      fullName: "Vikram Singh",
      email: "student7@school.edu",
      username: "vikram.singh",
      admissionNumber: "ADM-2024-0201",
      rollNumber: "IT-11",
      course: "B.Tech Information Technology",
      department: "Information Technology",
      className: "Year 2 / 2nd Year",
      section: "Section A",
      semester: "Semester 3",
      academicSession: "2025-2026",
      gender: "Male",
      dateOfBirth: "2004-06-15",
      mobileNumber: "+91 98765 43222",
      fatherName: "Harpreet Singh",
      motherName: "Gurpreet Kaur",
      guardianContact: "+91 98765 43223",
      residentialAddress: "C-88, Model Town, Delhi 110009",
      admissionDate: "2024-08-01",
      remarks: "Dean's list 1st year",
    },
    {
      fullName: "Tanya Joshi",
      email: "student8@school.edu",
      username: "tanya.joshi",
      admissionNumber: "ADM-2025-0301",
      rollNumber: "MBA-05",
      course: "Master of Business Administration (MBA)",
      department: "Management Studies (MBA)",
      className: "Year 1 / 1st Year",
      section: "Section A",
      semester: "Semester 1",
      academicSession: "2025-2026",
      gender: "Female",
      dateOfBirth: "2001-04-10",
      mobileNumber: "+91 98765 43224",
      fatherName: "Praveen Joshi",
      motherName: "Anuradha Joshi",
      guardianContact: "+91 98765 43225",
      residentialAddress: "Villa 14, Palm Meadows, Greater Noida",
      admissionDate: "2025-07-15",
      remarks: "Corporate relations coordinator",
    },
  ];

  const createdStudents = [];

  for (const s of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        username: s.username,
        password: studentHashedPassword,
        role: "STUDENT",
        student: {
          create: {
            fullName: s.fullName,
            admissionNumber: s.admissionNumber,
            rollNumber: s.rollNumber,
            course: s.course,
            department: s.department,
            className: s.className,
            section: s.section,
            semester: s.semester,
            academicSession: s.academicSession,
            gender: s.gender,
            dateOfBirth: s.dateOfBirth,
            email: s.email,
            mobileNumber: s.mobileNumber,
            fatherName: s.fatherName,
            motherName: s.motherName,
            guardianContact: s.guardianContact,
            residentialAddress: s.residentialAddress,
            admissionDate: s.admissionDate,
            remarks: s.remarks,
            status: "ACTIVE",
          },
        },
      },
      include: { student: true },
    });
    createdStudents.push(user.student);
  }
  console.log(`✅ ${createdStudents.length} Students created with credentials student1@school.edu .. student8@school.edu / Student@123`);

  // Filter Year 3 Section A CSE students for attendance sessions
  const cseStudents = createdStudents.filter(
    (s) => s.course === "B.Tech Computer Science & Engineering" && s.section === "Section A"
  );

  // Today's date YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  const d1 = new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0];
  const d2 = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
  const d3 = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

  const sessionsSeed = [
    {
      sessionDate: today,
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      subjectName: "Database Management Systems",
      subjectCode: "CS-501",
      facultyName: "Dr. Arvind Raghavan",
      periodNumber: "1",
      startTime: "09:00",
      endTime: "10:00",
      status: "COMPLETED",
      records: [
        { studentIdx: 0, status: "PRESENT", remarks: "On time" },
        { studentIdx: 1, status: "PRESENT", remarks: "Participated in lab discussion" },
        { studentIdx: 2, status: "LATE", remarks: "Arrived 10 mins late due to bus traffic" },
        { studentIdx: 3, status: "PRESENT", remarks: "" },
        { studentIdx: 4, status: "ABSENT", remarks: "Unexcused absence" },
      ],
    },
    {
      sessionDate: today,
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      subjectName: "Computer Networks & Protocols",
      subjectCode: "CS-502",
      facultyName: "Prof. Shalini Murthy",
      periodNumber: "2",
      startTime: "10:00",
      endTime: "11:00",
      status: "COMPLETED",
      records: [
        { studentIdx: 0, status: "PRESENT", remarks: "" },
        { studentIdx: 1, status: "PRESENT", remarks: "" },
        { studentIdx: 2, status: "PRESENT", remarks: "" },
        { studentIdx: 3, status: "LEAVE", remarks: "Medical leave approved by HOD" },
        { studentIdx: 4, status: "PRESENT", remarks: "" },
      ],
    },
    {
      sessionDate: d1,
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      subjectName: "Software Engineering & Agile Methodologies",
      subjectCode: "CS-503",
      facultyName: "Dr. Meenakshi Sundaram",
      periodNumber: "3",
      startTime: "11:15",
      endTime: "12:15",
      status: "COMPLETED",
      records: [
        { studentIdx: 0, status: "PRESENT", remarks: "" },
        { studentIdx: 1, status: "PRESENT", remarks: "" },
        { studentIdx: 2, status: "PRESENT", remarks: "" },
        { studentIdx: 3, status: "PRESENT", remarks: "" },
        { studentIdx: 4, status: "PRESENT", remarks: "" },
      ],
    },
    {
      sessionDate: d2,
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      subjectName: "Database Management Systems",
      subjectCode: "CS-501",
      facultyName: "Dr. Arvind Raghavan",
      periodNumber: "1",
      startTime: "09:00",
      endTime: "10:00",
      status: "COMPLETED",
      records: [
        { studentIdx: 0, status: "PRESENT", remarks: "" },
        { studentIdx: 1, status: "PRESENT", remarks: "" },
        { studentIdx: 2, status: "ABSENT", remarks: "Sick leave" },
        { studentIdx: 3, status: "PRESENT", remarks: "" },
        { studentIdx: 4, status: "PRESENT", remarks: "" },
      ],
    },
    {
      sessionDate: d3,
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      academicSession: "2025-2026",
      subjectName: "Cloud Computing & DevOps",
      subjectCode: "CS-505",
      facultyName: "Prof. Rajesh Khanna",
      periodNumber: "4",
      startTime: "12:15",
      endTime: "13:15",
      status: "COMPLETED",
      records: [
        { studentIdx: 0, status: "PRESENT", remarks: "" },
        { studentIdx: 1, status: "PRESENT", remarks: "" },
        { studentIdx: 2, status: "PRESENT", remarks: "" },
        { studentIdx: 3, status: "PRESENT", remarks: "" },
        { studentIdx: 4, status: "LATE", remarks: "15 min delay" },
      ],
    },
  ];

  for (const s of sessionsSeed) {
    const session = await prisma.attendanceSession.create({
      data: {
        sessionDate: s.sessionDate,
        course: s.course,
        department: s.department,
        className: s.className,
        section: s.section,
        semester: s.semester,
        academicSession: s.academicSession,
        subjectName: s.subjectName,
        subjectCode: s.subjectCode,
        facultyName: s.facultyName,
        periodNumber: s.periodNumber,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
        createdById: admin.id,
      },
    });

    for (const r of s.records) {
      const student = cseStudents[r.studentIdx];
      if (student) {
        await prisma.attendanceRecord.create({
          data: {
            sessionId: session.id,
            studentId: student.id,
            status: r.status,
            remarks: r.remarks || null,
          },
        });
      }
    }
  }
  console.log(`✅ ${sessionsSeed.length} Attendance sessions and records seeded.`);

  // 4. Create Assignments
  const deadline1 = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
  const deadline2 = new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0];
  const deadline3 = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  const assignmentsSeed = [
    {
      title: "Assignment 1: Relational Schema Normalization & BCNF Proofs",
      description: "Analyze the given university database schema. Decompose relations into 3NF and BCNF. Provide dependency preservation and lossless-join proofs for each decomposition. Submit as a single formatted PDF report.",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      subjectName: "Database Management Systems",
      subjectCode: "CS-501",
      teacherName: "Dr. Arvind Raghavan",
      issueDate: today,
      deadline: deadline1,
      maxMarks: 100,
      status: "PUBLISHED",
      attachments: [
        {
          fileName: "DBMS_Lab_Assignment_1_Specifications.pdf",
          fileUrl: "/uploads/assignments/sample-dbms-spec.pdf",
          fileType: "application/pdf",
          fileSize: 452100,
        },
      ],
    },
    {
      title: "Assignment 2: Socket Programming in C/Python (TCP & UDP Multi-client)",
      description: "Implement a multi-threaded TCP chat server and client application with room broadcast support. Also write a UDP echo client measuring round-trip latency.",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      subjectName: "Computer Networks & Protocols",
      subjectCode: "CS-502",
      teacherName: "Prof. Shalini Murthy",
      issueDate: today,
      deadline: deadline2,
      maxMarks: 50,
      status: "PUBLISHED",
      attachments: [
        {
          fileName: "Network_Socket_Architecture_Diagram.png",
          fileUrl: "/uploads/assignments/network-diagram.png",
          fileType: "image/png",
          fileSize: 184500,
        },
      ],
    },
    {
      title: "Assignment 3: Software Requirements Specification (SRS) for Tele-Health",
      description: "Draft an IEEE 830 compliant Software Requirements Specification document for an AI-assisted hospital OPD booking system. Include UML use case and class diagrams.",
      course: "B.Tech Computer Science & Engineering",
      department: "Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
      section: "Section A",
      semester: "Semester 5",
      subjectName: "Software Engineering & Agile Methodologies",
      subjectCode: "CS-503",
      teacherName: "Dr. Meenakshi Sundaram",
      issueDate: today,
      deadline: deadline3,
      maxMarks: 100,
      status: "PUBLISHED",
      attachments: [],
    },
  ];

  for (const a of assignmentsSeed) {
    const createdAssignment = await prisma.assignment.create({
      data: {
        title: a.title,
        description: a.description,
        course: a.course,
        department: a.department,
        className: a.className,
        section: a.section,
        semester: a.semester,
        subjectName: a.subjectName,
        subjectCode: a.subjectCode,
        teacherName: a.teacherName,
        issueDate: a.issueDate,
        deadline: a.deadline,
        maxMarks: a.maxMarks,
        status: a.status,
        createdById: admin.id,
        attachments: {
          create: a.attachments,
        },
      },
    });
  }
  console.log(`✅ ${assignmentsSeed.length} Assignments created.`);

  // 5. Create Sample Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      userEmail: admin.email,
      action: "SYSTEM_INITIALIZED",
      entityType: "System",
      details: JSON.stringify({ message: "Initial database seed completed successfully." }),
    },
  });

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
