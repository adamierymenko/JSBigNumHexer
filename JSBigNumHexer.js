var JSBigNumHexer = {
	// Adds two arrays for the given base (10 or 16), returning the result.
	// This turns out to be the only "primitive" operation we need.
	add: function(x,y,base) {
		var z = [];
		var n = Math.max(x.length, y.length);
		var carry = 0;
		var i = 0;
		while (i < n || carry) {
			var xi = i < x.length ? x[i] : 0;
			var yi = i < y.length ? y[i] : 0;
			var zi = carry + xi + yi;
			z.push(zi % base);
			carry = Math.floor(zi / base);
			i++;
		}
		return z;
	},

	// Returns a*x, where x is an array of decimal digits and a is an ordinary
	// JavaScript number. base is the number base of the array x.
	multiplyByNumber: function(num,x,base) {
		if (num < 0) return null;
		if (num === 0) return [];

		var result = [];
		var power = x;
		while (true) {
			if (num & 1) {
				result = this.add(result, power, base);
			}
			num = num >> 1;
			if (num === 0) break;
			power = this.add(power, power, base);
		}

		return result;
	},

	parseToDigitsArray: function(str,base) {
		var digits = str.split('');
		var ary = [];
		for (var i = digits.length - 1; i >= 0; i--) {
			var n = parseInt(digits[i], base);
			if (isNaN(n)) return null;
			ary.push(n);
		}
		return ary;
	},

	convertBase: function(str,fromBase,toBase) {
		var digits = this.parseToDigitsArray(str, fromBase);
		if (digits === null) return null;

		var outArray = [];
		var power = [1];
		for (var i = 0; i < digits.length; i++) {
			// invariant: at this point, fromBase^i = power
			if (digits[i]) {
				outArray = this.add(outArray, this.multiplyByNumber(digits[i], power, toBase), toBase);
			}
			power = this.multiplyByNumber(fromBase, power, toBase);
		}

		var out = '';
		for (i = outArray.length - 1; i >= 0; i--) {
			out += outArray[i].toString(toBase);
		}
		return out.toLowerCase();
	}
};
