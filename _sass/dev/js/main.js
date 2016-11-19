$(document).ready(function() {
    $("#lightSlider").lightSlider({
        item: 1,
        auto: true,
        loop: true,
        pause: 10000,
        speed: 1000,
        autoWidth: true,
        controls: false,
        galleryMargin: 0
      });

    $(".banners__widget").accordion({heightStyle:"content"});
  });
