$(function(){
	var viewModel = new myApp.Calculator();

	ko.bindingHandlers.fader = {
		update: function (element, valueAccessor, allBindingsAccessor, callback){
			if(valueAccessor()){
				$(element).fadeOut();
			}else{
				$(element).fadeIn();
			}
		}
	}

	ko.bindingHandlers.ghost = {
		update: function (element, valueAccessor, allBindingsAccessor, callback){
			if(valueAccessor()){
				$(element).animate({opacity: 0});
			}else{
				$(element).animate({opacity: 1});
			}
		}
	}
	ko.applyBindings(viewModel);
});