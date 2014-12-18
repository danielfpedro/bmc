/*
 *  jQuery Boilerplate - v3.3.4
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "bmc",
				defaults = {
				topMenuHeight: 50,
				borderSize: 4,
				borderColor: 'red',
				colors: ['pink', '#FF0011', '#FF0088'],
				postItColorDefault: '#FF0088'
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;

				this.setBorder = this.settings.borderSize + 'px solid '	+ this.settings.borderColor;
				this.$postItProto = $('<div/>').addClass('post-it').append($('<textarea/>'), $('<p/>').text('sds'));

				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
					// Place initialization logic here
					// You already have access to the DOM element and
					// the options via the instance, e.g. this.element
					// and this.settings
					// you can add more functions like the one below and
					// call them like so: this.yourOtherFunction(this.element, this.settings).
					console.log("xD");

					this.fitAppContainer();
					this.fitRows();

					this.createColBorder('top');
					this.createColBorder('bottom');
					this.createColBorder('left');
					this.createColBorder('right');
					this.fitColHHalf('top');

					var _this = this;


					$(window).resize(function(event) {
						// This order mather
						_this.fitAppContainer();
						_this.fitRows();
						_this.fitColHHalf('top');

						var maxTop = 0;
						$('div.top-row').children().each(function(){
							if ($(this).height() > $('div.top-row').height()) {
								$('.top-row').css({'height': $(this).height()});
							}							
						});
						
						var maxBottom = 0;
						$('div.bottom-row').children().each(function(){
							if ($(this).height() > $('div.bottom-row').height()) {
								maxBottom = $(this).height();
								$('.bottom-row').css({'height': $(this).height()});
							}
						});
					});

					$('a#addPostIt').click(function(){
						_this.addPostIt($(this));
						return false;
					});

					$('.app').on('blur', 'div.post-it textarea', function(){
						var $this = $(this);
						$this.hide();
						var $p = $this.next('p').show();
						if ($this.val().length === 0) {
							$p.text('Clique aqui para escrever no seu post it!');
						}
					});
					$('.app').on('click', 'div.post-it p', function(){
						var $this = $(this);
						$this.hide();
						$this.prev('textarea').show().focus();
						$this.siblings('.container-colors-post-it').hide();
					});
					$('.app').on('keyup', 'div.post-it textarea', function(){
						var $this = $(this);
						$this.next('p').text($this.val());
					});

					$('.app').on('click', '.color-post-it', function(){
						_this.changePostItColor($(this));
					});

					// $('.app').on('mouseenter', '.post-it, .container-colors-post-it', function(){
					// 	var $parent = $(this, '.post-it').children('.container-colors-post-it');
					// 	this.postItTimeout = setTimeout(function(){
					// 		$parent.stop().fadeIn();
					// 	}, 1000);
					// });
					$('.app').on({
						mouseenter: function(){
							if (!$(this).children('textarea').is(':focus')) {
								var $colors = $(this).children('.container-colors-post-it');
								$colors.stop().fadeIn('fast');
							}
						}, mouseleave: function(){
							var $colors = $(this).children('.container-colors-post-it');
							$colors.stop().fadeOut('fast');
						}
					}, '.post-it');
				},
				changePostItColor: function($this){
					var color = $this.css('background-color');
					$('.color-post-it').removeClass('active');
					$this.addClass('active').parents('.post-it').css({'background-color': color});
				},
				rgb2hex: function (rgb) {
					rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
					return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
				},
				hex: function (x) {
					var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
					return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
				},			
				addPostIt: function($this) {
					var $col = $this.parents('.col');
					var $newPostIt = this.$postItProto.clone();
					$newPostIt = this.fitPostIt($newPostIt, $col);

					$newPostIt.css({'background-color': this.settings.postItColorDefault});

					var $colorsContainer = $('<div/>').addClass('container-colors-post-it');

					var _this = this;
					$.each(this.settings.colors, function(index, value){
						var $newColor = $('<div/>').addClass('color-post-it').css({'background-color': value});

						if (value == _this.settings.postItColorDefault) {
							$newColor.addClass('active');
						}
						$colorsContainer.append($newColor);
					});

					
					$newPostIt.appendTo($col).append($colorsContainer).children('textarea').focus();

					$('div.col').sortable({
						items: 'div.post-it',
						connectWith: '.col',
						update: function(event, ui){
							var $col = ui.item.parents('.col');
							ui.item = _this.fitPostIt(ui.item, $col);
						}
					});

					var maxTop = 0;
					$('div.top-row').children().each(function(){
						if ($(this).height() > $('div.top-row').height()) {
							$('.top-row').css({'height': $(this).height()});
						}							
					});
					
					var maxBottom = 0;
					$('div.bottom-row').children().each(function(){
						if ($(this).height() > $('div.bottom-row').height()) {
							maxBottom = $(this).height();
							$('.bottom-row').css({'height': $(this).height()});
						}
					});
				},
				fitPostIt: function($postIt, $col){
					var margin = 20;
					var w;
					if ($col.hasClass('col-w-50')) {
						w = $col.width() / 2 - margin;
					} else {
						w = $col.width() - margin;	
					}
					console.log(w);
					return $postIt.css({width: w, 'margin-left': margin / 2});
				},
				fitAppContainer: function () {
					var wH = $(window).height();

					$(this.settings.topMenu).css({height: this.settings.topMenuHeight});
					var appH = wH - this.settings.topMenuHeight;
					$(this.element).css({
						'margin-top': this.settings.topMenuHeight,
						'height': appH,
						'border': this.setBorder,
					});
					$('#wrap').css({
						'height': '100%',
					});
				},
				fitRows: function(){
					// Pega novamente a altura da janela, nao pode ter um valor fixo pois conforme o redirecionamento ela vai constantemente mudando;
					var appH = $(this.element).height();
					var factor = 1.3;
					var topRowHeight = appH / factor;

					// Deve ser height e nao min-height e ter altura definida caso contrario
					// Os do height 100% dos filhos nao vão funcionar
					$('.top-row').css({'height': topRowHeight});
					$('.bottom-row').css({'height': appH - topRowHeight});
				},
				createColBorder: function(position){
					$('div.col-border-' + position).css('border-' + position, this.setBorder);
				},
				fitColHHalf: function(position){
					var parentHeight = $('.' + position + '-row').height();
					$('div.col-' + position + '-h-50').css({'min-height': parentHeight / 2});
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
