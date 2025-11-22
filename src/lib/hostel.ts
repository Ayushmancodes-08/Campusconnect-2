
export type Room = {
  id: string;
  floor: number;
  capacity: number;
  occupants: string[]; // student IDs
};

export type Hostel = {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  rooms: Room[];
}

// Default hostels with empty rooms (no pre-assigned students)
export const defaultHostels: Hostel[] = [
  {
    id: "H01",
    name: "St. Patrick Hostel",
    gender: "Male",
    rooms: [
      { id: 'A-101', floor: 1, capacity: 2, occupants: [] },
      { id: 'A-102', floor: 1, capacity: 2, occupants: [] },
      { id: 'B-201', floor: 2, capacity: 2, occupants: [] },
    ]
  },
  {
    id: "H02",
    name: "St. Teresa Hostel",
    gender: "Female",
    rooms: [
      { id: 'A-101', floor: 1, capacity: 2, occupants: [] },
      { id: 'A-102', floor: 1, capacity: 2, occupants: [] },
      { id: 'B-201', floor: 2, capacity: 2, occupants: [] },
    ]
  }
];
