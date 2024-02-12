$(document).ready(function (node) {
    const colorPickers = $('div.select-picker');

    $('select.select-picker').each(function (currentSelectIndex, currentSelect) {
        let options = $(currentSelect).children();
        let maxOptions = $(currentSelect).data('ngs-max');

        let searcher = $('<div type="searcher"><input type="search" value="" placeholder="Wyszukaj"/></div>');

        let selectPickerNode = $('<div class="select-picker"></div>');
        let body = $('<div class="select-picker-body"></div>');

        if ($(currentSelect).data('ngs-pos') === "from_bottom") {
            body.addClass('open-top');
        }

        if ($(currentSelect).data('ngs-search') === true) {
            body.append(searcher);
        }

        let bodyOptions = $('<div class="select-picker-options"></div>');

        generate_options(currentSelect, options, bodyOptions, maxOptions);

        body.append(bodyOptions);

        selectPickerNode.append($(`<span class="select-picker-header">${$(currentSelect).find('option:selected').text()}</span>`));
        selectPickerNode.append(body);
        $(this).parent().append(selectPickerNode);

        $(selectPickerNode).on('click', function (event) {
            event.stopPropagation();

            $('.select-picker').not(this).removeClass('active');
            $(this).toggleClass('active');
        });

        $(selectPickerNode).find('.select-picker-body').on('click', function (event) {
            event.stopPropagation();
        });

        $(searcher).find('input[type="search"]').on('input', function () {
            let searchVal = $(this).val().toLowerCase();
            $(bodyOptions).html('');

            let newOptions = [];

            let amount = 0;

            $(options).each(function (optionIndex, option) {
                amount++;
                let optionText = $(option).text().toLowerCase();

                if (optionText.includes(searchVal)) {
                    newOptions.push(option);
                }
            });

            generate_options(currentSelect, newOptions, bodyOptions, maxOptions);
        });
    })

    function generate_options(currentSelect, options, bodyOptions, maxOptions) {
        $(options).each(function (index, option) {
            if($(option).val() === "" || $(option).val() == null) return;
            
            if (!maxOptions || index <= maxOptions) {
                let optionNode = $(`<div class="select-picker-item" data-ngs-value="${$(option).val()}"><span>${$(option).text()}</span></div>`);

                optionNode.on('click', function () {
                    if ($(currentSelect).find(`option[value=${$(option).val()}]`) != null) {
                        $(currentSelect).val($(option).val());
                        $(bodyOptions).parent().parent().removeClass('active');
                        $(bodyOptions).parent().parent().find('.select-picker-header').text($(option).text());  
                    }
                });

                bodyOptions.append(optionNode);
            }
        });
    }

    $(document).on('click', function (event) {
        const target = $(event.target);
        if (!target.closest('.select-picker').length && !target.closest('.select-picker-body').length) {
            $('.select-picker').removeClass('active');
        }
    });
});