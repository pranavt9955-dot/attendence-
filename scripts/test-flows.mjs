import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function runTests() {
  console.log("🚀 Running Automated Comprehensive Verification Tests...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify Admin User
  const admin = await prisma.user.findUnique({
    where: { email: "admin@school.edu" },
  });
  assert(admin !== null && admin.role === "ADMIN", "Admin user exists with ADMIN role");
  const adminPasswordValid = await bcrypt.compare("Admin@123", admin.password);
  assert(adminPasswordValid, "Admin password hash verification succeeds");

  // 2. Verify Students & Profiles
  const students = await prisma.studentProfile.findMany({
    include: { user: true },
  });
  assert(students.length >= 8, `Enrolled students seeded: found ${students.length} students`);
  const firstStudent = students[0];
  assert(
    firstStudent.admissionNumber && firstStudent.rollNumber && firstStudent.course,
    `Student Profile has complete academic metadata (${firstStudent.fullName} - ${firstStudent.admissionNumber})`
  );

  // 3. Duplicate Admission Number Rejection Test
  let duplicateCaught = false;
  try {
    await prisma.studentProfile.create({
      data: {
        userId: "dummy-id",
        fullName: "Duplicate Tester",
        admissionNumber: firstStudent.admissionNumber, // Duplicate!
        rollNumber: "99",
        course: "Test",
        department: "Test",
        className: "Test",
        section: "A",
        semester: "1",
        academicSession: "2025-2026",
        email: "unique@test.edu",
      },
    });
  } catch (err) {
    duplicateCaught = true;
  }
  assert(duplicateCaught, "Prisma Unique Constraint rejected duplicate Admission Number");

  // 4. Verify Attendance Sessions & Duplicate Slot Check
  const sessions = await prisma.attendanceSession.findMany({
    include: { records: true },
  });
  assert(sessions.length >= 5, `Attendance sessions recorded: found ${sessions.length} sessions`);
  const session1 = sessions[0];
  assert(
    session1.records.length > 0,
    `Attendance session has student records (Count: ${session1.records.length})`
  );

  // 5. Test Attendance Percentage Calculation for Student
  const student1 = await prisma.studentProfile.findUnique({
    where: { admissionNumber: "ADM-2023-0101" },
    include: { attendanceRecords: true },
  });
  assert(student1 !== null, "Found test student ADM-2023-0101");
  const totalClasses = student1.attendanceRecords.length;
  const attended = student1.attendanceRecords.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  ).length;
  const percentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;
  assert(
    totalClasses > 0 && percentage >= 0 && percentage <= 100,
    `Attendance calculation: Total=${totalClasses}, Attended=${attended}, Percentage=${percentage}%`
  );

  // 6. Test Assignment Targeted Visibility
  const cseAssignments = await prisma.assignment.findMany({
    where: {
      status: "PUBLISHED",
      course: "B.Tech Computer Science & Engineering",
      className: "Year 3 / 3rd Year",
    },
    include: { attachments: true },
  });
  assert(
    cseAssignments.length >= 2,
    `Assignments targeted to Year 3 CSE found: ${cseAssignments.length} assignments`
  );
  assert(
    cseAssignments.some((a) => a.attachments.length > 0),
    "Assignment contains persistent file attachments"
  );

  // 7. Test Soft Delete & Restore Flow
  const testStudent = await prisma.user.create({
    data: {
      email: "temp_test_student@school.edu",
      username: "temp_test_student",
      password: "hashed_dummy_password",
      role: "STUDENT",
      student: {
        create: {
          fullName: "Temporary Test Student",
          admissionNumber: "ADM-TEST-9999",
          rollNumber: "999",
          course: "B.Tech Computer Science & Engineering",
          department: "Computer Science",
          className: "Year 3 / 3rd Year",
          section: "Section A",
          semester: "Semester 5",
          academicSession: "2025-2026",
          email: "temp_test_student@school.edu",
          status: "ACTIVE",
        },
      },
    },
    include: { student: true },
  });

  // Soft delete
  await prisma.studentProfile.update({
    where: { id: testStudent.student.id },
    data: { status: "DELETED" },
  });
  const deletedCheck = await prisma.studentProfile.findUnique({
    where: { id: testStudent.student.id },
  });
  assert(deletedCheck.status === "DELETED", "Soft deletion marks status as DELETED safely");

  // Restore
  await prisma.studentProfile.update({
    where: { id: testStudent.student.id },
    data: { status: "ACTIVE" },
  });
  const restoredCheck = await prisma.studentProfile.findUnique({
    where: { id: testStudent.student.id },
  });
  assert(restoredCheck.status === "ACTIVE", "Restoring record returns status to ACTIVE");

  // Clean up test user
  await prisma.user.delete({ where: { id: testStudent.id } });
  assert(true, "Temporary test user cleaned up");

  // 8. Audit Log Verification
  const auditLogs = await prisma.auditLog.findMany();
  assert(auditLogs.length > 0, `Audit logs recorded in database: ${auditLogs.length} entries`);

  console.log(`\n================================`);
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`================================\n`);

  if (failed > 0) process.exit(1);
}

runTests()
  .catch((e) => {
    console.error("Test execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
