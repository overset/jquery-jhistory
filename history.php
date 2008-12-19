<?

/*
// last-modified logic HTTP/1.0 style 304
if ( isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && ((strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'], time()) - time())/60) > 0 ) {
	header('Not Modified', true, 304);
	header('Last-Modified: '. $_SERVER['HTTP_IF_MODIFIED_SINCE']);
	exit(0);
} else {
	header('Last-Modified: '. gmdate("D, d M Y H:i:s", time() + 1200) .' GMT');
}
*/

// ETag logic HTTP/1.1 style
if ( isset($_SERVER['HTTP_IF_NONE_MATCH']) && (($_SERVER['HTTP_IF_NONE_MATCH'] - time())/60) < 1200 ) {
	header('Not Modified', true, 304);
	header('ETag: '. $_SERVER['HTTP_IF_NONE_MATCH']);
	exit(0);
} else {
	header('ETag: '. time());
}

print '<pre>'; print_r($_SERVER); print '</pre>';

/*
	header("Expires: -1");
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
*/
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<script language="JavaScript" type="text/javascript" src="jquery.js"></script>
	<script language="JavaScript" type="text/javascript" src="jquery.history.js"></script>
	<script>
		// set our global counter
		var counter = 0;

		// function to raise the counter and then store the change in the history
		function raiseCounter() {
			counter++;
			// store the counter inside an object such as {counter:0} along with extra to test speed
			$.history( {'counter':counter, 'counter1':counter, 'counter2':counter, 'counter3':counter, 'counter4':counter} );
			$('#counter').html('{\'counter\':' + counter.toString() + '}');
		}

		// function to handle the data coming back from the history upon forw/back hit
		$.history.callback = function ( reinstate, cursor ) {
				// check to see if were back to the beginning without any stored data
				if (typeof(reinstate) == 'undefined')
					counter = 0;
				else
					counter = parseInt(reinstate.counter) || 0;
				$('#counter').html('{\'counter\':' + counter.toString() + '}');
			};

		// initialize the display of the counter value on window.onLoad
		$('document').ready(function () {
				$('#counter').html('{\'counter\':' + counter.toString() + '}');
			});
	</script>
</head>
<body>
	<table width="100%">
		<tr>
			<tr>
				<td align=left valign=middle style="padding:10px; background:#EEE;">
					<input type=button value="raiseCounter()" onclick="raiseCounter()">
				</td>
				<td align=left id="counter" valign=middle style="font-family:tahoma; font-size:14pt; padding:10px; background:#EEE;"></td>
				<td align=left id="__historyDebug" valign=middle width="100%" style="font-family:tahoma; font-size:9pt; padding:10px; background:#EEE;"></td>
			<tr>
		</tr>
	</table>
</body>
</html>
