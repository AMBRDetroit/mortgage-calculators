window.mortgageCalculators.comparefixedRateVsARM = function(args){
	var args = validateInputArgs(args);
	
	var fixedInterestRate = args.interestRate;
	var termInYears = args.termInYears;
	var loanAmount = args.loanAmount;
	var initialInterestRate = args.initialInterestRate;
	var expectedAdjustmentRate = args.expectedAdjustmentRate;
	var monthsBeforeFirstAdjustment = args.monthsBeforeFirstAdjustment;
	var monthsBetweenAdjustments = args.monthsBetweenAdjustments;
	var maximumInterestRate = args.maximumInterestRate;
	
	var fixedMonthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : loanAmount,
		interestRate : fixedInterestRate,
		termInYears : termInYears
	});
	
	var initialMonthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : loanAmount,
		interestRate : initialInterestRate,
		termInYears : termInYears
	});

	var remainingBalance = loanAmount;
	// calculate payments before first adjustment 
	for(var i = 0; i < monthsBeforeFirstAdjustment; i++){
		var monthlyInterestPayment =  calculateMonthlyInterestPayment( (initialInterestRate/100)/12,remainingBalance );
		var monthlyPrincipalPayment = initialMonthlyMortgagePayment - monthlyInterestPayment;
		remainingBalance -= monthlyPrincipalPayment;
	}
	// calculate payments between adjustments 
	var adjustedInterestRate = initialInterestRate + expectedAdjustmentRate;
	var adjustedMonthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : remainingBalance,
		interestRate : adjustedInterestRate,
		termInYears : termInYears - (monthsBeforeFirstAdjustment/12)
	});

	for(var j=0; j < monthsBetweenAdjustments; j++ ){
		var newMonthlyInterestPayment =  calculateMonthlyInterestPayment((adjustedInterestRate/100)/12,remainingBalance);
		var newMonthlyPrincipalPayment = adjustedMonthlyMortgagePayment - newMonthlyInterestPayment;
		remainingBalance -= newMonthlyPrincipalPayment;
	}
	// calculate payments after adjustments 
	var remainingPayments = (termInYears*12) - monthsBeforeFirstAdjustment - monthsBetweenAdjustments;
	var maxMonthlyMortgagePayment;
	for (var k=0; k < remainingPayments; k+=monthsBetweenAdjustments){
		if(adjustedInterestRate < maximumInterestRate){
			adjustedInterestRate += expectedAdjustmentRate;
		}else{
			adjustedInterestRate = maximumInterestRate;
		}
		adjustedMonthlyMortgagePayment =  calculateMonthlyMortgagePayment({
			loanAmount : remainingBalance,
			interestRate : adjustedInterestRate,
			termInYears : (remainingPayments-k)/12
		}); 
		
		for(var x=0; x < monthsBetweenAdjustments; x++){
			var newMonthlyInterestPayment =  calculateMonthlyInterestPayment((adjustedInterestRate/100)/12,remainingBalance);
			var newMonthlyPrincipalPayment = adjustedMonthlyMortgagePayment - newMonthlyInterestPayment;
			remainingBalance -= newMonthlyPrincipalPayment;
		}
		maxMonthlyMortgagePayment = adjustedMonthlyMortgagePayment;
	}
	
	var response = {
		fixedRate : {
			monthlyMortgagePayment : formatResult(fixedMonthlyMortgagePayment)
		},
		ARM : {
			initialMonthlyMortgagePayment : formatResult(initialMonthlyMortgagePayment),
			maxMonthlyMortgagePayment : formatResult(maxMonthlyMortgagePayment)
		}
	}
	return response;	
};