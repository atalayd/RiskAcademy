/**
 * Credit Risk Module JavaScript
 * This file contains all the interactive functionality for the Credit Risk module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts and interactive elements when the DOM is fully loaded
    initializeCreditRiskComponents();
    setupCreditScoreSimulator();
    setupExpectedLossCalculator();
    setupCapitalCalculator();
    setupPortfolioOptimization();
    setupKnowledgeTests();
});

/**
 * Initialize Credit Risk Components Chart
 * Shows the main components of credit risk in a pie chart
 */
function initializeCreditRiskComponents() {
    const ctx = document.getElementById('credit-risk-components-chart');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Probability of Default (PD)', 'Loss Given Default (LGD)', 'Exposure at Default (EAD)'],
                datasets: [{
                    data: [35, 30, 35],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
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
 * Setup Credit Score Simulator
 * Interactive tool to simulate how different factors affect credit scores
 */
function setupCreditScoreSimulator() {
    const form = document.getElementById('credit-score-simulator-form');
    const resultContainer = document.getElementById('credit-score-result-container');
    const resultElement = document.getElementById('credit-score-result');
    const riskLevel = document.querySelector('#credit-score-result-container .risk-level');
    const interpretation = document.getElementById('credit-score-interpretation');
    
    // Update range input values as they change
    const rangeInputs = document.querySelectorAll('#credit-score-simulator-form input[type="range"]');
    rangeInputs.forEach(input => {
        const valueDisplay = document.getElementById(`${input.id}-value`);
        input.addEventListener('input', () => {
            valueDisplay.textContent = input.value;
        });
    });
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const paymentHistory = parseInt(document.getElementById('payment-history').value);
            const creditUtilization = parseInt(document.getElementById('credit-utilization').value);
            const creditHistory = parseInt(document.getElementById('credit-history').value);
            const creditMix = parseInt(document.getElementById('credit-mix').value);
            const newCredit = parseInt(document.getElementById('new-credit').value);
            
            // Calculate credit score (simplified model)
            // Payment history: 35%, Credit utilization: 30%, Length of history: 15%, Credit mix: 10%, New credit: 10%
            const score = Math.round(
                (paymentHistory * 0.35) + 
                ((100 - creditUtilization) * 0.30) + 
                (Math.min(creditHistory * 5, 100) * 0.15) + 
                (creditMix * 0.10) + 
                (newCredit * 0.10)
            );
            
            // Display result
            resultElement.textContent = score;
            
            // Set risk level width based on score (300-850 scale)
            const percentage = ((score - 300) / 550) * 100;
            riskLevel.style.width = `${percentage}%`;
            
            // Set color based on score
            if (score < 580) {
                riskLevel.style.backgroundColor = '#d9534f'; // Red
                interpretation.textContent = 'Poor: This credit score will make it difficult to obtain loans with favorable terms.';
            } else if (score < 670) {
                riskLevel.style.backgroundColor = '#f0ad4e'; // Yellow
                interpretation.textContent = 'Fair: This credit score may qualify for loans but not at the best rates.';
            } else if (score < 740) {
                riskLevel.style.backgroundColor = '#5bc0de'; // Blue
                interpretation.textContent = 'Good: This credit score should qualify for most loans at competitive rates.';
            } else if (score < 800) {
                riskLevel.style.backgroundColor = '#5cb85c'; // Green
                interpretation.textContent = 'Very Good: This credit score will qualify for loans at very favorable rates.';
            } else {
                riskLevel.style.backgroundColor = '#28a745'; // Dark Green
                interpretation.textContent = 'Exceptional: This credit score will qualify for the best loan terms available.';
            }
            
            // Show result container
            resultContainer.style.display = 'block';
        });
    }
}

/**
 * Setup Expected Loss Calculator
 * Calculates expected loss based on PD, LGD, and EAD
 */
