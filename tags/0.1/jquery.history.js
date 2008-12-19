/*
** history for ajax/javascript history
**	0.1 hidden frame + not bookmarkable + stores data for state change + allows reinstating data on forw/back hit
** authored by Jim Palmer - released under MIT license
** collage of ideas from Taku Sano, Mikage Sawatari, david bloom and Klaus Hartl
*/
(function($) {

	$.history = function ( store ) {

		// (initialize) create the hidden iframe if not on the root window.document.body
		if ( $(".__historyFrame").length == 0 ) {

			// set the history cursor to (-1) - this will be populated with current unix timestamp or 0 for the first screen
			$.history.cursor = -1;
			// use last saved-session handler here - document is required (no about:blank, javascript:void, etc.)
			$.history.frameSource = 'blank.html';
			// initialize the stack of history stored entries
			$.history.stack = {};

			// append to the root window.document.body without the src - uses class for toggleClass debugging - display:none doesn't work
			$("body").append('<iframe class="__historyFrame" style="border:0px; width:0px; height:0px; visibility:hidden;" />');

			// set the src (safari doesnt load the src if set in the append above) + set the onLoad event for the iframe
			$('.__historyFrame').attr('src', $.history.frameSource).load(function () {
					// create the form used for housing the "fragment identifier" - do not use POST unless really POSTing with the PRG pattern
					$(this).contents().find('body').append('<form id="__historyForm" action="" method="GET" onSubmit="return false;"/>');
					// setup interval function to check for changes in "history" via iframe hash and call appropriate callback function to handle it
					if ( typeof(this._manageHistoryIntervalID) != 'undefined' ) window.clearInterval(this._manageHistoryIntervalID);
					this._manageHistoryIntervalID = window.setInterval(function () {
							// fetch current cursor from the iframe document.URL or document.location depending on browser support
							var cursor = $(".__historyFrame").contents().attr( $.browser.msie ? 'URL' : 'location' ).toString().split('#')[1];
							// display debugging information if block id exists
							$('#__historyDebug').html('"' + $.history.cursor + '" vs "' + cursor + '" - ' + (new Date()).toString());
							// if cursors are different (forw/back hit) then reinstate data
							if ( parseFloat($.history.cursor) >= 0 && parseFloat($.history.cursor) != ( parseFloat(cursor) || 0 ) ) {
								// set the history cursor to the current cursor
								$.history.cursor = parseFloat(cursor) || 0;
								// reinstate the current cursor data through the callback
								$.history.callback( $.history.stack[ cursor ], cursor );
							}
						}, 100);
				});

		} else {	// handle new history entries apre-initialization
		
			// set the current unix timestamp for our history
			$.history.cursor = (new Date()).getTime();
			// move the history cursor in the hidden iframe to the newest fragment identifier keyed off the current unix timestamp
			$(".__historyFrame").contents().find('#__historyForm').attr('action', '#' + $.history.cursor).submit();
			// insert into the stack with current cursor
			$.history.stack[ $.history.cursor ] = store;
			
		}
			
	}

	// default callback function for handling changes in state
	$.history.callback = function ( reinstate, cursor ) { alert( 'reinstating ' + cursor + ': ' + typeof(reinstate) ); };
	
	// pre-initialize the history functionality - if you include this plugin this will be loaded as a singleton at time of the root window.onLoad
	$(document).ready( function () { $.history(); } );

})(jQuery);
