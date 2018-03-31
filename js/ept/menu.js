	var ignoreClick;

	function init(item)
	{
		$j(item + ' > li > a').click(function() {
			if ( !$j(this).hasClass("direct") )
			{
				ignoreClick = true;
				var child = $j(this).parent().find('ul');
							
				closeAll(item);
	
				$j(this).addClass('active');
				//child.show();
				child.slideDown(200, 'easeOutCirc').show(); //Drop down the subnav on click
				//child.show('slide',{direction: "up"},100);
			} 
		});

		$j('body').click(function() {
			if (ignoreClick == true)
			{
				ignoreClick = false;
			}
			else
			{
				closeAll(item);
			}
		});
	}

	function closeAll(item)
	{
		$j(item + ' > li > a').removeClass('active');
		$j(item).find('ul').hide();
	}