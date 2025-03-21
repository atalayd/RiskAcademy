/**
 * API Integration for Market Data
 * This file handles the integration with Alpha Vantage API for real-time market data
 */

document.addEventListener('DOMContentLoaded', function() {
    setupMarketDataIntegration();
    setupMarketDataDashboard();
});

/**
 * Alpha Vantage API key
 * Note: In production, this should be stored securely and not exposed in client-side code
 */

/**
 * Setup Market Data Integration
 * Initializes the market data integration functionality
 */
function setupMarketDataIntegration() {
    const marketDataForm = document.getElementById('market-data-form');
    
    if (marketDataForm) {
        marketDataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const symbol = document.getElementById('stock-symbol').value;
            const interval = document.getElementById('time-interval').value;
            
            fetchMarketData(symbol, interval);
        });
    }
}

/**
 * Fetch Market Data from Alpha Vantage API
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval (e.g., '5min', '15min', '30min', '60min')
 */
function fetchMarketData(symbol, interval) {
    const resultContainer = document.getElementById('market-data-result');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (resultContainer && loadingIndicator) {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        resultContainer.style.display = 'none';
        
        // Construct API URL
const apiUrl = `https://us-central1-portfolio-page---theanalyst.cloudfunctions.net/getStockData?symbol=${symbol}&interval=${interval}`;
        
        // Fetch data from API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process and display the data
                displayMarketData(data, symbol, interval);
                
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                resultContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching market data:', error);
                
                // Display error message
                resultContainer.innerHTML = `
                    <div class="error-message">
                        <h3>Error fetching market data</h3>
                        <p>${error.message}</p>
                        <p>Please try again with a different symbol or interval.</p>
                    </div>
                `;
                
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                resultContainer.style.display = 'block';
            });
    }
}

/**
 * Display Market Data
 * Processes and displays the market data from Alpha Vantage API
 * @param {Object} data - Market data from Alpha Vantage API
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval
 */
