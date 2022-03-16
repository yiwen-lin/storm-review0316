$(function () {
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var sliderIndex = 0;

    if( isMobile.any() ) {
        $('body').addClass('mobile');
    } else {
        $('body').removeClass('mobile');
    }

    let width = $(window).width();
    function sliderInit(width) {
        var scrollStatus = {
            wheeling: false,
            functionCall: false
        };
        var scrollTimer = false;

        function sliderTween() {
            var controller = new ScrollMagic.Controller();
            var tl = new TimelineMax();

            var ww = window.innerWidth;

            var noSlides = $(".section").length;
            var slideWidth = $(".section").width();
            var slideContainerWidth = slideWidth * noSlides - ww;
            var actionHorizontal = new TimelineMax().to("#slideContainer", 1, {
                x: -slideContainerWidth,
                ease: Power0.easeNone,
            });
            var horizontal = createHorizontal();

            function createHorizontal() {
                return new ScrollMagic.Scene({
                    triggerElement: "#js-wrapper",
                    triggerHook: "onLeave",
                    duration: slideContainerWidth,
                })
                    .refresh()
                    .setPin("#js-wrapper")
                    .setTween(actionHorizontal)
                    .addTo(controller)
                    .on("update", function (e) {
                        var sceneAmount = 10,
                            sceneWidth= (e.endPos) / (sceneAmount),
                            currentPos=e.scrollPos;

                        var getScene = Math.round(currentPos/sceneWidth);

                        var anchorID = getScene;
                        $('#anchor'+ anchorID).addClass('active').siblings().removeClass('active');
                        
                        if (getScene >= 0) {
                            var anchorID = getScene;
                            $('.section [data-aos]').removeClass('aos-animate')
                            $(`#section-${anchorID} [data-aos]`).addClass('aos-animate')
                        } else {
                            $('.section [data-aos]').removeClass('aos-animate')
                            $('#section--1 [data-aos]').addClass('aos-animate')
                        }

                        if (getScene > 0) {
                            $('.navigation').fadeIn();
                        } else {
                            $('.navigation').fadeOut();
                        }
                    });
            }

            // DC clear click to pos
            var result = 0;
            var isInProgress = false;
            document.addEventListener('wheel', function (e) {
                e.preventDefault();
                
                if ($('.active').length > 0) {
                    var num = $('.active').data('num');
                    if(isInProgress) { return; }
                    var value = e.deltaY;
                    result =  result + value;
                    if (result > 0) {
                        isInProgress = true;
                        result = 0;
                        num += 1;
                        $('#anchor' + num).click();
                        setTimeout(()=>{
                            isInProgress = false;
                        },1000);
                    } else if( result < 0) {
                        isInProgress = true;
                        result = 0;
                        num -= 1;
                        $('#anchor' + num).click();
                        setTimeout(()=>{
                            isInProgress = false;
                        },1000);
                    }
                }
            }, { passive: false });

            controller.scrollTo(function (newpos) {
                //TweenMax.to(window, 1, { scrollTo: { x: newpos } });
                TweenMax.to(window, 1, {
                    scrollTo: {
                        y: newpos,
                        autoKill: true,
                    },
                    ease: Power3.easeOut,
                });
            });

            $(window).on("resize", function () {
                ww = window.innerWidth;
                slideWidth = $(".section").width();
                slideContainerWidth = slideWidth * noSlides - ww;

                horizontal.destroy(true);
                horizontal = createHorizontal();
            });

            $('.anchor-nav > a').on("click", function (e) {
                if ($(this).hasClass('active')) return false;
                var id = $(this).attr("href");

                $targetPos = $(id).offset().top;
                $targetPos += $(id).offset().left;
                if ($(id).length > 0) {
                    e.preventDefault();
                    // trigger scroll
                    controller.scrollTo($targetPos, true);
                    $(this).addClass('active').siblings().removeClass('active');
                }
            });
        }

        function sliderSwipe() {
            document.addEventListener('touchstart', handleTouchStart, false);
            document.addEventListener('touchmove', handleTouchMove, false);

            var xDown = null;
            var yDown = null;

            function getTouches(evt) {
                return evt.touches ||             // browser API
                    evt.originalEvent.touches; // jQuery
            }

            function handleTouchStart(evt) {
                const firstTouch = getTouches(evt)[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            };

            function handleTouchMove(evt) {
                if ( ! xDown || ! yDown ) {
                    return;
                }

                var xUp = evt.touches[0].clientX;
                var yUp = evt.touches[0].clientY;

                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if ( Math.abs( xDiff ) <= Math.abs( yDiff ) ) {
                    if ( yDiff > 0 ) {
                        /* down swipe */
                        if (sliderIndex < 10) {
                            sliderIndex ++;
                        }
                    } else {
                        /* up swipe */
                        if (sliderIndex > 0 ) {
                            sliderIndex --;
                        }
                    }
                }
                sliderAction();
                /* reset values */
                xDown = null;
                yDown = null;
            };
        }

        function sliderAction() {
            $('#js-wrapper').animate({
                scrollLeft: width * sliderIndex
            }, 500);
            if ( sliderIndex >= 0 ) {
                $('.navigation').fadeIn();
                $('.section [data-aos]').removeClass('aos-animate');
                $(`#section-${sliderIndex} [data-aos]`).addClass('aos-animate')
            } else {
                $('.navigation').fadeOut();
                $('.section [data-aos]').removeClass('aos-animate');
                $('#section--1 [data-aos]').addClass('aos-animate')
            }
            if ( sliderIndex == 7 ) {
                $('a.anchor-nav-item').removeClass('active').eq(5).addClass('active');
            } else {
                $('a.anchor-nav-item').removeClass('active').eq(sliderIndex).addClass('active');
            }

            $('a.anchor-nav-item').click(function() {
                let thisIndex = $(this).index();
                sliderIndex = thisIndex;
                $('.section [data-aos]').removeClass('aos-animate');
                $(`#section-${thisIndex} [data-aos]`).addClass('aos-animate')
                $(this).addClass("active").siblings().removeClass("active");
            })
        }

        $('#section-0 [data-aos]').addClass('aos-animate')

        if( isMobile.any() ) {
            sliderSwipe();
        } else {
            sliderTween();
        }
    }

    sliderInit(width);

    window.onresize = function() {
        let width = $(window).width();
        sliderInit(width);
    }
});
