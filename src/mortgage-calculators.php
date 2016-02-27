<?php

	// Set the proper response header
	header('Content-type: text/javascript');
	
	echo "(function() {";
	
		// get helpers functions
		include('components/helpers.js');
		
		// init the calculator object
		echo "window.mortgageCalculators = {}";
		// monthly mortgage payment
		include("components/monthly-mortgage-payments.js");
		// monthly mortgage payment with extra payments
		include("components/extra-monthly-payments.js");
		// how much can i borrow
		include("components/how-much-can-i-borrow.js");
		// fifteen vs thirty mortgage
		include("components/fifteen-vs-thirty-mortgage.js");
		// refinance mortgage
		include("components/refinance-mortgage.js");
		// fixed rate vs arm
		include("components/fixed-rate-vs-arm.js");
		// rent vs buy
		include("components/rent-vs-buy.js");
		
	
	echo "})();";

?>