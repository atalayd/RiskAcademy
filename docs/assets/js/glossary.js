/**
 * Glossary and Terminology Support
 * This file contains the glossary functionality and tooltip implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeGlossary();
    setupTooltips();
});

/**
 * Financial Risk Management Glossary
 * Comprehensive list of terms and definitions
 */
const glossaryTerms = {
    // Market Risk Terms
    "var": {
        term: "Value at Risk (VaR)",
        definition: "A statistical measure that quantifies the level of financial risk within a portfolio over a specific time frame. It estimates how much a set of investments might lose, given normal market conditions, in a specific time period.",
        category: "Market Risk"
    },
    "parametric-var": {
        term: "Parametric VaR",
        definition: "A VaR calculation method that assumes returns follow a normal distribution. It uses volatility and correlation estimates to calculate potential losses.",
        category: "Market Risk"
    },
    "historical-var": {
        term: "Historical VaR",
        definition: "A VaR calculation method that uses actual historical returns to determine potential future losses, without assuming a specific distribution of returns.",
        category: "Market Risk"
    },
    "monte-carlo-var": {
        term: "Monte Carlo VaR",
        definition: "A VaR calculation method that uses random simulations of possible future scenarios based on statistical parameters to estimate potential losses.",
        category: "Market Risk"
    },
    "stress-testing": {
        term: "Stress Testing",
        definition: "A simulation technique used to evaluate how a portfolio, bank, or financial system would react to extreme, but plausible scenarios or market movements.",
        category: "Market Risk"
    },
    "interest-rate-risk": {
        term: "Interest Rate Risk",
        definition: "The risk that changes in interest rates will negatively impact the value of an investment or financial institution's interest income.",
        category: "Market Risk"
    },
    "equity-risk": {
        term: "Equity Risk",
        definition: "The risk of loss due to adverse movements in stock prices or equity indices.",
        category: "Market Risk"
    },
    "fx-risk": {
        term: "Foreign Exchange (FX) Risk",
        definition: "The risk of financial loss due to changes in the exchange rate between currencies.",
        category: "Market Risk"
    },
    "commodity-risk": {
        term: "Commodity Risk",
        definition: "The risk of financial loss due to adverse movements in commodity prices such as oil, gold, or agricultural products.",
        category: "Market Risk"
    },
    "basis-risk": {
        term: "Basis Risk",
        definition: "The risk that offsetting investments in a hedging strategy will not experience price changes in entirely opposite directions from each other.",
        category: "Market Risk"
    },
    "volatility": {
        term: "Volatility",
        definition: "A statistical measure of the dispersion of returns for a given security or market index, typically measured using standard deviation.",
        category: "Market Risk"
    },
    "frtb": {
        term: "Fundamental Review of the Trading Book (FRTB)",
        definition: "A set of Basel Committee regulations that revised market risk capital requirements for banks, introducing more risk-sensitive standardized and internal model approaches.",
        category: "Market Risk"
    },
    
    // Credit Risk Terms
    "pd": {
        term: "Probability of Default (PD)",
        definition: "The likelihood that a borrower will fail to make full and timely payments of principal and interest according to the contractual terms of the debt obligation.",
        category: "Credit Risk"
    },
    "lgd": {
        term: "Loss Given Default (LGD)",
        definition: "The amount of money a bank or other financial institution loses when a borrower defaults on a loan, expressed as a percentage of total exposure at the time of default.",
        category: "Credit Risk"
    },
    "ead": {
        term: "Exposure at Default (EAD)",
        definition: "A calculation of the total value a bank is exposed to when a loan defaults, including drawn amounts and potential future draw-downs.",
        category: "Credit Risk"
    },
    "expected-loss": {
        term: "Expected Loss (EL)",
        definition: "The average credit loss that a lender expects to incur on a loan or portfolio of loans. Calculated as EL = PD × LGD × EAD.",
        category: "Credit Risk"
    },
    "credit-scoring": {
        term: "Credit Scoring",
        definition: "A statistical analysis performed by lenders to determine the creditworthiness of a person or small business, resulting in a credit score.",
        category: "Credit Risk"
    },
    "credit-migration": {
        term: "Credit Migration",
        definition: "The movement of a borrower's credit quality from one risk rating to another, either improving (upgrade) or deteriorating (downgrade).",
        category: "Credit Risk"
    },
    "concentration-risk": {
        term: "Concentration Risk",
        definition: "The risk arising from an uneven distribution of exposures to particular sectors, regions, or borrowers, potentially leading to significant losses.",
        category: "Credit Risk"
    },
    "irb-approach": {
        term: "Internal Ratings-Based (IRB) Approach",
        definition: "A Basel framework that allows banks to use their internal models to estimate credit risk components (PD, LGD, EAD) for calculating regulatory capital requirements.",
        category: "Credit Risk"
    },
    "standardized-approach": {
        term: "Standardized Approach",
        definition: "A Basel framework that uses external credit ratings and fixed risk weights to calculate regulatory capital requirements for credit risk.",
        category: "Credit Risk"
    },
    "risk-weighted-assets": {
        term: "Risk-Weighted Assets (RWA)",
        definition: "A bank's assets weighted according to risk, used as the denominator in capital adequacy ratios to determine minimum capital requirements.",
        category: "Credit Risk"
    },
    "credit-var": {
        term: "Credit VaR",
        definition: "A measure that estimates the potential loss in value of a loan or bond portfolio due to credit events over a specified time horizon at a given confidence level.",
        category: "Credit Risk"
    },
    
    // Counterparty Credit Risk Terms
    "ccr": {
        term: "Counterparty Credit Risk (CCR)",
        definition: "The risk that a counterparty to a financial contract will default before the final settlement of the transaction's cash flows.",
        category: "Counterparty Risk"
    },
    "cva": {
        term: "Credit Valuation Adjustment (CVA)",
        definition: "An adjustment to the valuation of a derivative transaction to account for the credit risk of the counterparty.",
        category: "Counterparty Risk"
    },
    "dva": {
        term: "Debit Valuation Adjustment (DVA)",
        definition: "An adjustment to the valuation of a derivative transaction to account for an entity's own credit risk.",
        category: "Counterparty Risk"
    },
    "wrong-way-risk": {
        term: "Wrong-Way Risk",
        definition: "The risk that occurs when exposure to a counterparty is adversely correlated with the credit quality of that counterparty.",
        category: "Counterparty Risk"
    },
    "right-way-risk": {
        term: "Right-Way Risk",
        definition: "The risk that occurs when exposure to a counterparty is positively correlated with the credit quality of that counterparty.",
        category: "Counterparty Risk"
    },
    "potential-future-exposure": {
        term: "Potential Future Exposure (PFE)",
        definition: "A measure of counterparty risk that estimates the maximum expected credit exposure over a specified period with a high degree of statistical confidence.",
        category: "Counterparty Risk"
    },
    "expected-exposure": {
        term: "Expected Exposure (EE)",
        definition: "The average exposure to a counterparty at a future date, typically used in CVA calculations.",
        category: "Counterparty Risk"
    },
    "effective-epe": {
        term: "Effective Expected Positive Exposure (EEPE)",
        definition: "A weighted average of effective expected exposure over a time period, used in regulatory capital calculations for counterparty credit risk.",
        category: "Counterparty Risk"
    },
    "netting": {
        term: "Netting",
        definition: "The process of offsetting positive and negative values of transactions with the same counterparty to reduce overall exposure.",
        category: "Counterparty Risk"
    },
    "collateral": {
        term: "Collateral",
        definition: "Assets pledged by a counterparty to secure an obligation, reducing credit exposure.",
        category: "Counterparty Risk"
    },
    "margin": {
        term: "Margin",
        definition: "Collateral that is collected or posted to cover current and potential future exposure in derivative transactions.",
        category: "Counterparty Risk"
    },
    "sa-ccr": {
        term: "Standardized Approach for Counterparty Credit Risk (SA-CCR)",
        definition: "A regulatory method for calculating exposure at default for counterparty credit risk that replaced the Current Exposure Method (CEM) and Standardized Method (SM).",
        category: "Counterparty Risk"
    },
    
    // General Risk Management Terms
    "basel": {
        term: "Basel Accords",
        definition: "International banking regulations issued by the Basel Committee on Banking Supervision, setting standards for bank capital adequacy, stress testing, and market liquidity risk.",
        category: "General"
    },
    "basel-iii": {
        term: "Basel III",
        definition: "A global regulatory framework that strengthened bank capital requirements, stress testing, and market liquidity requirements in response to the 2008 financial crisis.",
        category: "General"
    },
    "economic-capital": {
        term: "Economic Capital",
        definition: "The amount of capital a financial institution estimates it should hold to remain solvent given its risk profile.",
        category: "General"
    },
    "regulatory-capital": {
        term: "Regulatory Capital",
        definition: "The minimum amount of capital a financial institution is required to hold as mandated by its financial regulator.",
        category: "General"
    },
    "risk-appetite": {
        term: "Risk Appetite",
        definition: "The level and type of risk an organization is willing to accept in pursuit of its business objectives.",
        category: "General"
    },
    "risk-tolerance": {
        term: "Risk Tolerance",
        definition: "The specific maximum risk an organization is willing to take regarding each relevant risk category.",
        category: "General"
    },
    "risk-management-framework": {
        term: "Risk Management Framework",
        definition: "A structured approach that outlines how an organization identifies, assesses, and manages risks.",
        category: "General"
    },
    "icaap": {
        term: "Internal Capital Adequacy Assessment Process (ICAAP)",
        definition: "A bank's internal process to assess its overall capital adequacy in relation to its risk profile and strategy for maintaining capital levels.",
        category: "General"
    }
};

