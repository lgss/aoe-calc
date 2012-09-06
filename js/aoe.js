var myApp = myApp || {};

myApp.Boundary = function (min, max) {
	var self = this;
	self.min = min;
	self.max = max;
};

myApp.Calculator = function () {
	var self = this,
		wkBoundaries = [new myApp.Boundary(0, 75), new myApp.Boundary(75, 135), new myApp.Boundary(135, 185), new myApp.Boundary(185, 225), new myApp.Boundary(225, 355), new myApp.Boundary(355, 505), new myApp.Boundary(505, 20000)],
		mthBoundaries = [new myApp.Boundary(0, 300), new myApp.Boundary(300, 550), new myApp.Boundary(550, 740), new myApp.Boundary(740, 900), new myApp.Boundary(900, 1420), new myApp.Boundary(1420, 2020), new myApp.Boundary(2020, 100000)],
		percentages = [0, 3, 5, 7, 12, 17, 17];

	//user inputs
	self.wages = ko.observable();
	self.frequencyOptions = ["Weekly","Monthly"];
	self.frequency = ko.observable();
	self.deductionOptions = [1,2];
	self.deductions = ko.observable();

	//outputs
	self.firstDeduction = ko.observable(0);
	self.firstDeductionOut = ko.computed(function(){
		return (self.firstDeduction()) ? self.firstDeduction().toFixed(2) : 0;
	},self);
	self.secondDeduction = ko.observable(0);
	self.secondDeductionOut = ko.computed(function(){
		return (self.secondDeduction()) ? self.secondDeduction().toFixed(2) : 0;
	},self);
	self.totalDeduction = ko.computed(function(){
		return (self.firstDeduction() +  (self.secondDeduction() || 0)).toFixed(2);
	},self);
	self.showResult = ko.observable(false);

	//others
	self.twoDeductions = ko.computed(function(){
		return (self.deductions() > 1) ? true : false;
	});
	self.percent = 0;
	self.highBoundary = false;

	self.isHighBoundary = function (amount,boundaries){
		return (amount >= boundaries[boundaries.length - 1].min) ? true : false;
	};

	self.getPercent = function getPercent(i, amount, boundaries) {
		return (amount < boundaries[i].max) ? percentages[i] : getPercent(i + 1, amount, boundaries);
	};

	self.calcPercent = function (amount,freq) {
		if (freq === "Weekly") {
			self.highBoundary = self.isHighBoundary(amount,wkBoundaries);
			return self.getPercent(0, amount, wkBoundaries);
		} else if (freq === "Monthly") {
			self.highBoundary = self.isHighBoundary(amount,mthBoundaries);
			return self.getPercent(0, amount, mthBoundaries);
		}
	};

	//type of deduction
	self.calcLowBoundary = function (amount) {
		return (amount / 100) * self.percent;
	};

	self.calcHighBoundary = function (amount) {
		var first = (amount / 100) * self.percent,
			second = (amount - first) * 0.5;
		return first + second;
	};

	//get the deduction
	self.getDeduction = function (amount){
		if(!self.highBoundary){
			return self.calcLowBoundary(amount);	
		} else{
			return self.calcHighBoundary(amount);
		}
	};

	self.calculate = function () {

		var wages = self.wages(),
			amount = 0,
			freq = self.frequency(),
			two = self.twoDeductions(),
			firstDeduction = 0,
			secondDeduction = 0,
			remainder = 0;
		if(wages !== undefined && freq !== undefined){
			amount = parseInt(wages.replace("£",""),10);
			if(isNaN(amount)){
				self.wages(undefined);
			} else{
				self.percent = self.calcPercent(amount,freq) || 0;

				if(two){
					firstDeduction = self.getDeduction(amount);
					remainder = amount - firstDeduction;
					self.percent = self.calcPercent(remainder,freq) || 0;
					secondDeduction = self.getDeduction(remainder);
				} else{
					firstDeduction = self.getDeduction(amount);
				}
				self.firstDeduction(firstDeduction || 0);
				self.secondDeduction(secondDeduction || 0);
				self.showResult(((self.totalDeduction() > 0 && self.wages() > 0 && self.deductions() > 0) ? true : false));
			}
			

		} 		
	};

	self.reset = function(){
		self.showResult(false);
		self.wages(undefined);
		self.frequency(undefined);
		self.deductions(undefined);
		self.firstDeduction(undefined)
		self.secondDeduction(undefined);
	};


};

