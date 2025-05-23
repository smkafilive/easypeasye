// Faculty data
const facultyData = {
    "CSE": [
        "Fazle Rabby, Assistant Professor & Head",
        "Fazle Rabbi Rushu, Assistant Professor",
        "Afrin Jahan Chowdhury, Lecturer",
        "Md. Rafiuzzaman, Lecturer",
        "Afia Farzana, Lecturer",
        "MD. Abdul Hye, Professor & Dean, Engineering Faculty"
    ],
    "EEE": [
        "Junaid Bin Fakhrul Islam, Assistant Professor & Head",
        "Md. Hasanuzzaman, Assistant Professor",
        "Md. Al-Arman Chowdhury Asif, Lecturer",
        "Sheikh Md. Shafiqul Islam, Lecturer"
    ],
    "BBA": [
        "Rashel Sheikh, Associate Professor & Dean",
        "Md. Maksodul Haque Sawrov, Assistant Professor & Head",
        "Md. Tareq Hasan, Assistant Professor",
        "Md. Mirajul Islam, Assistant Professor",
        "Bithi Rani Debnath, Lecturer"
    ],
    "LAW": [
        "G.M. Ikramul Kabir, Assistant Professor & Head",
        "Hadiuzzaman, Assistant Professor",
        "Md. Taibur Rahman, Lecturer",
        "Tangila Yasmeen, Lecturer",
        "Happy Akter, Lecturer",
        "Mubtasim Alam Musavee, Lecturer"
    ],
    "English": [
        "Md. Amirul Mumeneen, Associate Professor & Head",
        "Md. Shaon Akter, Assistant Professor",
        "Mst. Tanna Khatun, Assistant Professor",
        "Md. Naymul Islam, Lecturer"
    ],
    "Economics": [
        "Md. Minhaz Uddin, Assistant Professor & Head",
        "Md. Hasanur Rahman, Lecturer"
    ],
    "Political Science": [
        "Sidratul Montaha, Assistant Professor & Head",
        "Afroza Yasmin Mitu, Lecturer",
        "Dil Noshina Jannat, Lecturer",
        "Md. Mehabub Hasan, Lecturer"
    ]
};

// Department full names
const departmentFullNames = {
    "CSE": "Computer Science & Engineering",
    "EEE": "Electrical & Electronic Engineering",
    "BBA": "Business Administration",
    "LAW": "Law",
    "Economics": "Economics",
    "English": "English",
    "Political Science": "Political Science"
};

// DOM elements
const departmentSelect = document.getElementById('department');
const submittedToSelect = document.getElementById('submittedTo');
const customFacultyInput = document.getElementById('customFaculty');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const coverPage = document.getElementById('coverPage');

// Form display elements
const reportTypeDisplay = document.getElementById('reportTypeDisplay');
const reportTitleDisplay = document.getElementById('reportTitleDisplay');
const courseTitleDisplay = document.getElementById('courseTitleDisplay');
const courseCodeDisplay = document.getElementById('courseCodeDisplay');
const submittedToDisplay = document.getElementById('submittedToDisplay');
const facultyDeptDisplay = document.getElementById('facultyDeptDisplay');
const studentNameDisplay = document.getElementById('studentNameDisplay');
const studentIdDisplay = document.getElementById('studentIdDisplay');
const batchDisplay = document.getElementById('batchDisplay');
const studentDeptDisplay = document.getElementById('studentDeptDisplay');
const submissionDateDisplay = document.getElementById('submissionDateDisplay');

// Initialize date picker with today's date
document.getElementById('submissionDate').valueAsDate = new Date();

// Department change event
departmentSelect.addEventListener('change', function() {
    const selectedDept = this.value;
    submittedToSelect.innerHTML = '';
    submittedToSelect.disabled = !selectedDept;
    customFacultyInput.style.display = 'none';
    
    if (selectedDept) {
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Faculty';
        submittedToSelect.appendChild(defaultOption);
        
        // Add faculty options
        facultyData[selectedDept].forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty;
            option.textContent = faculty;
            submittedToSelect.appendChild(option);
        });
        
        // Add custom option
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Custom Faculty';
        submittedToSelect.appendChild(customOption);
    }
});

// Submitted To change event
submittedToSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
        customFacultyInput.style.display = 'block';
        customFacultyInput.value = '';
    } else {
        customFacultyInput.style.display = 'none';
    }
});

// Generate cover page
generateBtn.addEventListener('click', function() {
    // Get form values
    const reportType = document.getElementById('reportType').value;
    const reportTitle = document.getElementById('reportTitle').value;
    const courseTitle = document.getElementById('courseTitle').value;
    const courseCode = document.getElementById('courseCode').value;
    const department = document.getElementById('department').value;
    const submittedTo = submittedToSelect.value === 'custom' ? customFacultyInput.value : submittedToSelect.value;
    const studentName = document.getElementById('studentName').value;
    const studentId = document.getElementById('studentId').value;
    const batch = document.getElementById('batch').value;
    const studentDept = document.getElementById('studentDept').value;
    const submissionDate = document.getElementById('submissionDate').value;
    
    // Validate required fields
    if (!reportTitle || !courseTitle || !courseCode || !department || !submittedTo || !studentName || !studentId || !batch || !submissionDate) {
        alert('Please fill all required fields!');
        return;
    }
    
    // Format date
    const dateObj = new Date(submissionDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update cover page
    reportTypeDisplay.textContent = reportType;
    reportTitleDisplay.textContent = reportTitle;
    courseTitleDisplay.textContent = `Course Title: ${courseTitle}`;
    courseCodeDisplay.textContent = `Course Code: ${courseCode}`;
    submittedToDisplay.textContent = submittedTo;
    facultyDeptDisplay.textContent = `Department of ${departmentFullNames[department]}, SFMU`;
    studentNameDisplay.textContent = `Name: ${studentName}`;
    studentIdDisplay.textContent = `ID: ${studentId}`;
    batchDisplay.textContent = `Batch: ${batch}`;
    studentDeptDisplay.textContent = `Department of ${departmentFullNames[studentDept]}`;
    submissionDateDisplay.textContent = `Date: ${formattedDate}`;
    
    // Enable download button
    downloadBtn.disabled = false;
    
    // Scroll to preview
    coverPage.scrollIntoView({ behavior: 'smooth' });
});

// Download as PDF
downloadBtn.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Use html2canvas to capture the cover page
    html2canvas(coverPage, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('SFMU_Cover_Page.pdf');
    });
});

// Animation on scroll
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.form-group, .cover-page, footer');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initial animation trigger
window.dispatchEvent(new Event('scroll'));