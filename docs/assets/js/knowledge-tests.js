/**
 * Knowledge Tests Module
 * This file handles the interactive knowledge tests functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeKnowledgeTests();
    setupProgressTracking();
});

/**
 * Initialize Knowledge Tests
 * Sets up the interactive knowledge tests
 */
function initializeKnowledgeTests() {
    // Set up click handlers for all test options
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options in the same question
            const questionOptions = this.closest('.question').querySelectorAll('.option');
            questionOptions.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Clear feedback
            const feedback = this.closest('.question').querySelector('.feedback');
            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
        });
    });
    
    // Set up check answer buttons
    const checkButtons = document.querySelectorAll('.check-answer-button');
    
    checkButtons.forEach(button => {
        button.addEventListener('click', function() {
            checkAnswer(this.closest('.knowledge-test'));
        });
    });
}

/**
 * Check if the selected answer is correct
 * @param {HTMLElement} testContainer - The knowledge test container
 */
function checkAnswer(testContainer) {
    if (!testContainer) return;
    
    const options = testContainer.querySelectorAll('.option');
    const feedback = testContainer.querySelector('.feedback');
    let selectedOption = null;
    
    options.forEach(option => {
        if (option.classList.contains('selected')) {
            selectedOption = option;
        }
    });
    
    if (!selectedOption) {
        feedback.textContent = 'Please select an answer.';
        feedback.className = 'feedback warning-text';
        return;
    }
    
    const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
    
    if (isCorrect) {
        feedback.textContent = 'Correct! Well done.';
        feedback.className = 'feedback success-text';
        selectedOption.classList.add('correct');
        
        // Add animation for correct answer
        selectedOption.classList.add('correct-animation');
        setTimeout(() => {
            selectedOption.classList.remove('correct-animation');
        }, 1500);
        
        // Update progress
        updateTestProgress(testContainer, true);
    } else {
        feedback.textContent = 'Incorrect. Try again.';
        feedback.className = 'feedback error-text';
        selectedOption.classList.add('incorrect');
        
        // Add animation for incorrect answer
        selectedOption.classList.add('incorrect-animation');
        setTimeout(() => {
            selectedOption.classList.remove('incorrect-animation');
        }, 1500);
        
        // Highlight the correct answer
        options.forEach(option => {
            if (option.getAttribute('data-correct') === 'true') {
                option.classList.add('correct');
            }
        });
        
        // Update progress
        updateTestProgress(testContainer, false);
    }
}

/**
 * Update test progress
 * @param {HTMLElement} testContainer - The knowledge test container
 * @param {boolean} isCorrect - Whether the answer was correct
 */
function updateTestProgress(testContainer, isCorrect) {
    if (!testContainer) return;
    
    // Get module and skill level
    const module = testContainer.getAttribute('data-module');
    const level = testContainer.getAttribute('data-level');
    
    if (!module || !level) return;
    
    // Get current progress
    const progressKey = `${module}_${level}_test_progress`;
    let progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Get question ID
    const questionId = testContainer.getAttribute('data-question-id');
    
    if (!questionId) return;
    
    // Update progress for this question
    progress[questionId] = isCorrect;
    
    // Save progress
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Update module progress
    updateModuleProgress(module, level);
}

/**
 * Update module progress based on test results
 * @param {string} module - Module name
 * @param {string} level - Skill level
 */
function updateModuleProgress(module, level) {
    // Get test progress
    const progressKey = `${module}_${level}_test_progress`;
    const testProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Count correct answers
    const totalQuestions = document.querySelectorAll(`.knowledge-test[data-module="${module}"][data-level="${level}"]`).length;
    const correctAnswers = Object.values(testProgress).filter(value => value === true).length;
    
    // Calculate progress percentage
    const progressPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Update module progress
    if (typeof updateSkillLevelProgress === 'function') {
        updateSkillLevelProgress(module, level, progressPercentage);
    }
}

/**
 * Setup Progress Tracking
 * Initializes progress tracking for knowledge tests
 */
function setupProgressTracking() {
    // Get all modules and levels
    const tests = document.querySelectorAll('.knowledge-test');
    const moduleMap = {};
    
    // Build map of modules and levels
    tests.forEach(test => {
        const module = test.getAttribute('data-module');
        const level = test.getAttribute('data-level');
        
        if (module && level) {
            if (!moduleMap[module]) {
                moduleMap[module] = {};
            }
            
            if (!moduleMap[module][level]) {
                moduleMap[module][level] = [];
            }
            
            moduleMap[module][level].push(test.getAttribute('data-question-id'));
        }
    });
    
    // Initialize progress for each module and level
    for (const module in moduleMap) {
        for (const level in moduleMap[module]) {
            initializeTestProgress(module, level, moduleMap[module][level]);
        }
    }
}

/**
 * Initialize test progress
 * @param {string} module - Module name
 * @param {string} level - Skill level
 * @param {Array} questionIds - Array of question IDs
 */
function initializeTestProgress(module, level, questionIds) {
    // Get current progress
    const progressKey = `${module}_${level}_test_progress`;
    let progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Initialize progress for each question if not already set
    questionIds.forEach(id => {
        if (progress[id] === undefined) {
            progress[id] = false;
        }
    });
    
    // Save progress
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Update module progress
    updateModuleProgress(module, level);
}

/**
 * Reset test progress
 * @param {string} module - Module name (or 'all' for all modules)
 * @param {string} level - Skill level (or 'all' for all levels)
 */
function resetTestProgress(module, level) {
    if (module === 'all') {
        // Reset all modules
        const modules = ['market-risk', 'credit-risk', 'counterparty-risk'];
        const levels = ['beginner', 'intermediate', 'advanced'];
        
        modules.forEach(mod => {
            levels.forEach(lvl => {
                resetTestProgress(mod, lvl);
            });
        });
        
        return;
    }
    
    if (level === 'all') {
        // Reset all levels for this module
        const levels = ['beginner', 'intermediate', 'advanced'];
        
        levels.forEach(lvl => {
            resetTestProgress(module, lvl);
        });
        
        return;
    }
    
    // Reset specific module and level
    const progressKey = `${module}_${level}_test_progress`;
    localStorage.removeItem(progressKey);
    
    // Update module progress
    updateModuleProgress(module, level);
    
    // Refresh the page to reset UI
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
}

/**
 * Get test completion status
 * @param {string} module - Module name
 * @param {string} level - Skill level
 * @returns {Object} Object with total, completed, and percentage
 */
function getTestCompletionStatus(module, level) {
    // Get test progress
    const progressKey = `${module}_${level}_test_progress`;
    const testProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Count correct answers
    const totalQuestions = Object.keys(testProgress).length;
    const correctAnswers = Object.values(testProgress).filter(value => value === true).length;
    
    // Calculate progress percentage
    const progressPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    return {
        total: totalQuestions,
        completed: correctAnswers,
        percentage: progressPercentage
    };
}
