$(function () {
    function setPostcode (pickedCity) {
        $('#error-container').hide();
        $('#city-name').text(pickedCity.placename);
        $('#postcode').text(pickedCity.postalcode);
        $('#postcode-display').show();
        history.pushState(null, null, '/postcode/' + countryCode.toLowerCase() + '/' + pickedCity.placename.toLowerCase());
    }

    function clearPostcode () {
        $('#city-name').text('');
        $('#postcode').text('');
        $('#postcode-display').hide();
        history.pushState(null, null, '/postcode/' + countryCode.toLowerCase());
    }

    $('#city-search')
        .on('selected.autocompletr', function (event, data) {
            var pickedCity = _.filter(cities, function (obj) {
                return obj.placename === data;
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
        .on('init.autocompletr', function (event) {
            var inputValue = _.startCase($(this).val().trim());
            if (inputValue.length) {
                $(this).val(inputValue);
                var pickedCity = _.filter(cities, function (obj) {
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
            closeOnBlur: true,
            filterFromStart: true,
            autoComplete: true,
            dataName: 'placename',
            minChars: 3,
            maxHeight: '205px',
        });

    //get user location

    //set country and update title

});