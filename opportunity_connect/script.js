// Global variables
let currentLanguage = 'en';
let currentStep = 1;
let userProfile = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    initializeNavigation();
    initializePage();
});

// Language Management
function initializeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    changeLanguage(savedLanguage);
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all translatable elements
    const translatableElements = document.querySelectorAll('[data-translate]');
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = lang;
    }
}

// Navigation Management
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for anchor links
    const scrollLinks = document.querySelectorAll('.scroll-link, .scroll-to-about');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href') || '#about-section');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Page-specific initialization
function initializePage() {
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'profile':
            initializeProfilePage();
            break;
        case 'recommendations':
            initializeRecommendationsPage();
            break;
        case 'internships':
            initializeInternshipsPage();
            break;
        case 'contact':
            initializeContactPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page === '' || page === 'index.html') return 'index';
    if (page.includes('profile')) return 'profile';
    if (page.includes('recommendations')) return 'recommendations';
    if (page.includes('internships')) return 'internships';
    if (page.includes('contact')) return 'contact';
    if (page.includes('about')) return 'about';
    
    return 'index';
}

// Home Page Functions
function initializeHomePage() {
    loadFeaturedInternships();
}

function loadFeaturedInternships() {
    const container = document.getElementById('featuredInternships');
    if (!container) return;
    
    const internships = [
        {
            title: "Frontend Developer Intern",
            company: "TechStart Solutions",
            location: "Mumbai, Maharashtra",
            type: "Paid",
            duration: "3 months",
            category: "Web Development",
            skills: ["React", "JavaScript", "CSS"]
        },
        {
            title: "Digital Marketing Intern",
            company: "Creative Agency",
            location: "Bangalore, Karnataka",
            type: "Paid",
            duration: "6 months",
            category: "Marketing",
            skills: ["SEO", "Social Media", "Analytics"]
        },
        {
            title: "Data Entry Specialist",
            company: "DataCorp India",
            location: "Delhi, NCR",
            type: "Paid",
            duration: "2 months",
            category: "Data Entry",
            skills: ["Excel", "Data Processing", "Attention to Detail"]
        }
    ];
    
    container.innerHTML = internships.map(internship => createInternshipCard(internship)).join('');
}

function createInternshipCard(internship) {
    const skillsBadges = internship.skills.map(skill => 
        `<span class="skill-badge">${skill}</span>`
    ).join('');
    
    return `
        <div class="internship-card">
            <div class="card-header">
                <div class="card-badges">
                    <span class="badge badge-secondary">${internship.category}</span>
                    ${internship.type === 'Paid' ? '<span class="badge badge-paid">💰 Paid</span>' : ''}
                </div>
                <h3 class="card-title">${internship.title}</h3>
                <p class="card-company">${internship.company}</p>
            </div>
            <div class="card-details">
                <div class="card-detail">
                    <span class="icon">📍</span>
                    ${internship.location}
                </div>
                <div class="card-detail">
                    <span class="icon">🕒</span>
                    ${internship.duration}
                </div>
                <div class="card-skills">
                    ${skillsBadges}
                </div>
                <button class="btn-primary card-button">
                    View Details
                    <span class="icon">→</span>
                </button>
            </div>
        </div>
    `;
}

// Profile Page Functions
function initializeProfilePage() {
    loadSkills();
    initializeProfileForm();
}

function loadSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;
    
    const skills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS',
        'Data Analysis', 'Digital Marketing', 'Graphic Design', 'Content Writing',
        'Social Media', 'SEO', 'Excel', 'PowerPoint', 'Communication',
        'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Research'
    ];
    
    skillsGrid.innerHTML = skills.map(skill => `
        <label class="skill-checkbox">
            <input type="checkbox" name="skills" value="${skill}">
            <span>${skill}</span>
        </label>
    `).join('');
    
    // Add click handlers for skill selection
    const skillCheckboxes = skillsGrid.querySelectorAll('.skill-checkbox');
    skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const input = this.querySelector('input[type="checkbox"]');
                input.checked = !input.checked;
            }
            this.classList.toggle('selected', this.querySelector('input').checked);
        });
    });
}

