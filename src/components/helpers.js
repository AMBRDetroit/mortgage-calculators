function validateInputArgs(args){
	for(var key in args){
		// if input value is not a number, set it to 0, else return the value as a number
		args[key] = isNaN(parseFloat(args[key])) ? 0 : ( ( parseFloat(args[key]) < 0 ? 0 : parseFloat(args[key]) ) );
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