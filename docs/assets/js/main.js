// Main JavaScript for Financial Risk Management Course

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize tabs
    initTabs();
    
    // Initialize dark mode toggle
    initDarkMode();
    
    // Initialize skill level selector
    initSkillLevelSelector();
    
    // Initialize knowledge test
    initKnowledgeTest();
    
    // Initialize sample charts
    initSampleCharts();
    
    // Initialize API data fetching
    initApiDataFetching();
});

// Animation on scroll
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport
    checkAnimations();
    
    // Check on scroll
    window.addEventListener('scroll', checkAnimations);
    
    function checkAnimations() {
        const windowHeight = window.innerHeight;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
}

// Tab functionality
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the target content
            const target = tab.getAttribute('data-target');
            
            // Remove active class from all tabs in the same group
            const tabGroup = tab.closest('.tabs');
            tabGroup.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab content in the same section
            const tabContents = tab.closest('section').querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the target content
            document.getElementById(target).classList.add('active');
        });
    });
}

// Dark mode toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    darkModeToggle.addEventListener('click', () => {
        // Toggle theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save preference
        localStorage.setItem('theme', newTheme);
    });
}

// Skill level selector
function initSkillLevelSelector() {
    const skillOptions = document.querySelectorAll('.skill-option');
    const body = document.body;
    
    // Check for saved skill level preference or use default
    const savedSkillLevel = localStorage.getItem('skillLevel') || 'beginner';
    body.className = `skill-level-${savedSkillLevel}`;
    
    // Update active skill option
    skillOptions.forEach(option => {
        if (option.getAttribute('data-skill') === savedSkillLevel) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    skillOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Get selected skill level
            const skillLevel = option.getAttribute('data-skill');
            
            // Remove active class from all options
            skillOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update body class for content visibility
            body.className = `skill-level-${skillLevel}`;
            
            // Save preference
            localStorage.setItem('skillLevel', skillLevel);
        });
    });
}

// Knowledge test functionality
function initKnowledgeTest() {
    const checkAnswerButton = document.getElementById('check-answer');
    if (!checkAnswerButton) return;
    
    const options = document.querySelectorAll('.option');
    const feedback = document.querySelector('.feedback');
    
    checkAnswerButton.addEventListener('click', () => {
        let selectedOption = null;
        
        // Find selected option
        options.forEach(option => {
            if (option.classList.contains('selected')) {
                selectedOption = option;
            }
        });
        
        // If no option selected, show message
        if (!selectedOption) {
            feedback.textContent = 'Please select an answer.';
            feedback.className = 'feedback';
            feedback.classList.add('incorrect');
            return;
        }
        
        // Check if correct
        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
        
        // Update option classes
        options.forEach(option => {
            option.classList.remove('selected');
            
            if (option === selectedOption) {
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            } else if (option.getAttribute('data-correct') === 'true') {
                option.classList.add('correct');
            }
        });
        
        // Show feedback
        feedback.textContent = isCorrect 
            ? 'Correct! Value at Risk (VaR) is not a component of Expected Loss calculation.'
            : 'Incorrect. The correct answer is Value at Risk (VaR). Expected Loss is calculated as PD × LGD × EAD.';
        feedback.className = 'feedback';
        feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    });
    
    // Option selection
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Clear feedback
            feedback.className = 'feedback';
            feedback.textContent = '';
        });
    });
}

