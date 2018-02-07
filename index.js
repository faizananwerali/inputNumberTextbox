$(document).ready(function(){
    var n = $(".numberTextBox").inputNumericTextBox({
        negativeAllow: false,
        decimalAllow: true,
		maxDecimalDigits: 4,
        maxValue: 800,
        minValue: 300,
        beforeKeypressAction: function(evt, settings) {
            //console.log(this);
			//console.log(evt);
            //console.log(settings);
            //console.log('before keypress');
        },
        afterKeypressAction: function(evt, settings) {
            //console.log(this);
			//console.log(evt);
            //console.log(settings);
            //console.log('after keypress');
        },
        beforeKeyupAction: function(evt, settings) {
            //console.log(this);
			//console.log(evt);
            //console.log(settings);
            //console.log('before keyup');
        },
        afterKeyupAction: function(evt, settings) {
            //console.log(this);
            //console.log(evt);
			//console.log(settings);
            //console.log('after keyup');
        },
        beforeBlurAction: function(evt, settings) {
            //console.log(this);
            //console.log(evt);
			//console.log(settings);
            //console.log('before blur');
        },
        afterBlurAction: function(evt, settings) {
            //console.log(this);
            //console.log(evt);
			//console.log(settings);
            //console.log('after blur');
        },
        onError: function(evt, settings) {
            //console.log(this);
            //console.log(evt);
			//console.log(settings);
            //console.log('on error');
            if (settings.decimalError) {
                //alert('More than one decimal number is not allowed');
            } else if (settings.multipleNegativeSignError) {
               // alert('More than one negative sign is not allowed.');
            } else if (settings.startNegativeSignError) {
                //alert('You can only use one negative sign at the start');
            } else if (settings.maxDecimalDigitError) {
				//alert('You can only use ' + settings.maxDecimalDigits + ' decimal digits.');
			} else if (settings.maxValueError) {
				//alert('You cann\'t enter value more than ' + settings.maxValue);
			}
        },
        onInitializationStart: function(settings) {
            //console.log(this);
            //console.log(evt);
            //console.log(settings);
            //console.log('on complete');
        },
        onInitializationComplete: function(settings) {
            //console.log(this);
            //console.log(evt);
			//console.log(settings);
            //console.log('on complete');
        }
    });

    //$(n).trigger("increment", 210);

    setTimeout(function(){
        $(n).trigger("setMaxValue", 1010);
    }, 3000); // 3 seconds

	$(n).on('onError', function(evt, settings){
		//console.log(evt);
		//console.log(settings);
	});

    /**
     * Important Note
     * ==============
     * If you initialize more than one then it will override previous settings and events.
     * To maintain previous events, pass the whole setting once again with changes within it.
     * Now it will override events
     *
     * Example of more than one initialization:
     * $(".numberTextBox").inputNumericTextBox();
     * var n = $(".numberTextBox").inputNumericTextBox({
     *     negativeAllow: false,
     *     decimalAllow: true
     * });
     * console.log(n);
     */
});