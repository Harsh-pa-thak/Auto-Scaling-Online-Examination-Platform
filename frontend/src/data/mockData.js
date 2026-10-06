// ============================================================
//  Mock Data — ExamPortal
//  Centralised data store. Import from here; never hardcode.
// ============================================================

// ── Auth users ───────────────────────────────────────────────
export const mockUsers = {
  student: {
    id: '24BCE1234',
    name: 'Harsh Pathak',
    email: 'harsh.pathak@vit.ac.in',
    role: 'student',
    branch: 'B.Tech CSE',
    semester: 4,
    section: 'A',
    batch: '2024–2028',
    cgpa: 8.7,
    phone: '+91 98765 43210',
    avatar: null, // null → show initials
    joinedAt: '2024-08-01',
  },
  admin: {
    id: 'ADMIN001',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@vit.ac.in',
    role: 'admin',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    phone: '+91 91234 56789',
    avatar: null,
    joinedAt: '2018-06-01',
  },
}

// ── Students list (admin view) ────────────────────────────────
export const mockStudents = [
  { id: '24BCE1001', name: 'Aarav Kumar',      email: 'aarav.kumar@vit.ac.in',      branch: 'CSE', semester: 4, section: 'A', cgpa: 9.1, status: 'active' },
  { id: '24BCE1002', name: 'Sneha Reddy',      email: 'sneha.reddy@vit.ac.in',      branch: 'CSE', semester: 4, section: 'A', cgpa: 8.6, status: 'active' },
  { id: '24BCE1003', name: 'Rohan Mehta',      email: 'rohan.mehta@vit.ac.in',      branch: 'CSE', semester: 4, section: 'B', cgpa: 7.9, status: 'active' },
  { id: '24BCE1004', name: 'Priya Nair',       email: 'priya.nair@vit.ac.in',       branch: 'CSE', semester: 4, section: 'B', cgpa: 8.3, status: 'active' },
  { id: '24BCE1005', name: 'Vikram Singh',     email: 'vikram.singh@vit.ac.in',     branch: 'CSE', semester: 4, section: 'C', cgpa: 7.2, status: 'active' },
  { id: '24BCE1006', name: 'Ananya Sharma',    email: 'ananya.sharma@vit.ac.in',    branch: 'CSE', semester: 4, section: 'C', cgpa: 9.3, status: 'active' },
  { id: '24BCE1007', name: 'Karthik Iyer',     email: 'karthik.iyer@vit.ac.in',     branch: 'CSE', semester: 4, section: 'A', cgpa: 8.0, status: 'active' },
  { id: '24BCE1008', name: 'Divya Menon',      email: 'divya.menon@vit.ac.in',      branch: 'CSE', semester: 4, section: 'B', cgpa: 8.8, status: 'inactive' },
  { id: '24BCE1009', name: 'Rahul Joshi',      email: 'rahul.joshi@vit.ac.in',      branch: 'CSE', semester: 4, section: 'C', cgpa: 7.5, status: 'active' },
  { id: '24BCE1010', name: 'Pooja Gupta',      email: 'pooja.gupta@vit.ac.in',      branch: 'CSE', semester: 4, section: 'A', cgpa: 8.1, status: 'active' },
  { id: '24BCE1011', name: 'Arjun Verma',      email: 'arjun.verma@vit.ac.in',      branch: 'CSE', semester: 4, section: 'B', cgpa: 6.8, status: 'active' },
  { id: '24BCE1012', name: 'Sanjana Pillai',   email: 'sanjana.pillai@vit.ac.in',   branch: 'CSE', semester: 4, section: 'C', cgpa: 9.0, status: 'active' },
  { id: '24BCE1234', name: 'Harsh Pathak',     email: 'harsh.pathak@vit.ac.in',     branch: 'CSE', semester: 4, section: 'A', cgpa: 8.7, status: 'active' },
  { id: '24BCE1235', name: 'Meera Krishnan',   email: 'meera.krishnan@vit.ac.in',   branch: 'CSE', semester: 4, section: 'A', cgpa: 7.6, status: 'active' },
  { id: '24BCE1236', name: 'Nikhil Agarwal',   email: 'nikhil.agarwal@vit.ac.in',   branch: 'CSE', semester: 4, section: 'B', cgpa: 8.4, status: 'inactive' },
]

