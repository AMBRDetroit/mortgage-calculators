/*
*	To calculate the comparison of rent vs buying of a mortgage pass in the following arguments :
*	var args = {
*		monthlyRent (number) : (number) 
*		purchasePrice (number) : (number)
*		downPayment (number) :  (number) ( will be converted into monthly percentage in calculations)
*		interestRate (number) : interest rate as an annual percentage ( will be converted into  percentage in calculations)	
*		termInYears (number) :  the term in years ( will be converted to number of monthly payments in calculations)
*		howLongBeforeSelling (number) : (number) ,
*		currentAnnualInterest (number) : interest rate as an annual percentage ( will be converted into monthly percentage in calculations)	
*		incomeTaxRate (number) :  ( will be converted into percentage in calculations)	
*	}
*	response : an object
*	var response = {
*		currentValueOfHome : (number),
*		totalOwedToBank : (number),
*		equityOnHome : (number),
*		savingWhenRenting : (number),
*		transactionalCosts : (number),
*		netCostOfOwnership : (number),
*		moneySavedByBuying : (number)
*	};
*/
window.mortgageCalculators.compareBuyVsRent = function(args){
	var args = validateInputArgs(args);
	// initalize rent info
	var monthlyRent = args.monthlyRent;
	var expectedAnnualRentIncrease = args.expectedAnnualRentIncrease;
	
	// initialize purchase info
	var purchasePrice = args.purchasePrice; 
	// downpayment is % * purchase price
	var downPayment = (args.downPayment / 100 ) * purchasePrice;
	// remaining balance if down payment is initialize 
	var remainingBalance = purchasePrice - downPayment; 
	var interestRate = args.interestRate;
	var termInYears = args.termInYears;
	
	// initialize closing costs(input is percentage) * remaining balance
	var closingCosts = (args.closingCosts/100) * (remainingBalance);
	
	// initialize home ownership info
	var yearsBeforeSelling = args.howLongBeforeSelling;
	var incomeTax = args.incomeTaxRate;
	var currentAnnualInterestOnDownPayment = args.currentAnnualInterestOnDownPayment;
	var annualAppreciation = args.annualAppreciation;
	var monthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : remainingBalance,
		interestRate : interestRate,
		termInYears : termInYears
	});
	// initialize some metrics 
	var totalInterest = 0;
	var totalPrincipalPayment = 0;
	var totalTaxSavings = 0;
	var interestOnDownPayment = downPayment;
	// initalize total appreciation ( value of home)
	var totalAppreciation = purchasePrice;
	// initialize total cost of renting at 0
	var totalCostOfRenting = 0;
	// initialize total cost of buying with the down payment
	var totalCostOfBuying = downPayment;
	// calculate monthly breakdown for each year before selling
	for(var j=0; j < yearsBeforeSelling; j++){
		// total cost of renting = sum of the year totals of monthly rent
		totalCostOfRenting += monthlyRent * 12;
		// apply the annual rent increase on the monthly rent
		monthlyRent += monthlyRent * (expectedAnnualRentIncrease/100);
		// total appreciation ( value of home) = total appreciaton  + (total appreciation * monthly appreciation rate)
		totalAppreciation += totalAppreciation * (annualAppreciation/100);
		// calculate the monthly principal payments, interest, tax savings and remaining balance after payments made
		for(var i =0; i < 12; i++){
			var monthlyInterestPayment =  calculateMonthlyInterestPayment( (interestRate/100)/12,remainingBalance );
			var monthlyPrincipalPayment = monthlyMortgagePayment - monthlyInterestPayment;
			if( (remainingBalance - monthlyPrincipalPayment) >= 0 ){
				if(remainingBalance >= monthlyPrincipalPayment){
					remainingBalance -= monthlyPrincipalPayment;
				}
			}else{
				monthlyPrincipalPayment = remainingBalance;
				remainingBalance -= monthlyPrincipalPayment;
			}
			
			// sum monthly principal payment
			totalPrincipalPayment += monthlyPrincipalPayment;
			// sum monthly interest
			totalInterest += monthlyInterestPayment;
			// sum up tax 
			totalTaxSavings += monthlyInterestPayment * (incomeTax/100);
		}

	}
	// total cost of buying = (sum of annual costs of buying) + (sum of costs of selling)
	totalCostOfBuying += (totalPrincipalPayment + totalInterest - totalTaxSavings) + (remainingBalance + closingCosts);
	// equity on home = total appreciation - remaining balance
	var equityOnHome = totalAppreciation - remainingBalance;
	// net cost of buying = total appreciation - total cost of buying 
	var netCostOfBuying = totalCostOfBuying - totalAppreciation;
	// build the response
	var response = {
		currentValueOfHome : formatResult(totalAppreciation),
		totalOwedToBank : formatResult(remainingBalance),
		equityOnHome : formatResult(equityOnHome),
		netCostOfBuying : formatResult(netCostOfBuying),
		netCostOfRenting : formatResult(totalCostOfRenting),
		benefitOfBuying : formatResult(totalCostOfRenting - netCostOfBuying)
			
	}
	return response;
};