/*
**	history for ajax/javascript history
**		0.5 simplified the codebase and using static HTML file instead of loading dynamic cache files
**		0.4 easier to configure cache control iframe POST handler
**		0.3 history events now setup in queue to ensure all entries reside in the history stack
**		0.2 no more FORM GET submission, straight location.href instead + hold time for iframe load
**		0.1 hidden frame + not bookmarkable + stores data for state change + allows reinstating data on forw/back hit
**	authored by Jim Palmer - released under MIT license
**  collage of ideas from Taku Sano, Mikage Sawatari, david bloom and Klaus Hartl
*/
(function($) {

	/*
	** pre-initialize the history functionality - once you include this plugin this will be instantiated as a singleton onLoad
	** IMPORTANT - replace the 'cache.php' with the appropriate cache handler URL string
	**             this is what the iframe submits its POSTS to and is required for this plugin to work
	*/
	$(document).ready( function () { $.history( 'cache.html' ); } );

	// core history plugin functionality - handles singleton instantiation and individual calls
	$.history = function ( store ) {

		// (initialize) create the hidden iframe if not on the root window.document.body
		if ( $(".__historyFrame").length == 0 ) {

			// set the history cursor to (-1) - this will be populated with current unix timestamp or 0 for the first screen
			$.history.cursor = $.history.intervalId = 0;
			// initialize the stack of history stored entries
			$.history.stack = {};
			// initialize the stack of loading hold flags
			$.history._loading = {};
			// initialize the queue for loading history fragments in sequence
			$.history._queue = [];

			// append to the root window.document.body without the src - uses class for toggleClass debugging - display:none doesn't work
			$("body").append('<iframe class="__historyFrame" src="' + store + '" />'); //style="border:0px; width:0px; height:0px; visibility:hidden;" />');
			// setup interval function to check for changes in "history" via iframe hash and call appropriate callback function to handle it
			$.history.intervalId = $.history.intervalId || window.setInterval(function () {
					// fetch current cursor from the iframe document.URL or document.location depending on browser support
					var cursor = $(".__historyFrame").contents().attr( $.browser.msie ? 'URL' : 'location' ).toString().split('#')[1];
					// display debugging information if block id exists
					$('#__historyDebug').html('"' + $.history.cursor + '" vs "' + cursor + '" - ' + (new Date()).toString());
					// if cursors are different (forw/back hit) then reinstate data only when iframe is done loading
					if ( parseFloat($.history.cursor) >= 0 && parseFloat($.history.cursor) != ( parseFloat(cursor) || 0 ) ) {
						// set the history cursor to the current cursor
						$.history.cursor = parseFloat(cursor) || 0;
						// reinstate the current cursor data through the callback
						if ( typeof($.history.callback) == 'function' )
							$.history.callback( $.history.stack[ cursor ], cursor );
					}
				}, 150);

		// store history entry
		} else { 

			// set the current unix timestamp for our history
			$.history.cursor = (new Date()).getTime().toString();
			// add this cursor fragment id into the queue to be loaded by the checking function interval
			$.history._queue.push( $.history.cursor );
			// insert copy into the stack with current cursor 
			$.history.stack[ $.history.cursor ] = $.extend( true, {}, store );
			// force the new hash we're about to write into the IE6/7 history stack
			if ( $.browser.msie )
				$('.__historyFrame')[0].contentWindow.document.open().close();
			// write the fragment id to the hash history - webkit required full href reset - ie/ff work with simple hash manipulation
			if ( $.browser.safari )
				$('.__historyFrame').contents()[0].location.href = 'cache.html?' + $.history.cursor + '#' + $.history.cursor;
			else
				$('.__historyFrame').contents()[0].location.hash = '#' + $.history.cursor;

		}
			
	}

})(jQuery);