// ── Exams ─────────────────────────────────────────────────────
export const mockExams = [
  {
    id: 'EX001',
    title: 'Data Structures & Algorithms — Mid Semester',
    subject: 'Data Structures',
    code: 'CSE2001',
    duration: 90,
    totalMarks: 100,
    passMark: 40,
    totalQuestions: 50,
    marksPerQuestion: 2,
    negativeMarking: false,
    startTime: '2025-11-15T09:00:00',
    endTime:   '2025-11-15T10:30:00',
    status: 'upcoming',
    createdBy: 'ADMIN001',
    allowedStudents: 180,
    section: ['A', 'B', 'C'],
    instructions: [
      'Read all questions carefully before answering.',
      'Each question carries equal marks.',
      'No negative marking.',
      'Once submitted the exam cannot be re-attempted.',
      'Ensure a stable internet connection throughout.',
    ],
  },
  {
    id: 'EX002',
    title: 'Database Management Systems — Internal Assessment 2',
    subject: 'DBMS',
    code: 'CSE2002',
    duration: 60,
    totalMarks: 50,
    passMark: 20,
    totalQuestions: 25,
    marksPerQuestion: 2,
    negativeMarking: false,
    startTime: '2025-11-18T14:00:00',
    endTime:   '2025-11-18T15:00:00',
    status: 'upcoming',
    createdBy: 'ADMIN001',
    allowedStudents: 160,
    section: ['A', 'B'],
    instructions: [
      'All questions are mandatory.',
      'Time limit is strictly enforced.',
      'No partial marking.',
    ],
  },
  {
    id: 'EX003',
    title: 'Operating Systems — Quiz 3',
    subject: 'Operating Systems',
    code: 'CSE3001',
    duration: 30,
    totalMarks: 30,
    passMark: 12,
    totalQuestions: 15,
    marksPerQuestion: 2,
    negativeMarking: false,
    startTime: '2025-10-25T11:00:00',
    endTime:   '2025-10-25T11:30:00',
    status: 'active',
    createdBy: 'ADMIN001',
    allowedStudents: 200,
    section: ['A', 'B', 'C'],
    instructions: [
      'This is a timed quiz.',
      'Select the best answer for each question.',
    ],
  },
  {
    id: 'EX004',
    title: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    code: 'CSE3002',
    duration: 120,
    totalMarks: 100,
    passMark: 40,
    totalQuestions: 50,
    marksPerQuestion: 2,
    negativeMarking: true,
    negativeMarks: 0.5,
    startTime: '2025-09-30T09:00:00',
    endTime:   '2025-09-30T11:00:00',
    status: 'completed',
    createdBy: 'ADMIN001',
    allowedStudents: 175,
    section: ['A', 'B', 'C'],
    instructions: [
      'Negative marking of 0.5 marks per wrong answer.',
      'Do not leave any question unanswered without consideration.',
    ],
  },
  {
    id: 'EX005',
    title: 'Cloud Computing — Internal Assessment 1',
    subject: 'Cloud Computing',
    code: 'CSE4001',
    duration: 45,
    totalMarks: 50,
    passMark: 20,
    totalQuestions: 25,
    marksPerQuestion: 2,
    negativeMarking: false,
    startTime: '2025-09-12T10:00:00',
    endTime:   '2025-09-12T10:45:00',
    status: 'completed',
    createdBy: 'ADMIN001',
    allowedStudents: 120,
    section: ['A', 'B'],
    instructions: ['All questions are MCQ format.'],
  },
  {
    id: 'EX006',
    title: 'Data Structures — Practice Test',
    subject: 'Data Structures',
    code: 'CSE2001',
    duration: 60,
    totalMarks: 60,
    passMark: 24,
    totalQuestions: 30,
    marksPerQuestion: 2,
    negativeMarking: false,
    startTime: '2025-11-20T16:00:00',
    endTime:   '2025-11-20T17:00:00',
    status: 'draft',
    createdBy: 'ADMIN001',
    allowedStudents: 180,
    section: ['A', 'B', 'C'],
    instructions: [],
  },
]

