;(function ($, window, document, undefined) {
    'use strict';

    var pluginName = "autocompletr";
    var defaults = {
        dataSource: null,
        closeOnBlur: true,
        filterFromStart: true,
        maxHeight: '300px',
        autoComplete: false,
        dataName: null,
        minChars: 1,
        autofocus: false
    };
    var KEYS = {
        ESC: 27,
        TAB: 9,
        RETURN: 13,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };

    var utils = {
        escapeRegExChars: function (value) {
            return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
        },
        filter: function (obj, predicate) {
            var result = [];
            var key;

            for (key in obj) {
                if (obj.hasOwnProperty(key) && predicate(obj[key])) {
                    result.push(obj[key]);
                }
            }
            return result;
        },
        includes: function (string, regexPattern) {
            var pattern = new RegExp(regexPattern);
            return pattern.test(string);
        },
        getIndex: function (dataName) {
            if (dataName) {
                return function (array, index) {
                    return array[index][dataName];
                }
            } else {
                return function (array, index) {
                    return array[index];
                }
            }
        },
        getDataAtIndex: null,
        getData: function (data) {
            return new Promise(function (resolve, reject) {
                if ($.isArray(data)) {
                    // All good. return array.
                    resolve(data);
                } else {
                    // Might be a url. Get data from ajax.
                    $.ajax({
                        url: data,
                        dataType: 'json'
                    }).done(function (data) {
                        resolve(data)
                    }).fail(function (err) {
                        reject(err);
                    })
                }
            });
        }
    };

    // The actual plugin constructor
    function Plugin (element, options) {
        var _this = this;
        this.element = element;
        this.settings = $.extend({}, defaults, options);

        utils.getDataAtIndex = utils.getIndex(this.settings.dataName);

        if (this.settings.dataSource) {
            utils.getData(this.settings.dataSource)
                .then(function (data) {
                    _this._init(data);
                })
                .catch(function (err) {
                    console.error(err);
                });
        } else {
            console.warn('No data provided for Autocompletr.');
        }
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        _init: function (data) {
            var _this = this;

            this.DATA = data;

            this.suggestionsDiv = $('<div class="suggestions-box"></div>');
            this.suggestionsDiv.css('max-height', this.settings.maxHeight);
            this.suggestionsDiv.on('click._internal', '.suggestion', function (event) {
                _this._onSuggestionClick(event);
            });

            this.suggestionsDiv.insertAfter($(this.element));

            $(this.element).on('keydown._internal', function (event) {
                _this._onKeydown(event);
            });

            $(this.element).on('focus._internal', function (event) {
                /* Select value if there is a value ONLY if auto complete is enabled. */
                if ($(this).val().trim().length && _this.settings.autoComplete) {
                    this.select();
                } else {
                    _this._onChange(event);
                }
            });
            $(this.element).on('input._internal', function (event) {
                _this._onChange(event);
            });

            $(this.element).on('blur._internal', function () {
                if (_this.settings.closeOnBlur) {
                    _this._onBlur();
                }
            });

            $(this.element)
                .addClass(pluginName)
                .trigger('init.autocompletr', [this.DATA]);

            if (this.settings.autofocus) {
                $(this.element).focus();
            }
        },

        _onSuggestionClick: function (event) {
            this.selectedValue = $(event.target).text();
            this._clearSuggestions();
        },

        _onChange: function (event) {
            var _this = this;
            var $input = $(this.element);
            var inputVal = $input.val().toLowerCase();

            var filteredCities = utils.filter(this.DATA, function (item) {
                var patternStart = _this.settings.filterFromStart ? '^' : '';
                var pattern = patternStart + utils.escapeRegExChars(inputVal);
                return utils.includes(item[_this.settings.dataName].toLowerCase(), pattern);
            });

            if (inputVal.length > this.settings.minChars) {
                this._createSuggestions(filteredCities);
            } else {
                this._clearSuggestions();
            }
        },

        _moveUp: function (selectedSuggestion) {
            var newSelected = selectedSuggestion.prev();
            if (newSelected.length) {
                newSelected.addClass('selected');
                selectedSuggestion.removeClass('selected');

                if (newSelected.parent()[0].getBoundingClientRect().top > newSelected[0].getBoundingClientRect().top) {
                    newSelected[0].scrollIntoView(true);
                }
            }
            this.selectedValue = this.suggestionsDiv.find('.selected').text();
        },

        _moveDown: function (selectedSuggestion) {
            var newSelected = selectedSuggestion.next();
            if (newSelected.length) {
                newSelected.addClass('selected');
                selectedSuggestion.removeClass('selected');

                if (newSelected.parent()[0].getBoundingClientRect().bottom < newSelected[0].getBoundingClientRect().bottom) {
                    newSelected[0].scrollIntoView(false);
                }

            }
            this.selectedValue = this.suggestionsDiv.find('.selected').text();
        },

        _cycle: function (event, selectedSuggestion) {
            var newSelected;
            if (event.shiftKey) {
                newSelected = selectedSuggestion.prev();
                if (!newSelected.length) {
                    newSelected = this.suggestionsDiv.find('.suggestion:last');
                    newSelected[0].scrollIntoView(false);
                }
            } else {
                newSelected = selectedSuggestion.next();
                if (!newSelected.length) {
                    newSelected = this.suggestionsDiv.find('.suggestion:first');
                    newSelected[0].scrollIntoView(false);
                }
            }
            if (selectedSuggestion.is(newSelected)) {
                this._selectSuggestion(selectedSuggestion.text());
            } else {
                selectedSuggestion.removeClass('selected');
                newSelected.addClass('selected');
                newSelected[0].scrollIntoView(false);
            }
            this.selectedValue = this.suggestionsDiv.find('.selected').text();
        },

        _onKeydown: function (event) {
            var selectedSuggestion = this.suggestionsDiv.find('.selected');
            switch (event.which) {

                case KEYS.TAB:
                    //Do nothing if there are no suggestions
                    if (!selectedSuggestion.length) return;

                    this._cycle(event, selectedSuggestion);
                    break;

                case KEYS.UP:
                    this._moveUp(selectedSuggestion);
                    break;

                case KEYS.DOWN:
                    this._moveDown(selectedSuggestion);
                    break;

                case KEYS.RETURN:
                    //Do nothing if there are no suggestions
                    if (!selectedSuggestion.length) return;

                    this._autoComplete(true);
                    this._clearSuggestions();
                    break;

                case KEYS.ESC:
                    //Do nothing if there are no suggestions
                    if (!selectedSuggestion.length) return;

                    this._clearSuggestions();
                    break;

                default:
                    return;
            }

            event.preventDefault();
        },

        _onBlur: function () {
            var _this = this;
            setTimeout(function () {
                _this._clearSuggestions(true);
                $(_this.element).trigger('blur.autocompletr', [_this.selectedValue, _this.DATA]);
            }, 100)
        },

        _createSuggestions: function (filteredArray) {
            var _this = this;
            var isFirst = true;

            /* Return a array of <div> with the suggestions */
            var suggestions = Object.keys(filteredArray).map(function (key, index) {
                /* The first suggestion is selected by default. */
                var _class = isFirst ? 'suggestion selected' : 'suggestion';
                _this.selectedValue = isFirst ? utils.getDataAtIndex(filteredArray, index) : _this.selectedValue;
                isFirst = false;
                return '<div class="' + _class + ' empty">' + utils.getDataAtIndex(filteredArray, index) + '</div>';
            });

            if (filteredArray.length === 1) {
                /* If there's only one sugesstion and the input already has it's value - don't show suggestions. */
                if (utils.getDataAtIndex(filteredArray, 0).toLowerCase() === $(this.element).val().toLowerCase()) {
                    this._clearSuggestions();
                    return;
                }
            }

            this.suggestionsDiv
                .html(suggestions)
                .removeClass('empty');

            this.suggestionsDiv.scrollTop(0);
        },

        _selectSuggestion: function (value) {
            $(this.element).val(value);
        },

        _clearSuggestions: function (clearOnBlur) {
            this.suggestionsDiv
                .empty()
                .addClass('empty');

            /* If auto complete is needed, */
            if (this.settings.autoComplete) {
                /* Check if suggestions are visible */
                if ($(this.element).val().trim().length > this.settings.minChars) {
                    /* If there are suggestions, auto complete */
                    this._autoComplete();
                } else if (clearOnBlur) {
                    /* If this is called by onBlur, clear the input. */
                    $(this.element).val('');
                }
            }
        },

        _autoComplete: function (force) {
            if (force || this.selectedValue) {
                this._selectSuggestion(this.selectedValue);
                $(this.element).trigger('selected.autocompletr', [this.selectedValue, this.DATA]);
            }
        }
    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

