/*
*	To calculate comparison between fixed rate mortgage and adjustable rate mortgage  pass in the following arguments :
*	var args = {
*		loanAmount (number) : the loan amount 
*		interestRate (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		termInYears (number) :  the term in years ( will be converted to number of monthly payments in calculations)
*		monthsBeforeFirstAdjustment (number) : (number) before starting adjustments
*		monthsBetweenAdjustments (number) : (number) between each adjustments
*		expectedAdjustmentRate (number) : (number) ( will be converted into monthly percentage in calculations)	
*		initialInterestRate (number) : starting interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		maximumInterestRate (number) : max interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*	}
*	
*	response : an object
*	var response = {
*			fixedRate : {
*			monthlyMortgagePayment : (number)
*		},
*		ARM : {
*			initialMonthlyMortgagePayment : (number),
*			maxMonthlyMortgagePayment : (number)
*		}
*	}
*	
*/
window.mortgageCalculators.comparefixedRateVsARM = function(args){
	
	// validate our inputs first
	var inputData = _validateInputData(args, {
		loanAmount : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: false },
		interestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		termInYears : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		monthsBeforeFirstAdjustment : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		monthsBetweenAdjustments : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		expectedAdjustmentRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		initialInterestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		maximumInterestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: false }
	});
	if(inputData.error) {
		return { error : inputData.error }
	}
	
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
	
	response = {
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