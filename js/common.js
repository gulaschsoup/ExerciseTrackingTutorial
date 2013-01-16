function forward() {
	window.location = "index.html#gps_map";
}

// IP-Adress of the server hosting mediaWiki
var serverIP = 'mcm-dev.studiumdigitale.uni-frankfurt.de/model/';

$(function() { 
	
	/////////////////// Alle Inhalte anzeigen Funktionalität ////////////////////////

	$('#basic_map').live('pagecreate', function() {
		controller.mapHandler.getCompleteContent();
	});

	$('#basic_map').live('pageshow', function() {

		demo.add('basic_map', function() { $('#map_canvas').gmap('refresh'); }).load('basic_map');

	});
	
	//////////////////// Inhalte an diesem Ort finden Funktionalität ////////////////////////////////////////

	$('#gps_map').live('pagecreate', function() {
		
		controller.mapHandler.getNearContent();
		setTimeout(function(){
				controller.mapHandler.rescale();
		},200);
		
	});

	$('#gps_map').live('pageshow', function() {

		demo.add('gps_map', function() { $('#map_canvas_2').gmap('refresh'); }).load('gps_map');

	});
	
	///////////////////// Neuen Inhalt erstellen Funktionalität ///////////////////////////////////////

	$('#new_map').live('pagecreate', function() {
		
		controller.mapHandler.createContent();
		
	});

	$('#new_map').live('pageshow', function() {

		demo.add('new_map', function() { $('#map_canvas_3').gmap('refresh'); }).load('new_map');
		
	});
});


function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// Loop through the FileList
			for (var i = 0, f; f = files[i]; i++) {

			  // Only process image files.
			  if (!f.type.match('image.*')) {
				continue;
			  }

			  var reader = new FileReader();

			  // Closure to capture the file information.
			  reader.onload = (function(theFile) {
				return function(e) {
				
				  //Upload binary string
				  var fileStr = e.target.result;
				  console.log('File: ' + fileStr);
				  
				  
				  	$.getJSON('http://'+serverIP+'api.php', {action:'query',format:'json',prop:'info',intoken:'edit',titles:'test.png'}, function(data)
					{
						
						if (!data.query.pages.hasOwnProperty("-1"))
						{
							alert("Ein Artikel mit diesem Titel ist bereits vorhanden.");
							return false;
						}
						var tokenV = data.query.pages[-1].edittoken;
						console.log('Token from server: ' + tokenV);
						tokenV = encodeURI(tokenV);
						console.log('My token: ' + tokenV);
						$.post('http://'+serverIP+'api.php', {action:'upload',filename:'test.png',file:fileStr, token:tokenV}, function(result)
						{
							console.log(result);
						
						});
						
						alert("Artikel erfolgreich angelegt");
						
						console.log(tokenV);
					});
				
				};
			  })(f);

			  // Read in the image file as binary string
			  reader.readAsBinaryString(f) 

			}
		  }
