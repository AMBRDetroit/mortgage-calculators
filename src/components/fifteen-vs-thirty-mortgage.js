/*
*	To calculate a comparison between 15 year mortgage and 30 year mortgage  pass in the following arguments :
*	var args = {
*		loanAmount (number) : the loan amount 
*		interestRate1 (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		interestRate1 (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*	}
*
*	response : an object
*	var response = {
*		fifteenyearMortgage : {
*			monthlyMortgagePayment : (number),
*			totalPayments : (number),
*			totalInterest : (number)
*		},
*		thirtyyearMortgage : {
*			monthlyMortgagePayment : (number),
*			totalPayments : (number),
*			totalInterest : (number)
*		}
*	}
*/
window.mortgageCalculators.compareFifteenVsThirtyYearMortgages = function(args){
	
	// validate our inputs first
	var inputData = _validateInputData(args, {
		loanAmount : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: false },
		interestRate1 : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		interestRate2 : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false }
	});
	if(inputData.error) {
		return { error : inputData.error }
	}
	
	// set some working data
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
		fifteenYearMortgage : {
			monthlyMortgagePayment : formatResult(monthlyMortgagePayments1),
			totalInterest :  formatResult((monthlyMortgagePayments1 * 15 * 12) - loanAmount),
			totalPayments :  formatResult(monthlyMortgagePayments1 * 15 * 12)
		},
		thirtyYearMortgage : {
			monthlyMortgagePayment : formatResult(monthlyMortgagePayments2),
			totalInterest :  formatResult((monthlyMortgagePayments2 * 30 * 12) - loanAmount),
			totalPayments : formatResult(monthlyMortgagePayments2 * 30 * 12)
		}
	}
	return response;
};