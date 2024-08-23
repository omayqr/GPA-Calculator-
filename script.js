const levelSelect = document.getElementById('level');
const semesterSelect = document.getElementById('semester');
const coursesContainer = document.getElementById('coursesContainer');
const calculateBtn = document.getElementById('calculateBtn');
const saveSemesterBtn = document.getElementById('saveSemesterBtn');
const resultDiv = document.getElementById('result');
const savedGPAsDiv = document.getElementById('savedGPAs');
const calculateOverallBtn = document.getElementById('calculateOverallBtn');
const manualGPAInput = document.getElementById('manualGPA');
const saveManualGPABtn = document.getElementById('saveManualGPABtn');
const manualGPAContainer = document.getElementById('manualGPAContainer');
const exitBtn = document.getElementById('exitBtn');
const resetBtn = document.getElementById('resetBtn');

const courses = {
  1: [
    [
      { name: 'Anatomy I', credits: 3 },
      { name: 'Histology I', credits: 3 },
      { name: 'Embryology I', credits: 2.5 },
      { name: 'Biochemistry I', credits: 5 }
    ],
    [
      { name: 'Anatomy II', credits: 3 },
      { name: 'Histology II', credits: 3 },
      { name: 'Embryology II', credits: 2.5 },
      { name: 'Biochemistry II', credits: 5 },
      { name: 'Public health', credits: 1.5 }
    ]
  ],
  2: [
    [
      { name: 'Parasitology', credits: 4 },
      { name: 'Physiology I', credits: 5.5 },
      { name: 'Anatomy III', credits: 3 },
      { name: 'Environment', credits: 3 }
    ],
    [
      { name: 'Microbiology', credits: 4.5 },
      { name: 'Physiology II', credits: 5.5 },
      { name: 'Health statistics', credits: 3 },
      { name: 'Genetics', credits: 3 },
      { name: 'Psychology I', credits: 3 }
    ]
  ],
  3: [
    [
      { name: 'Pathology I', credits: 3 },
      { name: 'Pharmacology I', credits: 2 },
      { name: 'Propedeutic I', credits: 6.5 },
      { name: 'Epidemiology', credits: 4 },
      { name: 'Psychology II', credits: 3 }
    ],
    [
      { name: 'Pathology II', credits: 3 },
      { name: 'Pharmacology II', credits: 2 },
      { name: 'Propedeutic II', credits: 6.5 },
      { name: 'Health management', credits: 3 },
      { name: 'Clinical laboratory', credits: 4 }
    ]
  ],
  4: [
    [
      { name: 'Dermatology', credits: 4.5 },
      { name: 'Pharmacology III', credits: 2 },
      { name: 'Internal medicine I', credits: 7.5 },
      { name: 'Surgery I', credits: 5.5 },
      { name: 'Radiology', credits: 3 }
    ],
    [
      { name: 'Psychiatry', credits: 4.5 },
      { name: 'Medical ethics', credits: 1.5 },
      { name: 'Internal medicine II', credits: 9 },
      { name: 'Surgery II', credits: 6.5 }
    ]
  ],
  5: [
    [
      { name: 'E.N.T', credits: 3.5 },
      { name: 'Ophthalmology', credits: 3.5 },
      { name: 'Orthopedic', credits: 5 },
      { name: 'Urology', credits: 4.5 }
    ],
    [
      { name: 'Forensic medicine', credits: 3 },
      { name: 'Gynecology', credits: 13 },
      { name: 'Pediatric', credits: 13.5 }
    ]
  ],
  6: [
    [
      { name: 'Internal medicine III', credits: 16.5 },
      { name: 'General Surgery III', credits: 16.5 }
    ],
    [
      { name: 'Gynecology', credits: 16.5 },
      { name: 'Pediatric', credits: 16.5 }
    ]
  ]
};

let savedGPAs = [];

function renderCourses(level, semester) {
  coursesContainer.innerHTML = '';

  if (level && semester) {
    const levelCourses = courses[level][semester - 1];

    levelCourses.forEach(course => {
      const div = document.createElement('div');
      div.className = 'course-input';
      const label = document.createElement('label');
      const input = document.createElement('input');

      label.textContent = `${course.name} (${course.credits} credits)`;
      input.type = 'number';
      input.placeholder = 'Enter grade';
      input.min = 0;
      input.max = 100;

      div.appendChild(label);
      div.appendChild(input);
      coursesContainer.appendChild(div);
    });
  }
}

