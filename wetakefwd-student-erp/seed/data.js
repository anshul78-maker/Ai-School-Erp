// All the starting data for the app. On first run this is loaded into the
// database. Edit these values to change what the student sees, or add more
// students to the `students` array.

export const students = [
  {
    username: "priya",
    password: "priya123", // hashed automatically on first run
    name: "Priya Sharma",
    className: "Class 8-A",
    roll: 14,
    level: 7,
    xp: 640,
    xpToNext: 900,
    streak: 12,
    overall: 78,
    attendance: 94,
    homeworkDone: 18,
    homeworkTotal: 20,
    rank: 9,
    classSize: 42,
    insight:
      "Your algebra is now near the top of the class — brilliant jump. But chemistry equations are pulling your science score down. If you spend 20 minutes a day on balancing equations this week, you should cross 60%.",
    skills: [
      { topic: "Algebra", score: 88, level: "strong" },
      { topic: "Reading comprehension", score: 82, level: "strong" },
      { topic: "Geometry — theorems", score: 54, level: "work" },
      { topic: "Chemistry — equations", score: 41, level: "weak" }
    ],
    trend: [
      ["Apr", 62], ["Jun", 66], ["Aug", 65],
      ["Oct", 71], ["Dec", 74], ["Feb", 78]
    ],
    subjects: [
      { name: "Mathematics", color: "var(--violet)", score: 80, dir: "up",
        topics: [["Algebra", 88], ["Arithmetic", 82], ["Geometry", 54]] },
      { name: "Science", color: "var(--teal)", score: 72, dir: "up",
        topics: [["Biology", 78], ["Physics", 70], ["Chemistry", 41]] },
      { name: "English", color: "var(--sky)", score: 82, dir: "up",
        topics: [["Reading", 84], ["Grammar", 80], ["Writing", 79]] },
      { name: "Social Studies", color: "var(--amber)", score: 74, dir: "down",
        topics: [["History", 77], ["Geography", 72], ["Civics", 73]] }
    ],
    tasks: [
      { text: "Revise geometry theorems 1 & 2", meta: "10 min", xp: 15, done: 1 },
      { text: "Practice 5 chemistry equations", meta: "20 min", xp: 30, done: 0 },
      { text: "Finish Math homework (due tomorrow)", meta: "pending", xp: 25, done: 0 },
      { text: "Read English chapter 6", meta: "15 min", xp: 20, done: 0 }
    ],
    timetable: [
      ["08:30", "Mathematics", "Algebra — quadratic equations", "var(--violet)"],
      ["09:30", "Science", "Chemistry — balancing equations", "var(--teal)"],
      ["10:45", "English", "Chapter 6 discussion", "var(--sky)"],
      ["11:45", "Games", "Football practice", "var(--coral)"],
      ["13:30", "Social Studies", "The Mughal empire", "var(--amber)"]
    ],
    exams: [
      ["Science unit test", "in 3 days", "rose"],
      ["English essay", "Friday", "amber"],
      ["Math quiz", "next Tuesday", "sky"]
    ],
    badges: [
      ["Fast starter", "7-day streak", "trophy", "var(--coral)", 1],
      ["Math whiz", "Top 10 in Algebra", "target", "var(--violet)", 1],
      ["Bookworm", "Read 10 chapters", "book", "var(--sky)", 1],
      ["Perfect week", "5/5 homework", "check", "var(--teal)", 1],
      ["Science star", "90% in a test", "spark", "var(--amber)", 0],
      ["Marathon", "30-day streak", "flame", "var(--rose)", 0]
    ],
    week: [["M", 1], ["T", 1], ["W", 1], ["T", 1], ["F", 1], ["S", 1], ["S", 0]],
    leaderboard: [
      [7, "Rahul Jain", "RJ", "var(--sky)", 712, 0],
      [8, "Meera Nair", "MN", "var(--teal)", 676, 0],
      [9, "Priya Sharma", "PS", "var(--violet)", 640, 1],
      [10, "Arjun Rao", "AR", "var(--amber)", 604, 0],
      [11, "Sara Ali", "SA", "var(--coral)", 588, 0]
    ]
  }
];