// Initialize sample charts
function initSampleCharts() {
    // Risk-Return Chart
    const riskReturnChart = document.getElementById('risk-return-chart');
    if (riskReturnChart) {
        new Chart(riskReturnChart, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Conservative Portfolio',
                    data: [
                        { x: 5, y: 4 },
                        { x: 6, y: 5 },
                        { x: 7, y: 6 },
                        { x: 8, y: 7 }
                    ],
                    backgroundColor: 'rgba(52, 199, 89, 0.7)',
                    borderColor: 'rgba(52, 199, 89, 1)',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Moderate Portfolio',
                    data: [
                        { x: 10, y: 8 },
                        { x: 12, y: 10 },
                        { x: 14, y: 12 },
                        { x: 16, y: 14 }
                    ],
                    backgroundColor: 'rgba(255, 149, 0, 0.7)',
                    borderColor: 'rgba(255, 149, 0, 1)',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Aggressive Portfolio',
                    data: [
                        { x: 18, y: 14 },
                        { x: 20, y: 16 },
                        { x: 22, y: 18 },
                        { x: 24, y: 20 }
                    ],
                    backgroundColor: 'rgba(255, 59, 48, 0.7)',
                    borderColor: 'rgba(255, 59, 48, 1)',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Risk (%)',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Return (%)',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: Risk ${context.parsed.x}%, Return ${context.parsed.y}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize API data fetching
function initApiDataFetching() {
    const fetchDataButton = document.getElementById('fetch-data');
    if (!fetchDataButton) return;
    
    fetchDataButton.addEventListener('click', fetchMarketData);
    
    function fetchMarketData() {
        const symbol = document.getElementById('stock-symbol').value;
        const interval = document.getElementById('time-interval').value;
        const container = document.getElementById('market-data-container');
        
        // Show loading state
        container.innerHTML = `
            <div class="api-data-loading">
                <div class="loading-spinner"></div>
                <p>Fetching market data for ${symbol}...</p>
            </div>
        `;
        
        // In a real implementation, we would fetch data from the Alpha Vantage API
        // For demonstration purposes, we'll simulate a response with sample data
        setTimeout(() => {
            // Sample data structure similar to Alpha Vantage response
            const sampleData = generateSampleMarketData(symbol, interval);
            displayMarketData(sampleData, symbol, interval);
        }, 1500);
    }
    
    function generateSampleMarketData(symbol, interval) {
        // Generate timestamps for the last 20 intervals
        const timestamps = [];
        const prices = [];
        const volumes = [];
        
        const now = new Date();
        const intervalMinutes = parseInt(interval);
        
        // Base price varies by symbol
        let basePrice;
        switch(symbol) {
            case 'AAPL': basePrice = 175; break;
            case 'MSFT': basePrice = 380; break;
            case 'GOOGL': basePrice = 145; break;
            case 'AMZN': basePrice = 175; break;
            case 'NVDA': basePrice = 850; break;
            default: basePrice = 100;
        }
        
        // Generate data points
        for (let i = 19; i >= 0; i--) {
            const timestamp = new Date(now - i * intervalMinutes * 60000);
            timestamps.push(timestamp.toLocaleTimeString());
            
            // Generate price with some randomness
            const volatility = 0.005; // 0.5% volatility
            const randomChange = (Math.random() - 0.5) * 2 * volatility * basePrice;
            const price = basePrice + randomChange * (20 - i); // Trend over time
            prices.push(price.toFixed(2));
            
            // Generate volume
            const volume = Math.floor(Math.random() * 100000) + 50000;
            volumes.push(volume);
        }
        
        return {
            timestamps,
            prices,
            volumes
        };
    }
    
    function displayMarketData(data, symbol, interval) {
        const container = document.getElementById('market-data-container');
        
        // Create canvas for chart
        container.innerHTML = '<canvas id="market-data-chart"></canvas>';
        
        // Create chart
        const ctx = document.getElementById('market-data-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.timestamps,
                datasets: [
                    {
                        label: `${symbol} Price`,
                        data: data.prices,
                        borderColor: 'rgba(0, 113, 227, 1)',
                        backgroundColor: 'rgba(0, 113, 227, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: `${symbol} Volume`,
                        data: data.volumes,
                        borderColor: 'rgba(52, 199, 89, 1)',
                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: `Time (${interval} intervals)`,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Price ($)',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Volume',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light')
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 0) {
                                    label += '$' + context.parsed.y;
                                } else {
                                    label += context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize risk meters
function initRiskMeters() {
    const riskMeters = document.querySelectorAll('.risk-meter');
    
    riskMeters.forEach(meter => {
        const level = meter.getAttribute('data-level');
        const riskLevel = meter.querySelector('.risk-level');
        
        // Set width based on risk level
        riskLevel.style.width = `${level}%`;
    });
}

// Helper function to format numbers
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// Helper function to format currency
function formatCurrency(num) {
    return '$' + formatNumber(num.toFixed(2));
}

// Helper function to format percentage
function formatPercentage(num) {
    return num.toFixed(2) + '%';
}
