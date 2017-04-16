$(function () {
    function setPostcode (pickedCity) {
        $('#error-container').hide();
        $('#city-name').text(pickedCity.placename);
        $('#region-name').text(pickedCity.region);
        $('#postcode').text(pickedCity.postalcode);
        $('#postcode-display').show();
        history.pushState(
            null,
            pickedCity.placename + ' | Sri Lanka Postal Codes',
            '/postcode/' + countryCode.toLowerCase() + '/' + encodeURIComponent(pickedCity.placename.toLowerCase())
        );
        /* since pushstate is not supported everywhere */
        document.title = pickedCity.placename.toUpperCase() + ' Postcode | Sri Lanka Postal Codes';
    }

    function clearPostcode () {
        $('#city-name').text('');
        $('#postcode').text('');
        $('#region-name').text('');
        $('#postcode-display').hide();
        history.pushState(
            null,
            'Sri Lanka Postal Codes',
            '/postcode/' + countryCode.toLowerCase()
        );
        /* since pushstate is not supported everywhere */
        document.title = 'Sri Lanka Postal Codes';
    }

    $('#city-search')
        .on('selected.autocompletr', function (event, selectedValue, dataSource) {
            var pickedCity = _.filter(dataSource, function (obj) {
                return obj.placename === selectedValue;
            });
            if (pickedCity.length) {
                setPostcode(pickedCity[0]);
            } else {
                clearPostcode();
            }
        })
        .on('blur.autocompletr', function (event, data) {
            if (!$(this).val().trim().length) {
                clearPostcode();
            }
        })
        .on('init.autocompletr', function (event, dataSource) {
            var inputValue = _.startCase($(this).val().trim());
            if (inputValue.length) {
                $(this).val(inputValue);
                var pickedCity = _.filter(dataSource, function (obj) {
                    return obj.placename === inputValue;
                });
                if (pickedCity[0]) {
                    setPostcode(pickedCity[0]);
                } else {
                    $('#error-message').text("Couldn't find city named \"" + inputValue + "\". Check spelling and try again.");
                    $('#error-container').show();
                }
            } else {
                $(this).focus();
            }
        })
        .autocompletr({
            dataSource: '/ajax/' + countryCode,
            closeOnBlur: true,
            filterFromStart: true,
            autoComplete: true,
            dataName: 'placename',
            minChars: 2,
            maxHeight: '205px',
        });

    //get user location

    //set country and update title

});