/**
 * Initialize the glossary section
 */
function initializeGlossary() {
    const glossaryContainer = document.getElementById('glossary-container');
    
    if (!glossaryContainer) return;
    
    // Create category containers
    const categories = {
        "Market Risk": document.createElement('div'),
        "Credit Risk": document.createElement('div'),
        "Counterparty Risk": document.createElement('div'),
        "General": document.createElement('div')
    };
    
    // Add category headings
    for (const category in categories) {
        const heading = document.createElement('h3');
        heading.textContent = category;
        heading.className = 'glossary-category-heading';
        categories[category].appendChild(heading);
        categories[category].className = 'glossary-category';
    }
    
    // Sort terms alphabetically
    const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => {
        return glossaryTerms[a].term.localeCompare(glossaryTerms[b].term);
    });
    
    // Add terms to their respective categories
    for (const key of sortedTerms) {
        const termData = glossaryTerms[key];
        const termElement = document.createElement('div');
        termElement.className = 'glossary-term';
        
        const termHeading = document.createElement('h4');
        termHeading.textContent = termData.term;
        termElement.appendChild(termHeading);
        
        const termDefinition = document.createElement('p');
        termDefinition.textContent = termData.definition;
        termElement.appendChild(termDefinition);
        
        categories[termData.category].appendChild(termElement);
    }
    
    // Add categories to glossary container
    for (const category in categories) {
        glossaryContainer.appendChild(categories[category]);
    }
    
    // Add search functionality
    const searchInput = document.getElementById('glossary-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Get all glossary terms
            const terms = document.querySelectorAll('.glossary-term');
            
            // Filter terms based on search input
            terms.forEach(term => {
                const heading = term.querySelector('h4').textContent.toLowerCase();
                const definition = term.querySelector('p').textContent.toLowerCase();
                
                if (heading.includes(searchTerm) || definition.includes(searchTerm)) {
                    term.style.display = 'block';
                } else {
                    term.style.display = 'none';
                }
            });
            
            // Show/hide category headings based on visible terms
            const categories = document.querySelectorAll('.glossary-category');
            categories.forEach(category => {
                const visibleTerms = category.querySelectorAll('.glossary-term[style="display: block"]').length;
                const categoryHeading = category.querySelector('.glossary-category-heading');
                
                if (visibleTerms === 0) {
                    categoryHeading.style.display = 'none';
                } else {
                    categoryHeading.style.display = 'block';
                }
            });
        });
    }
}