function displayMarketData(data, symbol, interval) {
    const resultContainer = document.getElementById('market-data-result');
    
    if (!resultContainer) return;
    
    // Check if data contains error message
    if (data['Error Message']) {
        resultContainer.innerHTML = `
            <div class="error-message">
                <h3>API Error</h3>
                <p>${data['Error Message']}</p>
                <p>Please try again with a different symbol or interval.</p>
            </div>
        `;
        return;
    }
    
    // Check if data contains information message (e.g., API limit reached)
    if (data['Information']) {
        resultContainer.innerHTML = `
            <div class="warning-message">
                <h3>API Information</h3>
                <p>${data['Information']}</p>
                <p>Please try again later.</p>
            </div>
        `;
        return;
    }
    
    // Get metadata and time series data
    const metadata = data['Meta Data'];
    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = data[timeSeriesKey];
    
    if (!metadata || !timeSeries) {
        resultContainer.innerHTML = `
            <div class="error-message">
                <h3>Unexpected API Response</h3>
                <p>The API response format was not as expected.</p>
                <p>Please try again with a different symbol or interval.</p>
            </div>
        `;
        return;
    }
    
    // Extract relevant metadata
    const symbolInfo = metadata['2. Symbol'];
    const lastRefreshed = metadata['3. Last Refreshed'];
    const timezone = metadata['6. Time Zone'];
    
    // Convert time series data to arrays for charting
    const timestamps = [];
    const openPrices = [];
    const highPrices = [];
    const lowPrices = [];
    const closePrices = [];
    const volumes = [];
    
    // Sort timestamps in ascending order
    const sortedTimestamps = Object.keys(timeSeries).sort();
    
    // Get the last 20 data points (or fewer if less data is available)
    const dataPoints = Math.min(sortedTimestamps.length, 20);
    const recentTimestamps = sortedTimestamps.slice(-dataPoints);
    
    // Extract data for each timestamp
    recentTimestamps.forEach(timestamp => {
        const dataPoint = timeSeries[timestamp];
        
        timestamps.push(formatTimestamp(timestamp));
        openPrices.push(parseFloat(dataPoint['1. open']));
        highPrices.push(parseFloat(dataPoint['2. high']));
        lowPrices.push(parseFloat(dataPoint['3. low']));
        closePrices.push(parseFloat(dataPoint['4. close']));
        volumes.push(parseInt(dataPoint['5. volume']));
    });
    
    // Calculate statistics
    const latestClose = closePrices[closePrices.length - 1];
    const previousClose = closePrices[closePrices.length - 2] || 0;
    const change = latestClose - previousClose;
    const percentChange = previousClose ? (change / previousClose) * 100 : 0;
    const high = Math.max(...highPrices);
    const low = Math.min(...lowPrices);
    const avgVolume = Math.round(volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length);
    
    // Create HTML for market data summary
    const summaryHTML = `
        <div class="market-data-summary">
            <h3>${symbolInfo} - ${formatTimestamp(lastRefreshed)} (${timezone})</h3>
            <div class="market-data-stats">
                <div class="stat-item">
                    <span class="stat-label">Latest Price:</span>
                    <span class="stat-value">$${latestClose.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Change:</span>
                    <span class="stat-value ${change >= 0 ? 'positive-change' : 'negative-change'}">
                        ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${percentChange.toFixed(2)}%)
                    </span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Range:</span>
                    <span class="stat-value">$${low.toFixed(2)} - $${high.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Avg Volume:</span>
                    <span class="stat-value">${avgVolume.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div class="chart-container">
            <canvas id="price-chart"></canvas>
        </div>
        <div class="chart-container">
            <canvas id="volume-chart"></canvas>
        </div>
    `;
    
    // Update result container
    resultContainer.innerHTML = summaryHTML;
    
    // Create price chart
    const priceChartCtx = document.getElementById('price-chart');
    if (priceChartCtx) {
        new Chart(priceChartCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Close Price',
                        data: closePrices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price ($)',
                            color: isDarkMode() ? '#ffffff' : '#333333'
                        },
                        ticks: {
                            color: isDarkMode() ? '#ffffff' : '#333333'
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
                        position: 'top',
                        labels: {
                            color: isDarkMode() ? '#ffffff' : '#333333'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create volume chart
    const volumeChartCtx = document.getElementById('volume-chart');
    if (volumeChartCtx) {
        new Chart(volumeChartCtx, {
            type: 'bar',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Volume',
                        data: volumes,
                        backgroundColor: 'rgba(153, 102, 255, 0.7)',
                        borderColor: 'rgba(153, 102, 255, 1)',
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
                            text: 'Volume',
                            color: isDarkMode() ? '#ffffff' : '#333333'
                        },
                        ticks: {
                            color: isDarkMode() ? '#ffffff' : '#333333',
                            callback: function(value) {
                                return value.toLocaleString();
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
                        position: 'top',
                        labels: {
                            color: isDarkMode() ? '#ffffff' : '#333333'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Setup Market Data Dashboard
 * Creates a dashboard with market data for risk analysis
 */
function setupMarketDataDashboard() {
    const dashboardContainer = document.getElementById('market-data-dashboard');
    
    if (!dashboardContainer) return;
    
    // Default symbols to display
    const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    const interval = '15min';
    
    // Create dashboard layout
    dashboardContainer.innerHTML = `
        <div class="dashboard-header">
            <h3>Market Risk Dashboard</h3>
            <p>Real-time market data for risk analysis</p>
        </div>
        <div class="dashboard-grid">
            ${defaultSymbols.map(symbol => `
                <div class="dashboard-card" id="dashboard-${symbol}">
                    <div class="card-header">
                        <h4>${symbol}</h4>
                        <span class="loading-spinner">Loading...</span>
                    </div>
                    <div class="card-body">
                        <div class="placeholder-chart"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Fetch data for each symbol
    defaultSymbols.forEach(symbol => {
        fetchDashboardData(symbol, interval);
    });
}

/**
 * Fetch Dashboard Data
 * Fetches market data for dashboard cards
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval
 */
function fetchDashboardData(symbol, interval) {
    const cardContainer = document.getElementById(`dashboard-${symbol}`);
    
    if (!cardContainer) return;
    
    // Construct API URL
const apiUrl = `https://us-central1-portfolio-page---theanalyst.cloudfunctions.net/getStockData?symbol=${symbol}&interval=${interval}`;
    
    // Fetch data from API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process and display the data
            updateDashboardCard(cardContainer, data, symbol, interval);
        })
        .catch(error => {
            console.error(`Error fetching data for ${symbol}:`, error);
            
            // Display error message
            cardContainer.querySelector('.card-body').innerHTML = `
                <div class="error-message">
                    <p>Error loading data</p>
                    <small>${error.message}</small>
                </div>
            `;
            
            // Hide loading spinner
            cardContainer.querySelector('.loading-spinner').style.display = 'none';
        });
}

/**
 * Update Dashboard Card
 * Updates a dashboard card with market data
 * @param {HTMLElement} cardContainer - Dashboard card container
 * @param {Object} data - Market data from Alpha Vantage API
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval
 */
function updateDashboardCard(cardContainer, data, symbol, interval) {
    const cardBody = cardContainer.querySelector('.card-body');
    const loadingSpinner = cardContainer.querySelector('.loading-spinner');
    
    // Check if data contains error message
    if (data['Error Message'] || data['Information']) {
        cardBody.innerHTML = `
            <div class="error-message">
                <p>Error loading data</p>
                <small>${data['Error Message'] || data['Information']}</small>
            </div>
        `;
        loadingSpinner.style.display = 'none';
        return;
    }
    
    // Get time series data
    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) {
        cardBody.innerHTML = `
            <div class="error-message">
                <p>Unexpected API response</p>
            </div>
        `;
        loadingSpinner.style.display = 'none';
        return;
    }
    
    // Convert time series data to arrays for charting
    const timestamps = [];
    const closePrices = [];
    
    // Sort timestamps in ascending order
    const sortedTimestamps = Object.keys(timeSeries).sort();
    
    // Get the last 10 data points
    const dataPoints = Math.min(sortedTimestamps.length, 10);
    const recentTimestamps = sortedTimestamps.slice(-dataPoints);
    
    // Extract data for each timestamp
    recentTimestamps.forEach(timestamp => {
        const dataPoint = timeSeries[timestamp];
        
        timestamps.push(formatTimestamp(timestamp, true));
        closePrices.push(parseFloat(dataPoint['4. close']));
    });
    
    // Calculate statistics
    const latestClose = closePrices[closePrices.length - 1];
    const previousClose = closePrices[closePrices.length - 2] || 0;
    const change = latestClose - previousClose;
    const percentChange = previousClose ? (change / previousClose) * 100 : 0;
    
    // Create HTML for card body
    cardBody.innerHTML = `
        <div class="card-stats">
            <div class="price">$${latestClose.toFixed(2)}</div>
            <div class="change ${change >= 0 ? 'positive-change' : 'negative-change'}">
                ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${percentChange.toFixed(2)}%)
            </div>
        </div>
        <div class="mini-chart-container">
            <canvas id="mini-chart-${symbol}"></canvas>
        </div>
    `;
    
    // Create mini chart
    const miniChartCtx = document.getElementById(`mini-chart-${symbol}`);
    if (miniChartCtx) {
        new Chart(miniChartCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        data: closePrices,
                        borderColor: change >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                        backgroundColor: change >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
}

/**
 * Format Timestamp
 * Formats a timestamp for display
 * @param {string} timestamp - Timestamp in format 'YYYY-MM-DD HH:MM:SS'
 * @param {boolean} shortFormat - Whether to use short format (time only)
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(timestamp, shortFormat = false) {
    if (shortFormat) {
        // Extract time only (HH:MM)
        const timePart = timestamp.split(' ')[1];
        if (timePart) {
            return timePart.substring(0, 5);
        }
        return timestamp;
    }
    
    // Convert to more readable format
    const date = new Date(timestamp);
    return date.toLocaleString();
}

/**
 * Check if dark mode is enabled
 * @returns {boolean} True if dark mode is enabled
 */
function isDarkMode() {
    return document.body.classList.contains('dark-mode');
}
