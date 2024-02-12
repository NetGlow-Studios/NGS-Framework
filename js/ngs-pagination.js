$(function () {
    $('.ngs-pagination').each(function () {
        let id = $(this).attr('id');
        let page = localStorage.getItem(id);
        if(page){
            $(this).find('.header-page-item[data-ngs-page=' + page + ']').click();
        } else {
            $(this).find('.header-page-item:first-child').click();
        }
    });
});

$('.header-page-item:not(.disabled)').click(function () {
    let page = $(this).data('ngs-page');

    $(this).addClass('active')
        .siblings().removeClass('active');
    
    $(this).parent().parent()
        .find('.body-page-item[data-ngs-page=' + page + ']')
        .addClass('active').siblings().removeClass('active');
    
    let id = $(this).parent().parent().attr('id');
    
    if(id){
        localStorage.setItem(id, page);
    }
});