// ── Questions (Question Bank) ──────────────────────────────────
export const mockQuestions = [
  // Data Structures
  { id: 'Q001', subject: 'Data Structures', topic: 'Graph Traversal', difficulty: 'easy',   marks: 2, text: 'Which data structure is used in BFS traversal?',                              options: ['Stack', 'Queue', 'Priority Queue', 'Deque'],                        correctAnswer: 1 },
  { id: 'Q002', subject: 'Data Structures', topic: 'Graph Traversal', difficulty: 'easy',   marks: 2, text: 'Which data structure is used in DFS traversal?',                              options: ['Queue', 'Stack', 'Heap', 'Array'],                                  correctAnswer: 1 },
  { id: 'Q003', subject: 'Data Structures', topic: 'Tree',            difficulty: 'medium', marks: 2, text: 'What is the time complexity of inserting into a balanced BST?',                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],                           correctAnswer: 2 },
  { id: 'Q004', subject: 'Data Structures', topic: 'Sorting',         difficulty: 'medium', marks: 2, text: 'Which sorting algorithm has O(n log n) worst-case time complexity?',           options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'],        correctAnswer: 2 },
  { id: 'Q005', subject: 'Data Structures', topic: 'Linked List',     difficulty: 'easy',   marks: 2, text: 'In a singly linked list, each node contains:',                                options: ['Data only', 'Data and one pointer', 'Data and two pointers', 'Pointers only'], correctAnswer: 1 },
  { id: 'Q006', subject: 'Data Structures', topic: 'Hashing',         difficulty: 'hard',   marks: 2, text: 'Which collision resolution technique uses linked lists at each bucket?',       options: ['Open addressing', 'Linear probing', 'Chaining', 'Quadratic probing'], correctAnswer: 2 },
  { id: 'Q007', subject: 'Data Structures', topic: 'Stack',           difficulty: 'easy',   marks: 2, text: 'Stack follows which principle?',                                              options: ['FIFO', 'LIFO', 'LILO', 'FILO'],                                     correctAnswer: 1 },
  { id: 'Q008', subject: 'Data Structures', topic: 'Heap',            difficulty: 'medium', marks: 2, text: 'In a max-heap, the root always contains the:',                                options: ['Minimum element', 'Median element', 'Maximum element', 'Random element'], correctAnswer: 2 },

  // DBMS
  { id: 'Q101', subject: 'DBMS', topic: 'Normalization',   difficulty: 'medium', marks: 2, text: 'A relation is in 3NF if it is in 2NF and has no:',                                    options: ['Partial dependency', 'Full dependency', 'Transitive dependency', 'Multivalued dependency'], correctAnswer: 2 },
  { id: 'Q102', subject: 'DBMS', topic: 'SQL',             difficulty: 'easy',   marks: 2, text: 'Which SQL clause is used to filter groups?',                                           options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],                          correctAnswer: 1 },
  { id: 'Q103', subject: 'DBMS', topic: 'Transactions',    difficulty: 'hard',   marks: 2, text: 'Which ACID property ensures that transactions execute completely or not at all?',       options: ['Consistency', 'Isolation', 'Durability', 'Atomicity'],              correctAnswer: 3 },
  { id: 'Q104', subject: 'DBMS', topic: 'Indexing',        difficulty: 'medium', marks: 2, text: 'Which index structure supports range queries efficiently?',                             options: ['Hash index', 'B+ Tree index', 'Bitmap index', 'Dense index'],       correctAnswer: 1 },
  { id: 'Q105', subject: 'DBMS', topic: 'ER Model',        difficulty: 'easy',   marks: 2, text: 'In an ER diagram, a diamond shape represents:',                                        options: ['Entity', 'Attribute', 'Relationship', 'Primary key'],               correctAnswer: 2 },

  // Operating Systems
  { id: 'Q201', subject: 'Operating Systems', topic: 'Scheduling',     difficulty: 'medium', marks: 2, text: 'Which scheduling algorithm can lead to starvation?',                         options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'SRTF'],               correctAnswer: 2 },
  { id: 'Q202', subject: 'Operating Systems', topic: 'Memory',         difficulty: 'medium', marks: 2, text: 'Which page replacement algorithm suffers from Belady\'s anomaly?',           options: ['Optimal', 'LRU', 'FIFO', 'LFU'],                                   correctAnswer: 2 },
  { id: 'Q203', subject: 'Operating Systems', topic: 'Deadlock',       difficulty: 'hard',   marks: 2, text: 'Which condition is NOT required for deadlock?',                               options: ['Mutual exclusion', 'Hold and wait', 'Pre-emption', 'Circular wait'], correctAnswer: 2 },
  { id: 'Q204', subject: 'Operating Systems', topic: 'Processes',      difficulty: 'easy',   marks: 2, text: 'A process in the "Blocked" state is waiting for:',                           options: ['CPU allocation', 'I/O completion', 'Memory allocation', 'Thread creation'], correctAnswer: 1 },

  // Computer Networks
  { id: 'Q301', subject: 'Computer Networks', topic: 'OSI Model',      difficulty: 'easy',   marks: 2, text: 'Which OSI layer is responsible for end-to-end error detection?',             options: ['Network layer', 'Data Link layer', 'Transport layer', 'Session layer'], correctAnswer: 2 },
  { id: 'Q302', subject: 'Computer Networks', topic: 'TCP/IP',         difficulty: 'medium', marks: 2, text: 'What does the "three-way handshake" establish?',                             options: ['A UDP connection', 'A TCP connection', 'An HTTP session', 'A DNS query'], correctAnswer: 1 },
  { id: 'Q303', subject: 'Computer Networks', topic: 'Routing',        difficulty: 'hard',   marks: 2, text: 'Which routing protocol uses the Dijkstra algorithm?',                        options: ['RIP', 'BGP', 'OSPF', 'EIGRP'],                                     correctAnswer: 2 },
  { id: 'Q304', subject: 'Computer Networks', topic: 'Addressing',     difficulty: 'easy',   marks: 2, text: 'How many bits are in an IPv4 address?',                                     options: ['16', '32', '64', '128'],                                            correctAnswer: 1 },

  // Cloud Computing
  { id: 'Q401', subject: 'Cloud Computing', topic: 'Service Models',   difficulty: 'easy',   marks: 2, text: 'Which cloud service model provides virtualised computing resources?',        options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],                                    correctAnswer: 2 },
  { id: 'Q402', subject: 'Cloud Computing', topic: 'Deployment',       difficulty: 'medium', marks: 2, text: 'A cloud environment used exclusively by one organisation is called:',        options: ['Public cloud', 'Hybrid cloud', 'Community cloud', 'Private cloud'], correctAnswer: 3 },
  { id: 'Q403', subject: 'Cloud Computing', topic: 'Auto Scaling',     difficulty: 'hard',   marks: 2, text: 'Which AWS service automatically adjusts EC2 capacity based on demand?',     options: ['Elastic Load Balancer', 'Auto Scaling Groups', 'CloudWatch', 'Lambda'], correctAnswer: 1 },
]

