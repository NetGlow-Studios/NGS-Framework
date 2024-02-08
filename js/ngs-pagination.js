// $(document).ready(function () {
//     if($('.header-page-item.active').length === 0) {
//         $('.header-page-item:first-child').addClass('active');
//         $('.body-page-item:first-child').addClass('active');
//     }
// });

$('.header-page-item:not(.disabled)').click(function () {
    let page = $(this).data('ngs-page');

    $('.header-page-item[data-ngs-page=' + page + ']').addClass('active').siblings().removeClass('active');
    $('.body-page-item[data-ngs-page=' + page + ']').addClass('active').siblings().removeClass('active');
});