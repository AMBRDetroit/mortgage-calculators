# Mortgage Calculators

This JS Library contains functions commonly used with mortgage calculations. 

## Background
While trying to build a set of mortgage calculators for a client, we were hoping to find a Javascript library that contained the functions.
After hours of research, we were unable to find any Javascript library. However, we found a bunch of spreadsheets and after thorough investigation, developed our own functions.

## Getting Started
To get started you can download the minified code src/mortgage-calculators.js or clone the entire repo and import it into your next project.

## Modules
This library contains 7 different modules used for different 
  1. Monthly Mortgage Payment
  2. Monthly Mortgage Payment With Extra Monthly Payments
  3. 15 Year VS 30 Year Mortgage
  4. How Much Can I Borrow ?
  5. Fixed Rate VS ARM
  6. Refinance Mortgage
  7. Should I Buy or Rent a home?

### Monthly Mortgage Payment
 ```javascript
Input Arguments:
  var args = {
		loanAmount : 100000,
		interestRate : 3.75, (Annual Rate, will be converted to a monthly percentage in calculations)
		termInYears : 30  
	}
	mortgageCalculators.monthlyMortgagePayments(args);
	
Response:
	  Returns rounded (number)
 ```
  
### Monthly Mortgage Payment With Extra Monthly Payments
```javascript
Input Arguments:
	var args = {
		loanAmount : 200000,
		interestRate : 6.75,
		termInYears : 5,
		extraPaymentAmount : 300
	}
	mortgageCalculators.monthlyMortgagePaymentsWithExtraPayments(args);
	
Returns (object)
	 var response = {
	    	withExtraPayment : {
	    		totalMonthlyPayment : 4236.69,
	    		interestRate : 6.75,
	    		term : 5,
	    		totalCost : 233018.07,
	    		payments : [{ // Array of Annual Break Down
	    	        annualInterestPayment: 12322.85,
	    	        annualPrincipalPayment: 38517.47,
	    	        balance: 161482.53,
	    	        monthlyBreakdown: [{ // Array of monthly breakdowns
	        				monthlyPayment : 4236.69,
	        				principalPayment :  3111.69,
	        				interestPayment :  1125,
	        				balance :  196888.31
	        			}...]
	    	  }...]
	    	},
	    	withoutExtraPayment : {
	    		totalMonthlyPayment : 3936.69,
	    		interestRate : 6.75,
	    		term : 5,
	    		totalCost : 236201.53
	    	}
	    }
 ```
### 15 Year VS 30 Year Mortgage
```javascript
Input Arguments:
	var args = {
		loanAmount : 100000,
		interestRate1 : 3.25,
		interestRate2 : 3.75
	}
	mortgageCalculators.compareFifteenVsThirtyYearMortgages(args);
	
Returns (object)
    var response = {
		fifteenYearMortgage : {
			monthlyMortgagePayment : 702.67,
			totalPayments : 126480.38,
			totalInterest : 26480.38
		},
		thirtyYearMortgage : {
			monthlyMortgagePayment : 463.12,
			totalPayments : 166721.61,
			totalInterest : 66721.61
		}
	}
 ```
