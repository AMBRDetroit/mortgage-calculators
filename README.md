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
#### Description: 
This module calculates the monthly mortgage payment based on the loan amount, annual interest rate, and the term in years. 
#### Usage:
 ```javascript
mortgageCalculators.monthlyMortgagePayments({
	loanAmount : 100000,
	interestRate : 3.75, (Annual Rate, will be converted to a monthly percentage in calculations)
	termInYears : 30  
});
```
#### Response:
```javascript
Returns 463.12;
 ```
### Monthly Mortgage Payment With Extra Monthly Payments
#### Description: 
This module calculates the monthly monthly payment from above with an extra monthly payment amount. It returns an object with annual and monthly breakdowns. 
#### Usage:
```javascript
mortgageCalculators.monthlyMortgagePaymentsWithExtraPayments({
	loanAmount : 200000,
	interestRate : 6.75,
	termInYears : 5,
	extraPaymentAmount : 300
});
```
#### Response:
```javascript
{
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
#### Description: 
This module calculates the comparison of a 15-year mortgage with a 30-year mortgage based on the loan amount, and the interest rate of the respective year. 
#### Usage:
```javascript
mortgageCalculators.compareFifteenVsThirtyYearMortgages({
	loanAmount : 100000,
	interestRate1 : 3.25,
	interestRate2 : 3.75
});
```
#### Response: 
```javascript	
{
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
### How Much Can I Borrow?
#### Description: 
This module calculates how much you could be expected to borrow from a lender based on various parameters. It returns an aggressive and conservative break down using commonly used debt-to-payment ratios.
#### Usage:
```javascript
mortgageCalculators.howMuchCanIBorrow({
	interestRate : 3.75,
	grossMonthlyIncome : 4000,
	monthlyDebtPayment :  400,
	termInYears : 30,
	downPayment : 5,
	yearlyPropertyTax : 1200,
	yearlyPropertyInsurance : 1200		
});
```
#### Response:
```javascript
{
  aggressive: {
    downPayment: 12092.01,
    loanAmount: 241840.27,
    priceOfHome: 253932.28
  },
  conservative: {
    downPayment: 9069.01,
    loanAmount: 181380.2,
    priceOfHome: 190449.21
  },
  futureMonthlyPayment: {
    aggressive: {
      principalAndInterest: 1320,
      taxesAndInsurance: 200,
      totalMonthlyPayment: 1520
    },
    conservative: {
      principalAndInterest: 1040,
      taxesAndInsurance: 200,
      totalMonthlyPayment: 1240
    }
  }
}
```
### Fixed Rate VS ARM
#### Description: 
This module calculates the comparison between a fixed rate mortgage and an adjustable rate mortgage based on various parameters. 
#### Usage:
```javascript
mortgageCalculators.comparefixedRateVsARM({
	loanAmount : 100000,
	termInYears : 30,
	interestRate : 6.5,
	monthsBeforeFirstAdjustment : 36,
	monthsBetweenAdjustments : 12,
	expectedAdjustmentRate : 0.25,
	initialInterestRate : 6.5,
	maximumInterestRate : 12
});
```
#### Response:
```javascript
 {
	fixedRate : {
		monthlyMortgagePayment : 632.07
	},
	ARM : {
		initialMonthlyMortgagePayment : 632.07,
		maxMonthlyMortgagePayment : 889.32
	}
}
```
### Refinance Mortgage
#### Description: 
This module calculates new values for a new monthly mortgage after an _n_ number of payments are already made. Returns an object with old and new mortgage values and the interest potentially saved by refinancing.
#### Usage:
```javascript
mortgageCalculators.refinanceMortgage({
	interestRate : 3.75,
	loanAmount : 100000,
	termInYears : 30,
	paymentsMade : 12,
	newInterestRate : 2.75,
	newTermInYears : 30	
});
```
#### Response:
```javascript
{
	interestSaved : 16899.79,
	oldMonthlyMortgage : {
		monthlyMortgagePayment : 463.12,
		remainingInterest : 63003
	},
	newMonthlyMortgage : {
		newMortgageTotal : 98161.22,
		monthlyMortgagePayment : 400.73,
		remainingInterest : 46103.21
	}
}
```
### Should I Buy or Rent a Home?
#### Description: 
This module calculates the potential benefits of buying a home as opposed to renting a home based on various given parameters. Returns a break down of the various costs of both buying vs renting, and a final value of money saved by buying. This final value may be negative to indicate a benefit of renting rather than buying.
#### Usage:
```javascript
mortgageCalculators.compareBuyVsRent({
	monthlyRent : 800,
	expectedAnnualRentIncrease : 5,
	purchasePrice : 200000,
	downPayment : 5,
	interestRate : 6,
	termInYears : 30,
	closingCosts : 1.5,
	annualAppreciation : 3,
	howLongBeforeSelling : 10,
	currentAnnualInterestOnDownPayment : 3,
	incomeTaxRate : 28
});
```
#### Response:
```javascript
{
	currentValueOfHome: 268783.28,
	totalOwedToBank: 167371.45,
	equityOnHome: 101411.83,
	netCostOfBuying: 11326.5,
	netCostOfRenting: 120747.77,
	benefitOfBuying: 109421.27
}
```
