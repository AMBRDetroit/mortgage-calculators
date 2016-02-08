/*
*	To calculate the refinancing of a mortgage pass in the following arguments :
*	var args = {
*		loanAmount (number) : (number) 
*		interestRate (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		termInYears (number) :  the term in years ( will be converted to number of monthly payments in calculations)
*		paymentsMade (number) : (number) ,
*		newInterestRate (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		newTermInYears (number) :  the term in years ( will be converted to number of monthly payments in calculations)
*	}
*	response : an object
*	var response = {
*		interestSaved : (number),
*		oldMonthlyMortgage : {
*			monthlyMortgagePayment : (number),
*			remainingInterest : (number)
*		},
*		newMonthlyMortgage : {
*			newMortgageTotal : (number),
*			monthlyMortgagePayment : (number),
*			remainingInterest : (number)
*		}
*	};
*	
*/
window.mortgageCalculators.refinanceMortgage = function(args){
	
	// validate our inputs first
	var inputData = _validateInputData(args, {
		loanAmount : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: false },
		interestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		termInYears : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		newInterestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		newTermInYears : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		newTermInYears : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		paymentsMade : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: true }
	});
	if(inputData.error) {
		return { error : inputData.error }
	}
	
	var loanAmount = args.loanAmount;
	var interestRate = args.interestRate;
	var termInYears = args.termInYears;
	var newInterestRate = args.newInterestRate;
	var newTermInYears = args.newTermInYears;
	var numberOfPaymentsMade = args.paymentsMade;
	// base monthly mortage payment
	var monthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : loanAmount,
		interestRate : interestRate,
		termInYears : termInYears
	});
	var remainingBalance = loanAmount;
	var totalPaid = 0; 
	var totalInterest = 0;
	for(var i=0; i < numberOfPaymentsMade; i++ ){
		// convert interest rate into a monthly percentage rate
		var monthlyInterestPayment = calculateMonthlyInterestPayment((interestRate/100)/12,remainingBalance);
		var monthlyPrincipalPayment = monthlyMortgagePayment - monthlyInterestPayment;
		// if the total monthly payment is no longer less than remaining balance, then we are at our last payment
		if( (remainingBalance - monthlyPrincipalPayment) >= 0 ){	
			remainingBalance -= monthlyPrincipalPayment;
		}
		totalPaid += monthlyPrincipalPayment;
		totalInterest +=  monthlyInterestPayment;
	}
	// calculate the remaining interest at the end of the number of payments made
	var remainingInterest = (monthlyMortgagePayment * termInYears * 12)- loanAmount - totalInterest; 
	// the new mortgage total is the remaining balance
	var newMortgageTotal = remainingBalance;
	// lets calculate the new monthly mortgage payment with the new mortgage total
	var newMonthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : newMortgageTotal,
		interestRate : newInterestRate,
		termInYears : newTermInYears
	});
	//calculate remaining total interest 
	var newRemainingInterest = (newMonthlyMortgagePayment * newTermInYears * 12) - remainingBalance; 
	// build out the response
	var response = {
		interestSaved : formatResult(remainingInterest - newRemainingInterest),
		oldMonthlyMortgage : {
			monthlyMortgagePayment : formatResult(monthlyMortgagePayment),
			remainingInterest : formatResult(remainingInterest)
		},
		newMonthlyMortgage : {
			newMortgageTotal : formatResult(newMortgageTotal),
			monthlyMortgagePayment : formatResult(newMonthlyMortgagePayment),
			remainingInterest : formatResult(newRemainingInterest)
		}
	};
	return response;
};