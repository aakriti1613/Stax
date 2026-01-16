export type Subject = 'cpp' | 'java' | 'python' | 'dsa' | 'oops' | 'dbms'

export interface Unit {
  id: string
  name: string
  description: string
  locked: boolean
  completed: boolean
  xpReward: number
}

export interface SubjectConfig {
  id: Subject
  name: string
  icon: string
  color: string
  units: Unit[]
}

export const SUBJECTS: Record<Subject, SubjectConfig> = {
  cpp: {
    id: 'cpp',
    name: 'C++ Fundamentals',
    icon: '⚡',
    color: 'neon-cyan',
    units: [
      { id: 'variables', name: 'Variables & Data Types', description: 'Learn the basics', locked: false, completed: false, xpReward: 100 },
      { id: 'control-flow', name: 'Control Flow', description: 'If, loops, switches', locked: true, completed: false, xpReward: 150 },
      { id: 'functions', name: 'Functions', description: 'Reusable code blocks', locked: true, completed: false, xpReward: 150 },
      { id: 'pointers', name: 'Pointers & References', description: 'Memory management', locked: true, completed: false, xpReward: 200 },
      { id: 'classes', name: 'Classes & Objects', description: 'OOP in C++', locked: true, completed: false, xpReward: 200 },
    ],
  },
  java: {
    id: 'java',
    name: 'Java Fundamentals',
    icon: '☕',
    color: 'neon-purple',
    units: [
      { id: 'basics', name: 'Java Basics', description: 'Syntax and structure', locked: false, completed: false, xpReward: 100 },
      { id: 'oop', name: 'OOP Concepts', description: 'Classes, inheritance', locked: true, completed: false, xpReward: 200 },
      { id: 'collections', name: 'Collections Framework', description: 'Lists, maps, sets', locked: true, completed: false, xpReward: 200 },
      { id: 'exceptions', name: 'Exception Handling', description: 'Error management', locked: true, completed: false, xpReward: 150 },
    ],
  },
  python: {
    id: 'python',
    name: 'Python Fundamentals',
    icon: '🐍',
    color: 'neon-green',
    units: [
      { id: 'basics', name: 'Python Basics', description: 'Syntax and types', locked: false, completed: false, xpReward: 100 },
      { id: 'data-structures', name: 'Data Structures', description: 'Lists, dicts, tuples', locked: true, completed: false, xpReward: 150 },
      { id: 'functions', name: 'Functions & Modules', description: 'Code organization', locked: true, completed: false, xpReward: 150 },
      { id: 'oop', name: 'OOP in Python', description: 'Classes and objects', locked: true, completed: false, xpReward: 200 },
    ],
  },
  dsa: {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: '🔢',
    color: 'neon-pink',
    units: [
      { id: 'arrays', name: 'Arrays', description: 'Linear data structures', locked: false, completed: false, xpReward: 150 },
      { id: 'linked-lists', name: 'Linked Lists', description: 'Dynamic structures', locked: true, completed: false, xpReward: 200 },
      { id: 'trees', name: 'Trees', description: 'Hierarchical data', locked: true, completed: false, xpReward: 250 },
      { id: 'sorting', name: 'Sorting Algorithms', description: 'Efficient ordering', locked: true, completed: false, xpReward: 200 },
      { id: 'searching', name: 'Searching Algorithms', description: 'Finding data', locked: true, completed: false, xpReward: 200 },
    ],
  },
  oops: {
    id: 'oops',
    name: 'Object-Oriented Programming',
    icon: '🎯',
    color: 'neon-blue',
    units: [
      { id: 'classes', name: 'Classes & Objects', description: 'Fundamentals', locked: false, completed: false, xpReward: 150 },
      { id: 'inheritance', name: 'Inheritance', description: 'Code reuse', locked: true, completed: false, xpReward: 200 },
      { id: 'polymorphism', name: 'Polymorphism', description: 'Many forms', locked: true, completed: false, xpReward: 200 },
      { id: 'encapsulation', name: 'Encapsulation', description: 'Data hiding', locked: true, completed: false, xpReward: 150 },
      { id: 'abstraction', name: 'Abstraction', description: 'Simplified interfaces', locked: true, completed: false, xpReward: 200 },
    ],
  },
  dbms: {
    id: 'dbms',
    name: 'Database Management Systems',
    icon: '🗄️',
    color: 'neon-cyan',
    units: [
      { id: 'introduction', name: 'DBMS Introduction', description: 'Basics of databases', locked: false, completed: false, xpReward: 100 },
      { id: 'sql', name: 'SQL Fundamentals', description: 'Query language', locked: true, completed: false, xpReward: 200 },
      { id: 'normalization', name: 'Normalization', description: 'Database design', locked: true, completed: false, xpReward: 250 },
      { id: 'transactions', name: 'Transactions', description: 'ACID properties', locked: true, completed: false, xpReward: 200 },
      { id: 'indexing', name: 'Indexing', description: 'Performance optimization', locked: true, completed: false, xpReward: 200 },
    ],
  },
}


