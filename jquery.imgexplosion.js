/**
 * jquery.imgexplosion launches a horde of spinning (optional) images like fireworks
 * this is useful for a display of gold star fireworks as shown in the example--or flying soccer balls, heads, etc :)
 * 
 * @version 1.0
 * @requires jquery 1.4.2 or >
 * @usage: 
 * @author Copyright (c) 2011 Adam Eivy (antic | atomantic)
 * @license Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($, window, document, undefined) {
    /**
	 * The core plugin object
	 * 
	 * @param dom el The main element to attach directions
	 * @param obj opt Configuration option overrides
	 *
	 * @return obj an instance of the constructed library object
	 */
    var imgExplosion = window.imgExplosion = function(opt) {
        var o = $.extend({}, imgExplosion.defaults, opt || '');
        if (! (this instanceof imgExplosion)) {
            return new imgExplosion(o);
        }
		
        this.opt = o;

		// make sure we have the image created
		this.init();

        return this;
    };
    /**
	 * initializer
	 */
    imgExplosion.prototype.init = function() {
		// initial image object to clone
		this.img = $('<img src="'+this.opt.img+'" style="position:absolute;z-index:'+this.opt.z+'" />');
		// cache measurements
		var d = this.img.get(0);
		this.imgW = d.width;
		this.imgH = d.height;
		
		this.diam = Math.ceil(Math.sqrt(Math.pow(d.width,2) + Math.pow(d.height,2)));
		
		// cache document width. TODO: handle window resize while running.
		this.dw = $(document).width();
		this.dh = $(document).height();
		
		// max throwing destination
		// we could calculate the diam and max for each, given that they change size
		// but it's probably excessive
		this.maxOffset = this.dh - this.diam;
		
		// start off counter
		this.counter = 0;
		// run it
		this.interval = setInterval(
			// create the interval method within the context of our object
			(function(self) {
			    return function() {
					self.throwClone();
				};
			})(this),
		   300
		);
    };
    /**
	 * Throw a clone of the image (this is the interval method)
	 */
    imgExplosion.prototype.throwClone = function() {
		this.counter++;
		if(this.counter > this.opt.num){
			clearInterval(this.interval);
			return;
		}
		var o = this.opt,
			w = this.randBetween(this.opt.min,this.imgW), // new width
		    x = this.randBetween(0,this.dw-this.diam), // new x coordinate (padded)
			r = this.randBetween(0,180), // new rotation
		    cln = this.img.clone()
				// randomize starting left offset
				.css('left',x+'px')
				// randomize rotation
				.css('rotation',r+'deg')
				.css('-moz-transform','rotate('+r+'deg)')
				.css('-webkit-transform','rotate('+r+'deg)')
				.data('rot',1) // initial rotation to increment
				.width(w),
			runs = 0,
			r = 0,
			anim = {};
		// handle alternating
		if(this.opt.alternate){
			this.opt.start = this.opt.start==='bottom'?'top':'bottom';
		}
		// set initial start position
		if(this.opt.start==='bottom'){
			// make sure the image doesn't cause scrollbar by offsetting 
			// it from the bottom of the page enough that it can have a random rotation
			cln.css('bottom',this.diam-this.imgW);
		}else{
			cln.css(this.opt.start,'0px');
		}
		// add the 'bottom' or 'top' css prop to the animation config	
		anim[this.opt.start] = '+='+this.randBetween(200,this.maxOffset);
		
		if(this.opt.angle){
			anim.left = this.randBetween(0,this.dw-this.diam);
		}
		// actually stick it on the page
		$('body').append(cln);
		// start throw animation
		cln.animate(anim, this.randBetween(600,2000), function() {
			var t = $(this);
			if(o.explode && jQuery.ui){
				t.hide('explode', { pieces: 12 }, 500);
			}else{
				t.fadeOut();
			}
			clearInterval(t.get(0).intv);
		});
		if(this.opt.rot){
			// since jquery can't handle animating a transform css attribute with a value like 'rotate(300deg)'
			// we have to hack it with a setInterval
			
			// start rotation animation
			cln.intv = setInterval(
				(function(self,cln) {
				    return function() {
						self.rotAnimation(cln); 
					};
				})(this,cln),
				15
			);
		}
		
        return this;
    };
	imgExplosion.prototype.rotAnimation = function(cln) {
		var r = cln.data('rot') + 5;
		if(r>300){ // make sure we don't leave excessive intervals running on the page
			clearInterval(cln.intv);
			return;
		}
		cln.data('rot',r)
			.css('rotation',r+'deg')
			.css('-moz-transform','rotate('+r+'deg)')
			.css('-webkit-transform','rotate('+r+'deg)');
	};
	imgExplosion.prototype.randBetween = function(a,b){
		return Math.floor( Math.random() * (b-a) ) + a;
	};
    /**
	 * configuration defaults
	 */
    imgExplosion.defaults = {
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
		angle:false,
		// what z-index should we lay them on
		z: 1001
    };

    /**
	 * jQuery fn
	 * 
	 * @param obj opt The config options
	 * 
	 * @return instance of gmapDirections
	 */
    $.fn.imgExplosion = function(opt) {
        if (!this.length) {
			// return non-element attached version
            return new imgExplosion(opt);
        }
        return this.each(function() {
			// create and cache the gmapDirections object in the data cache for the map element
			return new imgExplosion($.extend(opt||{}, {
				img:$(this).attr('src')
			}));
        });
    };
})(jQuery, window, document);