function setupExpectedLossCalculator() {
    const form = document.getElementById('expected-loss-calculator-form');
    const resultContainer = document.getElementById('expected-loss-result-container');
    const resultElement = document.getElementById('expected-loss-result');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const loanAmount = parseFloat(document.getElementById('loan-amount').value);
            const pd = parseFloat(document.getElementById('probability-default').value) / 100;
            const lgd = parseFloat(document.getElementById('loss-given-default').value) / 100;
            
            // Calculate expected loss
            const expectedLoss = loanAmount * pd * lgd;
            
            // Display result
            resultElement.textContent = `$${expectedLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            
            // Create chart
            const ctx = document.getElementById('expected-loss-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.expectedLossChart) {
                    window.expectedLossChart.destroy();
                }
                
                window.expectedLossChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Loan Amount', 'Expected Loss'],
                        datasets: [{
                            label: 'Amount ($)',
                            data: [loanAmount, expectedLoss],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 99, 132, 0.7)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
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
 * Setup Capital Calculator
 * Calculates capital requirements based on exposure and approach type
 */
function setupCapitalCalculator() {
    const form = document.getElementById('capital-calculator-form');
    const resultContainer = document.getElementById('capital-result-container');
    const capitalResult = document.getElementById('capital-result');
    const rwaResult = document.getElementById('rwa-result');
    const ratioResult = document.getElementById('capital-ratio');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const approachType = document.getElementById('approach-type').value;
            const exposureAmount = parseFloat(document.getElementById('exposure-amount').value);
            const exposureType = document.getElementById('exposure-type').value;
            const creditRating = document.getElementById('credit-rating').value;
            const pd = parseFloat(document.getElementById('probability-default-capital').value) / 100;
            
            // Calculate risk weight based on approach and parameters
            let riskWeight = 0;
            
            if (approachType === 'standardized') {
                // Simplified standardized approach risk weights
                if (exposureType === 'sovereign') {
                    if (creditRating === 'aaa' || creditRating === 'aa') riskWeight = 0;
                    else if (creditRating === 'a') riskWeight = 0.2;
                    else if (creditRating === 'bbb') riskWeight = 0.5;
                    else if (creditRating === 'bb') riskWeight = 1.0;
                    else if (creditRating === 'b') riskWeight = 1.0;
                    else riskWeight = 1.5;
                } else if (exposureType === 'bank') {
                    if (creditRating === 'aaa' || creditRating === 'aa') riskWeight = 0.2;
                    else if (creditRating === 'a') riskWeight = 0.5;
                    else if (creditRating === 'bbb') riskWeight = 1.0;
                    else if (creditRating === 'bb') riskWeight = 1.0;
                    else if (creditRating === 'b') riskWeight = 1.5;
                    else riskWeight = 1.5;
                } else if (exposureType === 'corporate') {
                    if (creditRating === 'aaa' || creditRating === 'aa') riskWeight = 0.2;
                    else if (creditRating === 'a') riskWeight = 0.5;
                    else if (creditRating === 'bbb') riskWeight = 1.0;
                    else if (creditRating === 'bb') riskWeight = 1.0;
                    else if (creditRating === 'b') riskWeight = 1.5;
                    else riskWeight = 1.5;
                } else if (exposureType === 'retail') {
                    riskWeight = 0.75;
                }
            } else if (approachType === 'foundation-irb' || approachType === 'advanced-irb') {
                // Simplified IRB approach (using Basel formula approximation)
                // This is a very simplified version of the actual Basel IRB formula
                const correlation = 0.12 * (1 - Math.exp(-50 * pd)) / (1 - Math.exp(-50)) + 0.24 * (1 - (1 - Math.exp(-50 * pd)) / (1 - Math.exp(-50)));
                const maturityAdjustment = 1.0;
                const lgd = approachType === 'foundation-irb' ? 0.45 : 0.4; // Simplified
                
                // Simplified capital requirement calculation
                riskWeight = (lgd * 1.06 * Math.sqrt(1 / (1 - correlation)) * 
                             (Math.sqrt(correlation) * 2.33 + Math.sqrt(1 - correlation) * 
                             Math.max(-3, Math.min(3, -1 * Math.log(pd) / Math.sqrt(2) - 2.33 / Math.sqrt(1 - correlation))))) * 
                             maturityAdjustment;
                
                // Cap risk weight at 12.5 (equivalent to 100% capital charge)
                riskWeight = Math.min(riskWeight, 12.5);
            }
            
            // Calculate RWA and capital requirement
            const rwa = exposureAmount * riskWeight;
            const capitalRequirement = rwa * 0.08; // 8% capital requirement
            const capitalRatio = (capitalRequirement / exposureAmount) * 100;
            
            // Display results
            rwaResult.textContent = `$${rwa.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            capitalResult.textContent = `$${capitalRequirement.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            ratioResult.textContent = `${capitalRatio.toFixed(2)}%`;
            
            // Show result container
            resultContainer.style.display = 'block';
        });
    }
}

/**
 * Setup Portfolio Optimization
 * Simulates portfolio optimization based on concentration and rating distribution
 */
function setupPortfolioOptimization() {
    const form = document.getElementById('portfolio-optimization-form');
    const resultContainer = document.getElementById('portfolio-optimization-result-container');
    const recommendations = document.getElementById('optimization-recommendations');
    
    // Update range input values as they change
    const rangeInputs = document.querySelectorAll('#portfolio-optimization-form input[type="range"]');
    rangeInputs.forEach(input => {
        const valueDisplay = document.getElementById(`${input.id}-value`);
        input.addEventListener('input', () => {
            valueDisplay.textContent = `${input.value}%`;
        });
    });
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const portfolioSize = parseFloat(document.getElementById('portfolio-size').value);
            const industryConcentration = parseInt(document.getElementById('industry-concentration').value);
            const geographicConcentration = parseInt(document.getElementById('geographic-concentration').value);
            const ratingDistribution = parseInt(document.getElementById('rating-distribution').value);
            
            // Calculate current portfolio metrics
            const currentReturn = 0.05 + (0.02 * (100 - ratingDistribution) / 100); // Higher return for lower rating
            const currentLoss = portfolioSize * 0.01 * (1 + (industryConcentration / 100) + (geographicConcentration / 100) - (ratingDistribution / 100));
            const currentRar = (currentReturn * portfolioSize - currentLoss) / portfolioSize * 100;
            const currentCapital = portfolioSize * 0.08 * (1 + (industryConcentration / 100) + (geographicConcentration / 100) - (ratingDistribution / 200));
            
            // Calculate optimized portfolio metrics
            const optIndustryConc = Math.max(industryConcentration - 15, 20);
            const optGeographicConc = Math.max(geographicConcentration - 10, 20);
            const optRatingDist = Math.min(ratingDistribution + 10, 80);
            
            const optimizedReturn = 0.05 + (0.02 * (100 - optRatingDist) / 100);
            const optimizedLoss = portfolioSize * 0.01 * (1 + (optIndustryConc / 100) + (optGeographicConc / 100) - (optRatingDist / 100));
            const optimizedRar = (optimizedReturn * portfolioSize - optimizedLoss) / portfolioSize * 100;
            const optimizedCapital = portfolioSize * 0.08 * (1 + (optIndustryConc / 100) + (optGeographicConc / 100) - (optRatingDist / 200));
            
            // Calculate changes
            const returnChange = optimizedReturn - currentReturn;
            const lossChange = optimizedLoss - currentLoss;
            const rarChange = optimizedRar - currentRar;
            const capitalChange = optimizedCapital - currentCapital;
            
            // Update table values
            document.getElementById('current-return').textContent = `${(currentReturn * 100).toFixed(2)}%`;
            document.getElementById('optimized-return').textContent = `${(optimizedReturn * 100).toFixed(2)}%`;
            document.getElementById('return-change').textContent = `${(returnChange >= 0 ? '+' : '')}${(returnChange * 100).toFixed(2)}%`;
            
            document.getElementById('current-loss').textContent = `$${currentLoss.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('optimized-loss').textContent = `$${optimizedLoss.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('loss-change').textContent = `${lossChange >= 0 ? '+' : '-'}$${Math.abs(lossChange).toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            
            document.getElementById('current-rar').textContent = `${currentRar.toFixed(2)}%`;
            document.getElementById('optimized-rar').textContent = `${optimizedRar.toFixed(2)}%`;
            document.getElementById('rar-change').textContent = `${(rarChange >= 0 ? '+' : '')}${rarChange.toFixed(2)}%`;
            
            document.getElementById('current-capital').textContent = `$${currentCapital.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('optimized-capital').textContent = `$${optimizedCapital.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('capital-change').textContent = `${capitalChange >= 0 ? '+' : '-'}$${Math.abs(capitalChange).toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            
            // Create chart
            const ctx = document.getElementById('portfolio-optimization-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.portfolioOptimizationChart) {
                    window.portfolioOptimizationChart.destroy();
                }
                
                window.portfolioOptimizationChart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Return', 'Risk-Adjusted Return', 'Expected Loss', 'Economic Capital', 'Diversification'],
                        datasets: [
                            {
                                label: 'Current Portfolio',
                                data: [
                                    currentReturn * 100,
                                    currentRar,
                                    (currentLoss / portfolioSize) * 100,
                                    (currentCapital / portfolioSize) * 100,
                                    100 - (industryConcentration + geographicConcentration) / 2
                                ],
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                            },
                            {
                                label: 'Optimized Portfolio',
                                data: [
                                    optimizedReturn * 100,
                                    optimizedRar,
                                    (optimizedLoss / portfolioSize) * 100,
                                    (optimizedCapital / portfolioSize) * 100,
                                    100 - (optIndustryConc + optGeographicConc) / 2
                                ],
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            r: {
                                angleLines: {
                                    color: isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                grid: {
                                    color: isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                pointLabels: {
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                }
                            }
                        }
                    }
                });
            }
            
            // Generate recommendations
            recommendations.innerHTML = '';
            
            if (industryConcentration > 30) {
                const li = document.createElement('li');
                li.textContent = `Reduce industry concentration from ${industryConcentration}% to ${optIndustryConc}% to improve diversification and reduce risk.`;
                recommendations.appendChild(li);
            }
            
            if (geographicConcentration > 30) {
                const li = document.createElement('li');
                li.textContent = `Reduce geographic concentration from ${geographicConcentration}% to ${optGeographicConc}% to mitigate regional economic risks.`;
                recommendations.appendChild(li);
            }
            
            if (ratingDistribution < 60) {
                const li = document.createElement('li');
                li.textContent = `Increase investment grade exposure from ${ratingDistribution}% to ${optRatingDist}% to improve portfolio quality and reduce expected losses.`;
                recommendations.appendChild(li);
            }
            
            if (recommendations.children.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Your portfolio is already well-optimized. Continue to monitor for changes in market conditions.';
                recommendations.appendChild(li);
            }
            
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