// ── Exam Attempts / Results ────────────────────────────────────
export const mockResults = [
  {
    id: 'R001',
    studentId: '24BCE1234',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 82,
    totalMarks: 100,
    percentage: 82,
    grade: 'A',
    timeTaken: 110,
    totalQuestions: 50,
    attempted: 50,
    correct: 41,
    wrong: 9,
    submittedAt: '2025-09-30T10:50:00',
    status: 'passed',
  },
  {
    id: 'R002',
    studentId: '24BCE1234',
    examId: 'EX005',
    examTitle: 'Cloud Computing — Internal Assessment 1',
    subject: 'Cloud Computing',
    score: 38,
    totalMarks: 50,
    percentage: 76,
    grade: 'B+',
    timeTaken: 42,
    totalQuestions: 25,
    attempted: 25,
    correct: 19,
    wrong: 6,
    submittedAt: '2025-09-12T10:42:00',
    status: 'passed',
  },
  {
    id: 'R003',
    studentId: '24BCE1001',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 91,
    totalMarks: 100,
    percentage: 91,
    grade: 'S',
    timeTaken: 108,
    totalQuestions: 50,
    attempted: 50,
    correct: 46,
    wrong: 4,
    submittedAt: '2025-09-30T10:48:00',
    status: 'passed',
  },
  {
    id: 'R004',
    studentId: '24BCE1003',
    examId: 'EX004',
    examTitle: 'Computer Networks — End Semester',
    subject: 'Computer Networks',
    score: 36,
    totalMarks: 100,
    percentage: 36,
    grade: 'F',
    timeTaken: 112,
    totalQuestions: 50,
    attempted: 48,
    correct: 18,
    wrong: 30,
    submittedAt: '2025-09-30T10:52:00',
    status: 'failed',
  },
]

