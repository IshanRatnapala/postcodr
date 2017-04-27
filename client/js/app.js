$(function () {
    function setPostcode (pickedCity) {
        $('#error-container').hide();
        $('#city-name').text(pickedCity.areaName);
        $('#region-name').text(pickedCity.address3);
        $('#postcode').text(pickedCity.postcode);
        $('#postcode-display').show();
        history.pushState(
            null,
            pickedCity.areaName + ' | Sri Lanka Postal Codes',
            '/' + countryCode.toLowerCase() + '/' + encodeURIComponent(pickedCity.areaName.toLowerCase())
        );
        /* since pushstate is not supported everywhere */
        document.title = pickedCity.areaName.toUpperCase() + ' Postcode | Sri Lanka Postal Codes';
    }

    function clearPostcode () {
        $('#city-name').text('');
        $('#postcode').text('');
        $('#region-name').text('');
        $('#postcode-display').hide();
        history.pushState(
            null,
            'Sri Lanka Postal Codes',
            '/' + countryCode.toLowerCase()
        );
        /* since pushstate is not supported everywhere */
        document.title = 'Sri Lanka Postal Codes';
    }

    $('#city-search')
        .on('selected.autocompletr', function (event, selectedValue, dataSource) {
            var pickedCity = _.filter(dataSource, function (obj) {
                return obj.areaName === selectedValue;
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
                    return obj.areaName === inputValue;
                });
                if (pickedCity[0]) {
                    setPostcode(pickedCity[0]);
                } else {
                    console.warn('Picked city does not exist!');
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
            dataName: 'areaName',
            minChars: 0,
            maxHeight: '205px',
        });

    //get user location

    //set country and update title

});