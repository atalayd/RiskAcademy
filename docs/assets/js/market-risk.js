/**
 * Market Risk Module JavaScript
 * This file contains all the interactive functionality for the Market Risk module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts and interactive elements when the DOM is fully loaded
    initializeMarketRiskFactorsChart();
    setupVaRCalculator();
    setupStressTestSimulator();
    setupCapitalCalculator();
    setupKnowledgeTests();
});

/**
 * Initialize Market Risk Factors Chart
 * Shows the main types of market risk in a doughnut chart
 */
function initializeMarketRiskFactorsChart() {
    const ctx = document.getElementById('market-risk-factors-chart');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Equity Risk', 'Interest Rate Risk', 'Currency Risk', 'Commodity Risk'],
                datasets: [{
                    data: [30, 35, 20, 15],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDarkMode() ? '#ffffff' : '#333333'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Setup Value at Risk (VaR) Calculator
 * Interactive tool to calculate VaR using different methodologies
 */
function setupVaRCalculator() {
    const form = document.getElementById('var-calculator-form');
    const resultContainer = document.getElementById('var-result-container');
    const resultElement = document.getElementById('var-result');
    const riskLevel = document.querySelector('.risk-level');
    const riskInterpretation = document.getElementById('risk-interpretation');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const portfolioValue = parseFloat(document.getElementById('portfolio-value').value);
            const confidenceLevel = parseFloat(document.getElementById('confidence-level').value);
            const timeHorizon = parseFloat(document.getElementById('time-horizon').value);
            const volatility = parseFloat(document.getElementById('volatility').value);
            const varMethod = document.getElementById('var-method').value;
            
            // Calculate VaR based on method
            let varResult = 0;
            
            if (varMethod === 'parametric') {
                // Parametric VaR calculation
                // VaR = Portfolio Value * Volatility * Z-score * sqrt(time horizon / 252)
                const zScore = getZScore(confidenceLevel / 100);
                const annualToDaily = Math.sqrt(timeHorizon / 252); // Assuming 252 trading days in a year
                varResult = portfolioValue * (volatility / 100) * zScore * annualToDaily;
            } else if (varMethod === 'historical') {
                // Simplified historical simulation (using parametric as base with adjustment)
                const zScore = getZScore(confidenceLevel / 100);
                const annualToDaily = Math.sqrt(timeHorizon / 252);
                // Add a small adjustment factor to simulate historical data variation
                const adjustmentFactor = 1.1 - (Math.random() * 0.2); // Random factor between 0.9 and 1.1
                varResult = portfolioValue * (volatility / 100) * zScore * annualToDaily * adjustmentFactor;
            } else if (varMethod === 'monte-carlo') {
                // Simplified Monte Carlo simulation (using parametric as base with multiple simulations)
                const zScore = getZScore(confidenceLevel / 100);
                const annualToDaily = Math.sqrt(timeHorizon / 252);
                
                // Run multiple simulations and take the average
                let totalVaR = 0;
                const numSimulations = 100;
                
                for (let i = 0; i < numSimulations; i++) {
                    const randomFactor = 0.9 + (Math.random() * 0.4); // Random factor between 0.9 and 1.3
                    totalVaR += portfolioValue * (volatility / 100) * zScore * annualToDaily * randomFactor;
                }
                
                varResult = totalVaR / numSimulations;
            }
            
            // Display result
            resultElement.textContent = `$${varResult.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            
            // Calculate risk level as percentage of portfolio value
            const riskPercentage = (varResult / portfolioValue) * 100;
            riskLevel.style.width = `${Math.min(riskPercentage * 10, 100)}%`; // Scale for better visualization
            
            // Set risk level color and interpretation
            if (riskPercentage < 1) {
                riskLevel.style.backgroundColor = '#28a745'; // Green
                riskInterpretation.textContent = 'Low Risk: Your potential loss is less than 1% of portfolio value.';
                riskInterpretation.className = 'success-text';
            } else if (riskPercentage < 3) {
                riskLevel.style.backgroundColor = '#ffc107'; // Yellow
                riskInterpretation.textContent = 'Moderate Risk: Your potential loss is between 1% and 3% of portfolio value.';
                riskInterpretation.className = 'warning-text';
            } else if (riskPercentage < 5) {
                riskLevel.style.backgroundColor = '#fd7e14'; // Orange
                riskInterpretation.textContent = 'High Risk: Your potential loss is between 3% and 5% of portfolio value.';
                riskInterpretation.className = 'warning-text';
            } else {
                riskLevel.style.backgroundColor = '#dc3545'; // Red
                riskInterpretation.textContent = 'Very High Risk: Your potential loss is more than 5% of portfolio value.';
                riskInterpretation.className = 'error-text';
            }
            
            // Show result container
            resultContainer.style.display = 'block';
        });
    }
}

/**
 * Setup Stress Test Simulator
 * Simulates the impact of stress scenarios on a portfolio
 */
function setupStressTestSimulator() {
    const form = document.getElementById('stress-test-form');
    const resultContainer = document.getElementById('stress-test-result-container');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const portfolioValue = parseFloat(document.getElementById('stress-portfolio-value').value);
            const equityExposure = parseFloat(document.getElementById('equity-exposure').value) / 100;
            const bondExposure = parseFloat(document.getElementById('bond-exposure').value) / 100;
            const fxExposure = parseFloat(document.getElementById('fx-exposure').value) / 100;
            
            // Calculate stress test results
            const baseCase = portfolioValue;
            
            // Mild stress scenario: equity -10%, bonds -2%, FX -5%
            const mildStress = portfolioValue * (
                1 - (equityExposure * 0.10) - (bondExposure * 0.02) - (fxExposure * 0.05)
            );
            
            // Moderate stress scenario: equity -25%, bonds -8%, FX -15%
            const moderateStress = portfolioValue * (
                1 - (equityExposure * 0.25) - (bondExposure * 0.08) - (fxExposure * 0.15)
            );
            
            // Severe stress scenario: equity -40%, bonds -15%, FX -25%
            const severeStress = portfolioValue * (
                1 - (equityExposure * 0.40) - (bondExposure * 0.15) - (fxExposure * 0.25)
            );
            
            // Calculate impacts
            const mildImpact = baseCase - mildStress;
            const moderateImpact = baseCase - moderateStress;
            const severeImpact = baseCase - severeStress;
            
            // Update table values
            document.getElementById('base-case-value').textContent = `$${baseCase.toLocaleString()}`;
            document.getElementById('mild-stress-value').textContent = `$${mildStress.toLocaleString()}`;
            document.getElementById('moderate-stress-value').textContent = `$${moderateStress.toLocaleString()}`;
            document.getElementById('severe-stress-value').textContent = `$${severeStress.toLocaleString()}`;
            
            document.getElementById('mild-stress-impact').textContent = `-$${mildImpact.toLocaleString()} (${((mildImpact / baseCase) * 100).toFixed(1)}%)`;
            document.getElementById('moderate-stress-impact').textContent = `-$${moderateImpact.toLocaleString()} (${((moderateImpact / baseCase) * 100).toFixed(1)}%)`;
            document.getElementById('severe-stress-impact').textContent = `-$${severeImpact.toLocaleString()} (${((severeImpact / baseCase) * 100).toFixed(1)}%)`;
            
            // Create chart
            const ctx = document.getElementById('stress-test-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.stressTestChart) {
                    window.stressTestChart.destroy();
                }
                
                window.stressTestChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Base Case', 'Mild Stress', 'Moderate Stress', 'Severe Stress'],
                        datasets: [{
                            label: 'Portfolio Value ($)',
                            data: [baseCase, mildStress, moderateStress, severeStress],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(255, 99, 132, 0.7)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                }
                            },
                            x: {
                                ticks: {
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `$${context.raw.toLocaleString()}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            // Show result container
            resultContainer.style.display = 'block';
        });
    }
}

