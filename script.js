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

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Basic validation
    if (!email || !password || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        
        // Redirect based on role
        switch(role) {
            case 'citizen':
                alert('Login successful! Redirecting to Citizen Dashboard...');
                // window.location.href = 'citizen-dashboard.html';
                break;
            case 'admin':
                alert('Login successful! Redirecting to Admin Dashboard...');
                // window.location.href = 'admin-dashboard.html';
                break;
            case 'superadmin':
                alert('Login successful! Redirecting to Super Admin Dashboard...');
                // window.location.href = 'superadmin-dashboard.html';
                break;
            default:
                alert('Invalid role selected');
        }
    }, 1500);
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    // Basic validation
    if (!name || !email || !password || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate signup process
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        alert('Account created successfully! You can now login.');
        closeSignup();
        
        // Clear form
        document.getElementById('signupForm').reset();
    }, 1500);
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
