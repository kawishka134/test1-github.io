// Store data in localStorage
let videoList = JSON.parse(localStorage.getItem('videos')) || [];
let studentList = JSON.parse(localStorage.getItem('students')) || [];

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        console.log('Login attempt:', { username, password, email, phone }); // Debugging line
        
        // Teacher login
        if (username === "Manjula" && password === "13755") {
            console.log('Teacher login successful'); // Debugging line
            localStorage.setItem('userType', 'teacher');
            window.location.href = "teacher-dashboard.html";
            return;
        }
        
        // Student login
        if (email && phone) {
            console.log('Student login attempt'); // Debugging line
            const student = {
                email: email,
                phone: phone,
                registrationDate: new Date().toISOString()
            };
            
            // Add student to list if not already registered
            if (!studentList.some(s => s.email === email)) {
                studentList.push(student);
                localStorage.setItem('students', JSON.stringify(studentList));
            }
            
            localStorage.setItem('userType', 'student');
            localStorage.setItem('currentStudent', email);
            window.location.href = "student-dashboard.html";
            return;
        }
        
        // Invalid login
        console.log('Invalid login'); // Debugging line
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = "Invalid login details! Please check your credentials.";
            errorMessage.style.display = 'block';
        }
    });
}

// Video form handling
const videoForm = document.getElementById('videoForm');
if (videoForm) {
    videoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = document.getElementById('videoTitle').value.trim();
        const url = document.getElementById('videoUrl').value.trim();
        
        // Add new video
        const video = {
            title: title,
            url: url,
            uploadDate: new Date().toISOString()
        };
        
        videoList.push(video);
        localStorage.setItem('videos', JSON.stringify(videoList));
        
        alert("Video added successfully!");
        this.reset();
        loadTeacherDashboard();
    });
}

// Load teacher dashboard content
function loadTeacherDashboard() {
    const videoListElement = document.getElementById('teacherVideoList');
    const studentListElement = document.getElementById('studentList');
    
    if (videoListElement) {
        videoListElement.innerHTML = '';
        videoList.forEach((video, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${video.title}</strong>
                <br>URL: <a href="${video.url}" target="_blank">${video.url}</a>
                <br>Uploaded: ${new Date(video.uploadDate).toLocaleDateString()}
                <button onclick="deleteVideo(${index})" style="width: auto; padding: 5px 10px; margin-left: 10px;">Delete</button>
            `;
            videoListElement.appendChild(li);
        });
    }
    
    if (studentListElement) {
        studentListElement.innerHTML = '';
        studentList.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Email:</strong> ${student.email}
                <br><strong>Phone:</strong> ${student.phone}
                <br><strong>Registered:</strong> ${new Date(student.registrationDate).toLocaleDateString()}
            `;
            studentListElement.appendChild(li);
        });
    }
}

// Load student dashboard content
function loadStudentDashboard() {
    const videoListElement = document.getElementById('videoList');
    if (videoListElement) {
        videoListElement.innerHTML = '';
        videoList.forEach(video => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${video.title}</strong>
                <br><a href="${video.url}" target="_blank">Watch Video</a>
                <br>Added: ${new Date(video.uploadDate).toLocaleDateString()}
            `;
            videoListElement.appendChild(li);
        });
    }
}

// Delete video function
function deleteVideo(index) {
    if (confirm('Are you sure you want to delete this video?')) {
        videoList.splice(index, 1);
        localStorage.setItem('videos', JSON.stringify(videoList));
        loadTeacherDashboard();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('currentStudent');
    window.location.href = "index.html";
}

// Check authentication on page load
function checkAuth() {
    const userType = localStorage.getItem('userType');
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('teacher-dashboard.html') && userType !== 'teacher') {
        window.location.href = 'index.html';
    } else if (currentPath.includes('student-dashboard.html') && userType !== 'student') {
        window.location.href = 'index.html';
    }
}

// Load appropriate dashboard based on page
if (window.location.pathname.includes('teacher-dashboard.html')) {
    checkAuth();
    loadTeacherDashboard();
} else if (window.location.pathname.includes('student-dashboard.html')) {
    checkAuth();
    loadStudentDashboard();
}