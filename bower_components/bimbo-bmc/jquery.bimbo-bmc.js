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

					this.createAppContainer();
					this.createRows();
					//this.createCols();
					this.createColBorder('top');
					this.createColBorder('bottom');
					this.createColBorder('left');
					this.createColBorder('right');
					this.fitColHHalf('top');

					var _this = this;
					$('button#addPostIt').click(function(){
						var $this = $(this);
						var $col = $this.parent();
						var $newPostIt = _this.$postItProto.clone();
						$newPostIt.appendTo($col).children('textarea').focus();

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
					});
					$('.app').on('keyup', 'div.post-it textarea', function(){
						var $this = $(this);
						console.log($this.val());
						$this.next('p').text($this.val());
					});
				},
				createAppContainer: function () {
					var wH = $(window).height();

					$(this.settings.topMenu).css({height: this.settings.topMenuHeight});

					this.appH = wH - this.settings.topMenuHeight;
					$(this.element).css({
						'margin-top': this.settings.topMenuHeight,
						'min-height': this.appH,
						'border': this.setBorder,
					});
				},
				createRows: function(){
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
					parentHeight = $('.' + position + '-row').height();
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
