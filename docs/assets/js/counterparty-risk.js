/**
 * Counterparty Risk Module JavaScript
 * This file contains all the interactive functionality for the Counterparty Risk module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts and interactive elements when the DOM is fully loaded
    initializeCounterpartyRiskChart();
    setupExposureProfileSimulator();
    setupCVACalculator();
    setupWrongWayRiskAnalyzer();
    setupSACCRCalculator();
    setupKnowledgeTests();
});

/**
 * Initialize Counterparty Risk vs. Traditional Credit Risk Chart
 * Shows the comparison between counterparty risk and traditional credit risk
 */
function initializeCounterpartyRiskChart() {
    const ctx = document.getElementById('ccr-vs-credit-risk-chart');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Bilateral Risk', 
                    'Time Dependency', 
                    'Market Sensitivity', 
                    'Netting Benefits',
                    'Collateral Impact',
                    'Complexity'
                ],
                datasets: [
                    {
                        label: 'Counterparty Credit Risk',
                        data: [90, 85, 80, 75, 70, 85],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                    },
                    {
                        label: 'Traditional Credit Risk',
                        data: [30, 40, 35, 20, 40, 45],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
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
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
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
}

/**
 * Setup Exposure Profile Simulator
 * Simulates exposure profiles for different derivative transactions
 */
function setupExposureProfileSimulator() {
    const form = document.getElementById('exposure-simulator-form');
    const resultContainer = document.getElementById('exposure-profile-container');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const transactionType = document.getElementById('transaction-type').value;
            const notionalAmount = parseFloat(document.getElementById('notional-amount').value);
            const maturity = parseFloat(document.getElementById('maturity').value);
            const volatility = parseFloat(document.getElementById('volatility').value) / 100;
            
            // Generate time points (quarterly)
            const timePoints = [];
            const numPoints = Math.ceil(maturity * 4); // Quarterly points
            for (let i = 0; i <= numPoints; i++) {
                timePoints.push(i / 4);
            }
            
            // Generate exposure profiles based on transaction type
            const expectedExposure = [];
            const potentialFutureExposure = [];
            
            for (let i = 0; i < timePoints.length; i++) {
                const t = timePoints[i];
                let ee = 0;
                let pfe = 0;
                
                if (transactionType === 'interest-rate-swap') {
                    // Simplified model for IRS exposure
                    const timeToMaturity = maturity - t;
                    if (timeToMaturity > 0) {
                        const peakExposure = 0.05; // 5% of notional at peak
                        const peakTime = maturity / 3; // Peak at 1/3 of maturity
                        
                        // Bell-shaped curve for exposure
                        ee = notionalAmount * peakExposure * Math.exp(-0.5 * Math.pow((t - peakTime) / (maturity / 4), 2));
                        pfe = ee * (1 + volatility * Math.sqrt(timeToMaturity) * 2.33); // 99% confidence level
                    }
                } else if (transactionType === 'fx-forward') {
                    // Simplified model for FX forward exposure
                    const timeToMaturity = maturity - t;
                    if (timeToMaturity > 0) {
                        // Linear increase to maturity
                        ee = notionalAmount * (t / maturity) * 0.03; // Max 3% of notional
                        pfe = ee * (1 + volatility * Math.sqrt(timeToMaturity) * 2.33);
                    }
                } else if (transactionType === 'credit-default-swap') {
                    // Simplified model for CDS exposure
                    const timeToMaturity = maturity - t;
                    if (timeToMaturity > 0) {
                        // Relatively flat exposure profile
                        ee = notionalAmount * 0.02; // 2% of notional
                        pfe = ee * (1 + volatility * Math.sqrt(timeToMaturity) * 2.33);
                    }
                } else if (transactionType === 'equity-option') {
                    // Simplified model for equity option exposure
                    const timeToMaturity = maturity - t;
                    if (timeToMaturity > 0) {
                        // Decreasing exposure profile (highest at start)
                        ee = notionalAmount * 0.1 * Math.exp(-2 * t / maturity); // Starting at 10% of notional
                        pfe = ee * (1 + volatility * Math.sqrt(timeToMaturity) * 2.33);
                    }
                }
                
                expectedExposure.push(ee);
                potentialFutureExposure.push(pfe);
            }
            
            // Calculate key metrics
            const peakPFE = Math.max(...potentialFutureExposure);
            const epe = expectedExposure.reduce((sum, value) => sum + value, 0) / expectedExposure.length;
            const effectiveEPE = expectedExposure.reduce((max, value, index) => {
                return index === 0 ? value : Math.max(max, value);
            }, 0);
            
            // Update result table
            document.getElementById('peak-pfe').textContent = `$${peakPFE.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('epe').textContent = `$${epe.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('effective-epe').textContent = `$${effectiveEPE.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            
            // Create chart
            const ctx = document.getElementById('exposure-profile-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.exposureProfileChart) {
                    window.exposureProfileChart.destroy();
                }
                
                window.exposureProfileChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: timePoints.map(t => `${t.toFixed(2)} Years`),
                        datasets: [
                            {
                                label: 'Expected Exposure (EE)',
                                data: expectedExposure,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Potential Future Exposure (PFE)',
                                data: potentialFutureExposure,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Exposure ($)',
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                },
                                ticks: {
                                    color: isDarkMode() ? '#ffffff' : '#333333',
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time',
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                },
                                ticks: {
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
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.dataset.label}: $${context.raw.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
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
 * Setup CVA Calculator
 * Calculates Credit Valuation Adjustment for derivative transactions
 */
function setupCVACalculator() {
    const form = document.getElementById('cva-calculator-form');
    const resultContainer = document.getElementById('cva-result-container');
    const resultElement = document.getElementById('cva-result');
    const percentageElement = document.getElementById('cva-percentage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const expectedExposure = parseFloat(document.getElementById('expected-exposure').value);
            const counterpartyPD = parseFloat(document.getElementById('counterparty-pd').value) / 100;
            const recoveryRate = parseFloat(document.getElementById('recovery-rate').value) / 100;
            const discountRate = parseFloat(document.getElementById('discount-rate').value) / 100;
            
            // Calculate CVA
            // Simplified CVA calculation: CVA = (1 - RR) * EE * PD * DF
            const lgd = 1 - recoveryRate;
            const discountFactor = 1 / (1 + discountRate);
            const cva = lgd * expectedExposure * counterpartyPD * discountFactor;
            
            // Calculate CVA as percentage of exposure
            const cvaPercentage = (cva / expectedExposure) * 100;
            
            // Display results
            resultElement.textContent = `$${cva.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            percentageElement.textContent = `${cvaPercentage.toFixed(2)}%`;
            
            // Create chart
            const ctx = document.getElementById('cva-components-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.cvaComponentsChart) {
                    window.cvaComponentsChart.destroy();
                }
                
                window.cvaComponentsChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['CVA', 'Risk-Free Value'],
                        datasets: [{
                            data: [cva, expectedExposure - cva],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)'
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
                                        const value = context.raw;
                                        const percentage = (value / expectedExposure) * 100;
                                        return `${context.label}: $${value.toLocaleString(undefined, {maximumFractionDigits: 2})} (${percentage.toFixed(2)}%)`;
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
 * Setup Wrong-Way Risk Analyzer
 * Analyzes the impact of wrong-way risk on exposure and expected loss
 */
function setupWrongWayRiskAnalyzer() {
    const form = document.getElementById('wrong-way-risk-form');
    const resultContainer = document.getElementById('wrong-way-risk-result-container');
    const riskAssessment = document.getElementById('risk-assessment');
    const mitigationRecommendations = document.getElementById('mitigation-recommendations');
    
    // Update range input values as they change
    const correlationLevel = document.getElementById('correlation-level');
    const correlationLevelValue = document.getElementById('correlation-level-value');
    
    if (correlationLevel && correlationLevelValue) {
        correlationLevel.addEventListener('input', () => {
            correlationLevelValue.textContent = `${correlationLevel.value}%`;
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const transactionDescription = document.getElementById('transaction-description').value;
            const correlationLevel = parseInt(document.getElementById('correlation-level').value);
            const exposureAmount = parseFloat(document.getElementById('exposure-amount').value);
            const stressScenario = document.getElementById('stress-scenario').value;
            
            // Calculate base case values
            const basePD = 0.02; // 2% base probability of default
            const baseExposure = exposureAmount;
            const baseLoss = baseExposure * basePD * 0.6; // Assuming 40% recovery rate
            
            // Calculate stress factors based on scenario
            let stressFactor = 1.0;
            if (stressScenario === 'mild') {
                stressFactor = 1.5;
            } else if (stressScenario === 'moderate') {
                stressFactor = 2.0;
            } else if (stressScenario === 'severe') {
                stressFactor = 3.0;
            }
            
            // Calculate wrong-way risk impact
            // Correlation level affects both exposure and PD
            const correlationFactor = Math.max(0, correlationLevel / 100);
            const wwrExposure = baseExposure * (1 + correlationFactor * stressFactor * 0.5);
            const pdIncrease = basePD * correlationFactor * stressFactor;
            const wwrPD = basePD + pdIncrease;
            const wwrLoss = wwrExposure * wwrPD * 0.6;
            
            // Calculate impacts
            const exposureImpact = wwrExposure - baseExposure;
            const lossImpact = wwrLoss - baseLoss;
            
            // Update table values
            document.getElementById('base-exposure').textContent = `$${baseExposure.toLocaleString()}`;
            document.getElementById('wwr-exposure').textContent = `$${wwrExposure.toLocaleString()}`;
            document.getElementById('pd-increase').textContent = `${(pdIncrease * 100).toFixed(2)}%`;
            document.getElementById('base-loss').textContent = `$${baseLoss.toLocaleString()}`;
            document.getElementById('wwr-loss').textContent = `$${wwrLoss.toLocaleString()}`;
            document.getElementById('exposure-impact').textContent = `$${exposureImpact.toLocaleString()}`;
            document.getElementById('loss-impact').textContent = `$${lossImpact.toLocaleString()}`;
            
            // Create chart
            const ctx = document.getElementById('wrong-way-risk-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.wrongWayRiskChart) {
                    window.wrongWayRiskChart.destroy();
                }
                
                window.wrongWayRiskChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Exposure', 'Expected Loss'],
                        datasets: [
                            {
                                label: 'Base Case',
                                data: [baseExposure, baseLoss],
                                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            },
                            {
                                label: 'With Wrong-Way Risk',
                                data: [wwrExposure, wwrLoss],
                                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Amount ($)',
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                },
                                ticks: {
                                    color: isDarkMode() ? '#ffffff' : '#333333',
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
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
                                position: 'bottom',
                                labels: {
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            // Generate risk assessment
            let riskLevel = '';
            if (lossImpact / baseLoss < 0.5) {
                riskLevel = 'Low';
            } else if (lossImpact / baseLoss < 1.0) {
                riskLevel = 'Moderate';
            } else if (lossImpact / baseLoss < 2.0) {
                riskLevel = 'High';
            } else {
                riskLevel = 'Very High';
            }
            
            riskAssessment.textContent = `${riskLevel} Wrong-Way Risk: The expected loss increases by ${((lossImpact / baseLoss) * 100).toFixed(0)}% under stress conditions due to the correlation between exposure and counterparty credit quality.`;
            
            // Generate mitigation recommendations
            mitigationRecommendations.innerHTML = '';
            
            // Transaction-specific recommendations
            if (transactionDescription === 'fx-emerging') {
                addRecommendation('Consider implementing additional collateral requirements for emerging market counterparties.');
                addRecommendation('Set exposure limits specific to emerging market currencies.');
                addRecommendation('Explore hedging strategies to mitigate currency-specific risks.');
            } else if (transactionDescription === 'commodity-producer') {
                addRecommendation('Implement commodity price triggers for additional collateral calls.');
                addRecommendation('Diversify exposure across multiple commodity producers.');
                addRecommendation('Consider credit default swaps to hedge counterparty risk.');
            } else if (transactionDescription === 'equity-put') {
                addRecommendation('Avoid selling put options on counterparty\'s own stock or closely related entities.');
                addRecommendation('Implement strict limits on transactions with specific wrong-way risk.');
                addRecommendation('Require additional initial margin for transactions with potential wrong-way risk.');
            } else if (transactionDescription === 'sovereign-cds') {
                addRecommendation('Set country-specific limits for banks headquartered in the referenced sovereign.');
                addRecommendation('Implement additional stress tests for sovereign-bank correlation.');
                addRecommendation('Consider alternative hedging strategies that avoid direct wrong-way risk.');
            }
            
            // General recommendations based on risk level
            if (riskLevel === 'High' || riskLevel === 'Very High') {
                addRecommendation('Consider novating the transaction to a central counterparty if possible.');
                addRecommendation('Significantly increase collateral requirements and monitoring frequency.');
            }
            
            // Show result container
            resultContainer.style.display = 'block';
            
            function addRecommendation(text) {
                const li = document.createElement('li');
                li.textContent = text;
                mitigationRecommendations.appendChild(li);
            }
        });
    }
}

/**
 * Setup SA-CCR Calculator
 * Calculates exposure using the Standardized Approach for Counterparty Credit Risk
 */
function setupSACCRCalculator() {
    const form = document.getElementById('sa-ccr-calculator-form');
    const resultContainer = document.getElementById('sa-ccr-result-container');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get values from form
            const transactionCategory = document.getElementById('transaction-category').value;
            const adjustedNotional = parseFloat(document.getElementById('adjusted-notional').value);
            const maturityFactor = parseFloat(document.getElementById('maturity-factor').value);
            const isMargined = document.getElementById('is-margined').value === 'yes';
            
            // Get supervisory factors based on transaction category
            let supervisoryFactor = 0;
            switch (transactionCategory) {
                case 'interest-rate':
                    supervisoryFactor = 0.005; // 0.5%
                    break;
                case 'fx':
                    supervisoryFactor = 0.04; // 4%
                    break;
                case 'credit':
                    supervisoryFactor = 0.05; // 5% (simplified, actual values depend on rating)
                    break;
                case 'equity':
                    supervisoryFactor = 0.32; // 32% (simplified, actual values depend on equity type)
                    break;
                case 'commodity':
                    supervisoryFactor = 0.18; // 18% (simplified, actual values depend on commodity type)
                    break;
            }
            
            // Calculate SA-CCR components
            // Simplified calculation for educational purposes
            
            // Replacement Cost (RC)
            // For margined trades, RC is based on VM received/posted
            // For non-margined trades, RC is current market value
            // Simplified assumption: RC is 2% of notional for margined, 5% for non-margined
            const replacementCost = adjustedNotional * (isMargined ? 0.02 : 0.05);
            
            // Potential Future Exposure (PFE)
            // PFE = Multiplier * AddOn
            // AddOn = Sum of AddOns across asset classes
            // Simplified: AddOn = Adjusted Notional * Supervisory Factor * Maturity Factor
            const addOn = adjustedNotional * supervisoryFactor * maturityFactor;
            
            // Multiplier (simplified)
            const multiplier = isMargined ? 0.85 : 1.0;
            
            const potentialFutureExposure = multiplier * addOn;
            
            // Exposure at Default (EAD)
            const exposureAtDefault = 1.4 * (replacementCost + potentialFutureExposure);
            
            // Risk-Weighted Assets (RWA) - assuming 100% risk weight
            const riskWeightedAssets = exposureAtDefault * 1.0;
            
            // Capital Requirement (8% of RWA)
            const capitalRequirement = riskWeightedAssets * 0.08;
            
            // Update table values
            document.getElementById('replacement-cost').textContent = `$${replacementCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('potential-future-exposure').textContent = `$${potentialFutureExposure.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('exposure-at-default').textContent = `$${exposureAtDefault.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('risk-weighted-assets').textContent = `$${riskWeightedAssets.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            document.getElementById('capital-requirement').textContent = `$${capitalRequirement.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            
            // Create chart
            const ctx = document.getElementById('sa-ccr-components-chart');
            
            if (ctx) {
                // Destroy existing chart if it exists
                if (window.saCCRComponentsChart) {
                    window.saCCRComponentsChart.destroy();
                }
                
                window.saCCRComponentsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Replacement Cost', 'Potential Future Exposure', 'Exposure at Default'],
                        datasets: [{
                            label: 'Amount ($)',
                            data: [replacementCost, potentialFutureExposure, exposureAtDefault],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(255, 99, 132, 0.7)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
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
                                title: {
                                    display: true,
                                    text: 'Amount ($)',
                                    color: isDarkMode() ? '#ffffff' : '#333333'
                                },
                                ticks: {
                                    color: isDarkMode() ? '#ffffff' : '#333333',
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
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
                                        return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
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
