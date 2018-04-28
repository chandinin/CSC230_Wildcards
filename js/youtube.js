$(document).ready(function() {
  var drawBtn = function(className) {
    var buttonType = "ytp-small-play-button";
    if ($(className).find("img").length > 0) {
      var href = $(className).find('a').first().attr('href');
      var url = href + "'";
	  var test= "onclick=window.open("+"'"+url+",'_blank')";
      $(className).append(
        '<button class=' + buttonType +' '+test+'>' +
		  '<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%" role="img" aria-labelledby="title-play-btn desc-play-btn"> ' +
		  '<title id="title-play-btn">Play Button</title><desc id="desc-play-btn">Opens video in new window</desc>' +
		  '<path class="ytp-large-play-button-bg" d="m .66,37.62 c 0,0 .66,4.70 2.70,6.77 2.58,2.71 5.98,2.63 7.49,2.91 5.43,.52 23.10,.68 23.12,.68 .00,-1.3e-5 14.29,-0.02 23.81,-0.71 1.32,-0.15 4.22,-0.17 6.81,-2.89 2.03,-2.07 2.70,-6.77 2.70,-6.77 0,0 .67,-5.52 .67,-11.04 l 0,-5.17 c 0,-5.52 -0.67,-11.04 -0.67,-11.04 0,0 -0.66,-4.70 -2.70,-6.77 C 62.03,.86 59.13,.84 57.80,.69 48.28,0 34.00,0 34.00,0 33.97,0 19.69,0 10.18,.69 8.85,.84 5.95,.86 3.36,3.58 1.32,5.65 .66,10.35 .66,10.35 c 0,0 -0.55,4.50 -0.66,9.45 l 0,8.36 c .10,4.94 .66,9.45 .66,9.45 z" fill="#404040" fill-opacity="0.81"></path> ' +
		  '<path d="m 26.96,13.67 18.37,9.62 -18.37,9.55 -0.00,-19.17 z" fill="#fff"></path> ' +
		  '<path d="M 45.02,23.46 45.32,23.28 26.96,13.67 43.32,24.34 45.02,23.46 z" fill="#ccc"></path> ' +
		  '</svg>' +
		  '</button>'
      );
      $(className).find('button').addClass('ytp-button');
    };
  };

	//add button to slider
	$( ".bxslider").find('li').each(function(index, element) {
  	$(this).addClass('thumbnail');

	$(this).children(':first').wrap( "<div class='inner-thumbnail'></div>" );
	});
  
	//add button to thumbnails
	if($('.inner-thumbnail').length >0){
		$('.inner-thumbnail').each(function() {
      drawBtn(this);
				if ($('.thumbnail').parent().find('.page-header').length >0){
									$('.thumbnail').css('width', '40%');
					};
  })
		}
	else {
		 drawBtn('.inner-thumbnail');
				if ($('.thumbnail').parent().find('.page-header').length >0){
		
				$('.thumbnail').css('width', '40%');
				}
		}

// $('.thumbnail').find('a').addClass('no-icon');
	
	
});