// Market Risk Module JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initializeMarketRiskCharts();
    
    // Set up interactive elements
    setupInteractiveElements();
    
    // Initialize tabs
    initializeTabs();
});

// Initialize all charts for the Market Risk module
function initializeMarketRiskCharts() {
    // Market Risk Overview Chart
    if (document.getElementById('market-risk-overview-chart')) {
        const ctx = document.getElementById('market-risk-overview-chart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Interest Rate Risk', 'Equity Risk', 'FX Risk', 'Commodity Risk', 'Credit Spread Risk', 'Volatility Risk'],
                datasets: [{
                    label: 'Risk Exposure',
                    data: [65, 78, 45, 52, 63, 58],
                    backgroundColor: 'rgba(0, 113, 227, 0.2)',
                    borderColor: 'rgba(0, 113, 227, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 113, 227, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}/100`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Scenario Impact Chart
    if (document.getElementById('scenario-impact-chart')) {
        const ctx = document.getElementById('scenario-impact-chart').getContext('2d');
        window.scenarioChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Interest Rate', 'Equity Market', 'FX Rate', 'Commodity Price', 'Total Impact'],
                datasets: [{
                    label: 'Portfolio Impact ($)',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(0, 113, 227, 0.7)',
                        'rgba(41, 151, 255, 0.7)',
                        'rgba(0, 183, 255, 0.7)',
                        'rgba(0, 236, 255, 0.7)',
                        'rgba(220, 53, 69, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Impact ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Risk Factor'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    // Monte Carlo Chart
    if (document.getElementById('monte-carlo-chart')) {
        const ctx = document.getElementById('monte-carlo-chart').getContext('2d');
        window.monteCarloChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Monte Carlo Simulation Results',
                    data: generateMonteCarloData(100),
                    backgroundColor: 'rgba(0, 113, 227, 0.5)',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Portfolio Value Change ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Simulation Run'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Run ${context.parsed.x}: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // VaR Distribution Chart
    if (document.getElementById('var-distribution-chart')) {
        const ctx = document.getElementById('var-distribution-chart').getContext('2d');
        window.varDistributionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 21}, (_, i) => -10 + i),
                datasets: [{
                    label: 'Return Distribution',
                    data: generateNormalDistribution(-10, 10, 21, 0, 3),
                    borderColor: 'rgba(0, 113, 227, 1)',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Probability Density'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Return (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    annotation: {
                        annotations: {
                            varLine: {
                                type: 'line',
                                xMin: -4.65,
                                xMax: -4.65,
                                borderColor: 'rgba(220, 53, 69, 1)',
                                borderWidth: 2,
                                label: {
                                    content: '99% VaR',
                                    enabled: true,
                                    position: 'top'
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // VaR ES Comparison Chart
    if (document.getElementById('var-es-comparison-chart')) {
        const ctx = document.getElementById('var-es-comparison-chart').getContext('2d');
        const returns = generateNormalDistribution(-10, 10, 100, 0, 3);
        const sortedReturns = [...returns].sort((a, b) => a - b);
        const varIndex = Math.floor(0.01 * sortedReturns.length);
        const var99 = sortedReturns[varIndex];
        const es99 = sortedReturns.slice(0, varIndex).reduce((a, b) => a + b, 0) / varIndex;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 100}, (_, i) => -10 + i * 0.2),
                datasets: [{
                    label: 'Return Distribution',
                    data: generateNormalDistribution(-10, 10, 100, 0, 3),
                    borderColor: 'rgba(0, 113, 227, 1)',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Probability Density'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Return (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    annotation: {
                        annotations: {
                            varLine: {
                                type: 'line',
                                xMin: var99,
                                xMax: var99,
                                borderColor: 'rgba(220, 53, 69, 1)',
                                borderWidth: 2,
                                label: {
                                    content: '99% VaR',
                                    enabled: true,
                                    position: 'top'
                                }
                            },
                            esLine: {
                                type: 'line',
                                xMin: es99,
                                xMax: es99,
                                borderColor: 'rgba(255, 193, 7, 1)',
                                borderWidth: 2,
                                label: {
                                    content: '99% ES',
                                    enabled: true,
                                    position: 'bottom'
                                }
                            },
                            tailArea: {
                                type: 'box',
                                xMin: -10,
                                xMax: var99,
                                backgroundColor: 'rgba(220, 53, 69, 0.2)',
                                borderWidth: 0
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Sensitivity Analysis Chart
    if (document.getElementById('sensitivity-analysis-chart')) {
        const ctx = document.getElementById('sensitivity-analysis-chart').getContext('2d');
        window.sensitivityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 11}, (_, i) => -50 + i * 10),
                datasets: [{
                    label: 'Portfolio Value Impact',
                    data: generateSensitivityData('interest-rate', -50, 50, 11),
                    borderColor: 'rgba(0, 113, 227, 1)',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Portfolio Value Change (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Risk Factor Change (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    // Capital Impact Chart
    if (document.getElementById('capital-impact-chart')) {
        const ctx = document.getElementById('capital-impact-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Baseline', 'Mild Stress', 'Moderate Stress', 'Severe Stress'],
                datasets: [{
                    label: 'CET1 Ratio (%)',
                    data: [15.2, 13.8, 11.5, 9.2],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(220, 53, 69, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CET1 Ratio (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Scenario'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    annotation: {
                        annotations: {
                            regulatoryMinimum: {
                                type: 'line',
                                yMin: 8,
                                yMax: 8,
                                borderColor: 'rgba(220, 53, 69, 1)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: 'Regulatory Minimum',
                                    enabled: true,
                                    position: 'left'
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    // FRTB Impact Chart
    if (document.getElementById('frtb-impact-chart')) {
        const ctx = document.getElementById('frtb-impact-chart').getContext('2d');
        window.frtbChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Current Market Risk RWA', 'FRTB Market Risk RWA', 'Change'],
                datasets: [{
                    label: 'Risk-Weighted Assets ($M)',
                    data: [1000, 1350, 350],
                    backgroundColor: [
                        'rgba(0, 113, 227, 0.7)',
                        'rgba(220, 53, 69, 0.7)',
                        'rgba(255, 193, 7, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'RWA ($M)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: ''
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    // VaR Trend Chart
    if (document.getElementById('var-trend-chart')) {
        const ctx = document.getElementById('var-trend-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Total VaR',
                    data: [3.8, 4.1, 3.9, 4.2, 4.5, 4.3, 4.0, 4.2, 4.4, 4.3, 4.1, 4.2],
                    borderColor: 'rgba(0, 113, 227, 1)',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Interest Rate VaR',
                    data: [2.8, 3.0, 2.9, 3.1, 3.3, 3.2, 3.0, 3.1, 3.2, 3.1, 3.0, 3.1],
                    borderColor: 'rgba(41, 151, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'Credit Spread VaR',
                    data: [2.5, 2.7, 2.6, 2.8, 2.9, 2.8, 2.7, 2.8, 2.9, 2.8, 2.7, 2.8],
                    borderColor: 'rgba(0, 183, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'FX VaR',
                    data: [1.3, 1.4, 1.3, 1.5, 1.6, 1.5, 1.4, 1.5, 1.6, 1.5, 1.4, 1.5],
                    borderColor: 'rgba(0, 236, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'VaR ($M)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    // Yield Curve Exposure Chart
    if (document.getElementById('yield-curve-exposure-chart')) {
        const ctx = document.getElementById('yield-curve-exposure-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['ON', '1W', '1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y'],
                datasets: [{
                    label: 'DV01 Exposure ($K)',
                    data: [10, 25, 50, 75, 100, 150, 200, 180, 150, 120, 80, 40, 20],
                    borderColor: 'rgba(0, 113, 227, 1)',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'DV01 ($K)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tenor'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    // Stress Scenario Chart
    if (document.getElementById('stress-scenario-chart')) {
        const ctx = document.getElementById('stress-scenario-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2008 Financial Crisis', '2020 COVID Shock', 'Rate Hike +200bp', 'Credit Spread Widening'],
                datasets: [{
                    label: 'P&L Impact ($M)',
                    data: [-12.5, -9.8, -8.2, -11.3],
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'P&L Impact ($M)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Stress Scenario'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    // Market Risk Dashboard Chart
    if (document.getElementById('market-risk-dashboard-chart')) {
        const ctx = document.getElementById('market-risk-dashboard-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['VaR', 'Stressed VaR', 'Expected Shortfall', 'Worst Case Loss'],
                datasets: [{
                    label: 'Current',
                    data: [4.2, 12.5, 5.8, 15.3],
                    backgroundColor: 'rgba(0, 113, 227, 0.7)',
                    borderWidth: 1
                }, {
                    label: 'Previous Month',
                    data: [3.9, 11.8, 5.5, 14.7],
                    backgroundColor: 'rgba(160, 160, 160, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value ($M)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Risk Measure'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
}

// Set up interactive elements
function setupInteractiveElements() {
    // Scenario Analysis Tool
    setupScenarioAnalysisTool();
    
    // Monte Carlo Simulation
    setupMonteCarloSimulation();
    
    // VaR Calculator
    setupVaRCalculator();
    
    // Sensitivity Analysis Tool
    setupSensitivityAnalysisTool();
    
    // FRTB Calculator
    setupFRTBCalculator();
}

// Set up Scenario Analysis Tool
function setupScenarioAnalysisTool() {
    const interestRateSlider = document.getElementById('interest-rate-slider');
    const equityMarketSlider = document.getElementById('equity-market-slider');
    const fxRateSlider = document.getElementById('fx-rate-slider');
    const commodityPriceSlider = document.getElementById('commodity-price-slider');
    
    const interestRateValue = document.getElementById('interest-rate-value');
    const equityMarketValue = document.getElementById('equity-market-value');
    const fxRateValue = document.getElementById('fx-rate-value');
    const commodityPriceValue = document.getElementById('commodity-price-value');
    
    const portfolioImpact = document.getElementById('portfolio-impact');
    const portfolioImpactPercentage = document.getElementById('portfolio-impact-percentage');
    
    if (interestRateSlider && equityMarketSlider && fxRateSlider && commodityPriceSlider) {
        // Update values on slider change
        interestRateSlider.addEventListener('input', updateScenarioAnalysis);
        equityMarketSlider.addEventListener('input', updateScenarioAnalysis);
        fxRateSlider.addEventListener('input', updateScenarioAnalysis);
        commodityPriceSlider.addEventListener('input', updateScenarioAnalysis);
        
        // Initial update
        updateScenarioAnalysis();
    }
    
    function updateScenarioAnalysis() {
        // Get slider values
        const interestRateChange = parseFloat(interestRateSlider.value);
        const equityMarketChange = parseFloat(equityMarketSlider.value);
        const fxRateChange = parseFloat(fxRateSlider.value);
        const commodityPriceChange = parseFloat(commodityPriceSlider.value);
        
        // Update displayed values
        interestRateValue.textContent = `${interestRateChange}%`;
        equityMarketValue.textContent = `${equityMarketChange}%`;
        fxRateValue.textContent = `${fxRateChange}%`;
        commodityPriceValue.textContent = `${commodityPriceChange}%`;
        
        // Calculate impacts (simplified model)
        const interestRateImpact = -interestRateChange * 250000 / 100; // $250K per 1% change
        const equityMarketImpact = equityMarketChange * 150000 / 100; // $150K per 1% change
        const fxRateImpact = fxRateChange * 100000 / 100; // $100K per 1% change
        const commodityPriceImpact = commodityPriceChange * 80000 / 100; // $80K per 1% change
        
        const totalImpact = interestRateImpact + equityMarketImpact + fxRateImpact + commodityPriceImpact;
        const portfolioValue = 10000000; // $10M portfolio
        const impactPercentage = totalImpact / portfolioValue * 100;
        
        // Update impact display
        if (portfolioImpact && portfolioImpactPercentage) {
            portfolioImpact.textContent = `$${totalImpact.toLocaleString()}`;
            portfolioImpactPercentage.textContent = `${impactPercentage.toFixed(2)}% of portfolio value`;
            
            // Update class based on positive/negative impact
            if (totalImpact >= 0) {
                portfolioImpactPercentage.className = 'dashboard-change positive';
            } else {
                portfolioImpactPercentage.className = 'dashboard-change negative';
            }
        }
        
        // Update chart if available
        if (window.scenarioChart) {
            window.scenarioChart.data.datasets[0].data = [
                interestRateImpact,
                equityMarketImpact,
                fxRateImpact,
                commodityPriceImpact,
                totalImpact
            ];
            window.scenarioChart.update();
        }
    }
}

// Set up Monte Carlo Simulation
function setupMonteCarloSimulation() {
    const runMonteCarloButton = document.getElementById('run-monte-carlo');
    
    if (runMonteCarloButton && window.monteCarloChart) {
        runMonteCarloButton.addEventListener('click', function() {
            // Generate new simulation data
            const newData = generateMonteCarloData(100);
            
            // Update chart
            window.monteCarloChart.data.datasets[0].data = newData;
            window.monteCarloChart.update();
        });
    }
}

// Generate Monte Carlo simulation data
function generateMonteCarloData(points) {
    const data = [];
    for (let i = 0; i < points; i++) {
        const x = i;
        // Normal distribution around 0 with standard deviation of 50000
        const y = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) * 50000;
        data.push({x, y});
    }
    return data;
}

// Set up VaR Calculator
function setupVaRCalculator() {
    const calculateVarButton = document.getElementById('calculate-var');
    
    if (calculateVarButton) {
        calculateVarButton.addEventListener('click', calculateVaR);
        
        // Initial calculation
        calculateVaR();
    }
    
    function calculateVaR() {
        const portfolioValue = parseFloat(document.getElementById('portfolio-value').value);
        const portfolioVolatility = parseFloat(document.getElementById('portfolio-volatility').value) / 100;
        const confidenceLevel = parseFloat(document.getElementById('confidence-level').value);
        const timeHorizon = parseFloat(document.getElementById('time-horizon').value);
        
        // Z-score for confidence level
        const zScore = getZScore(confidenceLevel);
        
        // Calculate VaR
        const var1d = portfolioValue * portfolioVolatility * zScore;
        const varTh = var1d * Math.sqrt(timeHorizon);
        
        // Update result
        const varResult = document.getElementById('var-result');
        const varPercentage = document.getElementById('var-percentage');
        
        if (varResult && varPercentage) {
            varResult.textContent = `$${varTh.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            const percentage = (varTh / portfolioValue * 100).toFixed(2);
            varPercentage.textContent = `${percentage}% of portfolio value`;
        }
        
        // Update VaR distribution chart if available
        if (window.varDistributionChart) {
            // Update VaR line position
            const varLineValue = -zScore * 3 / 2.33; // Scale to match our distribution
            
            if (window.varDistributionChart.options.plugins.annotation) {
                window.varDistributionChart.options.plugins.annotation.annotations.varLine.xMin = varLineValue;
                window.varDistributionChart.options.plugins.annotation.annotations.varLine.xMax = varLineValue;
                window.varDistributionChart.options.plugins.annotation.annotations.varLine.label.content = 
                    `${(confidenceLevel * 100).toFixed(0)}% VaR`;
            }
            
            window.varDistributionChart.update();
        }
    }
    
    function getZScore(confidenceLevel) {
        // Approximation of inverse normal CDF
        if (confidenceLevel === 0.95) return 1.645;
        if (confidenceLevel === 0.99) return 2.326;
        if (confidenceLevel === 0.995) return 2.576;
        return 2.326; // Default to 99%
    }
}

// Set up Sensitivity Analysis Tool
function setupSensitivityAnalysisTool() {
    const sensitivityRiskFactor = document.getElementById('sensitivity-risk-factor');
    const sensitivityMagnitude = document.getElementById('sensitivity-magnitude');
    const sensitivityMagnitudeValue = document.getElementById('sensitivity-magnitude-value');
    
    if (sensitivityRiskFactor && sensitivityMagnitude && sensitivityMagnitudeValue) {
        // Update on risk factor change
        sensitivityRiskFactor.addEventListener('change', updateSensitivityAnalysis);
        
        // Update on magnitude change
        sensitivityMagnitude.addEventListener('input', function() {
            sensitivityMagnitudeValue.textContent = `${sensitivityMagnitude.value}%`;
            updateSensitivityAnalysis();
        });
        
        // Initial update
        updateSensitivityAnalysis();
    }
    
    function updateSensitivityAnalysis() {
        const riskFactor = sensitivityRiskFactor.value;
        const magnitude = parseInt(sensitivityMagnitude.value);
        
        // Update chart if available
        if (window.sensitivityChart) {
            // Generate new data based on selected risk factor
            const newData = generateSensitivityData(riskFactor, -50, 50, 11);
            
            // Update chart
            window.sensitivityChart.data.datasets[0].data = newData;
            window.sensitivityChart.data.datasets[0].label = `${getRiskFactorLabel(riskFactor)} Sensitivity`;
            window.sensitivityChart.update();
            
            // Highlight current magnitude
            highlightMagnitude(magnitude);
        }
    }
    
    function getRiskFactorLabel(riskFactor) {
        switch(riskFactor) {
            case 'interest-rate': return 'Interest Rate';
            case 'equity': return 'Equity Market';
            case 'fx': return 'Foreign Exchange';
            case 'credit-spread': return 'Credit Spread';
            case 'commodity': return 'Commodity Price';
            default: return 'Risk Factor';
        }
    }
    
    function generateSensitivityData(riskFactor, min, max, points) {
        const data = [];
        const step = (max - min) / (points - 1);
        
        for (let i = 0; i < points; i++) {
            const x = min + i * step;
            let y;
            
            switch(riskFactor) {
                case 'interest-rate':
                    // Non-linear relationship for interest rates
                    y = -x * 0.2 - Math.sign(x) * Math.pow(Math.abs(x) / 10, 1.5);
                    break;
                case 'equity':
                    // Linear relationship for equity
                    y = x * 0.8;
                    break;
                case 'fx':
                    // Linear relationship for FX
                    y = x * 0.5;
                    break;
                case 'credit-spread':
                    // Non-linear relationship for credit spreads
                    y = -x * 0.3 - Math.sign(x) * Math.pow(Math.abs(x) / 15, 1.2);
                    break;
                case 'commodity':
                    // Linear relationship for commodities
                    y = x * 0.4;
                    break;
                default:
                    y = x * 0.5;
            }
            
            data.push(y);
        }
        
        return data;
    }
    
    function highlightMagnitude(magnitude) {
        // Implementation would depend on Chart.js version and plugins
        // This is a placeholder for the functionality
        console.log(`Highlighting magnitude: ${magnitude}%`);
    }
}

// Set up FRTB Calculator
function setupFRTBCalculator() {
    const frtbApproach = document.getElementById('frtb-approach');
    const irPercentage = document.getElementById('ir-percentage');
    const equityPercentage = document.getElementById('equity-percentage');
    const fxPercentage = document.getElementById('fx-percentage');
    const creditPercentage = document.getElementById('credit-percentage');
    const commodityPercentage = document.getElementById('commodity-percentage');
    
    const irPercentageValue = document.getElementById('ir-percentage-value');
    const equityPercentageValue = document.getElementById('equity-percentage-value');
    const fxPercentageValue = document.getElementById('fx-percentage-value');
    const creditPercentageValue = document.getElementById('credit-percentage-value');
    const commodityPercentageValue = document.getElementById('commodity-percentage-value');
    
    const calculateFrtbButton = document.getElementById('calculate-frtb');
    
    if (frtbApproach && irPercentage && equityPercentage && fxPercentage && creditPercentage && commodityPercentage && calculateFrtbButton) {
        // Update percentage values on slider change
        irPercentage.addEventListener('input', function() {
            irPercentageValue.textContent = `${irPercentage.value}%`;
        });
        
        equityPercentage.addEventListener('input', function() {
            equityPercentageValue.textContent = `${equityPercentage.value}%`;
        });
        
        fxPercentage.addEventListener('input', function() {
            fxPercentageValue.textContent = `${fxPercentage.value}%`;
        });
        
        creditPercentage.addEventListener('input', function() {
            creditPercentageValue.textContent = `${creditPercentage.value}%`;
        });
        
        commodityPercentage.addEventListener('input', function() {
            commodityPercentageValue.textContent = `${commodityPercentage.value}%`;
        });
        
        // Calculate FRTB impact on button click
        calculateFrtbButton.addEventListener('click', calculateFRTBImpact);
    }
    
    function calculateFRTBImpact() {
        const approach = frtbApproach.value;
        const ir = parseInt(irPercentage.value) / 100;
        const equity = parseInt(equityPercentage.value) / 100;
        const fx = parseInt(fxPercentage.value) / 100;
        const credit = parseInt(creditPercentage.value) / 100;
        const commodity = parseInt(commodityPercentage.value) / 100;
        
        // Validate that percentages sum to 100%
        const total = ir + equity + fx + credit + commodity;
        if (Math.abs(total - 1) > 0.01) {
            alert('Portfolio composition must sum to 100%. Current sum: ' + (total * 100).toFixed(0) + '%');
            return;
        }
        
        // Calculate current RWA (simplified model)
        const currentRWA = 1000; // $1B baseline
        
        // Calculate FRTB RWA based on approach and composition
        let frtbRWA;
        if (approach === 'sa') {
            // Standardized Approach multipliers (simplified)
            frtbRWA = currentRWA * (
                ir * 1.2 +
                equity * 1.5 +
                fx * 1.3 +
                credit * 1.6 +
                commodity * 1.4
            );
        } else {
            // Internal Models Approach multipliers (simplified)
            frtbRWA = currentRWA * (
                ir * 1.1 +
                equity * 1.3 +
                fx * 1.2 +
                credit * 1.4 +
                commodity * 1.25
            );
        }
        
        // Calculate change
        const change = frtbRWA - currentRWA;
        
        // Update chart if available
        if (window.frtbChart) {
            window.frtbChart.data.datasets[0].data = [currentRWA, frtbRWA, change];
            window.frtbChart.update();
        }
    }
}

// Initialize tabs functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Get parent tabs container
                const tabsContainer = tab.closest('.tabs');
                if (!tabsContainer) return;
                
                // Remove active class from all tabs in this container
                tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Get target content id
                const targetId = tab.getAttribute('data-target');
                if (!targetId) return;
                
                // Find the closest parent that contains tab contents
                let tabContentsContainer = tabsContainer.nextElementSibling;
                while (tabContentsContainer && !tabContentsContainer.querySelector('.tab-content')) {
                    tabContentsContainer = tabContentsContainer.nextElementSibling;
                }
                
                if (!tabContentsContainer) return;
                
                // Hide all tab contents in this container
                tabContentsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Show corresponding tab content
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
}

// Generate normal distribution data
function generateNormalDistribution(min, max, points, mean, stdDev) {
    const data = [];
    const step = (max - min) / (points - 1);
    
    for (let i = 0; i < points; i++) {
        const x = min + i * step;
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                 Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        data.push(y);
    }
    
    return data;
}
