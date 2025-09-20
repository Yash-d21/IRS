// Supabase Configuration
const supabaseUrl = 'https://vygrmxlryetgjywrsafj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Z3JteGxyeWV0Z2p5d3JzYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDczMDcsImV4cCI6MjA3MzkyMzMwN30.m0aRfRhq7SbGZTHl_UfEc_J85IDQNUPXEvQNxIRl0pU';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Navigation and Page Functions
function goToLogin() {
    window.location.href = 'login.html';
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// Login Page Functions
function showSignup() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignup() {
    document.getElementById('signupModal').style.display = 'none';
}


// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
});

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    showLoadingState();
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            throw error;
        }
        
        if (data.user) {
            showSuccess('Login successful! Redirecting...');
            // Store user session
            localStorage.setItem('user', JSON.stringify(data.user));
            // Determine user role and redirect to appropriate dashboard
            const userRole = getUserRole(data.user.email);
            const dashboardUrl = getDashboardUrl(userRole);
            localStorage.setItem('userRole', userRole);
            setTimeout(() => {
                window.location.href = dashboardUrl;
            }, 1000);
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific error messages
        if (error.message && error.message.includes('email not confirmed')) {
            showError('This account was created before email verification was disabled. Please create a new account or contact support.');
        } else {
            showError(error.message || 'Login failed. Please try again.');
        }
    } finally {
        hideLoadingState();
    }
}

async function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Basic validation
    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    showLoadingState();
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) {
            throw error;
        }
        
        if (data.user) {
            showSuccess('Account created successfully! You can now login.');
            closeSignup();
            // Clear form
            document.getElementById('signupForm').reset();
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError(error.message || 'Signup failed. Please try again.');
    } finally {
        hideLoadingState();
    }
}

function showLoadingState() {
    const submitButtons = document.querySelectorAll('.btn-primary');
    submitButtons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Loading...';
    });
}

function hideLoadingState() {
    const submitButtons = document.querySelectorAll('.btn-primary');
    submitButtons.forEach(btn => {
        btn.disabled = false;
        if (btn.classList.contains('login-submit')) {
            btn.textContent = 'Sign In';
        } else {
            btn.textContent = 'Create Account';
        }
    });
}

function showError(message) {
    // Remove any existing error messages
    hideMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background-color: #ff6b6b;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 10px 0;
        font-size: 14px;
        text-align: center;
    `;
    
    // Insert error message at the top of the form
    const form = document.getElementById('loginForm') || document.getElementById('signupForm');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
    }
}

function showSuccess(message) {
    // Remove any existing messages
    hideMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'message success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background-color: #4CAF50;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 10px 0;
        font-size: 14px;
        text-align: center;
    `;
    
    // Insert success message at the top of the form
    const form = document.getElementById('loginForm') || document.getElementById('signupForm');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
    }
}

function hideMessages() {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('signupModal');
    if (event.target === modal) {
        closeSignup();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSignup();
    }
});

// Role-based routing
function getUserRole(email) {
    const emailLower = email.toLowerCase();
    
    if (emailLower === 'yashwanth.21092006@gmail.com') {
        return 'citizen';
    } else if (emailLower === 'anirudhsharma@gmail.com') {
        return 'admin';
    } else if (emailLower === 'abhilash@gmail.com') {
        return 'superadmin';
    } else {
        return 'citizen'; // Default role for other users
    }
}

function getDashboardUrl(role) {
    switch (role) {
        case 'citizen':
            return 'dashboard.html';
        case 'admin':
            return 'admin-dashboard.html';
        case 'superadmin':
            return 'superadmin-dashboard.html';
        default:
            return 'dashboard.html';
    }
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#ff6b6b';
                showFieldError(this, 'Please enter a valid email address');
            } else {
                this.style.borderColor = '#212124';
                hideFieldError(this);
            }
        });
    });
    
    passwordInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                this.style.borderColor = '#ff6b6b';
                showFieldError(this, 'Password must be at least 6 characters');
            } else {
                this.style.borderColor = '#212124';
                hideFieldError(this);
            }
        });
    });
});

function showFieldError(field, message) {
    hideFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .step, .role-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .role-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Demo data for hero card animation
function animateHeroCard() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '75%';
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', animateHeroCard);

// Authentication State Management
async function checkAuthState() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error checking auth state:', error);
            return;
        }
        
        if (session) {
            // User is logged in
            localStorage.setItem('user', JSON.stringify(session.user));
            const userRole = getUserRole(session.user.email);
            localStorage.setItem('userRole', userRole);
            console.log('User is authenticated:', session.user.email, 'Role:', userRole);
            
            // If on login page, redirect to appropriate dashboard
            if (window.location.pathname.includes('login.html')) {
                const dashboardUrl = getDashboardUrl(userRole);
                window.location.href = dashboardUrl;
            }
        } else {
            // User is not logged in
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            console.log('User is not authenticated');
        }
    } catch (error) {
        console.error('Auth state check failed:', error);
    }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    
    if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('user', JSON.stringify(session.user));
        const userRole = getUserRole(session.user.email);
        localStorage.setItem('userRole', userRole);
        if (window.location.pathname.includes('login.html')) {
            const dashboardUrl = getDashboardUrl(userRole);
            window.location.href = dashboardUrl;
        }
    } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Logout function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        showError('Logout failed. Please try again.');
    }
}

