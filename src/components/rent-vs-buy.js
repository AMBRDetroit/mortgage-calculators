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
*		icurrentValueOfHome : (number),
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
	var currentAnnualInterest = args.currentAnnualInterest;
	var annualAppreciation = args.annualAppreciation;
	
	var monthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : remainingBalance,
		interestRate : interestRate,
		termInYears : termInYears
	});
	
	var totalInterest = 0;
	var totalPrincipalPayment = 0;
	var totalTaxSavings = 0;
	// initalize total appreciation which starts with the purchase price
	var totalAppreciation = purchasePrice;
	// initialize equity on home = purchase price - remaining balance
	var equityOnHome = purchasePrice-remainingBalance;
	// initialize saving when renting = sum of downpayment
	var savingWhenRenting = downPayment;
	// initialize monthly cash out flow 
	var monthlyCashOutFlow = monthlyMortgagePayment;
	// calculate monthly breakdown for each year before selling
	for(var j=0; j < yearsBeforeSelling; j++){
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
			// newest monthly rent value 
			monthlyRent +=  monthlyRent*((expectedAnnualRentIncrease/100)/12);
			// monthly cash outflow in buying scenario = monthly mortgage payment - monthlyIncome tax ( + property tax + maintenance + insurance + etc ) 
			monthlyCashOutFlow = monthlyMortgagePayment - (monthlyInterestPayment * (incomeTax/100) );
			// calculate total saving when renting = sum of downpayment + (monthlyCashOutflow - monthlyRent)
			savingWhenRenting += (monthlyCashOutFlow - monthlyRent);
			// total appreciation ( value of home) = total appreciaton  + (total appreciation * monthly appreciation rate)
			totalAppreciation += totalAppreciation * ((annualAppreciation/12)/100) ;
			// equity on home = total appreciation - remaining balance
			equityOnHome = totalAppreciation - remainingBalance;
			
		}
	}
	
	// not sure how this is actually calculated. speadsheet does 0.06* totalappreciation
	var transactionalCosts = 0.06*totalAppreciation;
	// calculate total mortgage payments over the years before selling
	var totalMortgagePayments = totalPrincipalPayment - totalInterest - totalTaxSavings;	
	// (total cost of buying - (current value of home - total owed to bank ) ) 
	var netCostOfOwnership = equityOnHome - transactionalCosts;
	
	var moneySavedByBuying = netCostOfOwnership - savingWhenRenting;

	var response = {
		// total appreciation of home 
		currentValueOfHome : formatResult(totalAppreciation),
		//total cost of owed to bank = remaining balance
		totalOwedToBank : formatResult(remainingBalance),
		// total cost of renting = sum of monthly rent payments
		equityOnHome : formatResult(equityOnHome),
		// savings when rening
		savingWhenRenting : formatResult(savingWhenRenting),
		//transaction cost 
		transactionalCosts : formatResult(transactionalCosts),
		// net cost of ownership
		netCostOfOwnership : formatResult(netCostOfOwnership),
		// netCostOfRenting  - netCostOfOwnership  if > 0 - saved money by buying,  if < 0 - saved money from renting 
		moneySavedByBuying: formatResult(moneySavedByBuying),
			
	}
	return response;
};