// returns a formatted,and rounded value of the monthly mortgage payment
window.mortgageCalculators.monthlyMortgagePayments = function(args){
	// validate the input arguments
	var args = validateInputArgs(args);
	return formatResult(calculateMonthlyMortgagePayment(args));
};