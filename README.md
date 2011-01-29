#License#
@author Adam Eivy (antic | atomantic)  
@link [http://intellectualpirates.net](http://intellectualpirates.net)  

@license Copyright (c) 2011 Adam Eivy (antic | atomantic) Dual licensed under the MIT and GPL licenses:  
 * [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)  
 * [http://www.gnu.org/licenses/gpl.html](http://www.gnu.org/licenses/gpl.html)

#What it does:#

This is a fancy animation effect that throws a bunch of clones of an image onto the page, either shooting up from the bottom or falling down from the top.
It randomizes the size of the image between a min constraint and the maximum size of the source graphic.
It also, optionally, explodes at the end as it fades out.

The explosion requires jquery.ui

#Usage:#

	<!-- Include jQuery >= 1.4.2: [http://paulirish.com/2010/the-protocol-relative-url/](http://paulirish.com/2010/the-protocol-relative-url/) -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<!-- non google fallback -->
	<script>!window.jQuery && document.write(unescape('%3Cscript src="jquery.min.js"%3E%3C/script%3E'))</script>
	
	<!-- include jquery.ui -only needed if you are using the explode effect at the end -->
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>
	<!-- non google fallback -->
	<script>!window.jQuery.ui && document.write(unescape('%3Cscript src="jquery-ui.min.js"%3E%3C/script%3E'))</script>
	
	<!-- load and call the plugin -->
	<script src="jquery.imgexplosion.js"></script>
	
	<script type="text/javascript">
		$(function(){
			
			// simplest call, uses defaults:
			$.fn.imgExplosion();
			
			// adjusting call to a new image or image path
			$.fn.imgExplosion({
				img:'/img/somenewimage.png'
			});
			
			// using an image on the page
			$('#ImageID').imgExplosion();
			
			// showing all defaults in options:
			$.fn.imgExplosion({
				// absolute path to the image to firework (only needed if not attached to an image olready on the page)
		     	img: '/img/star.png',
				// how many images should we load before stopping the animation
				num: 24,				
				// minimum random width of the image in pixels
				min: 20,
				// should we explode or just hide after throwing the image? explode requires jquery.ui
				explode:true,	
				// should the image rotate into the page?
				rot: true,
				// where to start from (currently only supporting bottom or top)
				start:'bottom',
				// should we swap between top and bottom every throw
				alternate:false,
				// should we randomize the ending x coordinate (thrown at angle)?
				randEnd:false,
				// what z-index should we lay them on
				z: 1001
			});
			
		});
	</script>

The repository holds a demo in index.html, which is published on the github project page:
[Demo](http://atomantic.github.com/jquery.imgExplosion)