function calculateGPA() {
  const level = parseInt(levelSelect.value);
  const semester = parseInt(semesterSelect.value);
  const selectedCourses = courses[level][semester - 1];
  let totalCredits = 0;
  let totalGradePoints = 0;

  const grades = Array.from(coursesContainer.querySelectorAll('input')).map(input => {
    const grade = parseFloat(input.value);
    const course = selectedCourses.find(c => c.name === input.previousElementSibling.textContent.split('(')[0].trim());
    totalCredits += course.credits;
    totalGradePoints += grade * course.credits;
    return grade;
  });

  const gpa = totalGradePoints / totalCredits;

  let encouragingMessage;
  if (gpa >= 90) {
    encouragingMessage = 'Excellent! Keep up the great work!';
  } else if (gpa >= 80) {
    encouragingMessage = 'Well done! Your hard work is paying off.';
  } else if (gpa >= 70) {
    encouragingMessage = 'Good job! Keep pushing forward.';
  } else if (gpa >= 65) {
    encouragingMessage = 'You can do better. Don\'t give up!';
  } else {
    encouragingMessage = 'Keep trying, and you\'ll get there.';
  }

  resultDiv.textContent = `Your GPA: ${gpa.toFixed(2)} ${encouragingMessage}`;

  saveSemesterBtn.disabled = false;
  calculateOverallBtn.disabled = false;
}

function saveSemesterGPA() {
  const level = parseInt(levelSelect.value);
  const semester = parseInt(semesterSelect.value);
  const gpa = parseFloat(resultDiv.textContent.split(':')[1].split(' ')[1]);

  const existingIndex = savedGPAs.findIndex(saved => saved.level === level && saved.semester === semester);

  if (existingIndex !== -1) {
    savedGPAs[existingIndex] = { level, semester, gpa };
  } else {
    savedGPAs.push({ level, semester, gpa });
  }

  updateSavedGPAsDisplay();
  saveSemesterBtn.disabled = true;
}

function updateSavedGPAsDisplay() {
  savedGPAsDiv.innerHTML = '';
  savedGPAs.forEach(saved => {
    savedGPAsDiv.innerHTML += `<p>Level ${saved.level}, Semester ${saved.semester}: ${saved.gpa.toFixed(2)}</p>`;
  });
}

function calculateOverallGPA() {
  let totalCredits = 0;
  let totalGradePoints = 0;

  savedGPAs.forEach(({ level, semester, gpa }) => {
    const selectedCourses = courses[level][semester - 1];
    const semesterCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCredits += semesterCredits;
    totalGradePoints += gpa * semesterCredits;
  });

  const overallGPA = totalGradePoints / totalCredits;
  resultDiv.textContent = `Your Overall GPA: ${overallGPA.toFixed(2)}`;
}

function saveFinalGPA() {
  const level = parseInt(levelSelect.value);
  const semester = parseInt(semesterSelect.value);
  const finalGPA = parseFloat(manualGPAInput.value);

  if (finalGPA >= 0 && finalGPA <= 100) {
    const existingIndex = savedGPAs.findIndex(saved => saved.level === level && saved.semester === semester);

    if (existingIndex !== -1) {
      savedGPAs[existingIndex] = { level, semester, gpa: finalGPA };
    } else {
      savedGPAs.push({ level, semester, gpa: finalGPA });
    }

    updateSavedGPAsDisplay();

    manualGPAInput.value = '';
    saveSemesterBtn.disabled = true;
    calculateOverallBtn.disabled = false;
  } else {
    alert('Please enter a valid GPA between 0 and 100.');
  }
}

function toggleManualGPAContainer() {
  const level = parseInt(levelSelect.value);
  const semester = parseInt(semesterSelect.value);

  if (level && semester) {
    manualGPAContainer.style.display = 'block';
  } else {
    manualGPAContainer.style.display = 'none';
  }
}

function resetAll() {
  levelSelect.value = '';
  semesterSelect.value = '';
  coursesContainer.innerHTML = '';
  resultDiv.textContent = '';
  savedGPAsDiv.innerHTML = '';
  savedGPAs = [];
  manualGPAInput.value = '';
  saveSemesterBtn.disabled = true;
  calculateOverallBtn.disabled = true;
  manualGPAContainer.style.display = 'none';
}

levelSelect.addEventListener('change', () => {
  renderCourses(levelSelect.value, semesterSelect.value);
  saveSemesterBtn.disabled = true;
  calculateOverallBtn.disabled = true;
  toggleManualGPAContainer();
});

semesterSelect.addEventListener('change', () => {
  renderCourses(levelSelect.value, semesterSelect.value);
  saveSemesterBtn.disabled = true;
  calculateOverallBtn.disabled = true;
  toggleManualGPAContainer();
});

calculateBtn.addEventListener('click', calculateGPA);
saveSemesterBtn.addEventListener('click', saveSemesterGPA);
calculateOverallBtn.addEventListener('click', calculateOverallGPA);
saveManualGPABtn.addEventListener('click', saveFinalGPA);
resetBtn.addEventListener('click', resetAll);
exitBtn.addEventListener('click', () => window.close());