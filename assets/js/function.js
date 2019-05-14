var TRINITY = TRINITY || {};

TRINITY.RESIZE_CONTROLLER = {
	SP: {
		breakpoint: 736,
		isSP: false
	},
	init: function(){
		this.setParams();
		this.bindEvents();
		this.checkDevice();
	},
	setParams: function(){
		this.$window = $(window);
	},
	bindEvents: function(){
		this.$window.on('resize',$.proxy(this.checkDevice,this));
	},
	checkDevice: function(){
		if(this.$window.width() > this.SP.breakpoint){
			this.SP.isSP = false;
		}else{
			this.SP.isSP = true;
		}
	},
	isSP: function(){
		return this.SP.isSP;
	}
};

TRINITY.MENU_HEADER = {
  init: function(){
    this.setParams();
    this.bindEvent();
  },
  setParams: function(){
    this.$trigger = $('.jsc-memu-trigger');
    this.$content = $('.jsc-menu-contents')
    this.$layer = $('.jsc-overlay');
	this.$menuList = $('.jsc-menu-list');
	this.$link = this.$menuList.children('li').children('a');
  },
  bindEvent: function(){
    this.$trigger.on('click',$.proxy(this.toggleContent,this));
  },
  hideContent: function(){
	  this.$trigger.removeClass('is-active');
	  this.$content.slideUp();
	  this.$layer.hide();
  },
  toggleContent: function(e){
	  e.preventDefault();
    if(this.$content.is(':hidden')){
		this.$trigger.addClass('is-active');
      	this.$content.slideDown();
      	this.$layer.show();
    }else{
		this.$trigger.removeClass('is-active');
     	this.$content.slideUp();
     	this.$layer.hide();
    }
  }
};

TRINITY.CURRENT_CONTROLLER = {
	BREADK_POINT: 376,
	init: function(){
		this.setParams();
		this.setLine();
		this.bindEvent();
		this.load();
	},
	setParams: function(){
		this.$window = $(window);
		this.$body = $('html,body');
		this.$glonavList = $('.jsc-glonav').children('li');
		this.$glonav = this.$glonavList.children('a');
		this.$section = $('.jsc-section-block');
		this.flg = false;
		this.minNum;
		this.$curretTarget;
	},
	setLine: function(){
		this.line = this.$window.scrollTop() + (this.$window.innerHeight() / 2);
	},
	bindEvent: function(){
		this.$window.on('scroll',$.proxy(this.judgePos,this));
	},
	load: function(){
		if(this.$window.width() < this.BREADK_POINT) return;

		var _self = this;
		this.$section.each(function(){
			var scrollTop = Math.abs($(this).offset().top - _self.line);
			if(_self.minNum > scrollTop || !_self.minNum){
				_self.minNum = scrollTop;
				_self.$curretTarget = $(this);
			}
		});

		var id = this.$curretTarget.attr('id');
		this.$glonav.each(function(){
			 var href = $(this).attr('href');
			 if(href.indexOf(id) != -1){
				 $(this).parent().addClass('is-active');
			 }
		});
	},
	setCurrent: function($trigger){
		if(this.$window.width() < this.BREADK_POINT) return;
		this.$glonavList.removeClass('is-active');
		$trigger.parent().addClass('is-active');
	},
	judgePos: function(){
		var _self = this;
		this.line = this.$window.scrollTop() + (this.$window.innerHeight() / 2);
		this.$section.each(function(){
			if(_self.line > $(this).offset().top && _self.line < $(this).offset().top + $(this).innerHeight()){
				if(_self.$curretTarget == $(this)){
					_self.flg = false;
				}else{
					_self.flg = true;
					_self.$curretTarget = $(this);
				}
			}
		});

		if(!_self.flg) return;
		var id = this.$curretTarget.attr('id');
		this.$glonav.each(function(){
			 var href = $(this).attr('href');
			 $(this).parent().removeClass('is-active');
			 if(href.indexOf(id) != -1){
				 $(this).parent().addClass('is-active');
			 }
		});
	}
};

TRINITY.FADE_ANIMATION = {
	opt: {
		delay: 300
	},
	init: function(){
		this.setParams()
		this.bindEvent();
		this.judgePos();
	},
	setParams: function(){
		this.$window = $(window);
		this.$parallaxWrap = $('.jsc-fadein-wrap');
	},
	bindEvent: function(){
		this.$window.on('scroll',$.proxy(this.judgePos,this));
	},
	judgePos: function(){
		if(TRINITY.RESIZE_CONTROLLER.isSP()) return;
		var _self = this,
			windowBottom = this.$window.scrollTop() + this.$window.outerHeight();

		this.$parallaxWrap.each(function(){
			var posBorder = $(this).offset().top + ($(this).innerHeight() / 3);
			if(windowBottom > posBorder) _self.animateTarget($(this));
		});
	},
	animateTarget: function($parallaxWrap){
		var _self = this,
			$target = $parallaxWrap.find('.jsc-fadein-target');
		if($target){
			$target.each(function(i){
				$(this).delay(_self.opt.delay * i).queue(function() {
				   $(this).addClass('is-over').dequeue();
				});
			});
		}
	}
};

$(window).on('load',function(){
	$.smooziee();
	TRINITY.RESIZE_CONTROLLER.init();
	TRINITY.CURRENT_CONTROLLER.init();
 	TRINITY.MENU_HEADER.init();
	TRINITY.FADE_ANIMATION.init();
});
