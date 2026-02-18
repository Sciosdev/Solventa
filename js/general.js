$(document).ready(function(){
    $(function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                
                if (target.length)
                {
                    $('.mobile--slider').addClass('hello');
                    
                    setTimeout(function(){
                        $('.board--descuentos .mobile--slider').animate({
                            scrollLeft: target.offset().left
                        }, 1000);
                    },300);
                    
                    setTimeout(function(){
                        $('.mobile--slider').removeClass('hello');
                    },1310);
                    
                    return false;
                }
            }
            return false
        });
    });

    $(".board__inputs--input").change(function(){
    	if($(this).val())
    	{
    		$(this).siblings("label").addClass("wtext");
    	}
    	else $(this).siblings("label").removeClass("wtext");
  	});

  	
    
    //Add restriction for "just numbers" input
    $("input[type='tel']").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    //Close app
    $(".close").click(function() {
        $(this).parent().addClass("hide");
        
        setTimeout(function(){
            $(".board__app").removeClass("hide");
        },30000);
        $(".modales").children().remove();
    });
    
    
    $(".overlay__close").click(function() {
        $(this).parents(".overlay").removeClass("show");
        $(".linkbar__burger--input").prop('checked', false);
        let stateObj = { id: "100" };
              
            window.history.pushState(stateObj,
                     "index.html?", "/prueba/index.html");
        $(".modales").children().remove();
    });
    
    //-----------modals
    $(".overlay--back, .close").click(function() {
        $(".board").removeClass("show");
        $(".overlay--back").removeClass("show");
        let stateObj = { id: "100" };
              
            window.history.pushState(stateObj,
                     "index.html?", "/prueba/index.html");
        $(".modales").children().remove();
    });
    
    
    //Open modal, depends of "data--modal" of the button element
    $(".button__modal").click(function() {
        var datamodal = $(this).attr("data-modal");
        
        $(".modal--" + datamodal).toggleClass("show");
        $(".overlay--back").toggleClass("show");
    });
    
    //-----------modals end
    
    // Board group, lateral navigation in modals
    
    $(".button__modal,.board__opera,.button__cta").click(function() {
        $(this).parents(".board__group").addClass('show');
    });
    
    $(".return").click(function() {
        var vreturn = $(this).attr("data-step");
        $(this).parents(".board__group--" + vreturn).removeClass("show");
    });
    
    // Board group, lateral navigation in modals ----ELENA
    $(".button__cta--nones").click(function() {
        $(this).parents(".board__group").addClass('show');           
        var index = $(this).parent().index();
       
        $( ".separate ul:nth-child("+index+")" ).addClass('show').siblings().removeClass("show");
    });
});