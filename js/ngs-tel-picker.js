const countryPhoneCodes = { "PL":48, "DE":49, "GB":44, "US":1, "RU":7, "UA":380, "FR":33, "IT":39, "ES":34, "CN":86, "JP":81, "KR":82, "IN":91, "BR":55, "CA":1, "AU":61, "MX":52, "ID":62, "TR":90, "NL":31, "BE":32, "SE":46, "CH":41, "AT":43, "NO":47, "DK":45, "FI":358, "GR":30, "CZ":420, "PT":351, "HU":36, "IE":353, "RO":40, "ZA":27, "SG":65, "MY":60, "NZ":64, "TH":66, "PH":63, "IL":972, "AE":971, "SA":966, "EG":20, "PK":92, "CL":56, "CO":57, "VN":84, "AR":54, "BD":880, "DZ":213, "MA":212, "IR":98, "IQ":964 };
$(document).ready(function () {
    const telPickers = $('div.tel-picker');
    const telPickerChoices = telPickers.find('.tel-picker-options').children();

    $('input.tel-picker').each(function (currentInputIndex, currentInput) {
        let pickerNode = $('<div class="tel-picker"></div>');
        let bodyNode = $('<div class="tel-picker-body"><div class="tel-picker-options"></div></div>');
        let selectCountryNode = $('<div class="tel-picker-country-select"></div>');
        let currentCountry = $(currentInput).data('ngs-current');
        let optionsNode= $('<div class="tel-picker-options"></div>');
        
        selectCountryNode.append(`<div class="country flag-${currentCountry.toLowerCase()}" data-ngs-country="${currentCountry}">+${countryPhoneCodes[currentCountry]}</div>`);

        Object.entries(countryPhoneCodes)
            .sort((a, b) => a[1] - b[1])
            .forEach(([countryCode, phoneCode]) => {
                let countryOptionNode = $(`<div class="flag-${countryCode.toLowerCase()}" data-ngs-country="${countryCode}">+${phoneCode}</div>`);
                optionsNode.append(countryOptionNode);
            });
        
        bodyNode.append(optionsNode);
        pickerNode.append(selectCountryNode);
        pickerNode.append(bodyNode);
        pickerNode.append('<input type="tel"/>');
        $(currentInput).after(pickerNode);

        selectCountryNode.on('click', function (event) {
            event.stopPropagation();

            pickerNode.not(this).parent().removeClass('active');
            $(this).parent().toggleClass('active');
        });

        selectCountryNode.on('click', function (event) {
            event.stopPropagation();
        });

        bodyNode.find('.tel-picker-options').children().on('click', function (event) {
            let selectedValue = $(this).text();
            let selectedCountry = $(this).data('ngs-country');
            let telPicker = $('body').find('input.tel-picker');

            telPicker.val(selectedValue);

            $(this).parent().parent().parent().removeClass('active');
        });
    });

    $(document).on('click', function (event) {
        const target = $(event.target);
        if (!target.closest('.tel-picker').length && !target.closest('.tel-picker-body').length) {
            $('.tel-picker').removeClass('active');
        }
    });
});