/**
 * Setup tooltips for glossary terms
 */
function setupTooltips() {
    // Find all glossary term references in the content
    const content = document.querySelectorAll('.module-content, .section-content');
    
    content.forEach(section => {
        // Get the HTML content
        let html = section.innerHTML;
        
        // Replace glossary terms with tooltip spans
        for (const key in glossaryTerms) {
            const termData = glossaryTerms[key];
            const term = termData.term;
            const definition = termData.definition;
            
            // Create a regex to find the term, ensuring it's a whole word
            // This regex looks for the term with word boundaries and is case insensitive
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            
            // Replace the term with a tooltip span
            html = html.replace(regex, `<span class="tooltip-term" data-term="${key}">${term}<span class="tooltip-content">${definition}</span></span>`);
        }
        
        // Update the section content
        section.innerHTML = html;
    });
}

// Add event listener for tooltip hover
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('tooltip-term')) {
        const tooltip = e.target.querySelector('.tooltip-content');
        
        // Position the tooltip
        const rect = e.target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        tooltip.style.top = (rect.bottom + scrollTop) + 'px';
        tooltip.style.left = rect.left + 'px';
        tooltip.style.display = 'block';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('tooltip-term')) {
        const tooltip = e.target.querySelector('.tooltip-content');
        tooltip.style.display = 'none';
    }
});
