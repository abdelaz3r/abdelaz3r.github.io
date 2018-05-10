SVGSymbol = {
	// Constantes
	padding: 40,
	hgap: 40,
	vgap: 40,
	animateAppearTime: 400,
	animateDelay: 20,
	smallPointRadius: 1,
	largePointRadius: 6,
	variance: 1,

	// State
	width: 0,
	height: 0,
	isMobile: undefined,
	task: undefined,

	// Structure
	$svg: undefined,
	_svg: undefined,
	points: [],
	struct: [[1,1,0,0,0,0,1],[1,1,0,0,0,1,0],[1,1,0,0,1,0,0],[1,1,0,0,1,0,1],[1,1,0,1,1,0,0],[1,1,0,0,0,0,1],[1,1,1,1,0,1,0],[1,1,0,0,1,0,1],[1,1,1,0,0,1,0]],

	init: function() {
		SVGSymbol.$svg = $('#svg');
		SVGSymbol._svg = Snap('#svg');
		SVGSymbol.draw();
	},

	draw: function() {
		SVGSymbol.setSize();
		SVGSymbol.animate();
	},

	setSize: function() {
		SVGSymbol.width  = (SVGSymbol.padding * 2) + ((SVGSymbol.struct[0].length - 1) * SVGSymbol.hgap);
		SVGSymbol.height = (SVGSymbol.padding * 2) + ((SVGSymbol.struct.length - 1) * SVGSymbol.vgap);
		SVGSymbol.isMobile = false;

		SVGSymbol.$svg.css({
			'width': SVGSymbol.width,
			'height': SVGSymbol.height
		});
	},

	animate: function() {
		if (SVGSymbol.task !== undefined) {
			clearInterval(SVGSymbol.task);
			SVGSymbol.task = undefined;
		}

		if (SVGSymbol.isMobile) {
			console.log('animation continue');
		} else {
			for (var i = 0; i < SVGSymbol.struct.length; i++) {
				var line = SVGSymbol.struct[i];
				var yposition = SVGSymbol.padding + (i * SVGSymbol.vgap);

				for (var j = 0; j < line.length; j++) {
					var cell = line[j];
					var xposition = SVGSymbol.padding + (j * SVGSymbol.hgap);
					
					SVGSymbol.points.push({
						xposition,
						yposition,
						size: (cell == 1 
							? SVGSymbol.largePointRadius + _.random(-SVGSymbol.variance, SVGSymbol.variance)
							: SVGSymbol.smallPointRadius)
					});
				}
			}

			SVGSymbol.points = _.shuffle(SVGSymbol.points);

			var task = setInterval(function() {
				if (SVGSymbol.points.length > 0) {
					var point = SVGSymbol.points.pop();
					
					SVGSymbol._svg.circle(point.xposition, point.yposition, 0).animate({
						r: point.size
					}, SVGSymbol.animateAppearTime);
				} else {
					clearInterval(task);
				}
			}, SVGSymbol.animateDelay);
		}
	}
};

Pager = {
	current: undefined,
	pages: {},
	menus: {},

	init: function() {
		$('.nav-button').each(function() {
			Pager.menus[$(this).data('target')] = $(this);
		});
		
		$('.section').each(function() {
			Pager.pages[$(this).data('name')] = $(this);
		});
	},

	show: function(target) {
		if (Pager.pages[target] !== undefined && Pager.current !== target) {
			var $page = Pager.pages[target];
			var distance = SVGSymbol.$svg.offset().top - window.pageYOffset - 40;

			Pager.current = target;

			if (distance > 0) {
				$('body, html').animate({
					scrollTop: SVGSymbol.$svg.offset().top - 40
				}, 500);
			}

			$page.css('display', 'block');
			$page.find('.content-item').each(function(i, item) {
				var $item = $(item);

				$item.css('opacity', 0);

				setTimeout(function() {
					$item.animate({
						opacity: 1
					}, 500);
				}, i * 50);
			});
		}

		for (var name in Pager.pages) {
			if (name !== target) {
				Pager.pages[name].css('display', 'none');
			}
		}

		for (var name in Pager.menus) {
			var $menu = Pager.menus[name];

			if (name === target) {
				$menu.addClass('active');
			} else {
				$menu.removeClass('active');
			}
		}
	}
};

$(document).ready(function() {

	(function() {
		var $elems = $('.header .title > *');

		$elems.each(function(i, elem) {
			setTimeout(function() {
				$(elem).animate({
					'opacity': 1
				}, 1000);
			}, 200 * i);
		});

		SVGSymbol.init();
	})();

	// pager system
	Pager.init();

	$('.nav-button').on('click', function(e) {
		e.preventDefault();
		Pager.show($(this).data('target'));
	});

	// lightbox
	$('.content-item-tail').each(function() {
		$(this).magnificPopup({
			delegate: 'a',
			type: 'image',
			closeOnContentClick: true,
			showCloseBtn: false,
			gallery: {
				enabled: true
			},
			zoom: {
				enabled: true,
				duration: 300,
				opener: function(openerElement) {
					return openerElement.is('img') ? openerElement : openerElement.find('img');
				}
			}
		});
	});
});