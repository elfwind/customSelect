// jQuery Custom Select Plugin
// A boilerplate for jumpstarting jQuery plugins development
// version 0.1
// by Victor Herman



;(function ( $, window, document, undefined ) {
    //some options to be implemented, supported so far:
    //placeholder - the default text on the select, if not inserted it will take the first option
    //click, hover, focus - event that will open the select, so far implemented only click
    //slideTime - the time needed for the dropdown to appear on event
    //wrapperWidth and wrapperHeight - the height and width of the placeholder element if not inserted it will take the size of the original element
    //boxWidth, boxHeight - the height and width of the dropdown if not inserted will take the width and size of the original element
    //tabindex - in order to determine the tabindex attribute of the select box wrapper
    //does not support multiple, size or optgroup but they will be implemented at a later revision
    var customSelect = "customSelect",
        defaults = {
            placeholder     :   '',
            //show dropdown on event
            hover           :   false,
            focus           :   false,
            click           :   true,
            //time needed for the options to appear
            slideTime       :   '200',
            wrapperWidth    :   '',
            wrapperHeight   :   '',
            boxWidth        :   '',
            dropWidth       :   '',
            tabindex        :   '0',

            //default comment to be removed
            // if your plugin is event-driven, you may provide callback capabilities
            // for its events. execute these functions before or after events of your
            // plugin, so that users may customize those particular events without
            // changing the plugin's code
            onFoo: function() {}
        };

    // The actual plugin constructor
    function Plugin( element, options ) {

        var $element = $(element), // reference to the jQuery version of DOM element
            //defined self as to make it accesible from everywhere in the plugin
            self = this;
             //element = element;    // reference to the actual DOM element
            //plugin = this;
        //placeholder should take the selected option or the first option
        //added some code for the multiple and size options, but are not supported yet
        if($element.attr('multiple') || $element.attr('size')) {
            if($element.find('option').not(':disabled').is(':selected')){

                defaults.placeholder = '<ul class="select-choices">'
                $element.find('option:selected').not(':disabled').each(function(){
                    defaults.placeholder += '<li class="select-li-choices"><div class="choices-text">' + $(this).text() + '</div><span class="remove-span"></span></li>';
                });
                defaults.placeholder += '</ul>';

            }
        }
        else {
            defaults.placeholder = $element.find('option:selected').not(':disabled').length > 0 ?
                    $element.children('option:selected').text() :
                    $element.children('option').not(':disabled').first().text();
        }

        //defined wrapped width and length
        defaults.wrapperWidth = this.getRealWidth($element);
        defaults.wrapperHeight = this.getRealHeight($element);
        defaults.boxWidth = defaults.wrapperWidth;
        defaults.dropWidth = defaults.wrapperWidth;

        //merging the user options with our defaults
        self.options = $.extend( {}, defaults, options );

        self._defaults = defaults;
        self._name = customSelect;
        //self.element = element;

        //initialization of the plugin
        self.init(element, self);

    }


    Plugin.prototype = {
        //needed those variables and could not find a way to better define them
        selectBox: '',
        selectBoxSpan: '',
        dropDownContainer: '',
        optionContainer: '',

        getRealWidth:  function($e){
            return $e.width() + parseInt($e.css("padding-left"), 10) + parseInt($e.css("padding-right"), 10);
        },

        getRealHeight: function ($e) {
            return $e.height() + parseInt($e.css("padding-top"), 10) + parseInt($e.css("padding-bottom"), 10);
        },

        // the actual constructor of the DOM
        selectBoxConstructor: function(element, self){
            var $element = $(element);

            //constructor for the drop down items
            var dropDownContainer = '<div class="drop-container"  style="width:' + this.options.dropWidth + 'px;"><ul class="ul-wrapper">',
                selectBox = '<div class="custom-select-wrapper" style="width:' + this.options.wrapperWidth + 'px;" tabindex="' + this.options.tabindex + '"><div class="selectBox" style="width:' + this.options.boxWidth + 'px; height:' + this.options.wrapperHeight + 'px;"><span class="select-placeholder">' + this.options.placeholder + '</span><span class="ui-element"></span></div>';

            //check if the custom element is a select
            if(element.nodeName.toLowerCase() === 'select'){

                //constructor for the select element
                if ( $element.attr('multiple') === 'multiple'){
                    //multiple selects available.

                }
                else if( $element.attr('size') !== undefined ){
                    //number of visibile selections

                }
                if($element.children('optgroup').size() > 0){
                    //optgroup structure
                }
                else {
                    $element.find('option').each(function(){
                       dropDownContainer += '<li class="li-selectable option"><div class="option-label">' + $(this).text() + '</div><span class="ui-element"></span></li>';
                    })
                }
            }
            else {
                return false
            }

            dropDownContainer += '</ul></div></div>';
            var customSelectContainer = selectBox + dropDownContainer;

            // inserts the custom select into the DOM
            $element.after(customSelectContainer);

            //disregard next comment
            //asign the DOM created elements to jQuery object in order to hook them with events
            // $selectBox = $element.next('.custom-select-wrapper').find('.selectBox');
            // $dropDownContainer = $selectBox.next('.drop-container');
            // $customSelectContainer = $element.next('.custom-select-wrapper');

        },

        //hide dropdown, will be changed to accomodate the close of the select on click outside the element
        hideDropdown: function($selectBox, $dropDownContainer){
            if($dropDownContainer.is(':visible')) {
                $dropDownContainer.slideUp(this.options.slideTime);
                $selectBox.removeClass('expanded');
            }
            if($dropDownContainer.is(':hidden')) {
                $dropDownContainer.slideDown(this.options.slideTime);
                $selectBox.addClass('expanded');
            }
        },

        //change the original select values on selection on our plugin
        keepSelecteSelectedOption: function(optionSelectedText){//console.log($element.children('option:selected').text());
            $element.find('option').each(function(){
                if($(this).text() === optionSelectedText){
                    $(this).prop('selected', true);
                }
            })
        },

        //general events for the custom dropdown
        selectBoxBindEvents: function(element, self){
            var $element = $(element),
                $selectBox = $element.next('.custom-select-wrapper').find('.selectBox'),
                $dropDownContainer = $selectBox.next('.drop-container'),
                $customSelectContainer = $element.next('.custom-select-wrapper');
            if(this.options.hover === true) {
                //show drop down on hover
            }
            if(this.options.focus === true) {
                //show drop down on focus
            }
            if(this.options.click === true){
                $customSelectContainer.off('click.default1').on('click.default1', function(evt){
                    //in order not to interfere with hide menu on document click
                    evt.stopPropagation();
                    self.hideDropdown($selectBox, $dropDownContainer);
                });
            }
            //focus blur event - for UI purposes
            $customSelectContainer.off('focus.default3 blur.default4').on('focus.default3 blur.default4', function(){ $(this).toggleClass('focused');});

            $('html').off('click.default5').on('click.default5', function(evt){
                $dropDownContainer.hide();
            });

            //select the option on click
            $dropDownContainer.find('li.li-selectable').off('click.default2').on('click.default2', function(evt){
                evt.stopPropagation();
                var selectedText = $(this).children('.option-label').text();
                $selectBox.children('.select-placeholder').text(selectedText);
                $(this).addClass('selected');
                self.keepSelecteSelectedOption(selectedText);
                self.hideDropdown();
            });
        },

        init: function(element, self) {
            this.selectBoxConstructor(element, self);
            this.selectBoxBindEvents(element, self);
        }

    };

    // add the plugin to the jQuery.fn object
    $.fn.customSelect = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (!$.data(this, "plugin_" + customSelect)) {
                $.data(this, "plugin_" + customSelect, new Plugin( this, options ));
            }

        });

    }

})( jQuery, window, document );

    //disregard the following comments
    // $(document).ready(function() {

    //     // attach the plugin to an element
    //     $('#element').pluginName({'foo': 'bar'});

    //     // call a public method
    //     $('#element').data('pluginName').foo_public_method();

    //     // get the value of a property
    //     $('#element').data('pluginName').settings.foo;

    // });