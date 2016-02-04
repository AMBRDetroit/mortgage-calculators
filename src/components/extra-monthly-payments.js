// calculate monthly mortgage payments with extra monthly payments
window.mortgageCalculators.monthlyMortgagePaymentsWithExtraPayments = function(args){
	// validate the input arguments
	var args = validateInputArgs(args);
	var monthlyInterestRate =  (args.interestRate/100)/12;
	var numberOfMonthlyPayments = args.termInYears * 12;
	var extraPaymentAmount = args.extraPaymentAmount;
	var monthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : args.loanAmount,
		interestRate : args.interestRate,
		termInYears : args.termInYears
	});
	var remainingBalance = args.loanAmount;
	// initialize the total montlh payment
	var totalMonthlyPayment =  monthlyMortgagePayment + extraPaymentAmount;
	// initialize monthly payments breakdown array
	var monthlyPayments = [];
	// calculate monthly payment breakdowns against the number of monthly payments
	for(var i = 0; i<= numberOfMonthlyPayments; i++){
		var monthlyInterestPayment = calculateMonthlyInterestPayment(monthlyInterestRate,remainingBalance);
		var monthlyPrincipalPayment = monthlyMortgagePayment - monthlyInterestPayment + extraPaymentAmount;
		// if the total monthly payment is no longer less than remaining balance, then we are at our last payment
		if( (remainingBalance - monthlyPrincipalPayment) >= 0 ){
			if(remainingBalance >= totalMonthlyPayment){
				remainingBalance -= monthlyPrincipalPayment;
			}
		}else{
			totalMonthlyPayment = remainingBalance;
			remainingBalance -= totalMonthlyPayment;
		}
		// as long as remaining balance is greater than zero, lets store those in our monthly payment array
		if(remainingBalance > 0){
			// full monthly payment array
			monthlyPayments.push({
				monthlyPayment : formatResult(monthlyMortgagePayment + extraPaymentAmount),
				principalPayment :  formatResult(monthlyPrincipalPayment),
				interestPayment :  formatResult(monthlyInterestPayment),
				balance :  formatResult(remainingBalance)
			});
		}
	}

	// initialize annual breakdown array
	var annualPayments = [];
	// separate monthly payments into years
	for(var j=0; j <= Math.ceil(monthlyPayments.length); j+=12){
		annualPayments.push(monthlyPayments.slice(j,j+12));
	}
	// intialize array to join annual and monthly payment breakdowns
	var payments = [];
	// set the annual remaining balance as the loan amount to calculate the annual remaining balance breakdown
	var annualRemainingBalance = args.loanAmount;
	// sum up totals for each year
	for(var k=0; k < annualPayments.length; k++){
		// reset annual interest and principal payments for th year
		var annualInterestPayment = 0;
		var annualPrincipalPayment = 0;	
			// add up the payments of the year
			for(var x=0; x < annualPayments[k].length;x++){
				annualInterestPayment += annualPayments[k][x].interestPayment;
				annualPrincipalPayment += annualPayments[k][x].principalPayment;
			}
			
		if( (annualRemainingBalance - annualPrincipalPayment) >= 0){
			if(annualRemainingBalance >= annualPrincipalPayment){
				annualRemainingBalance -=  annualPrincipalPayment;
			}
		}else{
			annualPrincipalPayment = annualRemainingBalance;
			annualRemainingBalance -= annualPrincipalPayment;
		}
		payments.push({
			annualInterestPayment : formatResult(annualInterestPayment),
			annualPrincipalPayment : formatResult(annualPrincipalPayment),
			balance :	formatResult(annualRemainingBalance),
			monthlyBreakdown : annualPayments[k]
		});
	}
	// build response object
	var response = { 
		withExtraPayment : {
			totalMonthlyPayment : formatResult((monthlyMortgagePayment + extraPaymentAmount)),
			interestRate : args.interestRate,
			term : args.termInYears, 
			totalCost :  formatResult( monthlyPayments.length * (monthlyMortgagePayment + extraPaymentAmount)),
			payments : payments
		},
		withoutExtraPayment : {
			totalMonthlyPayment : formatResult(monthlyMortgagePayment),
			interestRate : args.interestRate,
			term : args.termInYears,
			totalCost : formatResult(monthlyMortgagePayment * numberOfMonthlyPayments)
		}
	};
	return response;
	
};