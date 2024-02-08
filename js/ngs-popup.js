function closePopup(popup){
    popup.css('animation', 'popup-close-anim .3s ease 0s 1 normal forwards');

    setTimeout(function() {
        $(popup).removeClass('show');
    }, 2000);
}

function openPopup(popup) {
    if($(popup).data('ngs-timer')){
        $(popup).addClass('show');

        let time = $(popup).data('ngs-timer');

        let timerBar = $(popup).find('.popup-timer-bar');
        let initialWidth = timerBar.width();

        let widthDecrement = initialWidth / (time * 60);
        function updateWidth() {
            initialWidth -= widthDecrement;

            timerBar.width(initialWidth);

            if (initialWidth > 0) {
                requestAnimationFrame(updateWidth);
            } else {
                closePopup(popup);
            }
        }

        requestAnimationFrame(updateWidth);
    }
}

function popup(popup, state){
    if(state === 'show'){
        openPopup(popup)
    }else if(state === 'hide'){
        closePopup(popup);
    }
}

$(document).ready(function () {
    // $('.popup').each(function (index, element) {
    //     openPopup(element);
    //     // if($(element).data('ngs-popup-timer')){
    //     //     let time = $(element).data('ngs-popup-timer');
    //     //    
    //     //     let timerBar = $(element).find('.popup-timer-bar');
    //     //     let initialWidth = timerBar.width(); 
    //     //    
    //     //     let widthDecrement = initialWidth / (time * 60);
    //     //     function updateWidth() {
    //     //         initialWidth -= widthDecrement;
    //     //        
    //     //         timerBar.width(initialWidth);
    //     //        
    //     //         if (initialWidth > 0) {
    //     //             requestAnimationFrame(updateWidth);
    //     //         } else {
    //     //             closePopup(element);
    //     //         }
    //     //     }
    //     //
    //     //     requestAnimationFrame(updateWidth);
    //     // }
    // });
    
    $('button[data-ngs-close-popup]').on('click', function () {
        closePopup($(document).find($(this).data('ngs-close-popup')));
    });
});