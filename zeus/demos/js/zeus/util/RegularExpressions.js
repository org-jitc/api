function RegularExpressions(){
	this.double = function(hasMinus, integerLength, decimalLength){
		let exp = '^';
		if(hasMinus){
			exp += '-?';
		}
		
		exp += '(\\d';
		if(integerLength > 1){
			exp += '|[1-9]\\d{1,' + (--integerLength) + '}';
		}
		exp += ')';
		
		if(decimalLength && decimalLength > 0){
			exp += '(\\.\\d';
			
			if(decimalLength > 1){
				exp += '{1,' + decimalLength + '}'
			}
			exp += ')?'
		}
		exp += '$';
		return new RegExp(exp, 'g');
	};
	
	this.integer = function(hasMinus, length){
		let exp = '^';
		if(hasMinus){
			exp += '-?';
		}
		exp += '\\d';
		if(length > 1){
			exp += '|[1-9]\\d{1,' + (--length) + '}';
		}else{
			exp += '+';
		}
		exp += '$';
		return new RegExp(exp, 'g');
	};
}
var REGULAR_EXPRESSIONS = new RegularExpressions();
