$(document).ready(function () {
  console.clear();
  // var controller = new ScrollMagic.Controller();
  var controller = new ScrollMagic.Controller();
  var tl = new TimelineMax();

  var ww = window.innerWidth;

  var noSlides = $(".section").length;
  var slideWidth = $(".section").width();
  var slideContainerWidth = slideWidth * noSlides - ww;

  console.log(noSlides, slideContainerWidth);

  var actionHorizontal = new TimelineMax().to("#slideContainer", 1, {
    x: -slideContainerWidth,
    ease: Power0.easeNone
  });

  var horizontal = createHorizontal();

  function createHorizontal() {
    return new ScrollMagic.Scene({
      triggerElement: "#js-wrapper",
      triggerHook: "onLeave",
      duration: slideContainerWidth,
    })
      .setPin("#js-wrapper")
      .setTween(actionHorizontal)
      .addIndicators({
        colorTrigger: "white",
        colorStart: "white",
        colorEnd: "white",
      })
      .addTo(controller);
  }

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

  $(window).resize(function () {
    ww = window.innerWidth;
    slideContainerWidth = slideWidth * noSlides - ww;
    horizontal.destroy(true);
    horizontal = createHorizontal();
    console.log(ww, slideContainerWidth);
  });

  $(document).on("click", "a[href^='#']", function (e) {
    var id = $(this).attr("href");
    $targetPos = $(id).offset().top;
    $targetPos += $(id).offset().left;
    if ($(id).length > 0) {
      console.log($(id));
      e.preventDefault();
      // trigger scroll
      controller.scrollTo($targetPos);

     
    }
  });
});
