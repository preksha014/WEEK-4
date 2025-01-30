$(document).ready(function () {
    //console.log($);
    //syntax
    // $('selector').action();
    // $('p').click(function () {
    //     console.log("You clicked");
    //     console.log(this);
    //     // $(this).hide();
    // })

    //selectors
    // $('*').click();
    // $('p.odd').click();
    // $('p:first').click();

    //Events in jQuery
    //Mouse events-->click, double click, mouseenter, mouseleave,mousedown, hover
    //keyboard event-->keypress,keydown
    //form event-->submit,change,focus,blur
    //document-->load,scroll,resize,unload

    // $('p').mouseenter(function () {
    //     console.log("You entered");
    //     console.log(this);
    //     // $(this).hide();
    // })

    // $('p').mousedown(function () {
    //     console.log("You entered through mouse");
    //     console.log(this);
    //     // $(this).hide();
    // })

    // $('p').mouseleave(function () {
    //     console.log("You leaved");
    //     console.log(this);
    //     // $(this).hide();
    // })

    // $('p').on(
    //     {
    //         click:function(){
    //             console.log("Thanks for clicking",this);
    //         },
    //         hover:function(){
    //             console.log('you hovered');
    //             }
    //     })

    $('#btn').click(function(){
        $('#content').toggle(1000,function(){
            console.log("you toggled");
        });
    }
    )  

    //fadeOut()
    // $('#content').fadeOut(2000);
    // //fadeIn()
    // $('#content').fadeIn(2000);
    //fadeToggle()
    // $('#content').fadeToggle(2000);
    //fadeTo()
    // $('#content').fadeTo('slow',0.2);


    //slide
    // $('#content').slideUp(2000);
    // $('#content').slideToggle(2000);
    // $('#content').slideToggle(2000,function(){
    //     console.log("You slided")
    // });
    

    //animate in jQuery
     $('#content').animate(
        { 
          height: '100px',
          width: '500px',
          backgroundColor: "#FFC0CB"
        }, 5000
      );

      // Stop animation on click and restart with new animation
      $('#content').click(function () {
        $(this).stop(true).animate({
          backgroundColor: '#FFC0CB'
        }, 5000);
      });

    //DOM Manipulation
    // console.log($('#content').text("hello world"));
    // console.log($('body').html());
    // console.log($('#ta').val());
    // console.log($('#content').remove());
    // console.log($('#content').empty());
    // $('h1').addClass('class1');
    // $('#content').text("Hello World!");
    $('h1').on(
        {
            click:function(){
                console.log("Thanks for clicking",this);
                $(this).toggleClass("class2");
            },
        })

     $(window).on("scroll",function(){
      if($(window).scrollTop()>200){
        $('#scrollToTop').css("transform","translateY(0)");
      }else{
        $('#scrollToTop').css("transform","translateY(100)");
      }
     })

     $("#scrollToTop").click(function(){
      $("html,body").animate({
        scrollTop:"0"
      },1000)
     })

});