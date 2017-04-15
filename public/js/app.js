$(function () {
    //setup dropdowns
    $('#city-search').autocompletr({
        closeOnBlur: true,
        filterFromStart: false,
        autoComplete: true,
        dataName: 'placename',
        minChars: 1
    });

    $('#city-search').on('selected.autocompletr', function (event, data) {
        var pickedCity = _.filter(cities, function (obj) {
            return obj.placename === data;
        });
        if (pickedCity.length) {
            $('#postcode').text(pickedCity[0].postalcode);
        } else {
            $('#postcode').text('');
        }
    });
    $('#city-search').on('blur.autocompletr', function (event, data) {
        if (!$(this).val().trim().length) {
            $('#postcode').text('');
        }
    });

    //get user location

    //set country and update title

    //update hrefs
});