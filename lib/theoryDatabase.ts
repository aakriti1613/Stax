// Theory Database - Static content for first units
// This provides reliable theory content without depending on Gemini API

export interface TheoryContent {
  title: string
  overview: string
  sections: Array<{
    heading: string
    content: string
    codeExample: string
    visualDescription: string
  }>
  keyTakeaways: string[]
}

type TheoryKey = `${string}-${string}-${string}` // subject-unit-subtopic

const theoryDatabase: Record<string, TheoryContent> = {
  // DSA - Arrays - Introduction
  'dsa-arrays-intro': {
    title: 'Introduction to Arrays',
    overview: 'Arrays are one of the most fundamental data structures in computer science. They allow you to store multiple values of the same type in a contiguous block of memory, making them efficient for accessing elements by index. In this section, you\'ll learn what arrays are, how they work, and why they\'re essential for programming.',
    sections: [
      {
        heading: 'What are Arrays?',
        content: `An array is a collection of elements of the same data type, stored in contiguous memory locations. Think of it like a row of lockers, where each locker has a number (index) and can hold one item.

**Key Characteristics:**
- **Fixed Size**: Once created, the size of an array is typically fixed (in some languages)
- **Indexed Access**: Elements are accessed using their position (index), starting from 0
- **Contiguous Memory**: All elements are stored next to each other in memory
- **Same Data Type**: All elements must be of the same type (in statically-typed languages)

**Why Arrays Matter:**
Arrays provide O(1) constant-time access to any element if you know its index. This makes them incredibly fast for lookups and essential for many algorithms.`,
        codeExample: `// Creating an array in different languages

// C++
int numbers[5] = {1, 2, 3, 4, 5};
int first = numbers[0];  // Access first element (index 0)

// Java
int[] numbers = {1, 2, 3, 4, 5};
int first = numbers[0];

// Python
numbers = [1, 2, 3, 4, 5]
first = numbers[0]  # Access first element`,
        visualDescription: 'Visual: Imagine a row of numbered boxes (0, 1, 2, 3, 4), each containing a value. When you access array[2], you directly go to box number 2.'
      },
      {
        heading: 'Array Indexing and Memory Layout',
        content: `Understanding how arrays are stored in memory is crucial for understanding their efficiency.

**Memory Layout:**
- Arrays are stored in contiguous (adjacent) memory locations
- If an integer takes 4 bytes, and you have an array of 5 integers starting at memory address 1000:
  - Index 0: Address 1000
  - Index 1: Address 1004
  - Index 2: Address 1008
  - Index 3: Address 1012
  - Index 4: Address 1016

**Why This Matters:**
Because elements are stored contiguously, the computer can calculate the exact memory address of any element using a simple formula:
\`\`\`
address = base_address + (index × size_of_element)
\`\`\`

This is why array access is O(1) - it's just simple arithmetic!`,
        codeExample: `// Demonstrating array indexing

int arr[5] = {10, 20, 30, 40, 50};

// Accessing elements
cout << arr[0] << endl;  // Output: 10
cout << arr[2] << endl;  // Output: 30
cout << arr[4] << endl;  // Output: 50

// Common mistake: accessing out of bounds
// cout << arr[5] << endl;  // ERROR! Index out of bounds`,
        visualDescription: 'Visual: A memory diagram showing consecutive memory addresses with array elements. Arrows show how index 0 maps to the first address, index 1 to the next, etc.'
      },
      {
        heading: 'Common Array Operations',
        content: `Arrays support several fundamental operations, each with different time complexities:

**1. Access (Read)**
- **Time Complexity**: O(1) - Constant time
- Direct access using index
- \`element = array[index]\`

**2. Update (Modify)**
- **Time Complexity**: O(1) - Constant time
- Direct modification using index
- \`array[index] = new_value\`

**3. Search (Find Element)**
- **Time Complexity**: O(n) - Linear time
- Must check each element until found
- Worst case: element not found, check all n elements

**4. Insertion**
- **Time Complexity**: O(n) - Linear time
- Must shift elements to make space
- Inserting at beginning requires shifting all elements

**5. Deletion**
- **Time Complexity**: O(n) - Linear time
- Must shift elements to fill the gap
- Deleting from beginning requires shifting all elements`,
        codeExample: `// Common array operations

int arr[5] = {1, 2, 3, 4, 5};

// 1. Access
int value = arr[2];  // O(1)

// 2. Update
arr[2] = 99;  // O(1)

// 3. Search (linear search)
int target = 3;
bool found = false;
for (int i = 0; i < 5; i++) {
    if (arr[i] == target) {
        found = true;
        break;
    }
}  // O(n)

// 4. Insert at position (requires shifting)
// This is simplified - actual insertion needs dynamic array
int pos = 2;
int newValue = 10;
// Shift elements right
for (int i = 4; i > pos; i--) {
    arr[i] = arr[i-1];
}
arr[pos] = newValue;  // O(n)`,
        visualDescription: 'Visual: Animated diagram showing each operation - access (instant arrow), search (scanning through elements), insertion (shifting elements right), deletion (shifting elements left).'
      },
      {
        heading: 'Advantages and Disadvantages',
        content: `Understanding when to use arrays is as important as knowing how they work.

**Advantages:**
- ✅ **Fast Access**: O(1) time to access any element by index
- ✅ **Memory Efficient**: No extra overhead, just the data
- ✅ **Cache Friendly**: Contiguous memory improves cache performance
- ✅ **Simple**: Easy to understand and implement
- ✅ **Predictable**: Fixed size makes memory usage predictable

**Disadvantages:**
- ❌ **Fixed Size**: Cannot easily resize (in many languages)
- ❌ **Slow Insertion/Deletion**: O(n) time, requires shifting
- ❌ **Memory Waste**: If array is larger than needed, memory is wasted
- ❌ **No Dynamic Growth**: Cannot add elements beyond initial size easily

**When to Use Arrays:**
- When you know the size in advance
- When you need fast random access
- When you're doing mostly read operations
- For implementing other data structures (stacks, queues, etc.)`,
        codeExample: `// Arrays are perfect for:
// 1. Storing fixed-size collections
int scores[10];  // Store 10 test scores

// 2. Lookup tables
char grades[5] = {'A', 'B', 'C', 'D', 'F'};
char grade = grades[scoreIndex];  // Fast lookup

// 3. Implementing other structures
int stack[100];
int top = -1;

void push(int value) {
    stack[++top] = value;  // Using array as stack
}`,
        visualDescription: 'Visual: A comparison chart showing arrays vs other data structures, highlighting speed of access but limitations in flexibility.'
      },
      {
        heading: 'Real-World Applications',
        content: `Arrays are everywhere in programming! Here are some common use cases:

**1. Image Processing**
- Pixels in an image are stored as arrays
- Each pixel has RGB values: \`pixel[row][col] = {r, g, b}\`

**2. Game Development**
- Player inventory: \`items[10]\`
- High scores: \`scores[100]\`
- Game board: \`board[8][8]\` for chess

**3. Data Analysis**
- Temperature readings: \`temperatures[365]\` for daily data
- Stock prices: \`prices[252]\` for trading days

**4. System Programming**
- Buffer management
- Memory allocation
- Process scheduling queues

**5. Algorithm Implementation**
- Sorting algorithms work on arrays
- Dynamic programming uses arrays for memoization
- Graph representations (adjacency matrices)`,
        codeExample: `// Real-world example: Temperature tracking

float temperatures[7];  // Store weekly temperatures

// Input temperatures
for (int i = 0; i < 7; i++) {
    cin >> temperatures[i];
}

// Calculate average
float sum = 0;
for (int i = 0; i < 7; i++) {
    sum += temperatures[i];
}
float average = sum / 7;

// Find maximum
float max = temperatures[0];
for (int i = 1; i < 7; i++) {
    if (temperatures[i] > max) {
        max = temperatures[i];
    }
}`,
        visualDescription: 'Visual: Examples of arrays in real applications - image pixels, game boards, data charts, showing how arrays are the foundation of many systems.'
      }
    ],
    keyTakeaways: [
      'Arrays store elements of the same type in contiguous memory locations',
      'Array access by index is O(1) - extremely fast constant time',
      'Arrays have fixed size in most languages, making them memory-efficient but less flexible',
      'Insertion and deletion operations are O(n) because they require shifting elements',
      'Arrays are the foundation for many other data structures and algorithms'
    ]
  }
}