/**
 * Setup Regulatory Capital Calculator
 * Calculates capital requirements for market risk
 */
function setupCapitalCalculator() {
    const form = document.getElementById('capital-calculator-form');
    const resultContainer = document.getElementById('capital-result-container');
    const capitalResult = document.getElementById('capital-result');
    const capitalRatio = document.getElementById('capital-ratio');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const marketRiskAssets = parseFloat(document.getElementById('market-risk-assets').value);
            const approachType = document.getElementById('approach-type').value;
            
            // Calculate capital requirement
            let capitalRequirement = 0;
            
            if (approachType === 'standardized') {
                // Standardized approach: 8% of risk-weighted assets
                capitalRequirement = marketRiskAssets * 0.08;
            } else if (approachType === 'internal-model') {
                // Internal model approach: typically lower than standardized
                // Add a multiplier (3-4) to VaR for regulatory purposes
                const multiplier = 3.5;
                const estimatedVaR = marketRiskAssets * 0.02; // Simplified VaR calculation
                capitalRequirement = estimatedVaR * multiplier;
            }
            
            // Calculate capital ratio
            const ratio = (capitalRequirement / marketRiskAssets) * 100;
            
            // Display results
            capitalResult.textContent = `$${capitalRequirement.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            capitalRatio.textContent = `${ratio.toFixed(2)}%`;
            
            // Show result container
            resultContainer.style.display = 'block';
        });
    }
}

/**
 * Setup Knowledge Tests
 * Handles the interactive knowledge check questions
 */
function setupKnowledgeTests() {
    const beginnerButton = document.getElementById('check-answer-beginner');
    const intermediateButton = document.getElementById('check-answer-intermediate');
    const advancedButton = document.getElementById('check-answer-advanced');
    
    if (beginnerButton) {
        beginnerButton.addEventListener('click', function() {
            checkAnswer(this.closest('.knowledge-test'));
        });
    }
    
    if (intermediateButton) {
        intermediateButton.addEventListener('click', function() {
            checkAnswer(this.closest('.knowledge-test'));
        });
    }
    
    if (advancedButton) {
        advancedButton.addEventListener('click', function() {
            checkAnswer(this.closest('.knowledge-test'));
        });
    }
}

/**
 * Check if the selected answer is correct
 * @param {HTMLElement} testContainer - The knowledge test container
 */
function checkAnswer(testContainer) {
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
    } else {
        feedback.textContent = 'Incorrect. Try again.';
        feedback.className = 'feedback error-text';
        selectedOption.classList.add('incorrect');
        
        // Highlight the correct answer
        options.forEach(option => {
            if (option.getAttribute('data-correct') === 'true') {
                option.classList.add('correct');
            }
        });
    }
}

/**
 * Get Z-score for a given confidence level
 * @param {number} confidenceLevel - Confidence level (0-1)
 * @returns {number} Z-score
 */
function getZScore(confidenceLevel) {
    // Common z-scores for typical confidence levels
    if (confidenceLevel === 0.90) return 1.282;
    if (confidenceLevel === 0.95) return 1.645;
    if (confidenceLevel === 0.99) return 2.326;
    
    // For other confidence levels, use approximation
    // This is a simplified approximation of the inverse normal CDF
    const p = confidenceLevel;
    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;
    
    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;
    
    const c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136;
    const c3 = -2.40075827716184;
    const c4 = -2.54973253934373;
    const c5 = 4.37466414146497;
    const c6 = 2.93816398269878;
    
    const d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004;
    const d3 = 2.445134137143;
    const d4 = 3.75440866190742;
    
    let z_score = 0;
    
    if (p < 0.02425) {
        // Left tail
        const q = Math.sqrt(-2 * Math.log(p));
        z_score = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
                  ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p < 0.97575) {
        // Central region
        const q = p - 0.5;
        const r = q * q;
        z_score = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
                  (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
        // Right tail
        const q = Math.sqrt(-2 * Math.log(1 - p));
        z_score = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
                   ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    
    return z_score;
}

/**
 * Check if dark mode is enabled
 * @returns {boolean} True if dark mode is enabled
 */
function isDarkMode() {
    return document.body.classList.contains('dark-mode');
}

// Add click event listeners to options
document.addEventListener('DOMContentLoaded', function() {
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
});
