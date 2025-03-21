# 📊 README.md - Financial Risk Management Course - Risk Academy

## 📌 About This Project

- A comprehensive online course on Market Risk, Credit Risk, and Counterparty Credit Risk

- designed for banking professionals with interactive visualizations and real-time market data.
- there is still so much to add - so little time

# Financial Risk Management Course

A modern, interactive online course covering Market Risk, Credit Risk, and Counterparty Credit Risk with real-time market data integration and interactive visualizations. This course is designed for banking professionals including Senior Tech Business Analysts, Business System Analysts, Project Managers, and Data Analysts.

## Features

- **Comprehensive Risk Management Content**: Detailed modules covering Market Risk, Credit Risk, and Counterparty Credit Risk
- **Skill Level Categorization**: Content tailored for Beginner, Intermediate, and Advanced users
- **Interactive Visualizations**: Dynamic charts and calculators to demonstrate risk concepts
- **Real-time Market Data**: Integration with Alpha Vantage API for live market data
- **Terminology Support**: Hover-over tooltips and comprehensive glossary
- **Knowledge Tests**: Interactive assessments with progress tracking
- **Responsive Design**: Modern Apple-inspired interface that works on all devices
- **Dark/Light Mode**: Toggle between dark and light themes

## Installation

1. Clone or download this repository
2. Place all files on a web server or local development environment
3. Ensure the `header-video.mp4` file is in the correct location if used
4. Open `index.html` in a web browser

No build process is required as this is a pure HTML/CSS/JavaScript implementation.

## Project Structure

```
risk-management-course/
├── index.html                  # Homepage
├── assets/                     # Static assets
│   ├── css/                    # CSS stylesheets
│   │   └── styles.css          # Main stylesheet
│   ├── js/                     # JavaScript files
│   │   ├── main.js             # Main JavaScript functionality
│   │   ├── market-risk.js      # Market Risk module functionality
│   │   ├── credit-risk.js      # Credit Risk module functionality
│   │   ├── counterparty-risk.js # Counterparty Risk module functionality
│   │   ├── api-integration.js  # Market data API integration
│   │   ├── glossary.js         # Terminology and glossary functionality
│   │   ├── skill-levels.js     # Skill level categorization
│   │   └── knowledge-tests.js  # Knowledge tests functionality
│   └── images/                 # Image assets
├── modules/                    # Course modules
│   ├── market-risk/            # Market Risk module
│   │   └── index.html          # Market Risk content
│   ├── credit-risk/            # Credit Risk module
│   │   └── index.html          # Credit Risk content
│   └── counterparty-risk/      # Counterparty Risk module
│       └── index.html          # Counterparty Risk content
└── components/                 # Reusable components
```

## Usage

### Navigating the Course

1. Start at the homepage (`index.html`)
2. Select your skill level (Beginner, Intermediate, or Advanced)
3. Navigate through the modules using the main navigation
4. Use the skill level filters within each module to view content appropriate for your level
5. Interact with calculators, charts, and knowledge tests
6. Track your progress through the course

## Customization

### Adding New Content

To add new content to existing modules:

1. Edit the appropriate module HTML file (`modules/[module-name]/index.html`)
2. Add content within the appropriate skill level section
3. Add any necessary JavaScript functionality to the module's JS file

### Creating New Modules

To create a new module:

1. Create a new directory in the `modules` folder
2. Create an `index.html` file based on existing module templates
3. Create a corresponding JavaScript file in `assets/js/`
4. Add the module to the navigation in `index.html` and other module pages

### Modifying Styles

The main stylesheet is `assets/css/styles.css`. To modify the appearance:

1. Edit this file to change global styles
2. Use the CSS variables at the top of the file to modify colors and themes

## Browser Compatibility

The course is designed to work with modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is provided for educational purposes. All content and code should be used in accordance with applicable laws and regulations.

## Credits

- Alpha Vantage API for market data
- Chart.js for interactive visualizations
- Modern web technologies: HTML5, CSS3, JavaScript