// ── Notifications ──────────────────────────────────────────────
export const mockNotifications = [
  {
    id: 'N001',
    title: 'Exam Scheduled: Data Structures',
    message: 'Your Data Structures Mid Semester exam is scheduled for November 15 at 9:00 AM. Please be ready 15 minutes before.',
    type: 'info',
    read: false,
    createdAt: '2025-10-28T09:00:00',
  },
  {
    id: 'N002',
    title: 'Result Published: Cloud Computing IA1',
    message: 'Results for Cloud Computing Internal Assessment 1 are now available. You scored 76%. View your detailed report.',
    type: 'success',
    read: false,
    createdAt: '2025-09-14T10:00:00',
  },
  {
    id: 'N003',
    title: 'Exam Reminder: DBMS IA2',
    message: 'DBMS Internal Assessment 2 is scheduled in 3 days (November 18). Review the syllabus and exam pattern.',
    type: 'warning',
    read: true,
    createdAt: '2025-10-24T08:00:00',
  },
  {
    id: 'N004',
    title: 'Result Published: Computer Networks End Sem',
    message: 'Results for Computer Networks End Semester are now available. You scored 82% (Grade: A).',
    type: 'success',
    read: true,
    createdAt: '2025-10-02T11:00:00',
  },
  {
    id: 'N005',
    title: 'Operating Systems Quiz 3 — Active Now',
    message: 'OS Quiz 3 is now live and will be available for the next 30 minutes. Join immediately.',
    type: 'warning',
    read: true,
    createdAt: '2025-10-25T11:00:00',
  },
]

// ── Analytics (admin) ─────────────────────────────────────────
export const mockAnalytics = {
  overview: {
    totalStudents: 1847,
    totalExams: 24,
    activeExams: 1,
    completedExams: 18,
    avgScore: 71.4,
    examPassRate: 83.2,
    questionsInBank: 480,
    totalAttempts: 3920,
  },

  subjectStats: [
    { subject: 'Data Structures',   avgScore: 68.3, passRate: 78, totalAttempts: 920, color: '#4f46e5' },
    { subject: 'DBMS',              avgScore: 73.1, passRate: 85, totalAttempts: 780, color: '#0891b2' },
    { subject: 'Operating Systems', avgScore: 66.9, passRate: 74, totalAttempts: 860, color: '#059669' },
    { subject: 'Computer Networks', avgScore: 74.8, passRate: 88, totalAttempts: 720, color: '#d97706' },
    { subject: 'Cloud Computing',   avgScore: 71.2, passRate: 86, totalAttempts: 640, color: '#dc2626' },
  ],

  monthlyExams: [
    { month: 'Jun', exams: 2, students: 340 },
    { month: 'Jul', exams: 3, students: 520 },
    { month: 'Aug', exams: 4, students: 710 },
    { month: 'Sep', exams: 6, students: 980 },
    { month: 'Oct', exams: 5, students: 840 },
    { month: 'Nov', exams: 4, students: 530 },
  ],

  scoreDistribution: [
    { range: '0–39',   count: 186, label: 'Fail' },
    { range: '40–54',  count: 312, label: 'Pass' },
    { range: '55–69',  count: 698, label: 'Average' },
    { range: '70–84',  count: 1140, label: 'Good' },
    { range: '85–100', count: 584, label: 'Excellent' },
  ],

  weeklyActivity: [
    { day: 'Mon', attempts: 120 },
    { day: 'Tue', attempts: 280 },
    { day: 'Wed', attempts: 190 },
    { day: 'Thu', attempts: 340 },
    { day: 'Fri', attempts: 420 },
    { day: 'Sat', attempts: 90 },
    { day: 'Sun', attempts: 60 },
  ],
}

// ── Grade helper ──────────────────────────────────────────────
export const gradeFromPercentage = (pct) => {
  if (pct >= 90) return 'S'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'
  if (pct >= 50) return 'C'
  if (pct >= 40) return 'D'
  return 'F'
}
