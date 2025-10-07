/*
	Ethereal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	// Settings.
		var settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},

			// Scroll zones.
				scrollZones: {

					// If true, enables scrolling via scroll zones on the left/right edges of the scren.
						enabled: true,

					// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
						speed: 15

				},

			// Dragging.
				dragging: {

					// If true, enables scrolling by dragging the main wrapper with the mouse.
						enabled: true,

					// Sets the momentum factor. Must be a value between 0 and 1 (lower = less momentum, higher = more momentum, 0 = disable momentum scrolling).
						momentum: 0.875,

					// Sets the drag threshold (in pixels).
						threshold: 10

				},

			// If set to a valid selector , prevents key/mouse events from bubbling from these elements.
				excludeSelector: 'input:focus, select:focus, textarea:focus, audio, video, iframe',

			// Link scroll speed.
				linkScrollSpeed: 1000

		};

	// Vars.
		var	$window = $(window),
			$document = $(document),
			$body = $('body'),
			$html = $('html'),
			$bodyHtml = $('body,html'),
			$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			short:    '(min-aspect-ratio: 16/7)',
			xshort:   '(min-aspect-ratio: 16/6)'
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Mobile: Revert to native scrolling.
			if (browser.mobile) {

				// Disable all scroll-assist features.
					settings.keyboardShortcuts.enabled = false;
					settings.scrollWheel.enabled = false;
					settings.scrollZones.enabled = false;
					settings.dragging.enabled = false;

				// Re-enable overflow on body.
					$body.css('overflow-x', 'auto');

			}

		// IE: Various fixes.
			if (browser.name == 'ie') {

				// Enable IE mode.
					$body.addClass('is-ie');

				// Page widths.
					$window
						.on('load resize', function() {

							// Calculate wrapper width.
								var w = 0;

								$wrapper.children().each(function() {
									w += $(this).width();
								});

							// Apply to page.
								$html.css('width', w + 'px');

						});

			}

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
			(function() {

				$wrapper

					// Prevent keystrokes inside excluded elements from bubbling.
						.on('keypress keyup keydown', settings.excludeSelector, function(event) {

							// Stop propagation.
								event.stopPropagation();

						});

				$window

					// Keypress event.
						.on('keydown', function(event) {

							var scrolled = false;

							switch (event.keyCode) {

								// Left arrow.
									case 37:
										$document.scrollLeft($document.scrollLeft() - settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Right arrow.
									case 39:
										$document.scrollLeft($document.scrollLeft() + settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Page Up.
									case 33:
										$document.scrollLeft($document.scrollLeft() - $window.width() + 100);
										scrolled = true;
										break;

								// Page Down, Space.
									case 34:
									case 32:
										$document.scrollLeft($document.scrollLeft() + $window.width() - 100);
										scrolled = true;
										break;

								// Home.
									case 36:
										$document.scrollLeft(0);
										scrolled = true;
										break;

								// End.
									case 35:
										$document.scrollLeft($document.width());
										scrolled = true;
										break;

							}

							// Scrolled?
								if (scrolled) {

									// Prevent default.
										event.preventDefault();
										event.stopPropagation();

									// Stop link scroll.
										$bodyHtml.stop();

								}

						});

			})();

	// Scroll wheel.
		if (settings.scrollWheel.enabled)
			(function() {

				// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
				// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
					var normalizeWheel = function(event) {

						var	pixelStep = 10,
							lineHeight = 40,
							pageHeight = 800,
							sX = 0,
							sY = 0,
							pX = 0,
							pY = 0;

						// Legacy.
							if ('detail' in event)
								sY = event.detail;
							else if ('wheelDelta' in event)
								sY = event.wheelDelta / -120;
							else if ('wheelDeltaY' in event)
								sY = event.wheelDeltaY / -120;

							if ('wheelDeltaX' in event)
								sX = event.wheelDeltaX / -120;

						// Side scrolling on FF with DOMMouseScroll.
							if ('axis' in event
							&&	event.axis === event.HORIZONTAL_AXIS) {
								sX = sY;
								sY = 0;
							}

						// Calculate.
							pX = sX * pixelStep;
							pY = sY * pixelStep;

							if ('deltaY' in event)
								pY = event.deltaY;

							if ('deltaX' in event)
								pX = event.deltaX;

							if ((pX || pY)
							&&	event.deltaMode) {

								if (event.deltaMode == 1) {
									pX *= lineHeight;
									pY *= lineHeight;
								}
								else {
									pX *= pageHeight;
									pY *= pageHeight;
								}

							}

						// Fallback if spin cannot be determined.
							if (pX && !sX)
								sX = (pX < 1) ? -1 : 1;

							if (pY && !sY)
								sY = (pY < 1) ? -1 : 1;

						// Return.
							return {
								spinX: sX,
								spinY: sY,
								pixelX: pX,
								pixelY: pY
							};

					};

				// Wheel event.
					$body.on('wheel', function(event) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Stop link scroll.
							$bodyHtml.stop();

						// Calculate delta, direction.
							var	n = normalizeWheel(event.originalEvent),
								x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
								delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
								direction = x > 0 ? 1 : -1;

						// Scroll page.
							$document.scrollLeft($document.scrollLeft() + (delta * direction));

					});

			})();

	// Scroll zones.
		if (settings.scrollZones.enabled)
			(function() {

				var	$left = $('<div class="scrollZone left"></div>'),
					$right = $('<div class="scrollZone right"></div>'),
					$zones = $left.add($right),
					paused = false,
					intervalId = null,
					direction,
					activate = function(d) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Paused? Bail.
							if (paused)
								return;

						// Stop link scroll.
							$bodyHtml.stop();

						// Set direction.
							direction = d;

						// Initialize interval.
							clearInterval(intervalId);

							intervalId = setInterval(function() {
								$document.scrollLeft($document.scrollLeft() + (settings.scrollZones.speed * direction));
							}, 25);

					},
					deactivate = function() {

						// Unpause.
							paused = false;

						// Clear interval.
							clearInterval(intervalId);

					};

				$zones
					.appendTo($wrapper)
					.on('mouseleave mousedown', function(event) {
						deactivate();
					});

				$left
					.css('left', '0')
					.on('mouseenter', function(event) {
						activate(-1);
					});

				$right
					.css('right', '0')
					.on('mouseenter', function(event) {
						activate(1);
					});

				$wrapper
					.on('---pauseScrollZone', function(event) {

						// Pause.
							paused = true;

						// Unpause after delay.
							setTimeout(function() {
								paused = false;
							}, 500);

					});

			})();

	// Dragging.
		if (settings.dragging.enabled)
			(function() {

				var dragging = false,
					dragged = false,
					distance = 0,
					startScroll,
					momentumIntervalId, velocityIntervalId,
					startX, currentX, previousX,
					velocity, direction;

				$wrapper

					// Prevent image drag and drop.
						.on('mouseup mousemove mousedown', '.image, img', function(event) {
							event.preventDefault();
						})

					// Prevent mouse events inside excluded elements from bubbling.
						.on('mouseup mousemove mousedown', settings.excludeSelector, function(event) {

							// Prevent event from bubbling.
								event.stopPropagation();

							// End drag.
								dragging = false;
								$wrapper.removeClass('is-dragging');
								clearInterval(velocityIntervalId);
								clearInterval(momentumIntervalId);

							// Pause scroll zone.
								$wrapper.triggerHandler('---pauseScrollZone');

						})

					// Mousedown event.
						.on('mousedown', function(event) {

							// Disable on <=small.
								if (breakpoints.active('<=small'))
									return;

							// Clear momentum interval.
								clearInterval(momentumIntervalId);

							// Stop link scroll.
								$bodyHtml.stop();

							// Start drag.
								dragging = true;
								$wrapper.addClass('is-dragging');

							// Initialize and reset vars.
								startScroll = $document.scrollLeft();
								startX = event.clientX;
								previousX = startX;
								currentX = startX;
								distance = 0;
								direction = 0;

							// Initialize velocity interval.
								clearInterval(velocityIntervalId);

								velocityIntervalId = setInterval(function() {

									// Calculate velocity, direction.
										velocity = Math.abs(currentX - previousX);
										direction = (currentX > previousX ? -1 : 1);

									// Update previous X.
										previousX = currentX;

								}, 50);

						})

					// Mousemove event.
						.on('mousemove', function(event) {

							// Not dragging? Bail.
								if (!dragging)
									return;

							// Velocity.
								currentX = event.clientX;

							// Scroll page.
								$document.scrollLeft(startScroll + (startX - currentX));

							// Update distance.
								distance = Math.abs(startScroll - $document.scrollLeft());

							// Distance exceeds threshold? Disable pointer events on all descendents.
								if (!dragged
								&&	distance > settings.dragging.threshold) {

									$wrapper.addClass('is-dragged');

									dragged = true;

								}

						})

					// Mouseup/mouseleave event.
						.on('mouseup mouseleave', function(event) {

							var m;

							// Not dragging? Bail.
								if (!dragging)
									return;

							// Dragged? Re-enable pointer events on all descendents.
								if (dragged) {

									setTimeout(function() {
										$wrapper.removeClass('is-dragged');
									}, 100);

									dragged = false;

								}

							// Distance exceeds threshold? Prevent default.
								if (distance > settings.dragging.threshold)
									event.preventDefault();

							// End drag.
								dragging = false;
								$wrapper.removeClass('is-dragging');
								clearInterval(velocityIntervalId);
								clearInterval(momentumIntervalId);

							// Pause scroll zone.
								$wrapper.triggerHandler('---pauseScrollZone');

							// Initialize momentum interval.
								if (settings.dragging.momentum > 0) {

									m = velocity;

									momentumIntervalId = setInterval(function() {

										// Momentum is NaN? Bail.
											if (isNaN(m)) {

												clearInterval(momentumIntervalId);
												return;

											}

										// Scroll page.
											$document.scrollLeft($document.scrollLeft() + (m * direction));

										// Decrease momentum.
											m = m * settings.dragging.momentum;

										// Negligible momentum? Clear interval and end.
											if (Math.abs(m) < 1)
												clearInterval(momentumIntervalId);

									}, 15);

								}

						});

			})();

	// Link scroll.
		$wrapper
			.on('mousedown mouseup', 'a[href^="#"]', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.on('click', 'a[href^="#"]', function(event) {

				var	$this = $(this),
					href = $this.attr('href'),
					$target, x, y;

				// Get target.
					if (href == '#'
					||	($target = $(href)).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Calculate x, y.
					if (breakpoints.active('<=small')) {

						x = $target.offset().top - (Math.max(0, $window.height() - $target.outerHeight()) / 2);
						y = { scrollTop: x };

					}
					else {

						x = $target.offset().left - (Math.max(0, $window.width() - $target.outerWidth()) / 2);
						y = { scrollLeft: x };

					}

				// Scroll.
					$bodyHtml
						.stop()
						.animate(
							y,
							settings.linkScrollSpeed,
							'swing'
						);

			});

	// Gallery.
		$('.gallery')
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('img'),
					href = $a.attr('href');

				// Not an image? Bail.
					if (!href.match(/\.(jpg|gif|png|mp4)$/))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Set src.
					$modalImg.attr('src', href);

				// Set visible.
					$modal.addClass('visible');

				// Focus.
					$modal.focus();

				// Delay.
					setTimeout(function() {

						// Unlock.
							$modal[0]._locked = false;

					}, 600);

			})
			.on('click', '.modal', function(event) {

				var $modal = $(this),
					$modalImg = $modal.find('img');

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Already hidden? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Stop propagation.
					event.stopPropagation();

				// Lock.
					$modal[0]._locked = true;

				// Clear visible, loaded.
					$modal
						.removeClass('loaded')

				// Delay.
					setTimeout(function() {

						$modal
							.removeClass('visible')

						// Pause scroll zone.
							$wrapper.triggerHandler('---pauseScrollZone');

						setTimeout(function() {

							// Clear src.
								$modalImg.attr('src', '');

							// Unlock.
								$modal[0]._locked = false;

							// Focus.
								$body.focus();

						}, 475);

					}, 125);

			})
			.on('keypress', '.modal', function(event) {

				var $modal = $(this);

				// Escape? Hide modal.
					if (event.keyCode == 27)
						$modal.trigger('click');

			})
			.on('mouseup mousedown mousemove', '.modal', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
				.find('img')
					.on('load', function(event) {

						var $modalImg = $(this),
							$modal = $modalImg.parents('.modal');

						setTimeout(function() {

							// No longer visible? Bail.
								if (!$modal.hasClass('visible'))
									return;

							// Set loaded.
								$modal.addClass('loaded');

						}, 275);

					});


		// Countdown Code
		// var targetDate = new Date("June 8, 2025 00:00:00").getTime();

		// function updateCountdown() {
		// 	var now = new Date().getTime();
		// 	var distance = targetDate - now;

		// 	if (distance < 0) {
		// 		$("#countdown").html("Countdown Finished!");
		// 		clearInterval(countdownInterval);
		// 		return;
		// 	}

		// 	var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
		// 	var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		// 	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		// 	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// 	var html = '<div class="countdown-container">';
		// 	html += '<div class="count-box"><span class="value">' + days + '</span><span class="label">Days</span></div>';
		// 	html += '<div class="count-box"><span class="value">' + hours + '</span><span class="label">Hours</span></div>';
		// 	html += '<div class="count-box"><span class="value">' + minutes + '</span><span class="label">Minutes</span></div>';
		// 	html += '<div class="count-box"><span class="value">' + seconds + '</span><span class="label">Seconds</span></div>';
		// 	html += '</div>';

		// 	$("#countdown").html(html);
		// }

		// var countdownInterval = setInterval(updateCountdown, 1000);
		// updateCountdown();

		// Helper function: returns the timestamp for the next target date,
		// which is set to the 8th of the month at midnight.
		function getNextTargetDate() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth(); // 0-indexed (0 = January)
			var targetDay = 8;
			
			// If today is on or past the 8th, target the next month's 8th.
			if (now.getDate() >= targetDay) {
				month++;
				if (month > 11) {
					month = 0;
					year++;
				}
			}
			return new Date(year, month, targetDay, 0, 0, 0, 0).getTime();
		}

		// Initialize targetDate.
		var targetDate = getNextTargetDate();

		function updateCountdown() {
			var now = new Date().getTime();
			var distance = targetDate - now;

			// If the countdown has expired:
			if (distance < 0) {
				var today = new Date();
				// Check if today is the 8th of October (0-indexed month 9)
				if (today.getMonth() === 9 && today.getDate() === 8) {
					$("#countdown").html("<div class='special-message'>Happy Anniversary, my love!</div>");
					// Optionally, delay before resetting to the next target date:
					setTimeout(function() {
						targetDate = getNextTargetDate();
						updateCountdown();
					}, 10000); // 10-second delay
					return;
				} else {
					// Reset target date for the next month's 8th and return early.
					targetDate = getNextTargetDate();
					return;
				}
			}

			var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			var html  = '<div class="countdown-container">';
			html +=     '<div class="count-box"><span class="value">' + days + '</span><span class="label">Days</span></div>';
			html +=     '<div class="count-box"><span class="value">' + hours + '</span><span class="label">Hours</span></div>';
			html +=     '<div class="count-box"><span class="value">' + minutes + '</span><span class="label">Minutes</span></div>';
			html +=     '<div class="count-box"><span class="value">' + seconds + '</span><span class="label">Seconds</span></div>';
			html += '</div>';

			$("#countdown").html(html);
		}

		var countdownInterval = setInterval(updateCountdown, 1000);
		updateCountdown();

		var celebrationShown = false;

		function resolveConfettiHost() {
			var $access = $("#access-overlay");
			if ($access.length && $access.attr("aria-hidden") !== "true") {
				return $access;
			}

			var $game = $("#gift-game-overlay");
			if ($game.length && $game.attr("aria-hidden") !== "true") {
				return $game;
			}

			return $("body");
		}

		function launchConfetti() {
			var $host = resolveConfettiHost();

			var $container = $("#confetti-container");
			if (!$container.length) {
				$container = $('<div id="confetti-container"></div>');
				$host.append($container);
			} else if (!$container.parent().is($host)) {
				$container.appendTo($host);
			}

			var colors = ['#ff8ba7', '#ffc6ff', '#caffbf', '#ffd6a5', '#b9fbc0', '#b2e7ff'];
			var pieces = 150;

			for (var i = 0; i < pieces; i++) {
				var delay = Math.random() * 2.5;
				var fall = 3.2 + Math.random() * 2.8;
				var drift = (Math.random() - 0.5) * 60;
				var rotation = 360 + Math.random() * 720;
				var width = 8 + Math.random() * 6;
				var height = 18 + Math.random() * 8;

				var $piece = $('<span class="confetti-piece"></span>').css({
					left: (Math.random() * 100) + 'vw',
					backgroundColor: colors[i % colors.length],
					animationDelay: delay + 's',
					animationDuration: fall + 's',
					width: width + 'px',
					height: height + 'px',
					'--confetti-drift': drift + 'vw',
					'--confetti-rotation': rotation + 'deg'
				});

				$container.append($piece);
				(function(piece, lifespan) {
					setTimeout(function() {
						piece.remove();
					}, lifespan);
				})($piece, (delay + fall) * 1000 + 500);
			}

			// Light housekeeping so the container stays lean.
			setTimeout(function() {
				$container.children(':gt(300)').remove();
			}, 10000);
		}

		function showCelebration() {
			if (celebrationShown) return;
			celebrationShown = true;

			$("body").addClass("locked");
			$("#access-overlay").attr("aria-hidden", "false").show();

			$("#access-celebration")
				.stop(true, true)
				.css("opacity", 0)
				.animate({ opacity: 1 }, 400, function() {
					$("#renew-button").trigger("focus");
				});

			launchConfetti();
		}

		function showGiftGame() {
			var $overlay = $("#gift-game-overlay");
			$overlay.attr("aria-hidden", "false").addClass("visible");
			setTimeout(function() {
				$("#gift-guess-input").trigger("focus");
			}, 450);
		}

		function unlockSite() {
			var $overlay = $("#gift-game-overlay");
			$overlay.attr("aria-hidden", "true").removeClass("visible");
			setTimeout(function() {
				$("body").removeClass("locked");
			}, 400);
		}

		function closeOverlay() {
			var $overlay = $("#access-overlay");
			$overlay.attr("aria-hidden", "true").fadeOut(400, function() {
				$overlay.hide();
				showGiftGame();
			});
		}

		$("#access-celebration").attr("aria-hidden", "false");

		$("#renew-button").on("click", function() {
			var $button = $(this);
			if ($button.prop("disabled")) return;

			var renewalDate = new Date();
			renewalDate.setFullYear(renewalDate.getFullYear() + 5);

			var renewalText = renewalDate.toLocaleDateString(undefined, {
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			});

			$("#renew-message").text("Contract renewed until " + renewalText + ". There is no exit clause anymore, we locked in!");
			$button.prop("disabled", true).text("Renewed!");

			launchConfetti();
		});

		$("#enter-site-button").on("click", closeOverlay);

		// If someone double-clicks the overlay background because of excitement, do nothing.
		$("#access-overlay").on("click", function(event) {
			if (event.target === this && celebrationShown) {
				// Keep the celebration visible until they press the button.
				event.stopPropagation();
			}
		});

		// Trigger celebration once everything is ready.
		showCelebration();

		if (browser.mobile) {
			// Disable all scroll-assist features.
			settings.keyboardShortcuts.enabled = false;
			settings.scrollWheel.enabled = false;
			settings.scrollZones.enabled = false;
			settings.dragging.enabled = false;

			// Re-enable overflow on body.
			$body.css('overflow-x', 'auto');
		}

$.getJSON('assets/data/quiz.json', function(data) {
    var quizHtml = '';
    data.forEach(function(q, index) {
        quizHtml += '<div class="quiz-item">';
        quizHtml += '<p class="question">' + q.question + '</p>';
        if(q.choices && q.choices.length) {
            quizHtml += '<div class="answers">';
            q.choices.forEach(function(choice) {
                // Skip empty choices.
                if(choice === "") return;
                quizHtml += '<button type="button" class="answer-button" data-question-index="'+ index +'" data-answer="'+ choice.toUpperCase() +'">' + choice + '</button>';
            });
            quizHtml += '</div>';
        }
        else {
            // fallback to a text input if no choices provided
            quizHtml += '<input type="text" id="answer_' + index + '" placeholder="Your answer" />';
        }
        quizHtml += '</div>';
    });
    quizHtml += '<button id="submitQuiz" class="button primary">Submit Answers</button>';
    $('#quiz-container').html(quizHtml);
});

$(document).on('click', '.answer-button', function() {
    var $this = $(this),
        qIndex = $this.data('question-index');
    // Remove selected state from other buttons in the same question.
    $('.answer-button[data-question-index="'+ qIndex +'"]').removeClass('selected');
    // Add selected state.
    $this.addClass('selected');
});

// When the quiz is submitted, compare answers.
$(document).on('click', '#submitQuiz', function() {
    $.getJSON('assets/data/quiz.json', function(data) {
        var score = 0;
        data.forEach(function(q, index) {
            var userAns;
            if(q.choices && q.choices.length) {
                // Get value from the selected answer button.
                userAns = $('button.answer-button[data-question-index="'+ index +'"].selected').data('answer') || "";
            }
            else {
                userAns = $('#answer_' + index).val();
            }
            userAns = String(userAns).trim().toUpperCase();
            var correctAns = q.answer.trim().toUpperCase();
            if(userAns === correctAns) {
                score++;
            }
        });
        alert("You got " + score + " out of " + data.length + " correct!");
    });
});

$('#quiz-container').on('wheel', function(event) {
    // When scrolling inside #quiz-container, only allow vertical scrolling and stop propagation.
    event.stopPropagation();
});

var settings = {
    keyboardShortcuts: {
        enabled: true,
        distance: 50
    },
    scrollWheel: {
        enabled: true,
        factor: 1
    },
    scrollZones: {
        enabled: true,
        speed: 15
    },
    dragging: {
        enabled: true,
        momentum: 0.875,
        threshold: 10
    },
    excludeSelector: 'input:focus, select:focus, textarea:focus, audio, video, iframe',
    linkScrollSpeed: 2500  // quicker slide between panels
};

$(function() {
    // Set reference date: October 8, 2023 (month is 0-indexed so October is 9)
    var referenceDate = new Date(2023, 9, 8);
    var now = new Date();
    
    // Calculate total months difference
    var yearsDiff = now.getFullYear() - referenceDate.getFullYear();
    var monthsDiff = now.getMonth() - referenceDate.getMonth();
    var totalMonths = yearsDiff * 12 + monthsDiff;
    
    // Adjust if the current day is less than the reference day
    if (now.getDate() < referenceDate.getDate()) {
        totalMonths--;
    }
    
    // Prevent negative values (if before October 8, 2023)
    if (totalMonths < 0) {
        totalMonths = 0;
    }
    
	totalMonths += 1;

    // Update the h1 text within the intro section
    $('.intro h1.major').text('Countdown to ' + totalMonths + ' Months Together');
});

// Love Wheel Feature
$(function() {
  // Message database by category
  const messages = {
    lovethings: [
      "I love how your eyes light up when you stop feeling you're cramps.",
      "I love your sense of humor especially after you stop feeling you're cramps.",
      "I love your beautiful smile that melts my heart every time."
    ],
    trips: [
      "Thinking about that time the Vietnamese vendors called us poor.",
      "Sunset photos in Chongqing. We got mad at each other but it was worth it.",
      "Biking around Shanghai has to be one of my favorite memories with you.",
    ],
    future: [
      "Looking forward to traveling the world with you, one country at a time.",
      "All my plans for the future have you in the center of them."
    ],
    jokes: [
      "O M qiiii",
      "Spin this diiiiih",
    ],
    moments: [
      "You actually taught me how to celebrate birthdays, I now look forward to mine.",
      "First kiss on the field.",
	  "Hospital trip on the ambulance. That was fun lol.",
	],
    quirks: [
      "I adore how you bite your lips when you're concentrating.",
      "I love waking up before you, take photos of your sleeping positions, then wake you up."
    ]
  };
  
  // Heart burst animation function
  function burstHearts(count = 30) {
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'heart';
      h.style.left = (Math.random() * 100) + 'vw';
      h.style.bottom = '-20px';
      h.style.background = ['#ff7aa2', '#ffd1dc', '#ff9eb5', '#ffc3a0'][i % 4];
      h.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3000);
    }
  }
  
  // Spin wheel function - unlimited spinning allowed
  $('#spin-button').on('click', function() {
    
    const categories = Object.keys(messages);
    const slice = 360 / categories.length;
    const categoryIndex = Math.floor(Math.random() * categories.length);

    // Lots of spins + rotate so the chosen slice's CENTER aligns with the top pin.
    const centerAngle = (categoryIndex * slice) + (slice / 2);   // relative to from -90deg start
    const baseSpins   = 10 * 360;                                // 10 full turns
    const degrees     = baseSpins + (360 - centerAngle);         // align center to 0deg (top)

    // Rotate wheel
    $('#love-wheel').css({ 'transform': `rotate(${degrees}deg)` });
    
    // Show result after wheel stops
    setTimeout(function() {
      const category = categories[categoryIndex];
      const message = messages[category][Math.floor(Math.random() * messages[category].length)];
      
      // Display in modal
      $('#result-title').text(
        category === 'lovethings' ? "Things I Love About You" :
        category === 'trips' ? "Favorite Trip Memory" :
        category === 'future' ? "Our Future Together" :
        category === 'jokes' ? "Our Inside Jokes" :
        category === 'moments' ? "Special Moments" : "Your Cute Quirks"
      );
      $('#result-message').text(message);
      $('#wheel-result-modal').fadeIn(300);
      burstHearts(20); // Add hearts when showing result
      
      // No restriction - can spin again immediately!
    }, 4200);
  });
  
  // Close modal
  $('.close-modal').on('click', function() {
    $('#wheel-result-modal').fadeOut(300);
  });
  
  // Close modal when clicking outside
  $(window).on('click', function(e) {
    if ($(e.target).is('#wheel-result-modal')) {
      $('#wheel-result-modal').fadeOut(300);
    }
  });
});

// Gift Guessing Game
$(function() {
  const $card = $('#gift-guess-card');
  if (!$card.length) return;

  const gifts = [
    {
      name: "Horns of Gazels",
      aliases: ["horns of gazelle", "horns of gazels", "gazelle horns", "gazelle horn"],
      clue: "Sweet crescent moons dusted in sugar, straight from a Casablanca bakery window.",
      success: "🥐 Yes! Horns of Gazels.",
      reveal: "It was Horns of Gazels",
      nudge: "Think flaky, almond, and the kind of pastry that melts with tea."
    },
    {
      name: "Pink Buldak",
      aliases: ["buldak", "pink ramen", "pink buldak ramen"],
      clue: "A rosy, spicy comfort bowl.",
      success: "🍜 Correct — Pink Buldak",
      reveal: "Pink Buldak ramen.",
      nudge: "Picture our favorite ramen packet."
    },
    {
      name: "The Ordinary Retinol 1%",
      aliases: ["ordinary retinol", "retinol", "retinol 1", "the ordinary retinol"],
      clue: "That little glass bottle promising glowier tomorrows.",
      success: "✨ Nailed it — The Ordinary Retinol 1%",
      reveal: "The Ordinary Retinol 1%",
      nudge: "Skincare shelf. Amber bottle. Nighttime ritual."
    },
    {
      name: "Takis",
      aliases: ["taki", "takis"],
      clue: "Favorite American Chips",
      success: "Yup! Takis",
      reveal: "Takis!",
      nudge: "Come on, you know this one."
    },
    {
      name: "Moroccan Green Tea",
      aliases: ["green tea", "moroccan tea", "mint tea", "atay"],
      clue: "A copper teapot’s best friend, brewed with fresh mint and long pours.",
      success: "🍃 Exactly — Moroccan green tea.",
      reveal: "Moroccan green tea leaves.",
      nudge: "Smell the mint and sugar."
    },
    {
      name: "Cookies",
      aliases: ["cookie", "biscuits"],
      clue: "Bite-sized sugar rushes.",
      success: "🍪 Yes ma’am — Subway cookies to snack on.",
      reveal: "A stash of Subway cookies.",
      nudge: "Sweet circles ready to crumble between your fingers."
    },
    {
      name: "Myself",
      aliases: ["me", "yours truly", "your boy"],
      clue: "The carry-on item that misses you most.",
      success: "🤍 It’s me — the most excited passenger on that flight.",
      reveal: "I’m bringing myself, arms wide open.",
      nudge: "This surprise has a heartbeat."
    },
  ];

  const total = gifts.length;
  const progressState = new Array(total).fill("pending");
  let index = 0;
  let correctCount = 0;

  const $clue = $('#gift-clue');
  const $input = $('#gift-guess-input');
  const $guessBtn = $('#gift-guess-button');
  const $revealBtn = $('#gift-reveal-button');
  const $feedback = $('#gift-feedback');
  const $progress = $('#gift-progress');
  const $tracker = $('#gift-tracker');
  const $score = $('#gift-score');
  const $finishBtn = $('#gift-finish-button');

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function matchesAlias(gift, guess) {
    if (!guess) return false;
    const pool = [gift.name].concat(gift.aliases || []);
    return pool.some(function(entry) {
      const alias = normalize(entry);
      if (!alias) return false;
      if (alias === guess) return true;
      if (alias.length > 4 && guess.indexOf(alias) >= 0) return true;
      if (guess.length > 4 && alias.indexOf(guess) >= 0) return true;
      return false;
    });
  }

  function setMode(mode) {
    $guessBtn.data('mode', mode);
    if (mode === 'guess') {
      $guessBtn.text('Lock it in');
    } else {
      $guessBtn.text(index + 1 >= total ? 'See the finale' : 'Next surprise');
    }
  }

  function updateTracker() {
    const dots = [];
    for (let i = 0; i < total; i++) {
      const classes = ['tracker-dot'];
      if (progressState[i] === 'guessed') classes.push('guessed');
      if (progressState[i] === 'revealed') classes.push('revealed');
      if (i === index && index < total) classes.push('current');
      dots.push('<span class="' + classes.join(' ') + '"></span>');
    }
    $tracker.html(dots.join(''));
  }

  function updateScore() {
    $score.text('Correct guesses: ' + correctCount + ' / ' + total);
  }

  function renderRound() {
    const gift = gifts[index];
    $clue.text(gift.clue);
    $input.val('').prop('disabled', false);
    $input.show();
    $guessBtn.show().prop('disabled', false);
    $revealBtn.show().prop('disabled', false);
    $feedback.text('');
    $revealBtn.prop('disabled', false).text('Reveal secret');
    setMode('guess');
    $progress.text('Surprise ' + (index + 1) + ' of ' + total);
    updateTracker();
    updateScore();
    $finishBtn.removeClass('visible');
    setTimeout(function() {
      $input.trigger('focus');
    }, 120);
  }

  function finishGame() {
    $card.addClass('finished');
    $clue.text('Suitcase inspection complete.');
    $input.prop('disabled', true).hide();
    $guessBtn.hide();
    $revealBtn.hide();
    $feedback.text('Every surprise is tagged, packed, and waiting for you.');
    $progress.text('All surprises revealed.');
    updateTracker();
    updateScore();
    launchConfetti();
    $finishBtn.addClass('visible').trigger('focus');
  }

  function goNext() {
    index += 1;
    if (index >= total) {
      finishGame();
      return;
    }
    renderRound();
  }

  function handleWin(gift) {
    progressState[index] = 'guessed';
    correctCount += 1;
    $feedback.text(gift.success);
    $input.prop('disabled', true);
    $revealBtn.prop('disabled', true);
    setMode('next');
    updateTracker();
    updateScore();
    launchConfetti();
  }

  function handleReveal(gift) {
    if (progressState[index] !== 'guessed') {
      progressState[index] = 'revealed';
    }
    $feedback.text(gift.reveal);
    $input.prop('disabled', true);
    $revealBtn.prop('disabled', true);
    setMode('next');
    updateTracker();
    updateScore();
  }

  $guessBtn.on('click', function() {
    if ($guessBtn.data('mode') === 'next') {
      goNext();
      return;
    }

    const guess = normalize($input.val());
    const gift = gifts[index];

    if (!guess) {
      $feedback.text('Whisper a guess first, sweet face.');
      $input.trigger('focus');
      return;
    }

    if (matchesAlias(gift, guess)) {
      handleWin(gift);
    } else {
      $feedback.text(gift.nudge);
    }
  });

  $input.on('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      $guessBtn.trigger('click');
    }
  });

  $revealBtn.on('click', function() {
    if ($guessBtn.data('mode') === 'next') {
      goNext();
      return;
    }

    const gift = gifts[index];
    handleReveal(gift);
  });

  $finishBtn.on('click', function() {
    unlockSite();
  });

  renderRound();
});

})(jQuery);
