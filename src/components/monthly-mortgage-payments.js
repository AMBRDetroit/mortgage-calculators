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
window.mortgageCalculators.monthlyMortgagePayments = function(args) {
	
	// validate our inputs first
	var inputData = _validateInputData(args, {
		loanAmount : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: false },
		interestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		termInYears : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true }
	});
	if(inputData.error) {
		return { error : inputData.error }
	}
	
	// validate the input arguments
	return formatResult(calculateMonthlyMortgagePayment(args));
};