/**
 * Get theory content for a specific subject, unit, and subtopic
 * Handles both subtopic names and IDs
 */
export function getTheoryForSubtopic(
  subject: string,
  unit: string,
  subtopic: string
): TheoryContent | null {
  // Normalize keys: convert to lowercase and replace spaces/special chars
  let normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-')
  const normalizedUnit = unit.toLowerCase().replace(/\s+/g, '-')
  let normalizedSubtopic = subtopic.toLowerCase().replace(/\s+/g, '-')
  
  // Handle subject name variations
  if (normalizedSubject.includes('data-structures') || normalizedSubject.includes('dsa')) {
    normalizedSubject = 'dsa'
  }
  
  // Handle subtopic name variations - map common names to IDs
  const subtopicMappings: Record<string, string> = {
    'introduction-to-arrays': 'intro',
    'introduction': 'intro',
    'intro': 'intro',
    'array-operations': 'operations',
    'operations': 'operations',
    'searching-in-arrays': 'searching',
    'searching': 'searching',
    'sorting-arrays': 'sorting',
    'sorting': 'sorting'
  }
  
  // Try to map the subtopic name to an ID
  if (subtopicMappings[normalizedSubtopic]) {
    normalizedSubtopic = subtopicMappings[normalizedSubtopic]
  }
  
  // Try with the mapped ID first
  let key = `${normalizedSubject}-${normalizedUnit}-${normalizedSubtopic}` as TheoryKey
  let theory = theoryDatabase[key]
  
  // If not found, try with the original normalized name
  if (!theory) {
    const originalSubtopic = subtopic.toLowerCase().replace(/\s+/g, '-')
    key = `${normalizedSubject}-${normalizedUnit}-${originalSubtopic}` as TheoryKey
    theory = theoryDatabase[key]
  }
  
  return theory || null
}

/**
 * Check if theory exists for a subtopic
 */
export function hasTheoryForSubtopic(
  subject: string,
  unit: string,
  subtopic: string
): boolean {
  return getTheoryForSubtopic(subject, unit, subtopic) !== null
}

/**
 * Get all available theory topics
 */
export function getAllTheoryTopics(): Array<{ subject: string; unit: string; subtopic: string }> {
  return Object.keys(theoryDatabase).map(key => {
    const parts = key.split('-')
    return {
      subject: parts[0],
      unit: parts[1],
      subtopic: parts.slice(2).join('-')
    }
  })
}

