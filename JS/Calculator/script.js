var numeric = document.querySelectorAll('.numeric');
var operator = document.querySelectorAll('.operator');
var entryDisplay = document.querySelector('#entryDisplay');
var logDisplay = document.querySelector('#logDisplay');
var last = "";
var log = "";
var ans = "";
var current = "";


for (var i = 0; i < numeric.length; i++) {
	numeric[i].addEventListener("click", function() {
		if(this.textContent !== "0" || logDisplay.textContent !== "") {	
			logDisplay.textContent += this.textContent;
		}
		last = this.textContent;
	});
}

for (var i = 0; i < operator.length; i++) {
	operator[i].addEventListener("click", function() {
		//if the last entry is an operator then change it
		//to this operator
		//else log this operator
		if(logDisplay.textContent !== "") {
			if(/[\xD7\xF7+-]/g.test(last)) {
				// current = this.textContent;
				console.log("hello");
				logDisplay.textContent = logDisplay.textContent.slice(0, logDisplay.textContent.length - 1);
				logDisplay.textContent += this.textContent;
			} else {
				console.log("Hi")
				logDisplay.textContent += this.textContent;
			}
			last = this.textContent;
		}
	});
}

