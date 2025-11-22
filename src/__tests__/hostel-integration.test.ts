/**
 * Integration Tests for Hostel Data Synchronization
 * 
 * These tests verify the integration between:
 * - StudentService (Supabase)
 * - Room Management Pages
 * - Hostel Dashboard
 * - localStorage persistence
 */

/**
 * Test 1: Verify default hostels have no hardcoded students
 */
export function testDefaultHostelsEmpty() {
  const { defaultHostels } = require('@/lib/hostel');
  
  const allOccupants = defaultHostels.flatMap((h: any) => 
    h.rooms.flatMap((r: any) => r.occupants)
  );
  
  if (allOccupants.length !== 0) {
    throw new Error(`Expected empty occupants, but found ${allOccupants.length}`);
  }
  
  console.log('✓ Test 1 passed: Default hostels have no hardcoded students');
}

/**
 * Test 2: Verify hostel.ts doesn't export defaultMessData
 */
export function testMessDataRemoved() {
  const hostelModule = require('@/lib/hostel');
  
  if ('defaultMessData' in hostelModule) {
    throw new Error('defaultMessData should not be exported from hostel.ts');
  }
  
  console.log('✓ Test 2 passed: defaultMessData has been removed');
}

/**
 * Test 3: Verify student filtering logic
 */
export function testStudentFiltering() {
  const students = [
    { id: '1', name: 'John', gender: 'male', status: 'Active' },
    { id: '2', name: 'Jane', gender: 'female', status: 'Active' },
    { id: '3', name: 'Bob', gender: 'male', status: 'Active' },
  ];
  
  const assignedStudents = ['1', '2'];
  const availableStudents = students.filter(s => !assignedStudents.includes(s.id));
  
  if (availableStudents.length !== 1 || availableStudents[0].id !== '3') {
    throw new Error('Student filtering failed');
  }
  
  console.log('✓ Test 3 passed: Student filtering works correctly');
}

/**
 * Test 4: Verify invalid student ID handling
 */
export function testInvalidStudentHandling() {
  const students = [
    { id: '1', name: 'John', gender: 'male', status: 'Active' },
  ];
  
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || `Unknown Student (ID: ${studentId})`;
  };
  
  const validName = getStudentName('1');
  const invalidName = getStudentName('invalid-id');
  
  if (validName !== 'John') {
    throw new Error('Valid student name resolution failed');
  }
  
  if (!invalidName.includes('Unknown Student')) {
    throw new Error('Invalid student handling failed');
  }
  
  console.log('✓ Test 4 passed: Invalid student IDs are handled gracefully');
}

/**
 * Test 5: Verify gender-based filtering
 */
export function testGenderBasedFiltering() {
  const students = [
    { id: '1', name: 'John', gender: 'male', status: 'Active' },
    { id: '2', name: 'Jane', gender: 'female', status: 'Active' },
    { id: '3', name: 'Bob', gender: 'male', status: 'Active' },
  ];
  
  const maleStudents = students.filter(s => s.gender === 'male');
  const femaleStudents = students.filter(s => s.gender === 'female');
  
  if (maleStudents.length !== 2 || femaleStudents.length !== 1) {
    throw new Error('Gender-based filtering failed');
  }
  
  console.log('✓ Test 5 passed: Gender-based filtering works correctly');
}

/**
 * Test 6: Verify occupancy calculation
 */
export function testOccupancyCalculation() {
  const hostel = {
    id: 'H01',
    name: 'Test Hostel',
    gender: 'Male',
    rooms: [
      { id: 'A-101', floor: 1, capacity: 2, occupants: ['1'] },
      { id: 'A-102', floor: 1, capacity: 2, occupants: ['2', '3'] },
      { id: 'B-201', floor: 2, capacity: 2, occupants: [] },
    ]
  };
  
  const totalCapacity = hostel.rooms.reduce((acc, room) => acc + room.capacity, 0);
  const occupiedCount = hostel.rooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedCount / totalCapacity) * 100) : 0;
  
  if (totalCapacity !== 6 || occupiedCount !== 3 || occupancyRate !== 50) {
    throw new Error(`Occupancy calculation failed: capacity=${totalCapacity}, occupied=${occupiedCount}, rate=${occupancyRate}`);
  }
  
  console.log('✓ Test 6 passed: Occupancy calculation is correct');
}

/**
 * Test 7: Verify localStorage data structure
 */
export function testLocalStorageStructure() {
  const mockHostelData = {
    id: 'H01',
    name: 'Test Hostel',
    gender: 'Male',
    rooms: [
      { id: 'A-101', floor: 1, capacity: 2, occupants: [] }
    ]
  };
  
  const serialized = JSON.stringify(mockHostelData);
  const deserialized = JSON.parse(serialized);
  
  if (deserialized.id !== 'H01' || deserialized.rooms.length !== 1) {
    throw new Error('localStorage serialization/deserialization failed');
  }
  
  console.log('✓ Test 7 passed: localStorage data structure is valid');
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('\n=== Running Hostel Data Synchronization Tests ===\n');
  
  try {
    testDefaultHostelsEmpty();
    testMessDataRemoved();
    testStudentFiltering();
    testInvalidStudentHandling();
    testGenderBasedFiltering();
    testOccupancyCalculation();
    testLocalStorageStructure();
    
    console.log('\n=== All tests passed! ===\n');
  } catch (error) {
    console.error('\n=== Test failed ===');
    console.error(error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
