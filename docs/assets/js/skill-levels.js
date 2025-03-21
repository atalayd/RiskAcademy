/**
 * Skill Level Categorization
 * This file handles the skill level filtering functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeSkillLevelFilters();
    setupSkillLevelSelection();
    applyInitialSkillLevel();
});

/**
 * Initialize skill level filters
 * Sets up the skill level filter buttons and their functionality
 */
function initializeSkillLevelFilters() {
    const skillLevelButtons = document.querySelectorAll('.skill-level-button');
    
    skillLevelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            
            // Update active button
            skillLevelButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update content visibility
            filterContentBySkillLevel(level);
            
            // Save preference to localStorage
            localStorage.setItem('preferredSkillLevel', level);
        });
    });
}

/**
 * Filter content by skill level
 * Shows/hides content based on selected skill level
 * @param {string} level - Selected skill level (beginner, intermediate, advanced)
 */
function filterContentBySkillLevel(level) {
    const contentSections = document.querySelectorAll('.skill-level-content');
    
    contentSections.forEach(section => {
        const sectionLevel = section.getAttribute('data-level');
        
        if (sectionLevel === level || level === 'all') {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

/**
 * Setup skill level selection on homepage
 * Handles the skill level selection on the homepage
 */
function setupSkillLevelSelection() {
    const skillLevelCards = document.querySelectorAll('.skill-level-card');
    
    skillLevelCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            
            // Save preference to localStorage
            localStorage.setItem('preferredSkillLevel', level);
            
            // Redirect to modules page if on homepage
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                window.location.href = 'modules/market-risk/index.html';
            }
        });
    });
}

/**
 * Apply initial skill level
 * Sets the initial skill level based on localStorage or defaults to beginner
 */
function applyInitialSkillLevel() {
    // Get preferred skill level from localStorage
    const preferredLevel = localStorage.getItem('preferredSkillLevel') || 'beginner';
    
    // Find and click the corresponding button
    const button = document.querySelector(`.skill-level-button[data-level="${preferredLevel}"]`);
    if (button) {
        button.click();
    } else {
        // Default to showing all content if button not found
        filterContentBySkillLevel('all');
    }
}

/**
 * Update skill level progress
 * Updates the user's progress through the course
 * @param {string} module - Module name (market-risk, credit-risk, counterparty-risk)
 * @param {string} level - Skill level (beginner, intermediate, advanced)
 * @param {number} progress - Progress percentage (0-100)
 */
function updateSkillLevelProgress(module, level, progress) {
    // Get current progress from localStorage
    const progressKey = `${module}_${level}_progress`;
    localStorage.setItem(progressKey, progress);
    
    // Update progress bar if it exists
    const progressBar = document.querySelector(`.progress-bar[data-module="${module}"][data-level="${level}"]`);
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
}

/**
 * Get skill level description
 * Returns a description of the skill level for tooltips and guidance
 * @param {string} level - Skill level (beginner, intermediate, advanced)
 * @returns {string} Description of the skill level
 */
function getSkillLevelDescription(level) {
    switch (level) {
        case 'beginner':
            return 'Suitable for those new to financial risk management. Covers fundamental concepts and basic terminology.';
        case 'intermediate':
            return 'For professionals with some experience in risk management. Explores practical applications and regulatory frameworks.';
        case 'advanced':
            return 'Designed for experienced risk professionals. Covers complex modeling techniques and advanced risk management strategies.';
        default:
            return 'Select a skill level to customize your learning experience.';
    }
}

/**
 * Check if user is ready for next level
 * Determines if the user has completed enough of the current level to move to the next
 * @param {string} module - Module name (market-risk, credit-risk, counterparty-risk)
 * @param {string} currentLevel - Current skill level (beginner, intermediate)
 * @returns {boolean} Whether the user is ready for the next level
 */
function isReadyForNextLevel(module, currentLevel) {
    // Get current progress from localStorage
    const progressKey = `${module}_${currentLevel}_progress`;
    const progress = parseInt(localStorage.getItem(progressKey) || '0');
    
    // User is ready if progress is at least 80%
    return progress >= 80;
}

/**
 * Recommend next steps
 * Provides recommendations for what to study next based on progress
 * @returns {Object} Recommendation object with module, level, and reason
 */
function recommendNextSteps() {
    const modules = ['market-risk', 'credit-risk', 'counterparty-risk'];
    const levels = ['beginner', 'intermediate', 'advanced'];
    
    // Check progress for each module and level
    const progressMap = {};
    
    modules.forEach(module => {
        levels.forEach(level => {
            const progressKey = `${module}_${level}_progress`;
            const progress = parseInt(localStorage.getItem(progressKey) || '0');
            progressMap[`${module}_${level}`] = progress;
        });
    });
    
    // Find incomplete modules/levels (less than 80% progress)
    const incomplete = Object.keys(progressMap)
        .filter(key => progressMap[key] < 80)
        .sort((a, b) => progressMap[a] - progressMap[b]); // Sort by progress (ascending)
    
    if (incomplete.length === 0) {
        // All modules completed
        return {
            module: 'all',
            level: 'advanced',
            reason: 'Congratulations! You have completed all modules. Consider reviewing advanced topics or exploring the practical applications section.'
        };
    }
    
    // Recommend the module with the least progress
    const nextKey = incomplete[0];
    const [module, level] = nextKey.split('_');
    
    return {
        module,
        level,
        reason: `You have made ${progressMap[nextKey]}% progress in the ${level} ${formatModuleName(module)} module. Continue to build your knowledge in this area.`
    };
}

/**
 * Format module name for display
 * @param {string} moduleName - Module name (market-risk, credit-risk, counterparty-risk)
 * @returns {string} Formatted module name
 */
function formatModuleName(moduleName) {
    switch (moduleName) {
        case 'market-risk':
            return 'Market Risk';
        case 'credit-risk':
            return 'Credit Risk';
        case 'counterparty-risk':
            return 'Counterparty Credit Risk';
        default:
            return moduleName;
    }
}
