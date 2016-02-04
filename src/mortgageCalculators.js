(function(){
	
	function validateInputArgs(args){
		for(var key in args){
			// if input value is not a number, set it to 0, else return the value as a number
			args[key] = isNaN(parseFloat(args[key])) ? 0 : parseFloat(args[key]);
		}
		return args;
	};
	function calculateMonthlyInterestPayment(monthlyInterestRate,remainingBalance){
		return monthlyInterestRate * remainingBalance;
	};
	/*  
	 * Calculate monthly mortgage payments 
	*	For a fixed rate Monthly Mortage:
	*	c - the montly mortgage payment
	*	r - the monthly interest rate, expressed as a decimal, not a percentage. Since the quoted yearly percentage rate is not a compounded rate, the monthly percentage rate is simply the yearly percentage rate divided by 12; dividing the monthly percentage rate by 100 gives r, the monthly rate expressed as a decimal.
	*	N - the number of monthly payments, called the loan's term, and
	*	P - the amount borrowed, known as the loan's principal.	
	*	c =  [r * P * (1+r)^n )] / [(1 + r)^n - 1]
	*	
	*	Returns raw value of monthly mortgage payment, used in other calculations
	*/
	function calculateMonthlyMortgagePayment(args){
		var principal = args.loanAmount;
		var interestRate = args.interestRate == 0 ? 0 : args.interestRate/100;
		var monthlyInterestRate = interestRate == 0 ? 0 : interestRate/12;
		var numberOfMonthlyPayments = args.termInYears * 12;
		return (((monthlyInterestRate * principal * (Math.pow((1+monthlyInterestRate), numberOfMonthlyPayments)))) / ((Math.pow((1+monthlyInterestRate), numberOfMonthlyPayments)) - 1));
	};
	// calculate loan amount ( reverse the monthly mortgage payment formula)
	function calculateExpectedLoanAmount(args){
		var monthlyPrincipalPayment = args.monthlyPrincipalPayment;
		var interestRate = args.interestRate == 0 ? 0 : args.interestRate/100;
		var monthlyInterestRate = interestRate == 0 ? 0 : interestRate/12;
		var numberOfMonthlyPayments = args.termInYears * 12;
		return ( ( monthlyPrincipalPayment * (Math.pow( (1+monthlyInterestRate), numberOfMonthlyPayments) -1 ) ) / (monthlyInterestRate * Math.pow((1+monthlyInterestRate),numberOfMonthlyPayments )) )
	};
	
	function formatResult(result){
		return isNaN(parseFloat( result.toFixed(2) )) ? 0 : parseFloat(result.toFixed(2));
	};
	
	window.mortgageCalculators = {		
		// returns a formatted,and rounded value of the monthly mortgage payment
		monthlyMortgagePayments : function(args){
			// validate the input arguments
			var args = validateInputArgs(args);
			return formatResult(calculateMonthlyMortgagePayment(args));
		},
		// calculate monthly mortgage payments with extra monthly payments
		monthlyMortgagePaymentsWithExtraPayments : function(args){
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
			
		},
		howMuchCanIBorrow : function(args){
			var args = validateInputArgs(args);
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
						totalMonthlyPayment : formatResult((debtToPaymentRatio.conservative * grossMonthlyIncome) - monthlyDebtPayment - monthlyCostOfPropertyTaxAndInsurance)
					},
					aggressive : {
						principalAndInterest : formatResult((debtToPaymentRatio.aggressive * grossMonthlyIncome) - monthlyDebtPayment),
						taxesAndInsurance : formatResult(monthlyCostOfPropertyTaxAndInsurance),
						totalMonthlyPayment : formatResult((debtToPaymentRatio.aggressive * grossMonthlyIncome) - monthlyDebtPayment - monthlyCostOfPropertyTaxAndInsurance)
					}	
				}
			};
			return response;
		},
		compareFifteenVsThirtyYearMortgages : function(args){
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
		},
		refinanceMortgage : function(args){
			var args = validateInputArgs(args);
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
		},
		comparefixedRateVsARM : function(args){
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
		},
		compareBuyVsRent : function(args){
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
		}
	}
	
	
})();