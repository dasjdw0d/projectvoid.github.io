<?php
define('aosw98e3398hdhb', true);
require_once "xiconfig/config.php";
require_once "xiconfig/init.php";

if ($user->LoggedIn($odb)) {
    header('Location: home');
    exit();
}

header('Cache-Control: no-store, no-cache, must-revalidate');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduHub - Your Learning Journey Starts Here</title>
	<link href="css/index.css?v=<?= filemtime('css/index.css') ?>" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
</head>
<body>
    <nav>
        <ul>
            <li class="logo">EduHub</li>
            <li><button class="login-btn" onclick="openModal()">Login</button></li>
        </ul>
    </nav>

    <div class="hero">
        <div>
            <h1>Welcome to EduHub</h1>
            <p>Your gateway to knowledge and success</p>
        </div>
    </div>

    <div class="features">
        <h2>Why Choose EduHub?</h2>
        <div class="features-grid">
            <div class="feature-card">
                <h3>Expert Teachers</h3>
                <p>Learn from the best educators in their fields</p>
            </div>
            <div class="feature-card">
                <h3>Interactive Learning</h3>
                <p>Engage with dynamic content and real-time feedback</p>
            </div>
            <div class="feature-card">
                <h3>Flexible Schedule</h3>
                <p>Study at your own pace, anywhere, anytime</p>
            </div>
            <div class="feature-card">
                <h3>Diverse Courses</h3>
                <p>Choose from hundreds of subjects and specializations</p>
            </div>
        </div>
    </div>

    <!-- Updated Popular Courses Section -->
    <div class="courses-section">
        <h2>Popular Courses</h2>
        <div class="courses-grid">
            <div class="course-card">
                <h3>Advanced Mathematics</h3>
                <p>Master advanced mathematical concepts including:</p>
                <ul class="course-details">
                    <li>Calculus & Integration</li>
                    <li>Linear Algebra</li>
                    <li>Differential Equations</li>
                    <li>Statistics & Probability</li>
                </ul>
                <div class="course-info">
                    <span class="course-duration">12 weeks</span>
                    <span class="course-level">Advanced</span>
                </div>
                <span class="course-rating">★★★★★ (4.9)</span>
            </div>

            <div class="course-card">
                <h3>Physics & Chemistry Bundle</h3>
                <p>Comprehensive science foundation covering:</p>
                <ul class="course-details">
                    <li>Mechanics & Dynamics</li>
                    <li>Organic Chemistry</li>
                    <li>Quantum Physics</li>
                    <li>Chemical Reactions</li>
                </ul>
                <div class="course-info">
                    <span class="course-duration">16 weeks</span>
                    <span class="course-level">Intermediate</span>
                </div>
                <span class="course-rating">★★★★☆ (4.2)</span>
            </div>

            <div class="course-card">
                <h3>Computer Science Fundamentals</h3>
                <p>Essential programming concepts including:</p>
                <ul class="course-details">
                    <li>Python Programming</li>
                    <li>Data Structures</li>
                    <li>Algorithms</li>
                    <li>Web Development</li>
                </ul>
                <div class="course-info">
                    <span class="course-duration">14 weeks</span>
                    <span class="course-level">Beginner-Friendly</span>
                </div>
                <span class="course-rating">★★★★★ (4.8)</span>
            </div>

            <div class="course-card">
                <h3>Biology & Life Sciences</h3>
                <p>Explore living systems through:</p>
                <ul class="course-details">
                    <li>Cell Biology</li>
                    <li>Genetics</li>
                    <li>Human Anatomy</li>
                    <li>Ecology</li>
                </ul>
                <div class="course-info">
                    <span class="course-duration">10 weeks</span>
                    <span class="course-level">Intermediate</span>
                </div>
                <span class="course-rating">★★★★☆ (4.4)</span>
            </div>

            <div class="course-card">
                <h3>English Language & Literature</h3>
                <p>Enhance your language skills with:</p>
                <ul class="course-details">
                    <li>Advanced Grammar</li>
                    <li>Creative Writing</li>
                    <li>Literature Analysis</li>
                    <li>Business English</li>
                </ul>
                <div class="course-info">
                    <span class="course-duration">8 weeks</span>
                    <span class="course-level">All Levels</span>
                </div>
                <span class="course-rating">★★★★★ (4.7)</span>
            </div>

            <div class="course-card">
                <h3>World History</h3>
                <p>Journey through time exploring:</p>
                <ul class="course-details">
                    <li>Ancient Civilizations</li>
                    <li>Medieval Period</li>
                    <li>Modern History</li>
                    <li>Contemporary Events</li>
                </ul>
                <div class="course-info">
                    <span class="course-duration">12 weeks</span>
                    <span class="course-level">Beginner</span>
                </div>
                <span class="course-rating">★★★★☆ (4.3)</span>
            </div>
        </div>
    </div>

    <!-- Updated Testimonials Section (without images) -->
    <div class="testimonials">
        <h2>What Our Students Say</h2>
        <div class="testimonials-grid">
            <div class="testimonial-card">
                <p>"EduHub transformed my learning experience. The quality of education is outstanding! The interactive lessons and supportive community made learning enjoyable and effective."</p>
                <h4>Sarah Johnson</h4>
                <p class="student-info">Computer Science Student</p>
            </div>
            <div class="testimonial-card">
                <p>"The flexibility of online learning combined with expert teachers is perfect. I was able to balance my work and studies while achieving excellent results."</p>
                <h4>Michael Chen</h4>
                <p class="student-info">Mathematics Major</p>
            </div>
        </div>
    </div>

    <!-- New Statistics Section -->
    <div class="stats-section">
        <div class="stat-item">
            <h3>10,000+</h3>
            <p>Active Students</p>
        </div>
        <div class="stat-item">
            <h3>500+</h3>
            <p>Expert Teachers</p>
        </div>
        <div class="stat-item">
            <h3>1,000+</h3>
            <p>Online Courses</p>
        </div>
        <div class="stat-item">
            <h3>95%</h3>
            <p>Success Rate</p>
        </div>
    </div>

    <!-- New Footer Section -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">Teachers</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Popular Subjects</h3>
                <ul>
                    <li><a href="#">Mathematics</a></li>
                    <li><a href="#">Physics</a></li>
                    <li><a href="#">Computer Science</a></li>
                    <li><a href="#">Languages</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <p>Email: info@eduhub.com</p>
                <p>Phone: (555) 123-4567</p>
                <div class="social-links">
                    <a href="#" class="social-icon">Facebook</a>
                    <a href="#" class="social-icon">Twitter</a>
                    <a href="#" class="social-icon">LinkedIn</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 EduHub. All rights reserved.</p>
        </div>
    </footer>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Login to Your Account</h2>
            <form id="loginForm" method="POST" onsubmit="handleLogin(event)">
			<input type="hidden" name="csrf" value="<?php echo htmlspecialchars($xWAF->getCSRF(), ENT_QUOTES, 'UTF-8'); ?>">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="login-username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="submit-btn">Login</button>
            </form>
        </div>
    </div>

    <script>
        const modal = document.getElementById('loginModal');
        const loginForm = document.getElementById('loginForm');

        function openModal() {
            modal.style.display = 'block';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }
    </script>
	
	<script src="js/notify.js?v=<?= filemtime('js/notify.js') ?>"></script>
	<script src="js/login.js?v=<?= filemtime('js/login.js') ?>"></script>
	<script src="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.js"></script>
</body>
</html>
