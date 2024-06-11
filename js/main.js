

(function($) {

	var scrollTopTracker = 0;
	var scrollTopStickyHeaderTracker = 0;
	var siteCtaAlertTimeoutId = null;
	var mapSettings = {};

	// GO THROUGH THIS

	$(document).ready(function() {

		var target = window.location.hash;

	 	if (target.indexOf("#industry") >= 0) {
	 		form = 'body.post-type-archive-project section.page-section.default-section.first .post-index-filters form';
	 		target = target.replace('#industry-', '');
	 		// target = '#' + target;
			project = target;

			$("select[name=p_industry] option[data-name='" + project + "']").prop("selected", true);
			$(".form-container form").submit();
			
		}

		$.wptheme.initMobileMenu();
		$.wptheme.initHeader();
		$.wptheme.initSiteAnnouncement();
		$.wptheme.initLanguageSwitchers();
		$.wptheme.initGalleries();
		$.wptheme.initSliders();
		$.wptheme.initMaps();
		$.wptheme.initSvgMaps();
		$.wptheme.initModals();
		$.wptheme.initForms();
		$.wptheme.initAjaxPagination();
		$.wptheme.initComments();
		$.wptheme.initSocialShareLinks();
		$.wptheme.initExpandableReadMoreSections();

		$.wptheme.initTabbedContentSections();
		$.wptheme.initSidebarAccordionContentSections();

		$.wptheme.initWidgets();

		$.wptheme.initProjectArchive();

		// $.wptheme.initScrollingTriggers();

		$('.card-grid').cardGrid({});

		$.wptheme.initIEFixes();

	});

	$(window).load(function() {

	});

	$.wptheme = (function(wptheme) {
		wptheme.initSiteAnnouncement = function() {
			window.onclick = function(event) {
				if (event.target.id != "image_in_modal_div") {
					var announcement = $('#site-announcement');
					announcement.removeClass('shown');
					setTimeout(function() { announcement.removeClass('active'); }, 500);
					var id = announcement.data('announcement-id');
					setCookie('site_announcement_' + id, 'dismissed', 365);
					$('.modal-overlay').hide();
					$('body').removeClass('show-announcement');
				}
		 	}
			$(document).on('click', '#site-announcement button.dismiss', function(e) {
				var announcement = $('#site-announcement');
				announcement.removeClass('shown');
				setTimeout(function() { announcement.removeClass('active'); }, 500);
				var id = announcement.data('announcement-id');
				setCookie('site_announcement_' + id, 'dismissed', 365);
				$('.modal-overlay').hide();
				$('body').removeClass('show-announcement');
			});

			var adjustAnnouncement = function() {
				var announcement = $('#site-announcement');
				if(announcement.length && announcement.hasClass('active')) {
					// var height = announcement.outerHeight();
					// announcement.css({ marginTop: -height });
				}
			};

			var announcement = $('#site-announcement');
			if(announcement.length) {
				var id = announcement.data('announcement-id');
				var status = getCookie('site_announcement_' + id);
				if(status != 'dismissed') {
					announcement.addClass('active');
					setTimeout(function() { announcement.addClass('shown'); }, 500);
					adjustAnnouncement();
					$(window).on('load resize', adjustAnnouncement);
					$('.modal-overlay').show();
					$('body').addClass('show-announcement');
				}
			}
			
		};

		wptheme.initMobileMenu = function() {

			$('#mobile-menu-toggle').on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$('body').toggleClass('mobile-menu-active');
			}).on('vmousedown', function(e) {
				e.stopPropagation();
			});
			$(document).on('vmousedown', 'body.mobile-menu-active #page', function() {
				$('body').removeClass('mobile-menu-active');
			});

			// $('#mobile-navigation a').on('click', function(e) {
			// 	var menuItem = $(this).parent();
			// 	var subMenu = $('> .sub-menu-container', menuItem);
			// 	if(subMenu.length && !menuItem.hasClass('sub-menu-active')) {
			// 		e.preventDefault();
			// 		$('#mobile-navigation .menu-item.sub-menu-active').not(menuItem.parents('.sub-menu-active')).each(function(i, el) {
			// 			$(el).removeClass('sub-menu-active');
			// 			$('> .sub-menu-container', el).css({ height: $('> .sub-menu-container', el).outerHeight() });
			// 			setTimeout(function() { $('> .sub-menu-container', el).css({ height: 0 }); }, 0);
			// 		});
			// 		menuItem.addClass('sub-menu-active');
			// 		subMenu.css({ height: $('> .inner', subMenu).outerHeight() })
			// 		setTimeout(function() { subMenu.css({ height: 'auto' }); }, 200);
			// 	}
			// });

			// $('#mobile-navigation .menu-item.current-menu-ancestor, #mobile-navigation .menu-item.current-menu-item').each(function(i, el) {
			// 	var subMenu = $('> .sub-menu-container', el);
			// 	if(subMenu.length) {
			// 		$(el).addClass('sub-menu-active');
			// 		subMenu.css({ height: 'auto' });
			// 	}
			// });

		};

		wptheme.initHeader = function() {

			$(window).scroll(function(e) {
				var scrollTop = $(window).scrollTop();
				var header = $('#header');
				// var siteAnnouncement = $('#site-announcement');
				var miniHeaderScrollTopActivation = 100;
				var miniHeaderScrollUpActivation = 40;

				var minifyHeader = false;
				if(scrollTop >= miniHeaderScrollTopActivation) minifyHeader = true;
				if(scrollTop < scrollTopStickyHeaderTracker - miniHeaderScrollUpActivation) minifyHeader = false;

				if(minifyHeader && !header.hasClass('mini')) {
					header.addClass('mini');
					// siteAnnouncement.css({ height: 0 });
				} else if(!minifyHeader && header.hasClass('mini')) {
					header.removeClass('mini');
					// siteAnnouncement.css({ height: $('> .inner', siteAnnouncement).height() });
				}

				var stickyPageHeaderMenu = $('#sticky-page-header-menu');
				if(stickyPageHeaderMenu.length) {
					if($('#page-sections').offset().top <= scrollTop) {
						if(!stickyPageHeaderMenu.hasClass('active')) stickyPageHeaderMenu.addClass('active');
					} else if(stickyPageHeaderMenu.hasClass('active')) {
						stickyPageHeaderMenu.removeClass('active');
					}
				}

				if(scrollTop > scrollTopTracker) scrollTopStickyHeaderTracker = scrollTop;
				scrollTopTracker = scrollTop;
			});
			$(window).trigger('scroll');

			var refreshHeader = function() {
				var windowWidth = $('body').width();

				$('#header-navigation ul.menu > li').each(function(i, el) {
					var menuItem = $(el);
					var subMenu = $('> ul.sub-menu', menuItem);
					if(!subMenu.length) return;
					menuItem.removeClass('open-sub-menu-left');
					if(subMenu.offset().left + subMenu.width() > windowWidth - 6) {
						menuItem.addClass('open-sub-menu-left');
					}
				});

				// var siteAnnouncement = $('#site-announcement');
				// if(siteAnnouncement.length && !$('#header.mini').length) {
				// 	var siteAnnouncementHeight = $('> .inner', siteAnnouncement).height();
				// 	$('body').css({ marginTop: siteAnnouncementHeight });
				// 	if(!$('#header.mini').length) siteAnnouncement.css({ height: siteAnnouncementHeight });
				// }

			};
			refreshHeader();
			$(window).resize(refreshHeader);

			$('#header .search-form input[type=search]').on('focus', function(e) {
				$(this).closest('.search-form').addClass('active');
				$(this).select();
			}).on('blur', function(e) {
				if($(this).val() == '') $(this).closest('.search-form').removeClass('active');
			});

			$('#header-navigation').on('click', '.sub-menu-container', function(e) {
				$(this).parent().addClass('active');
			});
			$('#header-navigation').on('mouseenter', 'ul.menu > li > a', function(e) {
				$('#header-navigation li.menu-item.active').removeClass('active');
			});
			$(document).on('click', function(e) {
				if(!$(e.target).closest('.sub-menu-container').length) {
					$('#header-navigation li.menu-item.active').removeClass('active');
				}
			});

			$('#header-navigation ul.menu > li').hoverIntent({
				timeout: 200,
				over: function(e) {
					var menuItem = $(this);
					menuItem.addClass('hover');
					if(!menuItem.hasClass('active')) {
						$('#header-navigation ul.menu > li.active').removeClass('active');
					}
				},
				out: function(e) {
					var menuItem = $(this);
					menuItem.removeClass('hover');
				}
			});

			$('#header-navigation').on('mouseenter', '.sub-menu-container .menu-items a', function(e) {
				var postId = $(this).data('post-id');
				if(!postId) return;
				var previewContainer = $(this).closest('.menu-items').siblings('.preview-container');
				var preview = $('.preview-' + postId, previewContainer);
				if(!preview.length) {
					preview = $('<div class="preview preview-' + postId + '"><div class="inner"></div></div>');
					if($(this).data('post-title') || $(this).data('post-excerpt')) preview.addClass('has-content');
					if($(this).data('post-thumbnail-url')) {
						preview.prepend('<div class="bg" style="background-image: url(' + $(this).data('post-thumbnail-url') + ');"></div>');
					} else if($('.preview.root', previewContainer).length) {
						preview.prepend($('.preview.root .bg', previewContainer).clone());
					}
					if($(this).data('post-title')) $('> .inner', preview).append('<h3 class="preview-title">' + $(this).data('post-title') + '</h3>');
					if($(this).data('post-excerpt')) $('> .inner', preview).append('<div class="preview-excerpt">' + $(this).data('post-excerpt') + '</div>');
					previewContainer.append(preview);
				}
				if(!preview.hasClass('active')) {
					$('.preview.active', previewContainer).removeClass('active');
					setTimeout(function() { preview.addClass('active'); }, 1);
				}
			});
			$('#header-navigation').on('mouseenter', 'ul.menu > li > a', function(e) {
				var previewContainer = $(this).siblings('.sub-menu-container').find('.preview-container');
				if(previewContainer.length) {
					$('.preview.active', previewContainer).addClass('immediate').removeClass('active');
					setTimeout(function() { $('.preview.immediate', previewContainer).removeClass('immediate') }, 1);
				}
			});

			$('#header-navigation').on('submit', 'form.search-form', function(e) {
				e.preventDefault();
				var form = $(this);
				if($('input[name=s]', form).val().trim() == '') return false;
				var menuContainer = form.closest('.sub-menu-container');
				menuContainer.addClass('search-results-active');
				var previewContainer = $('.preview-container', menuContainer);
				if(previewContainer.length) {
					$('.preview.active', previewContainer).addClass('immediate').removeClass('active');
					setTimeout(function() { $('.preview.immediate', previewContainer).removeClass('immediate') }, 1);
				}
				var searchResultsContainer = $('.search-results', menuContainer);
				searchResultsContainer.addClass('active loading');
				$.get(themeData.ajaxUrl, 'action=get_search_results&context=header-navigation&' + form.serialize(), function(response) {
					var searchResultsContainer = $('#header-navigation .search-results.loading');
					$('.search-results-items', searchResultsContainer).html('');
					$('.scroll-contents', searchResultsContainer).scrollTop(0);
					if(response.success) {
						$('.search-results-header .summary', searchResultsContainer).text(response.posts.length ? 'Showing ' + (response.totalCount == response.posts.length ? (response.totalCount == 1 ? 'only ' : 'all ') : '') + response.posts.length : 'No Results Found');
						$('.search-results-header .summary', searchResultsContainer).addClass('active');
						if(response.totalCount > response.posts.length) {
							var form = searchResultsContainer.closest('.sub-menu-container').find('form.search-form');
							$('.search-results-header .more-link', searchResultsContainer).html('<a href="' + form.attr('action') + '?s=' + $('input[name=s]', form).val() + '&search_under_post=' + $('input[name=search_under_post]', form).val() + '">View All</a>');
							$('.search-results-header .more-link', searchResultsContainer).addClass('active');
						} else {
							$('.search-results-header .more-link', searchResultsContainer).html('');
							$('.search-results-header .more-link', searchResultsContainer).removeClass('active');
						}
						for(var i = 0; i < response.postsFormatted.length; i++) {
							$('.search-results-items', searchResultsContainer).append(response.postsFormatted[i]);
						}
					} else {

					}
					searchResultsContainer.removeClass('loading');
				}, 'json');
				$(window).trigger('resize');
				setTimeout(function() { $(window).trigger('resize'); }, 200);
				return false;
			});
			$('#header-navigation').on('click', '.search-results button.close', function(e) {
				$(this).closest('.sub-menu-container').removeClass('search-results-active');
				$(this).closest('.search-results').removeClass('active');
				$(window).trigger('resize');
			});

			var pageAnchorNav = $('#page-header-menu.anchor-navigation');
			if(pageAnchorNav.length) {
				stickyPageHeaderMenu = pageAnchorNav.clone();
				stickyPageHeaderMenu.attr('id', 'sticky-page-header-menu');
				$('#header').append(stickyPageHeaderMenu);
				$('body').addClass('has-sticky-page-header-menu');
			}

			$('#header-search .toggle').on('click', function(e) {
				var search = $(this).closest('#header-search');
				search.toggleClass('active');
				var container = $('.form-container', search);
				var startHeight = container.outerHeight();
				if(search.hasClass('active')) {
					container.css({ height: 'auto' });
					var endHeight = container.outerHeight();
					container.css({ height: startHeight });
					setTimeout(function() { container.css({ height: endHeight }); }, 0);
					setTimeout(function() { container.css({ height: 'auto' }); }, 300);
					$('input', search).select();
				} else {
					container.css({ height: startHeight });
					setTimeout(function() { container.css({ height: 0 }); }, 0);
				}
			});

		};

		wptheme.initLanguageSwitchers = function() {

			$(document).on('click', '.language-switcher button.menu-toggle', function(e) {
				var switcher = $(this).closest('.language-switcher');
				switcher.removeClass('menu-above');
				if($('.menu-container', switcher).offset().top + $('.menu-container', switcher).outerHeight() + 20 > $('body').height()) switcher.addClass('menu-above');
				switcher.toggleClass('active');
			});

			$(document).on('vmousedown', function(e) {
				var target = $(e.target);
				if(target.closest('.language-switcher').length && (target.is('button.menu-toggle') || target.closest('.menu-container').length)) return;
				$('.language-switcher.active').removeClass('active');
			});

		};

		wptheme.initGalleries = function() {

			$(document).on('click', '.gallery .gallery-icon a', function(e) {
				e.preventDefault();
				var gallery = $(this).closest('.gallery');
				var galleryLinks = [];
				$('.gallery-item', gallery).each(function(i, el) {
					galleryLinks.push({
						title: $('.gallery-icon img', el).attr('alt'),
						href: $('.gallery-icon a', el).attr('href'),
						thumbnail: $('.gallery-icon img', el).attr('src')
					});
				});
				blueimp.Gallery(galleryLinks, {
					index: $(this).closest('.gallery-item').index()
				});
			});

			$(document).on('click', '.section-gallery a', function(e) {
				e.preventDefault();
				var gallery = $(this).closest('.section-gallery');
				var galleryLinks = [];
				$('.image-container', gallery).each(function(i, el) {
					galleryLinks.push({
						title: $('img', el).attr('alt'),
						href: $('a', el).attr('href'),
						thumbnail: $('img', el).attr('src')
					});
				});
				blueimp.Gallery(galleryLinks, {
					index: $(this).closest('.image-container').index()
				});
			});

			$(document).on('mouseenter', 'section.page-section.image-gallery-section .section-gallery a', function(e) {
				var caption = $('.caption', this);
				$('> .inner', caption).css({ minHeight: $(this).width() / 5 });
				caption.css({ height: $('> .inner', caption).outerHeight() });
			}).on('mouseleave', 'section.page-section.image-gallery-section .section-gallery a', function(e) {
				var caption = $('.caption', this);
				caption.css({ height: 0 });
			});

		};

		wptheme.initSliders = function() {

			$('#page-header.configuration-slider').each(function(i, el) {
				var bgSlider = $('.section-bg .slider', el);
				var slider = $('.section-slider .slider', el);

				bgSlider.slick({
					arrows: false,
					dots: false,
					fade: true
				});
				
				slider.on('setPosition', function(event, slick) {
					var track = $('.slick-track', slick.$slider);
					var slides = $('.slick-slide', slick.$slider);
					slides.css({ height: 'auto' });
					slides.css({ height: track.height() });
				}).on('init beforeChange', function(event, slick, currentSlide) {
					setTimeout(function() {
						$('#page-header').removeClass('white-text');
						var slide = $(slick.$slides.get(slick.currentSlide));
						if(slide.length && slide.hasClass('white-text')) {
							$('#page-header').addClass('white-text');
						}
					}, 0);
				});
				slider.slick({
					arrows: true,
					dots: true,
					asNavFor: '#page-header-bg-slider'
				});

			});

			$('section.page-section.image-slider-section .section-slider').each(function(i, el) {
				var slider = $(el);

				var slickSettings = {
					arrows: false,
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1,
  					focusOnSelect: true,
  					variableWidth: false,
  					variableHeight: false,
  					mobileFirst: true,
  					responsive: [
						{
							breakpoint: 768 - 1,
							settings: {
								centerPadding: '100px',
								centerMode: true,
							}
						},
						{
							breakpoint: 992 - 1,
							settings: {
								centerPadding: '200px',
								centerMode: true,
							}
						}
					]
				};
				if ( $('body').hasClass('project-layout-alt-1') ) {
					slickSettings.arrows = true;
					slickSettings.dots = false;
					slickSettings.slide = '.slide';

					if ( slider.closest('.page-section').hasClass('display-slide-count') ) {
						slider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
							var slide_counter = $('.slide-counter', slider);
							if ( !slide_counter.length ) return;
							
							// currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
							var i = (currentSlide ? currentSlide : 0) + 1;
							var total = slick.slideCount;
							if ( i < 10 ) i = '0' + i;
							if ( total < 10 ) total = '0' + total;
							slide_counter.html('<span class="current-slide">' + i + '</span>/<span class="total-slides">' + total + '</span>');
						});
					}
				}
				slider.slick( slickSettings );
			});
			
			$('section.page-section.portal-links-section.slider-layout .section-links').each(function(i, el) {
				var slider = $(el);
				var sliderOptions = {
					arrows: true,
					dots: true,
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [
						{
							breakpoint: 768 - 1,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						},
						{
							breakpoint: 992 - 1,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3
							}
						}
					]
				};
				slider.slick(sliderOptions).on('setPosition', function(event, slick) {
					var track = $('.slick-track', slick.$slider);
					var slides = $('.slick-slide', slick.$slider);
					slides.css({ height: 'auto' });
					slides.css({ height: track.height() });
				});
			});

			$('section.page-section.news-event-slider-section, section.page-section.resources-slider-section').each(function(i, el) {
				var section = $(el);
				var slider = $('.section-slider', section);

				var sliderOptions = {
					arrows: true,
					dots: true,
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [
						{
							breakpoint: 768 - 1,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						},
						{
							breakpoint: 992 - 1,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3
							}
						}
					]
				};
				slider.slick(sliderOptions).on('setPosition', function(event, slick) {
					var track = $('.slick-track', slick.$slider);
					var slides = $('.slick-slide', slick.$slider);
					slides.css({ height: 'auto' });
					slides.css({ height: track.height() });
				});

				$('.section-filters input', section).on('change', function(e) {
					e.preventDefault();
					var section = $(this).closest('section.page-section');
					var slider = $('.section-slider', section);
					var slickSlider = slider.slick('getSlick');
					var selectedValue = $('.section-filters input:checked', section).val();
					slider.slick('slickUnfilter');
					if(selectedValue != '') {
						slider.slick('slickFilter', '.' + selectedValue);
					}
					slider.removeClass('item-count-' + slider.data('item-count'));
					slider.addClass('item-count-' + slickSlider.slideCount).data('item-count', slickSlider.slideCount);
				});

			});

			$('section.page-section.testimonial-slider-section .section-slider').each(function(i, el) {
				var slider = $(el);
				var sliderOptions = {
					arrows: false,
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1,
  					focusOnSelect: true,
  					variableWidth: false,
  					variableHeight: true,
  					mobileFirst: true,
  					responsive: [
						{
							breakpoint: 768 - 1,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
							}
						},
					]
				};
				slider.slick(sliderOptions).on('setPosition', function(event, slick) {
					var track = $('.slick-track', slick.$slider);
					var slides = $('.slick-slide', slick.$slider);
					slides.css({ height: 'auto' });
					slides.css({ height: track.height() });
				});
			});

			$('section.page-section.page-links-slider-section .section-slider').each(function(i, el) {
				var slider = $(el);
				var sliderOptions = {
					arrows: true,
					dots: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					focusOnSelect: true,
					variableWidth: false,
					mobileFirst: true,
					infinite: false,
					responsive: [
					{
						breakpoint: 768 - 1,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
						}
					},
					]
				};
				slider.slick(sliderOptions);
			});

			$('section.page-sidebar-section.related-posts-section.slider-layout .section-posts').each(function(i, el) {
				var slider = $(el);
				var sliderOptions = {
					arrows: false,
					dots: true,
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1
				};
				slider.slick(sliderOptions).on('setPosition', function(event, slick) {
					var track = $('.slick-track', slick.$slider);
					var slides = $('.slick-slide', slick.$slider);
					slides.css({ height: 'auto' });
					slides.css({ height: track.height() });
				});
			});

			$('section.page-section.grid-section.display-as-slider .section-grid').each(function(i, el) {
				var slider = $(el);
				var section = slider.closest('section.page-section');

				var slickSettings = {
					arrows: false,
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1,
  					focusOnSelect: true,
  					variableWidth: false,
  					variableHeight: true,
  					mobileFirst: true,
  					responsive: []
				};
				if(section.hasClass('column-count-2')) {
					slickSettings.responsive = [
						{ breakpoint: 768 - 1, settings: { slidesToShow: 2, slidesToScroll: 2 } }
					];
				} else if(section.hasClass('column-count-3')) {
					slickSettings.responsive = [
						{ breakpoint: 768 - 1, settings: { slidesToShow: 2, slidesToScroll: 2 } },
						{ breakpoint: 992 - 1, settings: { slidesToShow: 3, slidesToScroll: 3 } }
					];
				} else if(section.hasClass('column-count-4')) {
					slickSettings.slidesToShow = 2;
					slickSettings.slidesToScroll = 2;
					slickSettings.responsive = [
						{ breakpoint: 768 - 1, settings: { slidesToShow: 4, slidesToScroll: 4 } }
					];
				} else if(section.hasClass('column-count-5')) {
					slickSettings.slidesToShow = 2;
					slickSettings.slidesToScroll = 2;
					slickSettings.responsive = [
						{ breakpoint: 768 - 1, settings: { slidesToShow: 5, slidesToScroll: 5 } }
					];
				} else if(section.hasClass('column-count-6')) {
					slickSettings.slidesToShow = 3;
					slickSettings.slidesToScroll = 3;
					slickSettings.responsive = [
						{ breakpoint: 768 - 1, settings: { slidesToShow: 6, slidesToScroll: 6 } }
					];
				}
				slider.slick(slickSettings);
			});

		};

		wptheme.initMaps = function() {
			
			if(typeof google === 'undefined') return;

			mapSettings = {
				markerShapes: {
					default: {
						coords: [ 14,0 , 24,4 , 28,14 , 27,19 , 14,42 , 1,19 , 0,14 , 4,4 ],
						type: 'poly'
					}
				},
				markerImages: {
					blue: {
						url: themeData.themeUrl + '/images/miscellaneous/map-marker-superiorconstruction.png',
						size: new google.maps.Size(30, 42),
						scaledSize: new google.maps.Size(30, 42),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(15, 42)
					}
				}
			};

			$(document).on('mapInitialized', 'body.post-type-archive-project section.page-section.first .google-map', function(e) {
				var mapData = $(this).data('map-data');
				console.log(mapData);
				if(mapData.settings.points.length && !mapData.markers.length) {

					var infoWindow = null;

					infoWindow = new InfoBox({
						pixelOffset: new google.maps.Size(40, -65),
						alignBottom: false,
						closeBoxURL: ''
					});

					google.maps.event.addListener(mapData.map, 'click', function() {
						infoWindow.close();
					});

					var activeMapMarkers = [];
					mapData.bounds = new google.maps.LatLngBounds();
					for(var i in mapData.settings.points) {
						var point = mapData.settings.points[i];

						var position = new google.maps.LatLng(point.lat, point.lng);
						var markerSettings = {
							markerIndex: parseInt(i),
							position: position,
							// map: mapData.map,
							icon: mapSettings.markerImages.blue,
							shape: mapSettings.markerShapes.default,
							title: point.title,
							data: point
						};
						var marker = new google.maps.Marker(markerSettings);
						// marker.setVisible(point.active);

						if(markerSettings.data.infoBoxContent) {
							google.maps.event.addListener(marker, 'click', function() {
								var hasPhoto = this.data.hasPhoto;
								if(hasPhoto) {
									infoWindow.setOptions({ pixelOffset: new google.maps.Size(40, -200) });
								} else {
									infoWindow.setOptions({ pixelOffset: new google.maps.Size(40, -65) });
								}
								infoWindow.setOptions({ boxClass: 'infoBox' + (hasPhoto ? ' has-photo' : '') });
								infoWindow.setContent(this.data.infoBoxContent);
								infoWindow.open(this.map, this);
								setTimeout(function() { infoWindow.setOptions({ boxClass: 'infoBox active' + (hasPhoto ? ' has-photo' : '') }); }, 100);
							});
						}

						mapData.markers.push(marker);
						if(point.active) mapData.bounds.extend(position);
						if(point.active) activeMapMarkers.push(marker);
					}

					mapData.markerCluster = new MarkerClusterer(mapData.map, activeMapMarkers, {
						gridSize: 40,
						styles: [
							{
								textColor: 'white',
								url: themeData.themeUrl + '/images/miscellaneous/map-cluster-small.png',
								height: 45,
								width: 45,
								textSize: 16
							},{
								textColor: 'white',
								url: themeData.themeUrl + '/images/miscellaneous/map-cluster-medium.png',
								height: 58,
								width: 58,
								textSize: 16
							},{
								textColor: 'white',
								url: themeData.themeUrl + '/images/miscellaneous/map-cluster-large.png',
								height: 75,
								width: 75,
								textSize: 16
							}
						]
					});

					if(mapData.settings.points.length) {

						mapData.map.fitBounds(mapData.bounds);

						google.maps.event.addListenerOnce(mapData.map, 'idle', function() {
							var mapData = $(this.getDiv()).data('map-data');
							if(mapData.map.getZoom() > mapData.settings.options.zoom) {
								mapData.map.setZoom(mapData.settings.options.zoom);
							}
						});

					}

					if(mapData.markers.length == 1) {
						google.maps.event.addListenerOnce(mapData.map, 'idle', function() {
							infoWindow.setOptions({ boxClass: 'infoBox' });
							infoWindow.setContent(mapData.markers[0].data.infoBoxContent);
							infoWindow.open(mapData.markers[0].map, mapData.markers[0]);
							setTimeout(function() { infoWindow.setOptions({ boxClass: 'infoBox active' }); }, 100);
						});
					}

				}
			});

		};

		wptheme.initSvgMaps = function() {
			if(typeof window.svgMapRegionData === 'undefined') window.svgMapRegionData = [];

			for(var i = 0; i < window.svgMapRegionData.length; i++) {
				var mapRegionData = window.svgMapRegionData[i];
				var map = $('#' + mapRegionData.id + '.svg-map');
				if(!map.length) continue;
				map.data('mapData', mapRegionData);

				for(var j = 0; j < mapRegionData.regions.length; j++) {
					var region = mapRegionData.regions[j];
					var regionEl = $('#' + region.id, map);
					if(!regionEl.length) continue;
					regionEl.data('regionData', region);

					for(var k = 0; k < region.classes.length; k++) {
						regionEl.get(0).svgClassList.add(region.classes[k]);
					}

					if(region.info != '') {
						var infobox = $('<div id="' + region.id + '-infobox" class="infobox svg-map-infobox"><div class="tail"></div><div class="inner"></div></div>');
						$('> .inner', infobox).html(region.info);
						$('> .inner', map).append(infobox);
					}

					regionEl.on('click', function(e) {
						var maxOverflow = 10;
						var regionEl = $(this);
						var map = regionEl.closest('.svg-map');
						var region = regionEl.data('regionData');
						if(regionEl.hasClass('enabled')) {
							$('.svg-map path.active').not(regionEl).each(function(i, el) {
								el.svgClassList.remove('active');
								$('#' + $(el).attr('id') + '-infobox', map).removeClass('active');
							});
							if(!regionEl.hasClass('active')) {
								regionEl.get(0).svgClassList.add('active');
								var infobox = $('#' + region.id + '-infobox', map);
								if(infobox.length) {
									var x = e.pageX - map.offset().left;
									var y = e.pageY - map.offset().top;
									var left = x - (300 / 2);
									var bottom = map.outerHeight() - y + 10;
									if(left < -maxOverflow) {
										var diff = -left - maxOverflow;
										left = -maxOverflow;
										$('> .tail', infobox).css({ left: (300 / 2) - diff });
									} else if(left + 300 > map.width() + maxOverflow) {
										var diff = map.width() + maxOverflow - left - 300;
										left = map.width() - 300 + maxOverflow;
										$('> .tail', infobox).css({ left: (300 / 2) - diff });
									} else {
										$('> .tail', infobox).css({ left: '50%' });
									}
									infobox.css({ left: left, bottom: bottom });
									infobox.addClass('active');
								}
							}
						}
					});
				}

			}

			$(document).on('click', function(e) {
				if(!$(e.target).is('path.active') && !$(e.target).is('.svg-map-infobox') && !$(e.target).closest('.svg-map-infobox').length) {
					$('.svg-map path.active').each(function(i, el) {
						el.svgClassList.remove('active');
						$('#' + $(el).attr('id') + '-infobox', map).removeClass('active');
					});
				}
			});

			$(window).resize(function() {
				$('.svg-map path.active').each(function(i, el) {
					el.svgClassList.remove('active');
					$('#' + $(el).attr('id') + '-infobox', map).removeClass('active');
				});
			});

			// $('.svg-map svg path').on('click', function(e) {
			// 	var svg = $(this).closest('svg');
			// 	$('path.active', svg).not(this).each(function(i, el) { el.svgClassList.remove('active'); });
			// 	this.svgClassList.add('active');
			// 	svg.trigger('regionSelected', [ $(this).attr('id') ]);
			// });
		};

		wptheme.initModals = function() {

			$('body').append('<div id="modal-overlay"></div>');
			$('body').append('<div id="modal-loading"></div>');

			$(document).on('loadingModal', function(e) {
				$('#modal-loading').addClass('active');
				$('body').addClass('modal-active');
			});

			$(document).on('openModal', '.modal', function(e) {
				$('#modal-loading').removeClass('active');
				if(!$(this).hasClass('active')) {
					$('.modal.active').removeClass('active');
					$(this).addClass('active');
				}
				$('body').addClass('modal-active');
			});

			$(document).on('closeModal', '.modal', function(e) {
				$('#modal-loading').removeClass('active');
				var modal = $(this);
				modal.removeClass('active');
				$('body').removeClass('modal-active');
				// setTimeout(function() {
				// 	if(modal.hasClass('dynamically-injected')) modal.remove();
				// }, 500);
			});

			$(document).on('click', '.modal, .modal-close', function(e) {
				e.preventDefault();
				var modal = $(this).hasClass('modal') ? $(this) : $(this).closest('.modal');
				if(modal.length && !modal.hasClass('non-dismissable')) {
					modal.trigger('closeModal');
				}
			});

			$(document).on('click', '.modal-content', function(e) {
				e.stopPropagation();
			});

			$(document).on('click', 'a', function(e) {
				if($(this).attr('href') == undefined || $(this).attr('href').substring(0, 1) != '#' || $(this).attr('href') == '#') return;
				var modal = $($(this).attr('href') + '.modal').first();
				if(!modal.length && $(this).data('modal-html') !== undefined && $(this).data('modal-html') != '') {
					modal = $($(this).data('modal-html'));
					modal.addClass('dynamically-injected');
					$('body').append(modal);
				} else if(!modal.length && $(this).attr('href').match(/^#gated-content-modal-\d+$/)) {
					e.preventDefault();
					$(document).trigger('loadingModal');
					var args = {
						action: 'get_gated_content_modal',
						modal_id: $(this).attr('href').substring(1)
					};
					$.get(themeData.ajaxUrl, args, function(response) {
						if(response.trim() == '') {
							$('#modal-loading').removeClass('active');
							$('body').removeClass('modal-active');
							return;
						}
						var modal = $(response);
						modal.addClass('dynamically-injected');
						$('body').append(modal);
						setTimeout(function() { modal.trigger('openModal'); }, 0);
					}, 'html');
				}
				if(modal.length) {
					e.preventDefault();
					setTimeout(function() { modal.trigger('openModal'); }, 0);
				}
			});

			if(window.location.hash.match(/-modal$/)) {
				var modalLink = $('a').filter(function(i, el) { return $(el).attr('href') == window.location.hash; }).first();
				if(modalLink.length) {
					modalLink.trigger('click');
				}
			} else if(window.location.hash.match(/^#gated-content-modal-\d+$/)) {
				$(document).trigger('loadingModal');
				var args = {
					action: 'get_gated_content_modal',
					modal_id: window.location.hash.substring(1)
				};
				$.get(themeData.ajaxUrl, args, function(response) {
					if(response.trim() == '') {
						$('#modal-loading').removeClass('active');
						$('body').removeClass('modal-active');
						return;
					}
					var modal = $(response);
					modal.addClass('dynamically-injected');
					$('body').append(modal);
					setTimeout(function() { modal.trigger('openModal'); }, 0);
				}, 'html');
			}

		};

		wptheme.initForms = function() {

			if(typeof MktoForms2 !== 'undefined') {
				MktoForms2.onFormRender(function(form) {
					var formEl = form.getFormElem();

					$('.mktoFormCol', formEl).each(function(i, el) {
						if($('input, textarea, select', el).not('[type=hidden], [type=checkbox], [type=radio], [type=button]').length == 1) {
							$(el).addClass('singleInputFull');
						}
						if($('.mktoCheckboxList input', el).length == 1 && (!$('.mktoCheckboxList label', el).length || $('.mktoCheckboxList label', el).first().text().trim() == '')) {
							$(el).addClass('singleCheckbox');
						}
						if($('.mktoHtmlText', el).length) {
							$('.mktoHtmlText', el).closest('.mktoFormCol').addClass('htmlText');
							$('.mktoHtmlText div', el).filter(function(j, el2) { return $(el2).text().trim() == ''; }).remove();
						}
					});

					$('.mktoFormRow', formEl).each(function(i, el) {
						$(el).addClass('columnCount-' + $('> .mktoFormCol', el).length);
						if($('> .mktoFormCol', el).length && $('> .mktoFormCol', el).length == $('> .mktoFormCol.singleCheckbox', el).length) {
							$(el).addClass('singleCheckboxesRow');
						}
					});

					$('select:not(.select2-hidden-accessible)', formEl).each(function(i, el) {
						var options = {};
						if($('option', el).first().val().trim() == '') {
							options.placeholder = $('option', el).first().text();
							options.allowClear = true;
							$('option', el).first().remove();
							if(!$(el).is('[multiple]')) $(el).prepend('<option selected></option>');
						}
						if($(el).closest('.modal').length) {
							options.dropdownParent = $(el).closest('.modal-content');
						}
						$(el).select2(options).on('change.select2', function(e) {
							var form = MktoForms2.getForm($(this).closest('form').attr('id').replace(/^mktoForm_/, ''));
							if(form) {
								var vals = {};
								vals[$(this).attr('name')] = $(this).val();
								form.setValues(vals);
								console.log(form, vals);
							}
						});
					});

				});
			}

			$(document).on('click', 'form.mktoForm .mktoFormCol', function(e) {
				var colSelect2Input = $('.select2-hidden-accessible', this);
				if(colSelect2Input.length) {
					colSelect2Input.focus().select2('open');
				} else {
					var colInput = $('input, textarea', this).not('[type=hidden], [type=checkbox], [type=radio], [type=button]');
					if(colInput.length == 1) {
						colInput.select();
					} else if($('select', this).length == 1) {
						$('select', this).focus();
					}
				}
			});

		};

		wptheme.initAjaxPagination = function() {
			$(document).on('click', '.pagination.load-more a', function(e) {
				e.preventDefault();
				var pagination = $(this).closest('.pagination');
				if(pagination.hasClass('loading')) return;
				pagination.addClass('loading');
				if(history.replaceState != null) {
					history.replaceState('', document.title, $(this).attr('href'));
				}
				var args = {
					send_as_json: 1,
					context: pagination.data('context')
				};
				$.post($(this).attr('href'), args, function(response) {
					var pagination = $('.pagination.load-more.loading');
					if(response.success) {
						for(var i = 0; i < response.postsFormatted.length; i++) {
							pagination.before(response.postsFormatted[i]);
						}
						if(response.next && response.next != '') {
							$('a', pagination).attr('href', response.next);
						} else {
							pagination.remove();
						}
					}
					pagination.removeClass('loading');
				}, 'json');
			});

			var items = $(".cff-posts-wrap .cff-item");
			var numItems = items.length;
			var perPage = 3;

			items.slice(perPage).hide();

			$('#pagination-container').pagination({
					items: numItems,
					itemsOnPage: perPage,
					prevText: "Prev",
					nextText: "Next",
					onPageClick: function (pageNumber) {
							var showFrom = perPage * (pageNumber - 1);
							var showTo = showFrom + perPage;
							items.hide().slice(showFrom, showTo).show();
					}
			});

			$("#articles").click(function() {
				$('html, body').animate({ scrollTop:$(".section-header--article").offset().top - 134 }, 500);
		});
		};

		wptheme.initComments = function() {
			if($('body').hasClass('single-post')) {

				var toggleFloatCommentForm = function() {
					var commentsSection = $('section.page-section.post-comments.has-comments');
					commentsSection.removeClass('float-comment-form');
					var commentsContainer = $('.container > .inner', commentsSection);
					var sidebarContainer = $('section.page-section-sidebar-wrap .page-sidebar-sections-container > .inner');
					if(commentsContainer.length && sidebarContainer.length) {
						if($('body').width() >= 2300 || commentsContainer.offset().top >= sidebarContainer.offset().top + sidebarContainer.outerHeight()) {
							commentsSection.addClass('float-comment-form');
						}
					}
				};
				toggleFloatCommentForm();
				$(window).load(toggleFloatCommentForm);
				$(window).resize(toggleFloatCommentForm);

			}
		};

		wptheme.initSocialShareLinks = function() {
			
			$(document).on('click', '.social-share-links a', function(e) {
				var link = $(this);
				var li = link.parent();
				var ul = li.parent();
				if(ul.hasClass('current-url') && li.hasClass('print')) {
					e.preventDefault();
					window.print();
				} else if(li.is('.facebook, .twitter, .linkedin, .google-plus, .pinterest, .houzz')) {
					e.preventDefault();
					var winWidth = 600;
					var winHeight = 400;
					if(li.hasClass('google-plus')) { winWidth = 512; }
					if(li.hasClass('pinterest')) { winWidth = 750; }
					if(li.hasClass('houzz')) { winWidth = 800; winHeight = 460; }
					var winTop = (screen.height / 2) - (winHeight / 2) - (screen.height * 0.1);
					var winLeft = (screen.width / 2) - (winWidth / 2);
					window.open($(this).attr('href'), 'Share Link', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
				}
			});

			if($('body').hasClass('single-post') && $('section.page-section.post-content .social-sharing').length) {
				var repositionSocialSharingWidget = function() {
					if($('body').width() < 1400) return;
					var topMax = 180;
					var scrollTop = $(window).scrollTop();
					var widget = $('section.page-section.post-content .social-sharing');
					var container = widget.parent();
					var offset = Math.max(0, Math.min(scrollTop - container.offset().top + topMax, container.outerHeight() - widget.outerHeight()));
					widget.css({ top: offset + 80 });
				};
				repositionSocialSharingWidget();
				$(window).scroll(repositionSocialSharingWidget);
				$(window).resize(repositionSocialSharingWidget);
			}

		};

		wptheme.initExpandableReadMoreSections = function() {
			$(document).on('click', '.expandable-read-more-section > .toggle-wrap > .toggle', function(e) {
				e.preventDefault();
				var section = $(this).closest('.expandable-read-more-section');
				var contents = $('> .contents', section);
				if(!section.hasClass('expanded')) {
					contents.css({ height: 'auto' });
					var height = contents.outerHeight();
					contents.css({ height: 0 });
					section.addClass('expanded');
					setTimeout(function() { contents.css({ height: height }); }, 0);
					setTimeout(function() { contents.css({ height: 'auto' }); }, 400);
				} else {
					contents.css({ height: contents.outerHeight() });
					section.removeClass('expanded');
					setTimeout(function() { contents.css({ height: 0 }); }, 1);
				}
			});
		};

		wptheme.initTabbedContentSections = function() {

			$('section.page-section.tabbed-content-section .section-tabs .tab .tab-content-wrap').css({ height: 0 });
			$('section.page-section.tabbed-content-section .section-tabs .tab.expanded .tab-content-wrap').css({ height: 'auto' });

			$(document).on('click', 'section.page-section.tabbed-content-section .section-tabs .tab .tab-header', function(e) {
				var tab = $(this).closest('.tab');
				var tabContentWrap = $('.tab-content-wrap', tab);
				tab.toggleClass('expanded');
				if(tab.hasClass('expanded')) {
					tabContentWrap.css({ height: $('> .inner', tabContentWrap).outerHeight() });
					setTimeout(function() { tabContentWrap.css({ height: 'auto' }) }, 400);
				} else {
					tabContentWrap.css({ height: tabContentWrap.outerHeight() });
					setTimeout(function() { tabContentWrap.css({ height: 0 }) }, 0);
				}
			});

			$(document).on('click', 'section.page-section.tabbed-content-section .section-tabs-menu a', function(e) {
				e.preventDefault();
				var tab = $($(this).attr('href'));
				if(!tab.length || tab.hasClass('active')) return;
				var section = tab.closest('section.page-section');
				$('.section-tabs-menu .menu-item.active', section).removeClass('active');
				$('.section-tabs .tab.active', section).removeClass('active');
				$(this).parent().addClass('active');
				tab.addClass('active');
			});

		};

		wptheme.initSidebarAccordionContentSections = function() {

			$('section.page-sidebar-section.accordion-content-section .section-tabs .tab .tab-content-wrap').css({ height: 0 });
			$('section.page-sidebar-section.accordion-content-section .section-tabs .tab.expanded .tab-content-wrap').css({ height: 'auto' });

			$(document).on('click', 'section.page-sidebar-section.accordion-content-section .section-tabs .tab .tab-header', function(e) {
				var tab = $(this).closest('.tab');
				var tabContentWrap = $('.tab-content-wrap', tab);
				tab.toggleClass('expanded');
				if(tab.hasClass('expanded')) {
					tabContentWrap.css({ height: $('> .inner', tabContentWrap).outerHeight() });
					setTimeout(function() { tabContentWrap.css({ height: 'auto' }) }, 400);
				} else {
					tabContentWrap.css({ height: tabContentWrap.outerHeight() });
					setTimeout(function() { tabContentWrap.css({ height: 0 }) }, 0);
				}
			});

		};

		wptheme.initWidgets = function() {

			$('.widget.widget_resource_search').each(function(i, el) {
				var widget = $(el);

				$('select', widget).each(function(i, el) {
					var options = {};
					if($('option', el).first().val().trim() == '') {
						options.placeholder = $('option', el).first().text();
						options.allowClear = true;
						$('option', el).first().remove();
						if(!$(el).is('[multiple]')) $(el).prepend('<option selected></option>');
					}
					$(el).select2(options);
				});

				$('input[name=date]', widget).each(function(i, el) {
					var options = {
						dateFormat: 'mm/dd/yy'
					};
					$(el).datepicker(options);
				});

				widget.on('click', 'form .field', function(e) {
					if($(e.target).is('input')) return;
					var colSelect2Input = $('.select2-hidden-accessible', this);
					if(colSelect2Input.length) {
						colSelect2Input.focus().select2('open');
					} else {
						var colInput = $('input, textarea', this).not('[type=hidden], [type=checkbox], [type=radio], [type=button]');
						if(colInput.length == 1) {
							colInput.select();
						}
					}
				});

				widget.on('click', 'form .form-footer a.reset', function(e) {
					e.preventDefault();
					var form = $(this).closest('form');
					form.addClass('no-auto-submit');
					$('input[type=text], select', form).val('').trigger('change');
					form.removeClass('no-auto-submit');
					if($('body').hasClass('post-type-archive-resource') && $('body').width() >= 992) form.trigger('submit');
				});

				if($('body').hasClass('post-type-archive-resource')) {

					$('form', widget).on('submit', function(e) {
						e.preventDefault();
						var form = $(this);
						if(form.hasClass('no-auto-submit')) return false;

						var requestUrl = form.attr('action') + '?' + form.serialize();
						if(requestUrl == window.location.href) return;
						if(history.replaceState != null) {
							history.replaceState('', document.title, requestUrl);
						}

						var postIndexContainer = $('section.page-section.post-index .container > .inner');
						postIndexContainer.addClass('loading');
						if(!postIndexContainer.data('pending-request-count')) postIndexContainer.data('pending-request-count', 0);
						postIndexContainer.data('pending-request-count', postIndexContainer.data('pending-request-count') + 1);

						if($('body').width() < 992) wptheme.smoothScrollToElement(postIndexContainer, 1000, -30);

						var qv = {
							s: $('input[name=s]', form).val(),
							types: $('select[name=types\\[\\]]', form).val(),
							categories: $('select[name=categories\\[\\]]', form).val(),
							tags: $('select[name=tags\\[\\]]', form).val(),
							date: $('input[name=date]', form).val(),
							authors: $('select[name=authors\\[\\]]', form).val()
						};
						qv.types = qv.types ? qv.types : [];
						qv.categories = qv.categories ? qv.categories : [];
						qv.tags = qv.tags ? qv.tags : [];
						qv.authors = qv.authors ? qv.authors : [];
						var quickFiltersMenu = $('#page-header-menu.quick-filters.resource-types .menu');
						$('.menu-item.active', quickFiltersMenu).removeClass('active');
						if(qv.s == '' && qv.types.length <= 1 && !qv.categories.length && !qv.tags.length && qv.date == '' && !qv.authors.length) {
							if(!qv.types.length) {
								$('.menu-item.all', quickFiltersMenu).addClass('active');
							} else {
								$('.menu-item.' + qv.types[0], quickFiltersMenu).addClass('active');
							}
						}
						
						var args = {
							send_as_json: 1,
							context: 'archive-resource'
						};
						$.post(requestUrl, args, function(response) {

							var postIndexContainer = $('section.page-section.post-index .container > .inner');
							postIndexContainer.data('pending-request-count', Math.max(0, postIndexContainer.data('pending-request-count') - 1));
							postIndexContainer.html('');
							$('body').addClass('paged-0');

							if(response.success) {

								for(var i = 0; i < response.postsFormatted.length; i++) {
									postIndexContainer.append(response.postsFormatted[i]);
								}

								if(!response.postsFormatted.length) {
									var alertContainer = $('<div class="alert-container"></div>');
									var alert = $('<div class="alert warning no-results"></div>');
									alert.append('<h3>No Resources Found</h3>');
									alert.append('<p>Please try broadening your search criteria.</p>');
									alertContainer.append(alert);
									postIndexContainer.append(alertContainer);
								}

								if(response.next && response.next != '') {
									var pagination = $('<nav class="pagination load-more below"><a><span class="label">Load More</span> <span class="spinner"></span></a></nav>');
									pagination.data('context', 'archive-resource');
									$('a', pagination).attr('href', response.next);
									postIndexContainer.append(pagination);
								}

							}

							if(postIndexContainer.data('pending-request-count') == 0) postIndexContainer.removeClass('loading');

						}, 'json');
						return false;
					});

					$('select', widget).on('change', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});
					$('[name=s]', widget).on('blur', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});
					$('[name=date]', widget).on('change', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});

					$('#page-header-menu.quick-filters.resource-types').on('click', 'a', function(e) {
						e.preventDefault();
						var menuItem = $(this).closest('.menu-item');
						var menu = menuItem.closest('.menu');
						var form = $('.widget.widget_resource_search form');
						if(menuItem.hasClass('active')) return;

						var selectedType = $(this).data('type');
						form.addClass('no-auto-submit');
						$('input[type=text], select', form).val('').trigger('change');
						if($('select[name=types\\[\\]] option', form).filter(function(i, el) { return $(el).val() == selectedType; }).length) {
							$('select[name=types\\[\\]]', form).val(selectedType).trigger('change');
						}
						form.removeClass('no-auto-submit')
						form.trigger('submit');

					});

					var quickFiltersMenu = $('#page-header-menu.quick-filters.resource-types .menu');
					if(quickFiltersMenu.length) {
						var form = $('form', widget);
						var qv = {
							s: $('input[name=s]', form).val(),
							types: $('select[name=types\\[\\]]', form).val(),
							categories: $('select[name=categories\\[\\]]', form).val(),
							tags: $('select[name=tags\\[\\]]', form).val(),
							date: $('input[name=date]', form).val(),
							authors: $('select[name=authors\\[\\]]', form).val()
						};
						qv.types = qv.types ? qv.types : [];
						qv.categories = qv.categories ? qv.categories : [];
						qv.tags = qv.tags ? qv.tags : [];
						qv.authors = qv.authors ? qv.authors : [];
						$('.menu-item.active', quickFiltersMenu).removeClass('active');
						if(qv.s == '' && qv.types.length <= 1 && !qv.categories.length && !qv.tags.length && qv.date == '' && !qv.authors.length) {
							if(!qv.types.length) {
								$('.menu-item.all', quickFiltersMenu).addClass('active');
							} else {
								$('.menu-item.' + qv.types[0], quickFiltersMenu).addClass('active');
							}
						}
					}

				}

			});

			$('.widget.widget_blog_post_search').each(function(i, el) {
				var widget = $(el);

				$('select', widget).each(function(i, el) {
					var options = {};
					if($('option', el).first().val().trim() == '') {
						options.placeholder = $('option', el).first().text();
						options.allowClear = true;
						$('option', el).first().remove();
						if(!$(el).is('[multiple]')) $(el).prepend('<option selected></option>');
					}
					$(el).select2(options);
				});

				$('input[name=date]', widget).each(function(i, el) {
					var options = {
						dateFormat: 'mm/dd/yy'
					};
					$(el).datepicker(options);
				});

				widget.on('click', 'form .field', function(e) {
					if($(e.target).is('input')) return;
					var colSelect2Input = $('.select2-hidden-accessible', this);
					if(colSelect2Input.length) {
						colSelect2Input.focus().select2('open');
					} else {
						var colInput = $('input, textarea', this).not('[type=hidden], [type=checkbox], [type=radio], [type=button]');
						if(colInput.length == 1) {
							colInput.select();
						}
					}
				});

				widget.on('click', 'form .form-footer a.reset', function(e) {
					e.preventDefault();
					var form = $(this).closest('form');
					form.addClass('no-auto-submit');
					$('input[type=text], select', form).val('').trigger('change');
					form.removeClass('no-auto-submit');
					if($('body').hasClass('blog') && $('body').width() >= 992) form.trigger('submit');
				});

				if($('body').hasClass('blog')) {

					$('form', widget).on('submit', function(e) {
						e.preventDefault();
						var form = $(this);
						if(form.hasClass('no-auto-submit')) return false;

						var requestUrl = form.attr('action') + '?' + form.serialize();
						if(requestUrl == window.location.href) return;
						if(history.replaceState != null) {
							history.replaceState('', document.title, requestUrl);
						}

						var postIndexContainer = $('section.page-section.post-index .container > .inner');
						postIndexContainer.addClass('loading');
						if(!postIndexContainer.data('pending-request-count')) postIndexContainer.data('pending-request-count', 0);
						postIndexContainer.data('pending-request-count', postIndexContainer.data('pending-request-count') + 1);

						if($('body').width() < 992) wptheme.smoothScrollToElement(postIndexContainer, 1000, -30);

						var args = {
							send_as_json: 1,
							context: 'archive-post'
						};
						$.post(requestUrl, args, function(response) {

							var postIndexContainer = $('section.page-section.post-index .container > .inner');
							postIndexContainer.data('pending-request-count', Math.max(0, postIndexContainer.data('pending-request-count') - 1));
							postIndexContainer.html('');

							if(response.success) {

								for(var i = 0; i < response.postsFormatted.length; i++) {
									postIndexContainer.append(response.postsFormatted[i]);
								}

								if(!response.postsFormatted.length) {
									var alertContainer = $('<div class="alert-container"></div>');
									var alert = $('<div class="alert warning no-results"></div>');
									alert.append('<h3>No Posts Found</h3>');
									alert.append('<p>Please try broadening your search criteria.</p>');
									alertContainer.append(alert);
									postIndexContainer.append(alertContainer);
								}

								if(response.next && response.next != '') {
									var pagination = $('<nav class="pagination load-more below"><a><span class="label">Load More</span> <span class="spinner"></span></a></nav>');
									pagination.data('context', 'archive-post');
									$('a', pagination).attr('href', response.next);
									postIndexContainer.append(pagination);
								}

							}

							if(postIndexContainer.data('pending-request-count') == 0) postIndexContainer.removeClass('loading');

						}, 'json');
						return false;
					});

					$('select', widget).on('change', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});
					$('[name=s]', widget).on('blur', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});
					$('[name=date]', widget).on('change', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});

				}

			});

			$('.widget.widget_product_search').each(function(i, el) {
				var widget = $(el);

				$('select', widget).each(function(i, el) {
					var options = {};
					if($('option', el).first().val().trim() == '') {
						options.placeholder = $('option', el).first().text();
						options.allowClear = true;
						$('option', el).first().remove();
						if(!$(el).is('[multiple]')) $(el).prepend('<option selected></option>');
					}
					$(el).select2(options);
				});

				widget.on('click', 'form .field', function(e) {
					if($(e.target).is('input')) return;
					var colSelect2Input = $('.select2-hidden-accessible', this);
					if(colSelect2Input.length) {
						colSelect2Input.focus().select2('open');
					} else {
						var colInput = $('input, textarea', this).not('[type=hidden], [type=checkbox], [type=radio], [type=button]');
						if(colInput.length == 1) {
							colInput.select();
						}
					}
				});

				widget.on('click', 'form .form-footer a.reset', function(e) {
					e.preventDefault();
					var form = $(this).closest('form');
					form.addClass('no-auto-submit');
					$('input[type=text], select', form).val('').trigger('change');
					form.removeClass('no-auto-submit');
					if($('body').hasClass('post-type-archive-product') && $('body').width() >= 992) form.trigger('submit');
				});

				if($('body').hasClass('post-type-archive-product')) {

					$('form', widget).on('submit', function(e) {
						e.preventDefault();
						var form = $(this);
						if(form.hasClass('no-auto-submit')) return false;

						var requestUrl = form.attr('action') + '?' + form.serialize();
						if(requestUrl == window.location.href) return;
						if(history.replaceState != null) {
							history.replaceState('', document.title, requestUrl);
						}

						var postIndexContainer = $('section.page-section.post-index .container > .inner');
						postIndexContainer.addClass('loading');
						if(!postIndexContainer.data('pending-request-count')) postIndexContainer.data('pending-request-count', 0);
						postIndexContainer.data('pending-request-count', postIndexContainer.data('pending-request-count') + 1);

						if($('body').width() < 992) wptheme.smoothScrollToElement(postIndexContainer, 1000, -30);

						var qv = {
							s: $('input[name=s]', form).val(),
							categories: $('select[name=categories\\[\\]]', form).val(),
							tags: $('select[name=tags\\[\\]]', form).val(),
							industries: $('select[name=industries\\[\\]]', form).val(),
							volumes: $('select[name=volumes\\[\\]]', form).val()
						};
						qv.categories = qv.categories ? qv.categories : [];
						qv.tags = qv.tags ? qv.tags : [];
						qv.industries = qv.industries ? qv.industries : [];
						qv.volumes = qv.volumes ? qv.volumes : [];
						var quickFiltersMenu = $('#page-header-menu.quick-filters.product-categories .menu');
						$('.menu-item.active', quickFiltersMenu).removeClass('active');
						if(qv.s == '' && qv.categories.length <= 1 && !qv.tags.length && !qv.industries.length && !qv.volumes.length) {
							if(!qv.categories.length) {
								$('.menu-item.all', quickFiltersMenu).addClass('active');
							} else {
								$('.menu-item.product-category-' + qv.categories[0], quickFiltersMenu).addClass('active');
							}
						}

						var args = {
							send_as_json: 1,
							context: 'archive-product'
						};
						$.post(requestUrl, args, function(response) {

							var postIndexContainer = $('section.page-section.post-index .container > .inner');
							postIndexContainer.data('pending-request-count', Math.max(0, postIndexContainer.data('pending-request-count') - 1));
							postIndexContainer.html('');

							if(response.success) {

								for(var i = 0; i < response.postsFormatted.length; i++) {
									postIndexContainer.append(response.postsFormatted[i]);
								}

								if(!response.postsFormatted.length) {
									var alertContainer = $('<div class="alert-container"></div>');
									var alert = $('<div class="alert warning no-results"></div>');
									alert.append('<h3>No Products Found</h3>');
									alert.append('<p>Please try broadening your search criteria.</p>');
									alertContainer.append(alert);
									postIndexContainer.append(alertContainer);
								}

								if(response.next && response.next != '') {
									var pagination = $('<nav class="pagination load-more below"><a><span class="label">Load More</span> <span class="spinner"></span></a></nav>');
									pagination.data('context', 'archive-product');
									$('a', pagination).attr('href', response.next);
									postIndexContainer.append(pagination);
								}

							}

							if(postIndexContainer.data('pending-request-count') == 0) postIndexContainer.removeClass('loading');

						}, 'json');
						return false;
					});

					$('select', widget).on('change', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});
					$('[name=s]', widget).on('blur', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});

					$('#page-header-menu.quick-filters.product-categories').on('click', 'a', function(e) {
						e.preventDefault();
						var menuItem = $(this).closest('.menu-item');
						var menu = menuItem.closest('.menu');
						var form = $('.widget.widget_product_search form');
						if(menuItem.hasClass('active')) return;

						var selectedType = $(this).data('category');
						form.addClass('no-auto-submit');
						$('input[type=text], select', form).val('').trigger('change');
						if($('select[name=categories\\[\\]] option', form).filter(function(i, el) { return $(el).val() == selectedType; }).length) {
							$('select[name=categories\\[\\]]', form).val(selectedType).trigger('change');
						}
						form.removeClass('no-auto-submit')
						form.trigger('submit');

					});

					var quickFiltersMenu = $('#page-header-menu.quick-filters.product-categories .menu');
					if(quickFiltersMenu.length) {
						var form = $('form', widget);
						var qv = {
							s: $('input[name=s]', form).val(),
							categories: $('select[name=categories\\[\\]]', form).val(),
							tags: $('select[name=tags\\[\\]]', form).val(),
							industries: $('select[name=industries\\[\\]]', form).val(),
							volumes: $('select[name=volumes\\[\\]]', form).val()
						};
						qv.categories = qv.categories ? qv.categories : [];
						qv.tags = qv.tags ? qv.tags : [];
						qv.industries = qv.industries ? qv.industries : [];
						qv.volumes = qv.volumes ? qv.volumes : [];
						$('.menu-item.active', quickFiltersMenu).removeClass('active');
						if(qv.s == '' && qv.categories.length <= 1 && !qv.tags.length && !qv.industries.length && !qv.volumes.length) {
							if(!qv.categories.length) {
								$('.menu-item.all', quickFiltersMenu).addClass('active');
							} else {
								$('.menu-item.product-category-' + qv.categories[0], quickFiltersMenu).addClass('active');
							}
						}
					}

				}

			});

			$('.widget.widget_site_search').each(function(i, el) {
				var widget = $(el);

				$('select', widget).each(function(i, el) {
					var options = {};
					if($('option', el).first().val().trim() == '') {
						options.placeholder = $('option', el).first().text();
						options.allowClear = true;
						$('option', el).first().remove();
						if(!$(el).is('[multiple]')) $(el).prepend('<option selected></option>');
					}
					$(el).select2(options);
				});

				widget.on('click', 'form .field', function(e) {
					if($(e.target).is('input')) return;
					var colSelect2Input = $('.select2-hidden-accessible', this);
					if(colSelect2Input.length) {
						colSelect2Input.focus().select2('open');
					} else {
						var colInput = $('input, textarea', this).not('[type=hidden], [type=checkbox], [type=radio], [type=button]');
						if(colInput.length == 1) {
							colInput.select();
						}
					}
				});

				widget.on('click', 'form .form-footer a.reset', function(e) {
					e.preventDefault();
					var form = $(this).closest('form');
					form.addClass('no-auto-submit');
					$('input[type=text], select', form).val('').trigger('change');
					form.removeClass('no-auto-submit');
					if($('body').hasClass('search') && $('body').width() >= 992) form.trigger('submit');
				});

				if($('body').hasClass('search')) {

					$('form', widget).on('submit', function(e) {
						e.preventDefault();
						var form = $(this);
						if(form.hasClass('no-auto-submit')) return false;

						var requestUrl = form.attr('action') + '?' + form.serialize();
						if(requestUrl == window.location.href) return;
						if(history.replaceState != null) {
							history.replaceState('', document.title, requestUrl);
						}

						var postIndexContainer = $('section.page-section.post-index .container > .inner');
						postIndexContainer.addClass('loading');
						if(!postIndexContainer.data('pending-request-count')) postIndexContainer.data('pending-request-count', 0);
						postIndexContainer.data('pending-request-count', postIndexContainer.data('pending-request-count') + 1);

						if($('body').width() < 992) wptheme.smoothScrollToElement(postIndexContainer, 1000, -30);

						var args = {
							send_as_json: 1,
							context: 'index'
						};
						$.post(requestUrl, args, function(response) {

							var postIndexContainer = $('section.page-section.post-index .container > .inner');
							postIndexContainer.data('pending-request-count', Math.max(0, postIndexContainer.data('pending-request-count') - 1));
							postIndexContainer.html('');

							if(response.success) {

								for(var i = 0; i < response.postsFormatted.length; i++) {
									postIndexContainer.append(response.postsFormatted[i]);
								}

								if(!response.postsFormatted.length) {
									var alertContainer = $('<div class="alert-container"></div>');
									var alert = $('<div class="alert warning no-results"></div>');
									alert.append('<h3>No Results Found</h3>');
									alert.append('<p>Please try broadening your search criteria.</p>');
									alertContainer.append(alert);
									postIndexContainer.append(alertContainer);
								}

								if(response.next && response.next != '') {
									var pagination = $('<nav class="pagination load-more below"><a><span class="label">Load More</span> <span class="spinner"></span></a></nav>');
									pagination.data('context', 'index');
									$('a', pagination).attr('href', response.next);
									postIndexContainer.append(pagination);
								}

							}

							if(postIndexContainer.data('pending-request-count') == 0) postIndexContainer.removeClass('loading');

						}, 'json');
						return false;
					});

					$('select', widget).on('change', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});
					$('[name=s]', widget).on('blur', function(e) {
						if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					});

				}

			});

			$('.widget.widget_index_search').each(function(i, el) {
				var widget = $(el);

				widget.on('click', 'form .field', function(e) {
					if($(e.target).is('input')) return;
					var colSelect2Input = $('.select2-hidden-accessible', this);
					if(colSelect2Input.length) {
						colSelect2Input.focus().select2('open');
					} else {
						var colInput = $('input, textarea', this).not('[type=hidden], [type=checkbox], [type=radio], [type=button]');
						if(colInput.length == 1) {
							colInput.select();
						}
					}
				});

				widget.on('click', 'form .form-footer a.reset', function(e) {
					e.preventDefault();
					var form = $(this).closest('form');
					form.addClass('no-auto-submit');
					$('input[type=text], select', form).val('').trigger('change');
					form.removeClass('no-auto-submit');
					if($('body').hasClass('index-page') && $('body').width() >= 992) form.trigger('submit');
				});

				if($('body').hasClass('index-page')) {

					$('form', widget).on('submit', function(e) {
						e.preventDefault();
						var form = $(this);
						if(form.hasClass('no-auto-submit')) return false;

						var requestUrl = form.attr('action') + '?' + form.serialize();
						if(requestUrl == window.location.href) return;
						if(history.replaceState != null) {
							history.replaceState('', document.title, requestUrl);
						}

						var itemIndexContainer = $('section.page-section.item-index .container > .inner');
						if($('body').width() < 992) wptheme.smoothScrollToElement(itemIndexContainer, 1000, -30);

						// var keywords = $('[name=keywords]', form).val().trim().toLowerCase();
						var items = $('section.page-section.item-index .index-section ul.items li');
						var activeItems = items;
						// if(keywords != '') activeItems = items.filter(function(i, el) { return $(el).text().toLowerCase().indexOf(keywords) != -1; });
						var inactiveItems = items.not(activeItems);

						activeItems.removeClass('filtered-out');
						inactiveItems.addClass('filtered-out');

						return false;
					});

					// $('[name=keywords]', widget).on('keyup', function(e) {
					// 	if($('body').width() >= 992) $(this).closest('form').trigger('submit');
					// });

				}

			});

			$('.widget.widget_social_feed').each(function(i, el) {
				var widget = $(el);

				var userTimeline = $('.twitter-user-timeline', widget);
				if(userTimeline.length) {
					var args = userTimeline.data('args');
					var args = {
						action: 'get_social_feed_widget_twitter_user_timeline_entries',
						args: args,
						widget_id: widget.attr('id')
					};
					$.get(themeData.ajaxUrl, args, function(response) {
						var widget = $('#' + response.widgetId);
						if(response.success && widget.length) {
							var userTimeline = $('.twitter-user-timeline', widget);
							for(var i = 0; i < response.entriesFormatted.length; i++) {
								var entry = $(response.entriesFormatted[i]);
								userTimeline.append(entry);
							}
							$(window).trigger('resize');
						}
					}, 'json');
				}

			});

		};

		wptheme.initProjectArchive = function() {
			//mobile learn more
			$(document).on('click', '.project-view-more .btn', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(this).hide();
				$('article.project').slideDown('fast');

			})

			$(document).on('click', 'body.post-type-archive-project section.page-section.default-section.first .post-index-filters .form-toggle', function(e) {
				e.preventDefault();
				var container = $(this).closest('.post-index-filters');
				var formContainer = $('.form-container', container);
				if(!$(this).data('inactive-text')) {
					$(this).data('inactive-text', $(this).text());
				}
				container.toggleClass('active');
				if(container.hasClass('active')) {
					$(this).text($(this).data('active-text'));
					formContainer.stop(true).animate({ height: $('> .inner', formContainer).outerHeight() }, 500, 'easeOutExpo', function() { $(this).css({ height: 'auto' }); });
				} else {
					$(this).text($(this).data('inactive-text'));
					formContainer.stop(true).animate({ height: 0 }, 500, 'easeOutExpo');
				}

			});

			var len = $(".featured.project").length;
			var random = Math.floor( Math.random() * len );
			random = ((Math.random() * 10)+1) > 5 ? random: random;
			$(".featured.project").eq(random).removeClass("inactive");

			$('body.post-type-archive-project section.page-section.default-section.first .post-index-filters input').change(function(e){
				var listItems = $('.view.list .post-index > .article');	

				e.preventDefault();
				var form = $(this);
				var section = form.closest('section.page-section');

				var mapData = $('.google-map', section).data('map-data');
				var listItems = $('.view.list .post-index > .project', section);

				// var keywords = $('[name=p_keywords]', form).val();
				var selectedIndustry = $('[name=p_industry]:checked').val();
				var selectedRegion = $('[name=p_region]:checked').val();

				var activeIds = [];

				listItems.removeClass('inactive');
				listItems.each(function(i, el) {

					var postId = $(el).data('post-id');
					var termData = $(el).data('terms');
					// console.log(termData);
					var industryTermIds = termData.project_industry.map(function(n) { return n.id; });
					var regionTermIds = termData.project_region.map(function(n) { return n.id; });

					// Never show Former Properties unless specifically requested by filter -- Added by Connor B. Nov 6, 2018
					if (selectedIndustry != themeData.former_projects_industry && industryTermIds.includes(parseInt(themeData.former_projects_industry, 10))){
						$(el).addClass('inactive');
						return true; // Return non-false same as 'continue' in jQuery.each loop
					}
					// ---------------- //

					// if(keywords != '') {
					// 	if(!$(el).data('post-content').toLowerCase().match(keywords.toLowerCase())) $(el).addClass('inactive');
					// }
					if(selectedIndustry != '') {
						if(!termData.project_industry) $(el).addClass('inactive');
						if(industryTermIds.indexOf(parseInt(selectedIndustry)) === -1) $(el).addClass('inactive');
					}
					if(selectedRegion != '') {
						if(!termData.project_region) $(el).addClass('inactive');
						if(regionTermIds.indexOf(parseInt(selectedRegion)) === -1) $(el).addClass('inactive');
					}

					if(!$(el).hasClass('inactive')) {
						activeIds.push(postId);
					}
				});
				
				if ($(".featured.project:not(.inactive)").length > 1 ) {
					console.log('more than one');

					var len = $(".featured.project:not(.inactive)").length;
					var random = Math.floor( Math.random() * len );
					random = ((Math.random() * 10)+1) > 5 ? random: random;
					var featured = $(".featured.project:not(.inactive)").eq(random);
					$(".featured.project").addClass("inactive");
					featured.removeClass("inactive");
				}

				if (selectedIndustry == '' && selectedRegion == '') {
					$(".featured.project").addClass('inactive');
					$(".featured.project").eq(random).removeClass("inactive");
				}

				if ($(".featured.project:not(.inactive)").length == 0 ) {
					$(".post-index-filters-title.featured").hide();
				} else {
					$(".post-index-filters-title.featured").show();
				}

				var activeMapMarkers = [];
				mapData.bounds = new google.maps.LatLngBounds();
				for(var i = 0; i < mapData.markers.length; i++) {
					var active = activeIds.indexOf(mapData.markers[i].data.postId) !== -1;
					mapData.markers[i].data.active = active;
					if(active) mapData.bounds.extend(mapData.markers[i].position);
					if(active) activeMapMarkers.push(mapData.markers[i]);
				}
				mapData.markerCluster.clearMarkers();
				mapData.markerCluster.addMarkers(activeMapMarkers);

				if(activeMapMarkers.length) {
					mapData.map.fitBounds(mapData.bounds);
					google.maps.event.addListenerOnce(mapData.map, 'idle', function() {
						var mapData = $(this.getDiv()).data('map-data');
						if(mapData.map.getZoom() > mapData.settings.options.zoom) {
							mapData.map.setZoom(mapData.settings.options.zoom);
						}
					});
				}

				if(history.replaceState != null) {
					var queryVars = [];
					// if(keywords != '') queryVars.push('p_keywords=' + keywords);
					if(selectedIndustry != '') queryVars.push('p_industry=' + selectedIndustry);
					if(selectedRegion != '') queryVars.push('p_region=' + selectedRegion);
					var newUrl = window.location.href.replace(/\?.*/, '') + (queryVars.length ? '?' + queryVars.join('&') : '');
					history.replaceState('', document.title, newUrl);
				}

			});

			$(document).on('click', 'body.post-type-archive-project section.page-section.default-section.first .post-index-filters .reset', function(e) {
				e.preventDefault();
				var form = $(this).closest('form');
				// $('[name=p_keywords]', form).val('');
				$('[name=p_industry]', form).val('');
				$('[name=p_region]', form).val('');
				form.trigger('submit');
			});

			$(document).on('click', 'body.post-type-archive-project section.page-section.default-section.first .view-options button', function(e) {
				e.preventDefault();
				var buttons = $(this).closest('.view-options').find('button');
				buttons.removeClass('toggled');
				$(this).addClass('toggled');
				var mapView = $('section.page-section.default-section.first .view.map');
				var listView = $('section.page-section.default-section.first .view.list');
				if($(this).data('view') == 'list') {
					mapView.removeClass('active').addClass('inactive');
					listView.removeClass('inactive').addClass('active');
				} else {
					mapView.removeClass('inactive').addClass('active');
					listView.removeClass('active').addClass('inactive');
					var mapData = $('section.page-section.default-section.first .google-map').data('map-data');
					google.maps.event.trigger(mapData.map, 'resize');
				}
				wptheme.smoothScrollToElement($('section.page-section.default-section.first'));
			});

			// var listViewToggle = $('body.post-type-archive-project #page-header .page-header-content .view-options button.list');
			// if(listViewToggle.length && $('body').width() < 768) {
			// 	listViewToggle.trigger('click');
			// }

		};

		wptheme.initScrollingTriggers = function() {

			var scrollCallback = function() {
				window.requestAnimationFrame(function() {

					var scrollTop = $(window).scrollTop();
					var windowHeight = $(window).height();

					var selectors = [
						'.section-title'
					];

					$(selectors.join(',')).not('.animation-triggered').each(function(i, el) {
						var element = $(el);
						var elementOffset = element.offset().top;
						var elementHeight = element.outerHeight();
						if(scrollTop + (windowHeight * .8) >= elementOffset) {
							element.addClass('animation-triggered').trigger('triggerAnimation');
						}
					});

				});
			};

			var scrollIntervalId = setInterval(scrollCallback, 16);

		};

		wptheme.initIEFixes = function() {

			if ( !isIE() ) {
				return;
			}
			
			var adjustElementHeights = function() {

				var pageHeader = $('#page-header');
				if(pageHeader.length) {
					pageHeader.css({ height: 'auto' });
					pageHeader.css({ height: pageHeader.outerHeight() });
				}

				var elements = $('#header-navigation ul.menu > li > .sub-menu-container');
				if(elements.length) {
					elements.each(function(i, el) {
						var startHeight = $(el).outerHeight();
						$(el).css({ height: 'auto' });
						var endHeight = $(el).outerHeight();
						$(el).css({ height: startHeight });
						setTimeout(function() { $(el).css({ height: endHeight }); }, 1);
					});
				}

			};
			adjustElementHeights();
			$(window).load(adjustElementHeights);
			$(window).resize(adjustElementHeights);

		};

		wptheme.smoothScrollToElement = function(element, speed, offset) {
			speed = typeof speed !== 'undefined' ? speed : 1000;
			offset = typeof offset !== 'undefined' ? offset : 0;
			if(element.length > 0) {
				var margin = parseInt(element.css('margin-top'));
				wptheme.smoothScrollToPos(element.offset().top - (margin > 0 ? margin : 0), speed, offset);
			}
		};
		wptheme.smoothScrollToPos = function(y, speed, offset) {
			var newScrollTop = y + offset;
			var windowWidth = $('body').width();
			var currentScrollTop = $(window).scrollTop();
			var fixedHeaderOffset = $('#header').height();
			if(newScrollTop >= 100 && newScrollTop > currentScrollTop) { // mini header
				fixedHeaderOffset = 54;
				if(windowWidth >= 1200) fixedHeaderOffset = 84;
			} else if(newScrollTop <= currentScrollTop) { // full header
				fixedHeaderOffset = 54;
				if(windowWidth >= 768) fixedHeaderOffset = 70;
				if(windowWidth >= 992) fixedHeaderOffset = 86;
				if(windowWidth >= 1200) fixedHeaderOffset = 126;
				if(windowWidth >= 1350) fixedHeaderOffset = 130;
				// if($('body').hasClass('has-site-announcement')) {
				// 	fixedHeaderOffset += 40;
				// 	if(windowWidth >= 992) fixedHeaderOffset += 10;
				// }
			}
			if($('body').hasClass('admin-bar') && windowWidth < 783) fixedHeaderOffset += 46;
			else if($('body').hasClass('admin-bar')) fixedHeaderOffset += 32;
			$('html, body').stop(true).animate({ scrollTop: newScrollTop - fixedHeaderOffset }, speed, 'easeOutExpo');
		};

		return wptheme;
		
	})({});

})(jQuery);

function isIE() {
    const ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    const msie = ua.indexOf('MSIE '); // IE 10 or older
    const trident = ua.indexOf('Trident/'); //IE 11
    
    return (msie > 0 || trident > 0);
}