// Initialize auth state check when page loads
document.addEventListener('DOMContentLoaded', checkAuthState);

// Sidebar toggle functionality
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        
        // Save sidebar state to localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

// Initialize sidebar state from localStorage
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    if (sidebar && isCollapsed) {
        sidebar.classList.add('collapsed');
    }
}

// Initialize sidebar when page loads
document.addEventListener('DOMContentLoaded', initializeSidebar);

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section, .reports-section, .profile-section, .settings-section, .users-section, .analytics-section, .admin-management-section, .system-settings-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active navigation item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });
    
    // Show dashboard by default
    showSection('dashboard-section');
});

// Report Management Functions
async function createReport() {
    const title = prompt('Enter report title:');
    if (!title) return;
    
    const description = prompt('Enter report description:');
    if (!description) return;
    
    const category = prompt('Enter category (Infrastructure, Safety, Environment, Other):');
    if (!category) return;
    
    const priority = prompt('Enter priority (Low, Medium, High, Critical):');
    if (!priority) return;
    
    const location = prompt('Enter location:');
    if (!location) return;
    
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    title: title,
                    description: description,
                    category: category,
                    priority: priority,
                    location: location,
                    status: 'Submitted',
                    user_id: user.id,
                    user_email: user.email,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        
        alert('Report created successfully!');
        loadUserReports();
        updateDashboardStats();
    } catch (error) {
        console.error('Error creating report:', error);
        alert('Failed to create report. Please try again.');
    }
}

async function loadUserReports() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayReports(data || []);
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function displayReports(reports) {
    const reportsList = document.querySelector('.reports-list');
    if (!reportsList) return;
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<div class="no-reports"><p>No reports yet. <a href="#" onclick="createReport()">Create your first report</a></p></div>';
        return;
    }
    
    reportsList.innerHTML = reports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <h3>${report.title}</h3>
                <span class="status-badge status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span>
            </div>
            <p class="report-description">${report.description}</p>
            <div class="report-meta">
                <span class="category">${report.category}</span>
                <span class="priority priority-${report.priority.toLowerCase()}">${report.priority}</span>
                <span class="location">📍 ${report.location}</span>
                <span class="date">${new Date(report.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

async function updateDashboardStats() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { data, error } = await supabase
            .from('reports')
            .select('status')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        const stats = {
            total: data.length,
            resolved: data.filter(r => r.status === 'Resolved').length,
            inProgress: data.filter(r => r.status === 'In Progress').length,
            submitted: data.filter(r => r.status === 'Submitted').length
        };
        
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards[0]) statCards[0].querySelector('h3').textContent = stats.total;
        if (statCards[1]) statCards[1].querySelector('h3').textContent = stats.resolved;
        if (statCards[2]) statCards[2].querySelector('h3').textContent = stats.inProgress;
        if (statCards[3]) statCards[3].querySelector('h3').textContent = stats.submitted;
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Admin Functions
async function loadAllReports() {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayAllReports(data || []);
    } catch (error) {
        console.error('Error loading all reports:', error);
    }
}

function displayAllReports(reports) {
    const reportsList = document.querySelector('.all-reports-list');
    if (!reportsList) return;
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<div class="no-reports"><p>No reports found.</p></div>';
        return;
    }
    
    reportsList.innerHTML = reports.map(report => `
        <div class="report-card admin-report">
            <div class="report-header">
                <h3>${report.title}</h3>
                <span class="status-badge status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span>
            </div>
            <p class="report-description">${report.description}</p>
            <div class="report-meta">
                <span class="category">${report.category}</span>
                <span class="priority priority-${report.priority.toLowerCase()}">${report.priority}</span>
                <span class="location">📍 ${report.location}</span>
                <span class="user">👤 ${report.user_email}</span>
                <span class="date">${new Date(report.created_at).toLocaleDateString()}</span>
            </div>
            <div class="report-actions">
                <button class="btn-primary" onclick="updateReportStatus('${report.id}', 'In Progress')">Start</button>
                <button class="btn-secondary" onclick="updateReportStatus('${report.id}', 'Resolved')">Resolve</button>
                <button class="btn-danger" onclick="deleteReport('${report.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function updateReportStatus(reportId, newStatus) {
    try {
        const { error } = await supabase
            .from('reports')
            .update({ status: newStatus })
            .eq('id', reportId);
        
        if (error) throw error;
        
        alert('Report status updated successfully!');
        loadAllReports();
    } catch (error) {
        console.error('Error updating report status:', error);
        alert('Failed to update report status.');
    }
}

async function deleteReport(reportId) {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', reportId);
        
        if (error) throw error;
        
        alert('Report deleted successfully!');
        loadAllReports();
    } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report.');
    }
}
