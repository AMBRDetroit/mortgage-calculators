/*
*	To calculate Monthly Mortgage Payments pass in the following arguments :
*	var args = {
*		loanAmount (number) : the loan amount 
*		interestRate (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		termInYears (number) : the term in years ( will be converted to number of monthly payments in calculations)
*	}
*
*	response will be a rounded number
*/
window.mortgageCalculators.monthlyMortgagePayments = function(args){
	// validate the input arguments
	var args = validateInputArgs(args);
	return formatResult(calculateMonthlyMortgagePayment(args));
};