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
		this.img = $('<img src="'+this.opt.img+'" style="display:none;position:absolute;z-index:'+this.opt.z+'" />');
		$('body').append(this.img); // add it to the body to load the image
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
		   this.opt.interval
		);
    };
    /**
	 * Throw a clone of the image (this is the interval method)
	 */
    imgExplosion.prototype.throwClone = function() {
		var o = this.opt; // short cache
		this.counter++;
		if(this.counter > o.num){
			clearInterval(this.interval);
			return;
		}
		// handle alternating
		if(o.alternate){
			o.start = o.start==='bottom'?'top':'bottom';
		}
		var w = this.randBetween(o.min,this.imgW), // new width
		    x = this.randBetween(0,this.dw-this.diam), // new x coordinate (padded)
			y = o.inPlace ? this.randBetween(this.diam,this.maxOffset) : this.diam-this.imgW,
			r = this.randBetween(0,180), // new rotation
			throwTime = this.randBetween(o.minThrow,o.maxThrow),
			halfw = w/2,
		    cln = this.img.clone()
				// randomize starting left offset
				.css('left',x+'px')
				// starting y offset
				.css(o.start,y+'px')
				// start visible
				//.css('display','block')
				// randomize rotation
				.css('rotation',r+'deg')
				.css('-moz-transform','rotate('+r+'deg)')
				.css('-webkit-transform','rotate('+r+'deg)')
				.data('rot',1) // initial rotation to increment
				.width(0).show(),
			runs = 0,
			r = 0,
			anim = { // must insure that at least one css prop is animated (lets grow it)
				'width':w,
				'padding-right':halfw
			},
			animComplete = function() {
				var t = $(this);
				if(o.explode && jQuery.ui){
					t.hide('explode', { pieces: o.pieces }, o.explodeTime);
				}else{
					t.fadeOut();
				}
				clearInterval(t.get(0).intv);
			};
		// add the 'bottom' or 'top' css prop to the animation config	
		if(!this.opt.inPlace){
			anim[o.start] = '+='+this.randBetween(200,this.maxOffset);
			if(o.angle){
				anim.left = this.randBetween(0,this.dw-this.diam);
			}
		}else{
			anim.left = x - halfw;
			anim[o.start] = y + (o.start==='bottom' ? -halfw : halfw);
		}
		// actually stick it on the page
		$('body').append(cln);
		
		// start throw animation
		cln.animate(anim, throwTime, animComplete);
		
		if(o.rot){
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
		// path to the image to firework (only needed if not attached to an image olready on the page)
     	img: '/img/star.png',
		// set inPlace to true if you don't want the image to be thrown (just appear and explode/fade)
		inPlace:false,
		// how many miliseconds between throws
		interval:800,
		// how many images should we load before stopping the animation
		num: 24,				
		// minimum random width of the image in pixels
		min: 20,
		// min throw time (in ms)
		minThrow: 600,
		// max throw time (in ms)
		maxThrow: 2000,
		// should we explode or just hide after throwing the image? explode requires jquery.ui
		explode:true,	
		// how many pieces to explode into
		pieces:16,
		// how long we should run the explode animation
		explodeTime:500,
		// should the image rotate into the page?
		rot: true,
		// where to start from (currently only supporting bottom or top)
		start:'bottom',
		// should we swap between top and bottom every throw
		alternate:false,
		// should we randomize the ending x coordinate (thrown at angle)?
		angle:false,
		// what z-index should we lay them on (default setting throws it over a jquery.ui dialog overlay--but behind modal dialog)
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