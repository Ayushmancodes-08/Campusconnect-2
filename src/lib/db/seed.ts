import { getDb } from '../mongodb';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    const db = await getDb();
    
    // 1. Seed Users for Authentication
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    
    if (userCount === 0) {
      console.log('Seeding initial users...');
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const initialUsers = [
        { email: 'admin@campus.edu', password: hashedPassword, role: 'admin', name: 'Admin User' },
        { email: 'osahoo225@gmail.com', password: hashedPassword, role: 'teacher', name: 'Ayushman Patra' },
        { email: 'osahoo9178@gmail.com', password: hashedPassword, role: 'student', name: 'Om Sahoo' },
        { email: 'finance@campus.edu', password: hashedPassword, role: 'finance', name: 'Carol White' },
        { email: 'hostel@campus.edu', password: hashedPassword, role: 'hostel', name: 'Henry Cavill' },
      ];
      
      await usersCollection.insertMany(initialUsers);
      console.log('Users seeded successfully!');
    }

    // 2. Seed Students
    const studentsCollection = db.collection('students');
    const studentCount = await studentsCollection.countDocuments();
    if (studentCount === 0) {
      console.log('Seeding initial students...');
      const initialStudents = [
        {
          id: "1",
          name: "Om Sahoo",
          email: "osahoo9178@gmail.com",
          phone: "9876543210",
          gender: "male",
          join_date: "2023-01-15",
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Priya Sharma",
          email: "priya.sharma@campus.edu",
          phone: "9876543211",
          gender: "female",
          join_date: "2023-02-20",
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      await studentsCollection.insertMany(initialStudents);
      console.log('Students seeded successfully!');
    }

    // 3. Seed Staff
    const staffCollection = db.collection('staff');
    const staffCount = await staffCollection.countDocuments();
    if (staffCount === 0) {
      console.log('Seeding initial staff...');
      const initialStaff = [
        {
          id: "1",
          name: "Ayushman Patra",
          email: "osahoo225@gmail.com",
          phone: "9876543220",
          department: "Computer Science",
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Dr. Rajesh Kumar",
          email: "rajesh.kumar@campus.edu",
          phone: "9876543221",
          department: "Mathematics",
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      await staffCollection.insertMany(initialStaff);
      console.log('Staff seeded successfully!');
    }

    // 4. Seed Courses
    const coursesCollection = db.collection('courses');
    const courseCount = await coursesCollection.countDocuments();
    if (courseCount === 0) {
      console.log('Seeding initial courses...');
      const initialCourses = [
        {
          id: "1",
          time: "09:00 AM - 10:30 AM",
          class: "CS101",
          location: "Room 101",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          time: "11:00 AM - 12:30 PM",
          class: "MATH201",
          location: "Room 202",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      await coursesCollection.insertMany(initialCourses);
      console.log('Courses seeded successfully!');
    }

    // 5. Seed Holidays
    const holidaysCollection = db.collection('holidays');
    const holidayCount = await holidaysCollection.countDocuments();
    if (holidayCount === 0) {
      console.log('Seeding initial holidays...');
      const initialHolidays = [
        {
          id: "1",
          date: "2024-01-26",
          name: "Republic Day",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          date: "2024-03-08",
          name: "Maha Shivaratri",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      await holidaysCollection.insertMany(initialHolidays);
      console.log('Holidays seeded successfully!');
    }
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}
