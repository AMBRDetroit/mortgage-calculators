window.mortgageCalculators.compareFifteenVsThirtyYearMortgages = function(args){
	var args = validateInputArgs(args);
	var loanAmount = args.loanAmount;
	var interestRate1 = args.interestRate1;
	var interestRate2 = args.interestRate2;
	
	var monthlyMortgagePayments1 = calculateMonthlyMortgagePayment({
		loanAmount : loanAmount,
		interestRate : interestRate1,
		termInYears : 15
	});
	
	var monthlyMortgagePayments2 = calculateMonthlyMortgagePayment({
		loanAmount : loanAmount,
		interestRate : interestRate2,
		termInYears : 30
	});
	
	var response = {
		fifteenyearMortgage : {
			monthlyMortgagePayment : formatResult(monthlyMortgagePayments1),
			totalInterest :  formatResult((monthlyMortgagePayments1 * 15 * 12) - loanAmount),
			totalPayments :  formatResult(monthlyMortgagePayments1 * 15 * 12)
		},
		thirtyyearMortgage : {
			monthlyMortgagePayment : formatResult(monthlyMortgagePayments2),
			totalInterest :  formatResult((monthlyMortgagePayments2 * 30 * 12) - loanAmount),
			totalPayments : formatResult(monthlyMortgagePayments2 * 30 * 12)
		}
	}
	return response;
};