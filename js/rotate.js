var rbox = $('.rotatebox');
var gbox = $('.game');

$('.nav').click(function(){
    rbox.css('transform','rotateY(-45deg) translateX(35vw) translateZ(-35vw)');
    setTimeout(function(){gbox.addClass('hide')},100);
});

gbox.click(function(){
    if(gbox.hasClass('hide')){
        rbox.css('transform','rotateY(0)');
        gbox.removeClass('hide');
    }
});