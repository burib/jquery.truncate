/**
 * @author Balazs_Buri
 * jQuery truncate v0.1
 * TODO: RTL support, smartSize support, callback option
 */
/*extern jQuery */
(function($) {
   $.truncate = function(element, options) {
      var defaults = {
         startsFrom: 0,        //you can set where the truncate should start from               || int     ||
         length: 70,          //you can set how many characters you want to truncate            || int     ||
         wordSafe: true,      //if it's set to false then it will can cut the words into half   || boolean ||
         rtl: false,          //Right To Left direction ?                                       || boolean ||
         numDots: 0,          //you can add any dots to the end                                 || int     ||
         attrName: null,      //you can add the original text to any attribute                  || string  ||
         width: null,         //you can truncate also by width ( in px )                        || int     ||
         height: null         //you can truncate also by height ( in px )                       || int     ||
      },

      plugin = this,
      $element = $(element),

      setOrigValue = function() {
         //getAttribute() vs. property
         //http://jsperf.com/getattribute-vs-property/2
         return $element.data('origText', element.textContent || $element.text() || element.getAttribute('value'));
      },

      setAttr = function() {
         if (!!plugin.settings.attrName) {
            return $element.attr(plugin.settings.attrName, $.trim($element.data('origText')));
         }
      },

      truncate = function() {
        var lastDelimiterChar,
            width,
            height,
            origDisplayValue,
            dots = Array(plugin.settings.numDots+1).join('.'), //how many dot's to add
            supportValueAttr = !!element.value,
            tempValue = plugin.settings.rtl ? dots + $.trim($element.data('origText')) : $.trim($element.data('origText')) + dots;

          if (!!plugin.settings.width) {
            width = parseInt(plugin.settings.width,10);
            origDisplayValue = $element.css('display');
            $element.css('display','inline');

            for (;width < $element.outerWidth();) {
              if (plugin.settings.rtl) {
                tempValue = tempValue.substr(-(tempValue.length-plugin.settings.numDots-1));
                $element.text(dots+tempValue);
              } else {
                tempValue = tempValue.substr(0, tempValue.length-plugin.settings.numDots-1);
                $element.text(tempValue+dots);
              }
            }

            $element.css('display', origDisplayValue);
          }

          if (!!plugin.settings.height) {
            height = parseInt(plugin.settings.height,10);
            for (;height < $element.outerHeight();) {
              if (plugin.settings.rtl) {
                tempValue = tempValue.substr(-(tempValue.length-plugin.settings.numDots-1));
                $element.text(dots+tempValue);
              } else {
                tempValue = tempValue.substr(0, tempValue.length-plugin.settings.numDots-1);
                $element.text(tempValue+dots);
              }
            }
          }

          if ( !plugin.settings.width && !plugin.settings.height && tempValue.length >= plugin.settings.length + plugin.settings.startsFrom ) {
             if (plugin.settings.wordSafe) {
               lastDelimiterChar = tempValue.lastIndexOf(' ', plugin.settings.length);
               tempValue = (lastDelimiterChar > 0) ? tempValue.substring(plugin.settings.startsFrom, lastDelimiterChar) : tempValue.substring(plugin.settings.startsFrom, plugin.settings.length);
             }
             else {
               tempValue = tempValue.substring(plugin.settings.startsFrom, plugin.settings.length);
             }
             // TODO support RTL
             return supportValueAttr ? $element.val(tempValue+dots) : $element.text(tempValue+dots);
          }

      };

      plugin.init = function() {
         plugin.settings = $.extend({}, defaults, options);   //overwrite the default options
         setOrigValue();                                      //save the original value as $.fn.data();
         setAttr();                                           //add the original value to the element's given attribute
         truncate();                                          //truncate the element's text as settings.
      }();
   };

   $.fn.truncate = function(options) {
      return this.each(function() {
         if (undefined === $(this).data('truncate')) {
            var plugin = new $.truncate(this, options);
            $(this).data('truncate', plugin);
         }
      });
   };

})(jQuery);