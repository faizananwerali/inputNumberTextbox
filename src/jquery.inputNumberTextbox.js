/*
    Plugin Name: jQuery plugin inputNumericTextBox
    Version: 1.0
    Plugin URI: https://github.com/faizananwerali/inputNumberTextbox
    Description: jQuery plugin inputNumericTextBox is a simple input number validate and proper input textbox
    Author: Faizan Anwer Ali Rupani
    Author URI: https://github.com/faizananwerali
    License: Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT)
*/
(function (global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return factory($, global);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global);
    } else {
        factory(jQuery, global);
    }
})(typeof window !== 'undefined' ? window : this, function ($, window) {
    'use strict';
    var pluginName = 'inputNumericTextBox';
    var defaults = {
        negativeAllow: true,
        decimalAllow: true,
        minDecimalDigits: 0,
        minValue: -Infinity,
        maxDecimalDigits: Infinity,
        maxValue: Infinity,
        decimalError: false,
        startNegativeSignError: false,
        multipleNegativeSignError: false,
        maxDecimalDigitError: false,
        maxValueError: false,
        beforeKeypressAction: function () {
        },
        afterKeypressAction: function () {
        },
        beforeKeyupAction: function () {
        },
        afterKeyupAction: function () {
        },
        beforeBlurAction: function () {
        },
        afterBlurAction: function () {
        },
        onError: function () {
        },
        onInitializationStart: function () {
        },
        onInitializationComplete: function () {
        }
    };
    if (!$.fn[pluginName]) {
        $.fn[pluginName] = function (options) {

            return this.each(function () {

                // check if there is an existing instance related to element
                var instance = $.data(this, pluginName);

                if (instance) {
                    // override default and option settings of instance
                    var settings = $.extend(defaults, options);
                    setMaxAttrValue(this, settings.maxValue);
                    setMinAttrValue(this, settings.minValue);
                    setMaxDecimalAttrValue(this, settings.maxDecimalDigits);
                    setMinDecimalAttrValue(this, settings.minDecimalDigits);
                } else {
                    // create the plugin
                    var plugin = new InputNumericTextBox(this, options);

                    // Store the plugin instance on the element
                    $.data(this, pluginName, plugin);
                    return plugin;
                }
            });
        };
    }

    if (!$.fn.hasAttr) {
        $.fn.hasAttr = function (name) {
            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            return (typeof this.attr(name) !== typeof undefined && this.attr(name) !== false);
        };
    }

    function InputNumericTextBox(element, options) {
        var $this = this;
        var settings = {};
        var previous_value_set = false;
        var negative_set = false;
        var previous_value = '';
        var keysdown = {};

        $.extend(this, $.fn, {

            init: function () {
                if (typeof options.onInitializationStart !== "undefined") {
                    //defaults.onInitializationStart = options.onInitializationStart;
                    defaults.onInitializationStart = $.extend(defaults.onInitializationStart, options.onInitializationStart);
                    defaults.onInitializationStart.call(element, defaults);
                    $(element).trigger('onInitializationStart', defaults);
                    settings = $.extend(defaults, options);
                } else {
                    settings = $.extend(defaults, options);
                    settings.onInitializationStart.call(element, settings);
                    $(element).trigger('onInitializationStart', settings);
                }

                if ($(element).hasAttr('data-intb-max-value')) {
                    settings.maxValue = parseFloat($(element).attr('data-intb-max-value')) || settings.maxValue;
                }

                if ($(element).hasAttr('data-intb-min-value')) {
                    settings.minValue = parseFloat($(element).attr('data-intb-min-value')) || settings.minValue;
                }

                if ($(element).hasAttr('data-intb-max-decimal-digits')) {
                    settings.maxDecimalDigits = parseFloat($(element).attr('data-intb-max-decimal-digits')) || settings.maxDecimalDigits;
                }

                if ($(element).hasAttr('data-intb-min-decimal-digits')) {
                    settings.minDecimalDigits = parseFloat($(element).attr('data-intb-min-decimal-digits')) || settings.minDecimalDigits;
                }

                if (settings.minDecimalDigits < 0) {
                    settings.minDecimalDigits = 0;
                }
                if (settings.maxDecimalDigits < 0) {
                    settings.maxDecimalDigits = 0;
                }
                if (settings.maxDecimalDigits < settings.minDecimalDigits) {
                    settings.maxDecimalDigits = Infinity;
                }
                if (settings.maxValue < settings.minValue) {
                    settings.maxValue = Infinity;
                }
                setMaxAttrValue(element, settings.maxValue);
                setMinAttrValue(element, settings.minValue);
                setMaxDecimalAttrValue(element, settings.maxDecimalDigits);
                setMinDecimalAttrValue(element, settings.minDecimalDigits);

                $(element).on('keydown', function (evt) {
                    //console.log("keydown");
                    $this.triggerKeydownAction(evt, element);
                });

                $(element).on('keypress', function (evt) {
                    //console.log("keypress");
                    $this.triggerKeypressAction(evt, element);
                });
                $(element).on('keyup', function (evt) {
                    //console.log("keyup");
                    $this.triggerKeyupAction(evt, element);
                });
                $(element).on('blur', function (evt) {
                    //console.log("blur");
                    $this.triggerBlurAction(evt, element);
                });
                $(element).on('increment', function (evt, number) {
                    //console.log("increment");
                    $this.triggerIncrementAction(evt, element, number);
                });
                $(element).on('setMaxValue', function (evt, number) {
                    //console.log("setMaxValue");
                    $this.triggerSetMaxValue(evt, element, number);
                });
                $(element).on('setMinValue', function (evt, number) {
                    //console.log("setMinValue");
                    $this.triggerSetMinValue(evt, element, number);
                });
                $(element).on('MaxDecimalDigits', function (evt, number) {
                    //console.log("MaxDecimalDigits");
                    $this.triggerMaxDecimalDigits(evt, element, number);
                });
                $(element).on('MinDecimalDigits', function (evt, number) {
                    //console.log("MinDecimalDigits");
                    $this.triggerMinDecimalDigits(evt, element, number);
                });
                settings.onInitializationComplete.call(element, settings);
                $(element).trigger('onInitializationComplete', settings);
            },

            triggerKeydownAction: function (evt, element) {
                var theEvent = evt || window.event;
                if (theEvent.charCode === 0 && theEvent.keyCode === 0) {
                    if (theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                    return false;
                }
                if (keysdown[theEvent.keyCode]) {
                    // Ignore it
                    if (theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                    return false;
                }
                keysdown[theEvent.keyCode] = true;
            },

            triggerKeypressAction: function (evt, element) {
                //console.log(evt);
                //console.log(element);
                settings.beforeKeypressAction.call(element, evt, settings);
                $(element).trigger('beforeKeypressAction', settings);

                var regex;
                var theEvent = evt || window.event;
                if (theEvent.charCode === 0 && theEvent.keyCode === 0) {
                    if (theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                    return false;
                }
                var key = String.fromCharCode(theEvent.keyCode || theEvent.which);
                if (/\./.test(key) && /\./.test($(element).val())) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                    settings.decimalError = true;
                    settings.onError.call(element, evt, settings);
                    $(element).trigger('onError', settings);
                    settings.afterKeypressAction.call(element, evt, settings);
                    $(element).trigger('afterKeypressAction', settings);
                    settings.decimalError = false;
                    return false;
                }

                if (/-/.test(key) && /-/.test($(element).val())) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                    settings.multipleNegativeSignError = true;
                    settings.onError.call(element, evt, settings);
                    $(element).trigger('onError', settings);
                    settings.afterKeypressAction.call(element, evt, settings);
                    $(element).trigger('afterKeypressAction', settings);
                    settings.multipleNegativeSignError = false;
                    return false;
                }

                if (/-/.test(key)) {
                    negative_set = true;
                }

                previous_value_set = true;
                previous_value = $(element).val();

                if (settings.decimalAllow) {
                    regex = (settings.negativeAllow) ? /[0-9]|-|\./ : /[0-9]|\./;
                } else {
                    regex = (settings.negativeAllow) ? /[0-9]|-/ : /[0-9]/;
                }
                if (!regex.test(key)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }
                settings.afterKeypressAction.call(element, evt, settings);
                $(element).trigger('afterKeypressAction', settings);
            },

            triggerKeyupAction: function (evt, element) {
                settings.beforeKeyupAction.call(element, evt, settings);
                $(element).trigger('beforeKeyupAction', settings);

                var theEvent = evt || window.event;
                delete keysdown[theEvent.keyCode];

                if (settings.negativeAllow && previous_value_set && negative_set) {
                    if (!(/^-.*/.test($(element).val()))) {
                        $(element).val(previous_value);
                        settings.startNegativeSignError = true;
                        settings.onError.call(element, evt, settings);
                        $(element).trigger('onError', settings);
                        settings.startNegativeSignError = false;
                    }
                }

                if (settings.decimalAllow) {
                    if ($(element).hasAttr('data-intb-max-decimal-digits')) {
                        settings.maxDecimalDigits = parseFloat($(element).attr('data-intb-max-decimal-digits')) || settings.maxDecimalDigits;
                    }

                    if ($(element).hasAttr('data-intb-min-decimal-digits')) {
                        settings.minDecimalDigits = parseFloat($(element).attr('data-intb-min-decimal-digits')) || settings.minDecimalDigits;
                    }
                    var regexNum = (settings.maxDecimalDigits === Infinity) ? settings.minDecimalDigits + "," : settings.minDecimalDigits + "," + settings.maxDecimalDigits;
                    var regex = new RegExp("^-?[0-9]{0,}(?:\\.[0-9]{" + regexNum + "})?$");
                    if (!(regex.test($(element).val()))) {
                        $(element).val(previous_value);
                        settings.maxDecimalDigitError = true;
                        settings.onError.call(element, evt, settings);
                        $(element).trigger('onError', settings);
                        settings.maxDecimalDigitError = false;
                    }
                }

                var unlimited = false;
                var maxValue = Infinity;
                if ($(element).hasAttr('data-intb-max-value')) {
                    maxValue = parseFloat($(element).attr("data-intb-max-value"));
                    if (isNaN(maxValue)) {
                        unlimited = true;
                        maxValue = Infinity;
                    } else {
                        unlimited = false;
                        settings.maxValue = maxValue;
                    }
                }
                if (!unlimited) {
                    if ($(element).val() > maxValue) {
                        $(element).val(previous_value);
                        settings.maxValueError = true;
                        settings.onError.call(element, evt, settings);
                        $(element).trigger('onError', settings);
                        settings.maxValueError = false;
                    }
                }

                unlimited = false;
                var minValue = -Infinity;
                if ($(element).hasAttr('data-intb-min-value')) {
                    minValue = parseFloat($(element).attr("data-intb-min-value"));
                    if (isNaN(minValue)) {
                        unlimited = true;
                        minValue = -Infinity;
                    } else {
                        unlimited = false;
                        settings.minValue = minValue;
                    }
                }
                if (!unlimited) {
                    if ($(element).val() < minValue) {
                        //$(element).val(previous_value); //Bug because enabling it won't allow to write anything because every number will be less minValue if minValue is greater then 9
                        settings.minValueError = true;
                        settings.onError.call(element, evt, settings);
                        $(element).trigger('onError', settings);
                        settings.minValueError = false;
                    }
                }

                previous_value_set = false;
                previous_value = '';

                settings.afterKeyupAction.call(element, evt, settings);
                $(element).trigger('afterKeyupAction', settings);
            },

            triggerBlurAction: function (evt, element) {
                settings.beforeBlurAction.call(element, evt, settings);
                $(element).trigger('beforeBlurAction', settings);

                var inputValue = $(element).val(),
                    parsedValue = (settings.decimalAllow) ? parseFloat(inputValue) : parseInt(inputValue, 10);
                if (isNaN(parsedValue)) {
                    $(element).val('');
                } else if (settings.negativeAllow) {
                    $(element).val(parsedValue);
                } else {
                    $(element).val(Math.abs(parsedValue));
                }

                settings.afterBlurAction.call(element, evt, settings);
                $(element).trigger('afterBlurAction', settings);
            },

            triggerIncrementAction: function (evt, element, number) {
                var inputValue = $(element).val(),
                    inputParsedValue = (settings.decimalAllow) ? parseFloat(inputValue) : parseInt(inputValue, 10);
                inputValue = (!isNaN(inputParsedValue)) ? inputParsedValue : 0;

                var numberParsedValue = (settings.decimalAllow) ? parseFloat(number) : parseInt(number, 10);
                number = (!isNaN(numberParsedValue)) ? numberParsedValue : 0;

                var total = inputValue + number;
                if (!settings.decimalAllow && total < 0) {
                    total = 0;
                }
                $(element).val(total);
                /* Also have to validate for min and max digit and number */
            },

            triggerSetMaxValue: function (evt, element, number) {
                settings.maxValue = parseFloat(number) || settings.maxValue;
                setMaxAttrValue(element, settings.maxValue);
            },

            triggerSetMinValue: function (evt, element, number) {
                settings.minValue = parseFloat(number) || settings.maxValue;
                setMinAttrValue(element, settings.minValue);
            },

            triggerMaxDecimalDigits: function (evt, element, number) {
                settings.maxDecimalDigits = parseFloat(number) || settings.maxValue;
                setMaxDecimalAttrValue(element, settings.maxDecimalDigits);
            },

            triggerMinDecimalDigits: function (evt, element, number) {
                settings.minDecimalDigits = parseFloat(number) || settings.maxValue;
                setMinDecimalAttrValue(element, settings.minDecimalDigits);
            }
        });

        this.init();
        return settings;
    }

    function setMinAttrValue(element, number) {
        $(element).attr('data-intb-min-value', number);
    }

    function setMaxAttrValue(element, number) {
        $(element).attr('data-intb-max-value', number);
    }

    function setMinDecimalAttrValue(element, number) {
        $(element).attr('data-intb-min-decimal-digits', number);
    }

    function setMaxDecimalAttrValue(element, number) {
        $(element).attr('data-intb-max-decimal-digits', number);
    }
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