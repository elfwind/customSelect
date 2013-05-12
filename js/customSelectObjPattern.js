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

    var customSelect = "customSelect";

    // The actual plugin constructor
    function CustomSelect(element, options) {

        //defined self as to make it accesible from everywhere in the plugin
        var self = this;
            self.element = element;
            self.$element = $(element);
            self.defaults =  $.fn.customSelect.defaults;

        //placeholder should take the selected option or the first option
        //added some code for the multiple and size options, but are not supported yet
        if(self.$element.attr('multiple') || self.$element.attr('size')) {
            if(self.$element.find('option').not(':disabled').is(':selected')){

                self.defaults.placeholder = '<ul class="select-choices">'
                self.$element.find('option:selected').not(':disabled').each(function(){
                    self.defaults.placeholder += '<li class="select-li-choices"><div class="choices-text">' + $(this).text() + '</div><span class="remove-span">x</span></li>';
                });
                self.defaults.placeholder += '</ul>';
            }
            else if(self.$element.find('option').not(':disabled')){
                self.defaults.placeholder = self.$element.find('option').not(':disabled').first().text();
            }

        }

        else {
            self.defaults.placeholder = self.$element.find('option:selected').not(':disabled').length > 0 ?
                    self.$element.find('option:selected').text() :
                    self.$element.find('option').not(':disabled').first().text();
        }

        //defined wrapper width and length
        self.defaults.wrapperWidth = self.getRealWidth(self.$element);
        self.defaults.wrapperHeight = self.getRealHeight(self.$element);
        self.defaults.boxWidth = self.defaults.wrapperWidth;
        self.defaults.dropWidth = self.defaults.wrapperWidth;
        self.defaults.dropHeight = 'auto';

        //support for size attr, te be continued
        // if(self.$element.attr('size')){
        //     var $e = self.$element.find('option');
        //         self.defaults.dropHeight = self.getRealHeight($e)
        //         console.log($e.height())
        // }

        //merging the user options with our defaults
        self.options = $.extend( {}, $.fn.customSelect.defaults, options );

        // self._defaults = defaults;
        // self._name = customSelect;
        //self.element = element;

        //initialization of the plugin
        self.init();

    }


    CustomSelect.prototype = {

        getRealWidth:  function($e){
            return $e.width() + parseInt($e.css("padding-left"), 10) + parseInt($e.css("padding-right"), 10);
        },

        getRealHeight: function ($e) {
            return $e.height() + parseInt($e.css("padding-top"), 10) + parseInt($e.css("padding-bottom"), 10);
        },

        // the actual constructor of the DOM
        selectBoxConstructor: function(){
            var self=this,
                element = this.element,
                $element = $(element);

            //create DOM dropdown structure
            function createNormal($el, disabled){
                var disabled = disabled ? disabled : false;

                if(!$el.attr('disabled') && disabled === false){
                    $el.attr('selected') ?
                        dropDownContainer += '<li class="li-selectable option selected"><div class="option-label">' + $el.text() + '</div><span class="ui-element"></span></li>' :
                        dropDownContainer += '<li class="li-selectable option"><div class="option-label">' + $el.text() + '</div><span class="ui-element"></span></li>';
                } else {
                    dropDownContainer += '<li class="li-disabled option"><div class="option-label">' + $el.text() + '</div><span class="ui-element"></span></li>';
                }

                return dropDownContainer;
            }

            //constructor for the drop down items
            var dropDownContainer = '<div class="drop-container"  style="width:' + self.options.dropWidth + 'px; height:' + self.options.dropHeight + 'px;"><ul class="ul-wrapper">',
                selectBox = '<div class="custom-select-wrapper" style="width:' + this.options.wrapperWidth + 'px;" tabindex="' + this.options.tabindex + '"><div class="selectBox" style="width:' + this.options.boxWidth + 'px; height:' + this.options.wrapperHeight + 'px;"><div class="select-placeholder">' + this.options.placeholder + '</span><span class="ui-element"></span></div></div>';

            //check if the custom element is a select
            if(element.nodeName.toLowerCase() === 'select'){

                //iterating through the select children and building the structure
                $element.children().each(function(){
                    if($(this).is('option')){
                        createNormal($(this));
                    }
                    if($(this).is('optgroup')){
                        if(!$(this).attr('disabled')){
                            dropDownContainer += '<ul class="optgroup-element element-selectable"><li class="opt-label opt-selectable">' + $(this).attr('label') + '</li>';
                            $(this).children().each(function(){
                                createNormal($(this));
                            });
                            dropDownContainer += '</ul>';
                        } else {
                            dropDownContainer += '<ul class="optgroup-element element-disabled"><li class="opt-label opt-disabled">' + $(this).attr("label") + '</li>';
                            $(this).children().each(function(){
                                createNormal($(this), true);
                            });
                            dropDownContainer += '</ul>';
                        }
                    }

                });

                //constructor for the select element
                if ($element.attr('multiple') === 'multiple'){
                    //multiple selects available.

                }
                else if($element.attr('size') !== undefined ){
                    //number of visibile selections

                }

            }
            else {
                return false;
            }

            dropDownContainer += '</ul></div></div>';
            var customSelectContainer = selectBox + dropDownContainer;

            // inserts the custom select into the DOM
            $element.after(customSelectContainer);
            self.$selectBox = self.$element.next('.custom-select-wrapper').find('.selectBox');
            self.$customSelectContainer = $element.next('.custom-select-wrapper');
            self.$dropDownContainer = self.$selectBox.next('.drop-container');

        },

        //hide dropdown on click on another dropdown or on html
        hideDropdown: function(){
            var self = this;

            //hides all the visible dropdowns in case they are not the active one
            $('.drop-container').not(self.$element.next().find('.drop-container')).hide();
            if(self.$dropDownContainer.is(':visible')) {
                self.$dropDownContainer.slideUp(self.options.slideTime);
                self.$selectBox.removeClass('expanded');
            }
            if(self.$dropDownContainer.is(':hidden')) {
                self.$dropDownContainer.slideDown(self.options.slideTime);
                self.$selectBox.addClass('expanded');
            }
        },

        //change the original select values on selection on our plugin
        keepSelectedOption: function(optionSelectedText){
            this.$element.find('option').each(function(){
                if($(this).text() === optionSelectedText){
                    $(this).prop('selected', true);
                }
            })
        },

        //general events for the custom dropdown
        selectBoxBindEvents: function(){
            var self = this;
            if(this.options.hover === true) {
                //show drop down on hover
            }
            if(this.options.focus === true) {
                //show drop down on focus
            }
            if(this.options.click === true){
                self.$selectBox.off('click.default1').on('click.default1', function(evt){
                    //in order not to interfere with hide menu on document click
                    evt.stopPropagation();
                    $(this).addClass('active');
                    self.hideDropdown();
                });
            }
            //focus blur event - for UI purposes
            self.$customSelectContainer.off('focus.default3 blur.default4').on('focus.default3 blur.default4', function(){ $(this).toggleClass('focused'); });

            //close dropdown on text outside the select
            $('html').off('click.default5').on('click.default5', function(evt){
                if(!$('.custom-select-wrapper').is(evt.target) && $('.custom-select-wrapper').has(evt.target).length === 0){
                    $('.drop-container').hide();
                }
            });

            //select the option on click
            $(self.$customSelectContainer).off('click.default6').on('click.default6', $('li-disabled'), function(e){
                e.stopPropagation();
            });
            $(self.$customSelectContainer).off('click.default6').on('click.default6', $('opt-label'), function(e){
                e.stopPropagation();
            });

            self.$dropDownContainer.find('li.li-selectable').off('click.default2').on('click.default2', function(evt){
                evt.stopPropagation();
                var selectedText = $(this).children('.option-label').text();

                if(self.$element.attr('multiple') && !$(this).hasClass('selected')){
                    if(self.$selectBox.children('.select-choices')){
                        self.$selectBox.find('.select-choices').append('<li class="select-li-choices"><div class="choices-text">' +  selectedText + '</div><span class="remove-span">x</span></li>');
                        $(this).addClass('selected');
                    } else {
                        self.$selectBox.children('.select-placeholder').append('<ul class="select-choices"><li class="select-li-choices"><div class="choices-text">' +  selectedText + '</div><span class="remove-span">x</span></li>');
                        $(this).addClass('selected');
                    }
                    removeSpan();
                } else if(!self.$element.attr('multiple')) {
                   self.$selectBox.children('.select-placeholder').text(selectedText);
                   $(this).addClass('selected').siblings().removeClass('selected');
                }


                self.keepSelectedOption(selectedText);
                self.hideDropdown();
            });

            function removeSpan(){
                $('.remove-span').off('click.default7').on('click.default7', function(e){
                    e.stopPropagation();
                    $(this).parent().remove();
                    var unselectText = $(this).siblings().text();//.find('li-selectable.selected:contains:'+ unselectText)
                    self.$dropDownContainer.find('.li-selectable.selected:contains('+ unselectText + ')').removeClass('selected');
                    //self.$dropDownContainer.find('li-selectable.selected').contains(unselectText).removeClass('selected');
                });
            }
            removeSpan();
        },

        callBack: function(){
            var self = this;
            if(self.options.callback && (typeof self.options.callback === 'function')){
                self.options.callback.call(self.options.callback);
            }
        },

        destroy: function(){
            var self = this;
            self.$customSelectContainer.remove();
            self.$customSelectContainer.off('click');
            self.$customSelectContainer.find('*').off('click');
            self.$selectBox.off('click');
            self.$selectBox.find('*'.off('click');
            self.$dropDownContainer.off('click');
            self.$dropDownContainer.find('*').off('click');
        },

        init: function() {
            var self = this;
            self.selectBoxConstructor();
            self.selectBoxBindEvents();
            self.callBack();
            self.destroy();
        }

    };

    // add the plugin to the jQuery.fn object
    $.fn.customSelect = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (!$.data(this, "plugin_" + customSelect)) {
                $.data(this, "plugin_" + customSelect, new CustomSelect( this, options ));
            }

        });

    }

    $.fn.customSelect.defaults = {
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
            dropHeight      :   '',
            tabindex        :   '0',

            //default comment to be removed
            // if your plugin is event-driven, you may provide callback capabilities
            // for its events. execute these functions before or after events of your
            // plugin, so that users may customize those particular events without
            // changing the plugin's code
            callback        : function() {},
            destroy         : function() {}
    };

})( jQuery, window, document );