/*
*	To calculate how much you can borrow(loan amount) pass in the following arguments :
*	var args = {
*		grossMonthlyIncome (number) : (number) 
*		interestRate (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		termInYears (number) :  the term in years ( will be converted to number of monthly payments in calculations)
*		downPayment (number) : (number)  ( will be converted into monthly percentage in calculations)	
*		monthlyDebtPayment (number) : (number) debts paid each month,
*		yearlyPropertyTax (number) : (will be converted to monthly value in calculations)
*		yearlyPropertyInsurance (number) : (will be converted to monthly value in calculations)	
*	}
*
*	response : an object
*	var response = {
*		conservative : {
8			priceOfHome : (number),
8			downPayment : (number),
*			loanAmount : (number)
*		},
*		aggressive : {
*			priceOfHome : (number),
*			downPayment : (number),
*			loanAmount : (number),
*		},
*		futureMonthlyPayment : {
*			conservative : {
*				principalAndInterest : (number),
*				taxesAndInsurance : (number),
*				totalMonthlyPayment : (number)
*			},
*			aggressive : {
*				principalAndInterest : (number),
*				taxesAndInsurance : (number),
*				totalMonthlyPayment : (number)
*			}
*		}
*	};
*	
*/
window.mortgageCalculators.howMuchCanIBorrow = function(args){
	
	// validate our inputs first
	var inputData = _validateInputData(args, {
		interestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		termInYears : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		grossMonthlyIncome : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		downPayment : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		monthlyDebtPayment : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		yearlyPropertyTax : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		yearlyPropertyInsurance : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false }
	});
	if(inputData.error) {
		return { error : inputData.error }
	}
	
	// initialize valid args
	var interestRate = args.interestRate;
	var termInYears = args.termInYears;
	var monthlyDebtPayment = args.monthlyDebtPayment;
	var grossMonthlyIncome = args.grossMonthlyIncome;
	var downPaymentPercentage = args.downPayment/100;
	var monthlyPropertyTax = args.yearlyPropertyTax/12 ;
	var monthlyPropertyInsurance = args.yearlyPropertyInsurance/12;
	var monthlyCostOfPropertyTaxAndInsurance =  monthlyPropertyTax + monthlyPropertyInsurance;
	// debt to payment ratio used to calculate how much bank will give you based on income
	var debtToPaymentRatio = {
		conservative : .36,
		aggressive : .43
	}
	
	var conservativeExpectedLoanAmount = calculateExpectedLoanAmount({
		termInYears : termInYears,
		interestRate : interestRate,
		monthlyPrincipalPayment : (debtToPaymentRatio.conservative * grossMonthlyIncome) - monthlyDebtPayment - monthlyCostOfPropertyTaxAndInsurance
	});
	
	var aggressiveExpectedLoanAmount = calculateExpectedLoanAmount({
		termInYears : termInYears,
		interestRate : interestRate,
		monthlyPrincipalPayment : (debtToPaymentRatio.aggressive * grossMonthlyIncome) - monthlyDebtPayment - monthlyCostOfPropertyTaxAndInsurance
	});
	
	var response = {
		conservative : {
			priceOfHome : formatResult(conservativeExpectedLoanAmount + (conservativeExpectedLoanAmount * downPaymentPercentage)),
			downPayment : formatResult(conservativeExpectedLoanAmount * downPaymentPercentage),
			loanAmount : formatResult(conservativeExpectedLoanAmount)
		},
		aggressive : {
			priceOfHome : formatResult(aggressiveExpectedLoanAmount + (aggressiveExpectedLoanAmount * downPaymentPercentage)),
			downPayment : formatResult(aggressiveExpectedLoanAmount * downPaymentPercentage),
			loanAmount : formatResult(aggressiveExpectedLoanAmount)
		},
		futureMonthlyPayment : {
			conservative : {
				principalAndInterest : formatResult((debtToPaymentRatio.conservative * grossMonthlyIncome) - monthlyDebtPayment) ,
				taxesAndInsurance : formatResult(monthlyCostOfPropertyTaxAndInsurance),
				totalMonthlyPayment : formatResult((debtToPaymentRatio.conservative * grossMonthlyIncome) - monthlyDebtPayment + monthlyCostOfPropertyTaxAndInsurance)
			},
			aggressive : {
				principalAndInterest : formatResult((debtToPaymentRatio.aggressive * grossMonthlyIncome) - monthlyDebtPayment),
				taxesAndInsurance : formatResult(monthlyCostOfPropertyTaxAndInsurance),
				totalMonthlyPayment : formatResult((debtToPaymentRatio.aggressive * grossMonthlyIncome) - monthlyDebtPayment + monthlyCostOfPropertyTaxAndInsurance)
			}	
		}
	};
	return response;
};