function initializeProfileForm() {
    const form = document.getElementById('profileForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) return;
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateCurrentStep()) {
                nextStep();
            }
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevStep();
        });
    }
    
    // Submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateCurrentStep()) {
                submitProfile();
            }
        });
    }
    
    updateStepDisplay();
}

function nextStep() {
    if (currentStep < 3) {
        currentStep++;
        updateStepDisplay();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update step indicator
    const currentStepElement = document.getElementById('currentStep');
    if (currentStepElement) {
        currentStepElement.textContent = currentStep;
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${(currentStep / 3) * 100}%`;
    }
    
    // Show/hide steps
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.toggle('active', i === currentStep);
        }
    }
    
    // Show/hide buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentStep < 3 ? 'block' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.style.display = currentStep === 3 ? 'block' : 'none';
    }
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return false;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'hsl(0 70% 55%)';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (currentStep === 2) {
        const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
        if (selectedSkills.length === 0) {
            showMessage('Please select at least one skill', 'error');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showMessage('Please fill in all required fields', 'error');
    }
    
    return isValid;
}

function submitProfile() {
    // Collect form data
    const formData = new FormData(document.getElementById('profileForm'));
    const profile = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'skills') {
            if (!profile.skills) profile.skills = [];
            profile.skills.push(value);
        } else {
            profile[key] = value;
        }
    }
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Show success message
    showMessage('Profile created successfully!', 'success');
    
    // Redirect to recommendations
    setTimeout(() => {
        window.location.href = 'recommendations.html';
    }, 2000);
}

// Recommendations Page Functions
function initializeRecommendationsPage() {
    loadRecommendations();
}

function loadRecommendations() {
    const container = document.querySelector('.recommendations-grid');
    if (!container) return;
    
    const savedProfile = localStorage.getItem('userProfile');
    const profile = savedProfile ? JSON.parse(savedProfile) : null;
    
    // Generate recommendations based on profile
    const recommendations = generateRecommendations(profile);
    
    container.innerHTML = recommendations.map(rec => createRecommendationCard(rec)).join('');
}

function generateRecommendations(profile) {
    const allInternships = [
        {
            title: "Frontend Developer Intern",
            company: "TechStart Solutions",
            location: "Mumbai, Maharashtra",
            type: "Paid",
            duration: "3 months",
            category: "Web Development",
            skills: ["React", "JavaScript", "CSS"],
            match: "Your JavaScript and React skills make you a perfect fit for this role.",
            salary: "₹15,000/month"
        },
        {
            title: "Digital Marketing Intern",
            company: "Creative Agency",
            location: "Bangalore, Karnataka",
            type: "Paid",
            duration: "6 months",
            category: "Marketing",
            skills: ["SEO", "Social Media", "Analytics"],
            match: "Your interest in digital marketing and communication skills align well.",
            salary: "₹12,000/month"
        },
        {
            title: "Data Entry Specialist",
            company: "DataCorp India",
            location: "Delhi, NCR",
            type: "Paid",
            duration: "2 months",
            category: "Data Entry",
            skills: ["Excel", "Data Processing", "Attention to Detail"],
            match: "Your Excel skills and attention to detail are exactly what we need.",
            salary: "₹10,000/month"
        },
        {
            title: "Content Writer Intern",
            company: "Media House",
            location: "Remote",
            type: "Paid",
            duration: "4 months",
            category: "Content Writing",
            skills: ["Writing", "Research", "SEO"],
            match: "Your communication and writing skills make you ideal for this position.",
            salary: "₹8,000/month"
        }
    ];
    
    // If no profile, return all internships
    if (!profile || !profile.skills) {
        return allInternships.slice(0, 3);
    }
    
    // Filter and score based on profile skills
    const scored = allInternships.map(internship => {
        let score = 0;
        internship.skills.forEach(skill => {
            if (profile.skills.includes(skill)) {
                score += 2;
            }
        });
        
        // Bonus for location match
        if (profile.location && internship.location.toLowerCase().includes(profile.location)) {
            score += 1;
        }
        
        return { ...internship, score };
    });
    
    // Sort by score and return top 3
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

function createRecommendationCard(rec) {
    const skillsBadges = rec.skills.map(skill => 
        `<span class="skill-badge">${skill}</span>`
    ).join('');
    
    return `
        <div class="recommendation-card">
            <div class="card-header">
                <div class="card-badges">
                    <span class="badge badge-secondary">${rec.category}</span>
                    <span class="badge badge-paid">💰 ${rec.salary}</span>
                </div>
                <h3 class="card-title">${rec.title}</h3>
                <p class="card-company">${rec.company}</p>
            </div>
            <div class="card-details">
                <div class="card-detail">
                    <span class="icon">📍</span>
                    ${rec.location}
                </div>
                <div class="card-detail">
                    <span class="icon">🕒</span>
                    ${rec.duration}
                </div>
                <div class="match-reason">
                    <h4>Why this matches you:</h4>
                    <p>${rec.match}</p>
                </div>
                <div class="card-skills">
                    ${skillsBadges}
                </div>
                <div class="card-actions">
                    <button class="btn-outline">View Details</button>
                    <button class="btn-primary">Apply Now</button>
                </div>
            </div>
        </div>
    `;
}

// Internships Page Functions
function initializeInternshipsPage() {
    loadAllInternships();
    initializeFilters();
}

function loadAllInternships() {
    // This would typically load from an API
    // For now, we'll use static data
}

function initializeFilters() {
    // Initialize search and filter functionality
    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterInternships);
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterInternships);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInternships);
    }
}

function filterInternships() {
    // Implement filtering logic
}

// Contact Page Functions
function initializeContactPage() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate form submission
    showMessage('Sending message...', 'loading');
    
    setTimeout(() => {
        showMessage('Message sent successfully!', 'success');
        e.target.reset();
    }, 2000);
}

// Utility Functions
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        background-color: hsl(var(--card));
        border: 2px solid hsl(var(--border));
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Style based on type
    switch (type) {
        case 'success':
            messageElement.style.borderColor = 'hsl(var(--success))';
            messageElement.style.color = 'hsl(var(--success))';
            break;
        case 'error':
            messageElement.style.borderColor = 'hsl(var(--destructive))';
            messageElement.style.color = 'hsl(var(--destructive))';
            break;
        case 'loading':
            messageElement.style.borderColor = 'hsl(var(--primary))';
            messageElement.style.color = 'hsl(var(--primary))';
            messageElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    ${message}
                </div>
            `;
            break;
    }
    
    document.body.appendChild(messageElement);
    
    // Auto remove after 5 seconds (except loading messages)
    if (type !== 'loading') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
    
    return messageElement;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .match-reason {
        background-color: hsl(var(--primary-light));
        padding: 1rem;
        border-radius: calc(var(--radius) - 2px);
        margin: 1rem 0;
    }
    
    .match-reason h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: hsl(var(--primary));
        margin-bottom: 0.5rem;
    }
    
    .match-reason p {
        font-size: 0.875rem;
        color: hsl(var(--muted-foreground));
        margin: 0;
    }
    
    .recommendation-card {
        background-color: hsl(var(--card));
        border-radius: var(--radius);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: var(--transition-smooth);
        border: 1px solid hsl(var(--border));
        animation: slideUp 0.4s ease-out;
    }
    
    .recommendation-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-5px);
    }
    
    .card-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .card-actions .btn-outline,
    .card-actions .btn-primary {
        flex: 1;
        justify-content: center;
    }
    
    .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }
`;
document.head.appendChild(style);