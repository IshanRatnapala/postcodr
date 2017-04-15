$(function () {
    function setPostcode (pickedCity) {
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


    //setup dropdowns
    $('#city-search').on('selected.autocompletr', function (event, data) {
        var pickedCity = _.filter(cities, function (obj) {
            return obj.placename === data;
        });
        if (pickedCity.length) {
            setPostcode(pickedCity[0]);
        } else {
            clearPostcode();
        }
    });
    $('#city-search').on('blur.autocompletr', function (event, data) {
        if (!$(this).val().trim().length) {
            clearPostcode();
        }
    });
    $('#city-search').on('init.autocompletr', function (event) {
        var inputValue =  _.startCase($(this).val().trim());
        if (inputValue.length) {
            $(this).val(inputValue);
            var pickedCity = _.filter(cities, function (obj) {
                return obj.placename === inputValue ;
            });
            if (pickedCity[0]) {
                setPostcode(pickedCity[0]);
            } else {
                $('#error-message').text("Couldn't find city. Check spelling.");
            }
        } else {
            $(this).focus();
        }
    });

    $('#city-search').autocompletr({
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