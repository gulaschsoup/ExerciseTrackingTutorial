function controller(){
	this.mapHandler = new mapHandler();
	this.contentHandler = new contentHandler();
	this.navigationHandler = new navigationHandler();
	this.modelHandler = new modelHandler();
	
	this.initialize = function(){
		this.mapHandler.startLocate();		
	}
	
	this.getDebuggingMode = function(){
		return true;
	}
}
controller = new controller();

function modelHandler(){

	var loggedIn = false;
	var bname = "";
	var pw = "";
	var token = "";
	var mwPrefix = "";
	var mwSession = "";
	var mwlguserid = "";
	
	this.isLogedIn = function(){
		return loggedIn;
	}
	
	this.getBname = function(){
		return bname;
	}
	
	this.logIn = function(){
		$.ajax({
			type: 'POST',
			url: '../../controller/controller.php',
			dataType: 'json',
			async : false,
			data: {
				command: 'loginMW',
				username: document.loginMask.username.value, 
				password: document.loginMask.passwort.value
			},
			success : function(data){
				if(data.login =="yes"){
					loggedIn = true;
					bname = document.loginMask.username.value;
					pw = document.loginMask.passwort.value;
					token = data.token[0];
					mwPrefix = data.mwPrefix[0];
					mwSession = data.mwSession[0];
					mwlguserid = data.mwlguserid[0]; 

					controller.navigationHandler.checkMyMCM();
				}else{
					alert("Anmeldung fehlgeschlagen!");
					console.log(data.resulte);
				}
				
				setTimeout('$("#myMCM").popup("open");',100);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("anmeldung nicht gesendet");
			}
		});
	}
	
	this.logOut = function(){
		$.ajax({
			type: 'POST',
			url: '../../controller/controller.php',
			dataType: 'json',
			async : true,
			data: {
				command: 'logoutMW',
				prefix: mwPrefix
			},
			success : function(data){
				console.log("Logged out!");
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("nicht ausgeloggt");
			}
		});
		
		loggedIn = false;
		bname = "";
		pw = "";
		token = "";
		mwPrefix = "";
		mwSession = "";
		mwlguserid = "";
	}
	
	this.createPage = function(){
		
		$('#new_map_titleInput').val($('#new_map_titleInput').val().replace("&","und"));
		$('#new_map_textInput').val($('#new_map_textInput').val().replace("&","und"));
		
		var valid = true;
		var failure = "";
		
		if($('#new_map_titleInput').val() == null ||
		   $('#new_map_titleInput').val() == ""){
			failure += "Bitte einen Titel eingeben!\n";
			valid = false;
		}
		if($('#new_map_textInput').val() == null ||
		   $('#new_map_textInput').val() == ""){
			failure += "Bitte eine Beschreibung eingeben!\n";
			valid = false;
		}
		if($('#new_map_latInput').val() == null ||
		   $('#new_map_latInput').val() == ""){
			failure += "Bitte die Position auf der Karte auswählen!\n";
			valid = false;
		}
		if($('#new_map_distanceInput').val() == null ||
		   $('#new_map_distanceInput').val() == "" ||
		   isNaN($('#new_map_distanceInput').val()) == true){
			failure += "Bitte eine Zahl als Distanz eingeben!\n";
			valid = false;
		}
		
		if(valid){
			$.ajax({
				type: 'POST',
				url: '../../controller/controller.php',
				dataType: 'json',
				async : false,
				data: {
					command: 'createPage',
					session: mwSession,
					username: bname,
					mwlguserid: mwlguserid,
					title: $('#new_map_titleInput').val(),
					description: $('#new_map_textInput').val(),
					lat: $('#new_map_latInput').val(),
					lon: $('#new_map_lonInput').val(),
					distance: $('#new_map_distanceInput').val()
				},
				success : function(data){
					if(data.create =="yes"){
						alert("Artikel angelegt");
						console.log("Artikel angelegt");
						controller.mapHandler.refreshPins();
						$('#new_map_titleInput').val("");
						$('#new_map_textInput').val("");
						$('#new_map_latInput').val("");
						$('#new_map_lonInput').val("");
						$('#new_map_distanceInput').val("");
						controller.mapHandler.removeCreateContentMarker();
						window.location = "index.html#gps_map";
					}else{
						alert("Fehlgeschlagen");
						console.log(data.result[0]);
					}
					
					setTimeout('$("#myMCM").popup("open");',100);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("anmeldung nicht gesendet");
				}
			});
		}else{
			alert(failure);
		}
	}
}

function navigationHandler(){
	
	this.checkMyMCM = function(){
		$('#myMCM_content').html("");
		if(controller.modelHandler.isLogedIn()){
			$('#myMCM_content').append("<p>Hallo "+ controller.modelHandler.getBname() + "!</p>");
			$('#myMCM_content').append("<div data-role=\"fieldcontain\" id=\"myMCM_loginFieldContainer1\"></div>");
			$('#myMCM_loginFieldContainer1').append("<label for=\"flip\">Edit Modus</label>")
			$('#myMCM_loginFieldContainer1').append("<select name=\"flip\" disabled=\"disabled\" id=\"myMCM_flip\" data-role=\"slider\" data-theme=\"b\" data-track-theme=\"a\" data-mini=\"true\"></select>");
			$('#myMCM_flip').append("<option value=\"no\">Aus</option>");
			$('#myMCM_flip').append("<option value=\"yes\">An</option>");
			$('#myMCM_content').append("<a href=\"#new_map\" data-rel=\"external\" data-role=\"button\" data-transition=\"slide\" data-theme=\"b\" data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\">Erzeuge Pin</a>");
			$('#myMCM_content').append("<a href=\"#gps_map\" onclick=\"controller.modelHandler.logOut()\" data-rel=\"back\" data-role=\"button\" data-theme=\"b\" data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\">Logout</a>");
        
			$("#myMCM_content").trigger("create");
		}else{
			$('#myMCM_content').append("<form name=\"loginMask\" id=\"myMCM_content_form\" class=\"ui-hide-label\"></form>");
			$('#myMCM_content_form').append("<p>Bitte loggen Sie sich ein:</p>");
			$('#myMCM_content_form').append("<div data-role=\"fieldcontain\" id=\"myMCM_loginFieldContainer1\"></div>");
			$('#myMCM_content_form').append("<div data-role=\"fieldcontain\" id=\"myMCM_loginFieldContainer2\"></div>");
			$('#myMCM_content_form').append("<div data-role=\"fieldcontain\" id=\"myMCM_loginFieldContainer3\"></div>");
			$('#myMCM_loginFieldContainer1').append("<label for=\"username\">Benutzername:</label>");
			$('#myMCM_loginFieldContainer1').append("<input type=\"text\" name=\"username\" placeholder=\"Username\"/>");
			$('#myMCM_loginFieldContainer2').append("<label for=\"passwort\">Passwort:</label>");
			$('#myMCM_loginFieldContainer2').append("<input type=\"password\" name=\"passwort\" placeholder=\"Password\"/>");
			$('#myMCM_loginFieldContainer3').append("<a href=\"#gps_map\" onclick=\"controller.modelHandler.logIn()\" data-rel=\"back\" data-role=\"button\" data-theme=\"b\" data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\">Login</a>");
			
			$("#myMCM_content").trigger("create");
		}
	}
}

function mapHandler(){
	var locat = null;
	var positionFound = false;
	var trackPosition = true;
	/* Set an initial position in case we can't locate */
	var mobileDemo = { 'center': '57.7973333,12.0502107', 'zoom': 2 };
	
	var createContentMarker;
	var watchId;
	var map;
	var posMarker;
	var posDeltaCircle;
	var iconImage = new google.maps.MarkerImage(
		'./images/position_top_layer_small.png',		/* Picture address */
		new google.maps.Size(11, 11),					/* Picture size */
		new google.maps.Point(0,0),						/* Picture origin */
		new google.maps.Point(5, 5)						/* Picture anchor */
	);
	
	var pins = new Array();
	var infowindow = new google.maps.InfoWindow();
	var iteratatorInfoWindow;
	
	/* Try to repeatedly locate the position */
	this.startLocate = function(){
		console.log("Searching location...");
		watchId = navigator.geolocation.watchPosition(setCoordinates, errorLocate, {enableHighAccuracy:true, maximumAge:120000, timeout:120000});
	}
	
	/* When position is locatable */
	function setCoordinates(position){
		
		locat = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		console.log(locat);
		browserSupportFlag = true;
		
		if(positionFound){
			posMarker.setMap(null);
		}else if(map != null){ /* First time position is found */
			map.setCenter(locat);
			map.setZoom(15);
			positionFound = true;
		}
			
		posMarker = new google.maps.Marker({
			position: locat,
			icon: iconImage,
			title:"Your position"}
		);		
		posMarker.setMap(map);
		
		if(trackPosition && map != null){
			controller.mapHandler.setMapCenterToCurrentPosition();
			$('#trackerLink').addClass("ui-btn-active");
		}
	}
	
	/* When position was not found */
	function errorLocate(error){
		if(error.code == 0){
			console.log("... Unknown error");
			navigator.geolocation.clearWatch(watchId);
			controller.mapHandler.startLocate();
		}
		if(error.code == 1){
			console.log("... Permission denied");
			navigator.geolocation.clearWatch(watchId);
		}
		if(error.code == 2){
			console.log("... Position unavailable");
			navigator.geolocation.clearWatch(watchId);
			controller.mapHandler.startLocate();
		}
		if(error.code == 3){
			console.log("... Timout");
			navigator.geolocation.clearWatch(watchId);
			controller.mapHandler.startLocate();
		}
	}
		
	/* Centers the map to a specific position */
	this.setMapCenter = function(ownLat, ownLan){
		var ownPos = new google.maps.LatLng(ownLat,ownLan);
		map.setCenter(ownPos);
		map.setZoom(15);
	}
	
	/* Centers the map to the local Position */
	this.setMapCenterToCurrentPosition = function(){
		map.setCenter(locat);
		map.setZoom(15);
	}
	
	/* "Inhalte an diesem Ort finden" */
	this.getNearContent = function(){
		
		demo.add('gps_map', function() {

			$('#map_canvas_2').gmap({
				center: mobileDemo.center, 
				zoom: mobileDemo.zoom,
				disableDefaultUI: true, 
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.DEFAULT,
					position: google.maps.ControlPosition.TOP_RIGHT
				},
				overviewMapControl: true,
				overviewMapControlOptions: {},
				panControl: true,
				panControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT
				}, 
				rotateControl: false,
				rotateControlOptions: {},
				scaleControl: true,
			    scaleControlOptions: {
					position: google.maps.ControlPosition.BOTTOM_CENTER
				},
				streetViewControl: false,
			    streetViewControlOptions: {},
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.DEFAULT
				},
				callback: function() {
					var self = this;
					map = this.get('map');
					
					/* We need to fake-randomize our url a bit so google doesn't use it's cached version*/
					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1; /* zero based month */
					var yyyy = today.getFullYear();
					var hh = today.getHours();
					var mimi = today.getMinutes();
					var ss = today.getSeconds();
					var time = today.getTime();
					var timestamp = yyyy+'-'+mm+'-'+dd+'T'+hh+':'+mimi+':'+ss+'Z';
					
					if(locat != null){
						map.setCenter(locat);
						map.setZoom(15);
						posMarker = new google.maps.Marker({position: locat, icon: iconImage, title:"Your position"});
						posMarker.setMap(map);
						positionFound = true;
					}
					
					if(locat)$('#trackerLink').addClass("ui-btn-active");
					
					/* Load Pins */
					$.ajax({
						type: 'POST',
						url: '../../controller/controller.php',
						dataType: 'json',
						async : true,
						data: {
							command: 'getPins'
						},
						success : function(data){
							for (var i = 0; i < data.length; i++) {
								controller.mapHandler.initPins(data[i]);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							console.log("oops - Couldnt create pins");
						}
					});
					
					/* Add event listener */
					google.maps.event.addListener(map, 'dragstart', function(event) {
						if(trackPosition){
							trackPosition = false;
							$('#trackerLink').removeClass("ui-btn-active");
						}
					});
					
					google.maps.event.addListener(map, 'click', function(event) {
					});					
			}}); 
		}).load('gps_map');
	}
	
	this.createContent = function(count){
					
			demo.add('new_map', function() {

				$('#map_canvas_3').gmap({
					center: mobileDemo.center, 
					zoom: mobileDemo.zoom,
					disableDefaultUI: true, 
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: true,
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.DEFAULT,
						position: google.maps.ControlPosition.TOP_RIGHT
					},
					overviewMapControl: true,
					overviewMapControlOptions: {},
					panControl: true,
					panControlOptions: {
						position: google.maps.ControlPosition.TOP_LEFT
					}, 
					rotateControl: false,
					rotateControlOptions: {},
					scaleControl: true,
					scaleControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_CENTER
					},
					streetViewControl: false,
					streetViewControlOptions: {},
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.DEFAULT
					},
					callback: function() {
						var self = this;
						var createmap = this.get('map');
						
						/* We need to fake-randomize our url a bit so google doesn't use it's cached version*/
						var today = new Date();
						var dd = today.getDate();
						var mm = today.getMonth()+1; /* zero based month */
						var yyyy = today.getFullYear();
						var hh = today.getHours();
						var mimi = today.getMinutes();
						var ss = today.getSeconds();
						var time = today.getTime();
						var timestamp = yyyy+'-'+mm+'-'+dd+'T'+hh+':'+mimi+':'+ss+'Z';
						
						var lat;
						var lng;
						var markerCheck = 0;
						
						if(locat != null){
							createmap.setCenter(locat);
							createmap.setZoom(15);
						}
		
						/* Load Pins */
						$.ajax({
							type: 'POST',
							url: '../../controller/controller.php',
							dataType: 'json',
							async : true,
							data: {
								command: 'getPins'
							},
							success : function(data){
								for (var i = 0; i < data.length; i++) {
									var pin = data[i];
									var image = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/icons/'+pin.color+'-dot.png', new google.maps.Size(32, 32), new google.maps.Point(0,0), new google.maps.Point(16, 32));
									var shadow = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png', new google.maps.Size(56, 32), new google.maps.Point(0,0), new google.maps.Point(16, 32));
									
									var zIndex = 10;
									if(pin.color == "green") zIndex += 3;
									if(pin.color == "blue") zIndex += 2;
									if(pin.color == "red") zIndex += 1;
									
									var marker = new google.maps.Marker({
										position: new google.maps.LatLng(pin.coordinates.lat, pin.coordinates.lon),
										map: createmap,
										title: pin.title,
										animation: google.maps.Animation.DROP,
										icon: image,
										shadow: shadow,
										zIndex: zIndex
									});
								}
							},
							error : function(XMLHttpRequest, textStatus, errorThrown) {
								console.log("oops - Couldnt create pins");
							}
						});
						
						//Add event listener
						google.maps.event.addListener(createmap, 'click', function(event) 
						{	
							if(markerCheck == 1){			// markerCheck schützt davor, mehrere Marker auf die Karte zu setzen
								createContentMarker.setMap(null);
							}
							markerCheck = 1;
							lat = event.latLng.lat();
							lng = event.latLng.lng();
							$('#new_map_latInput').val(lat);
							$('#new_map_lonInput').val(lng);
							var image = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/icons/yellow-dot.png', new google.maps.Size(32, 32), new google.maps.Point(0,0), new google.maps.Point(16, 32));
							var shadow = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png', new google.maps.Size(56, 32), new google.maps.Point(0,0), new google.maps.Point(16, 32));
							createContentMarker = new google.maps.Marker({
								position: event.latLng,
								map: createmap,
								title: 'Neuer Pin',
								icon: image,
								shadow: shadow,
								zIndex: 15
							});
						});
				}}); 
		}).load('new_map');
	}
	
	this.removeCreateContentMarker = function(){
		createContentMarker.setMap(null);
	}
	
	this.doTracking = function(){
		if(locat){
			trackPosition = true;
			$('#gps_map').focus();
			controller.mapHandler.setMapCenterToCurrentPosition();
		}else{
			setTimeout(function(){
				$('#trackerLink').removeClass("ui-btn-active");
			},10);
			$('#gps_map').focus();
		}
	}
	
	this.initPins = function(pin){
		
		var image = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/icons/'+pin.color+'-dot.png', new google.maps.Size(32, 32), new google.maps.Point(0,0), new google.maps.Point(16, 32));
		var shadow = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png', new google.maps.Size(56, 32), new google.maps.Point(0,0), new google.maps.Point(16, 32));
		
		var zIndex = 10;
		if(pin.color == "green") zIndex += 3;
		if(pin.color == "blue") zIndex += 2;
		if(pin.color == "red") zIndex += 1;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(pin.coordinates.lat, pin.coordinates.lon),
			map: map,
			title: pin.title,
			animation: google.maps.Animation.DROP,
			icon: image,
			shadow: shadow,
			zIndex: zIndex
		});

		google.maps.event.addListener(marker, 'click', function() {
			var infoText = generateInfotext(pin);
			infowindow.setContent(infoText);
			
			clearInterval(iteratatorInfoWindow);
			
			iteratatorInfoWindow = setInterval(function(){
				var infoText = generateInfotext(pin);
				infowindow.setContent(infoText);
			},60000);
			
			infowindow.open(map, marker);
			
			controller.mapHandler.drawCircle(new google.maps.LatLng(pin.coordinates.lat, pin.coordinates.lon), pin.alloweddistance);
		});
		pins.push(marker);	
	}
	
	this.refreshPins = function(){
		for(var i = 0; i < pins.length; i++){
			pins[i].setMap(null);
		}
		
		pins = new Array();
		
		$.ajax({
			type: 'POST',
			url: '../../controller/controller.php',
			dataType: 'json',
			async : true,
			data: {
				command: 'getPins'
			},
			success : function(data){
				for (var i = 0; i < data.length; i++) {
					controller.mapHandler.initPins(data[i]);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("oops - Couldnt create pins");
			}
		});
	}
	
	this.getDistance = function(pinLat, pinLon){
		if(locat){
			var dlat = locat.lat() - pinLat;
			var dlon = locat.lng() - pinLon;
			var lat = ((locat.lat() + pinLat) / 2) * 0.01745;
			var dx = 111.3 * Math.cos(lat) * dlon;
			var dy = 111.3 * dlat;
			var distance = Math.sqrt(dx * dx + dy * dy) *1000;
		}else{
			var distance = -1;
		}
		
		return distance;
	}
	
	function generateInfotext(pin){
		
		distance = controller.mapHandler.getDistance(pin.coordinates.lat, pin.coordinates.lon);
		var divBegin = "<div style=\"padding: 5px; font-family: Arial, sans-serif; font-size: small\">";
		var head = "<div><h2 style=\"margin-top: 0px; white-space: normal\">"+ pin.title +"</h2>";
		var image ="";
		if(pin.image) 
			image = "<img src=\""+ pin.image +"\" alt=\""+ pin.image +"\" width=\"75px\" style=\"float:right; border=1px solid grey\">";
		var description = "<p>"+ pin.description +"</p><div style=\"clear:right\"></div></div>";
		var warningText =""
		if(controller.getDebuggingMode() && (distance > pin.alloweddistance || distance == -1) && pin.color != "red")
			warningText = "<h3 style=\"color: red\"> YOU JUST SEE THE BUTTON BECAUSE OF DEBUGGING MODE! </h3>"
		var link = "";
		if(pin.color != "red" && (controller.getDebuggingMode() || (distance <= pin.alloweddistance && distance != -1)))
			link = "<div style=\"margin-top: 20px;\"><a href=\"#contentPrototype?pageID="+pin.label+"\" data-transition=\"slide\" onclick=\"controller.contentHandler.grabPage("+pin.label+");\" data-rel=\"external\" rel=\"external\" data-role=\"button\" data-theme=\"b\" data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\" class=\"ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b\"><span class=\"ui-btn-inner ui-btn-corner-all\"><span class=\"ui-btn-text\">Zeige Inhalt</span></span></a></div>";
		var distanceText = "";
		if((distance > pin.alloweddistance) && pin.color != "red")
			distanceText = "Bitte nähere dich " + Math.round(distance - pin.alloweddistance) + "m dem Objekt, um den Inhalt zu sehen!";
		if(distance == -1 && pin.color != "red")
			distanceText = "Bitte vergewissere dich, dass deine Lokalisierung eingeschaltet ist!";
		var divEnd ="</div>";
		var infoText = divBegin + image + head + description + warningText + link + distanceText + divEnd;
		
		return infoText;
	}
	
	this.drawCircle = function(pos, distance){
		if(posDeltaCircle)posDeltaCircle.setMap(null);
		var position_bottom_Layer_Options = {
			strokeColor: "#444444",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#444444",
			fillOpacity: 0.35,
			map: map,
			zIndex: 1,
			center: pos,
			radius: distance 					/* Radius in meters */
		};
		posDeltaCircle = new google.maps.Circle(position_bottom_Layer_Options);
	}

	/* DEPRECATED */
	this.handleKMLEvent = function(kmlEvent) {
		
		var hasQuestion = kmlEvent.featureData.description.match(/\[dataInfo\](.*)\[\/dataInfo\]/);
		var pageID = kmlEvent.featureData.description.match(/\[dataPageid\](.*)\[\/dataPageid\]/);
		
		if(kmlEvent.featureData.infoWindowHtml.indexOf("[dataInfo]") != -1){
			var indexOfDataInfo = kmlEvent.featureData.infoWindowHtml.indexOf("[dataInfo]") + 10;
			kmlEvent.featureData.infoWindowHtml = kmlEvent.featureData.infoWindowHtml.substring(0, indexOfDataInfo);
			if(hasQuestion[1] != "#no_button"){
				var linkString = "<a href=\"#contentPrototype?pageID="+pageID[1]+"\" data-transition=\"slide\" onclick=\"controller.contentHandler.grabPage("+pageID[1]+");\" data-rel=\"external\" rel=\"external\" data-role=\"button\" data-theme=\"b\" data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\" class=\"ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b\"><span class=\"ui-btn-inner ui-btn-corner-all\"><span class=\"ui-btn-text\">Zeige Inhalt</span></span></a>";
				kmlEvent.featureData.infoWindowHtml = kmlEvent.featureData.infoWindowHtml.replace("[dataInfo]",linkString);
			}
			kmlEvent.featureData.infoWindowHtml = kmlEvent.featureData.infoWindowHtml.replace("[dataInfo]", "");
		}
	}
	
	this.rescale = function(){
		console.log("Try to rescale...");
		if(map){
			$('#map_canvas_2').height($('#gps_map').height() - $('#gps_map_header').height() - $('#gps_map_footer').height() - 35);
			console.log("rescaled: " + $('#map_canvas_2').height());
		}else
		{
			console.log("rescale failed");
			setTimeout(function(){
				controller.mapHandler.rescale();
			},2000);
		}
	}
	
	this.createRoute = function(routeID){
		
	}
	
	this.showRouteExample = function(){
		kmlPlacesLayer.setMap(null);
		
		var sta = new google.maps.LatLng(50.112778, 8.651389);
			var end = new google.maps.LatLng(50.111389, 8.654722);
			var wp1 = new google.maps.LatLng(50.113889, 8.651944);
			var wp2 = new google.maps.LatLng(50.111944, 8.655556);
		
			var direction = new google.maps.DirectionsService();
			direction.route({
					origin: sta,
					destination: end,
					travelMode: google.maps.TravelMode.WALKING,
					unitSystem: google.maps.UnitSystem.METRIC,
					waypoints: [{
								  location: wp1,
								  stopover: true
								},{
								  location: wp2,
								  stopover: true
								}],
					optimizeWaypoints: false,
					provideRouteAlternatives: false
				}, function(result, status) {
					var directionsDisplay = new google.maps.DirectionsRenderer();
					directionsDisplay.setMap(map);
					directionsDisplay.setDirections(result);
			});
	}
}

function contentHandler(){
	var contentExist;
	
	/* Result values */
	var result;
	var resultRanges;
	var resultReplyCount;
	var replyArray;
	var resultReplyDefault;
	/* new iterator for interval counting in distancePreview*/
	var iteratorDistance;
	
	//grab the content ... and its content :) from the model DB
	this.grabPage = function(pageID){
		var pageid = pageID;
		var distance = 0;
		$.ajax({
			type: 'POST',
			url: '../../controller/controller.php',
			dataType: 'json',
			async : false,
			data: {
				command: 'getContent',
				id: pageid
			},
			success : function(data){
				generateContentTemplate(data);
								
				var coordinate = new google.maps.LatLng(data.lat,data.lng);
				distance = controller.mapHandler.getDistance(coordinate.lat(), coordinate.lng());
				/* Switch between debugging mode on / off. Jump to Preview Site if you are not within bounds if */
				if ((distance >= data.allowedDistance || distance == -1) && controller.getDebuggingMode()){
					controller.contentHandler.initiateDistanceTrigger(data);
					setTimeout('window.location="index.html#distancePreview";',2);
				} 
				
				else{
					if(data.content){
						contentExist = true;
						$("#contentPrototype").trigger("create");
					}else{
						contentExist = false;
						controller.contentHandler.grabQuestion(data.id);
						setTimeout('window.location="index.html#questionPrototype";',2);
					}
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("contentHandler Problem");
			}
		
		});
		
	}
	
	/*function that refreshs the value in the distancePreview*/
	this.initiateDistanceTrigger = function(data){
		var coordinate = new google.maps.LatLng(data.lat,data.lng);
		var distance = controller.mapHandler.getDistance(coordinate.lat(), coordinate.lng());
		distance = distance.toFixed(2);
		$("#distancePreviewHeader").text(data.id);
				
		if (distance != -1){
			console.log(distance);
			$("#distanceToActivate").text(distance + " m");
		}
		if (distance < 0){
			$("#distanceToActivate").text("Sie konnten nicht lokalisiert werden. Aufruf der Seite nicht möglich!");
		}
		
		iteratorDistance = setInterval(function(){
			var coordinate = new google.maps.LatLng(data.lat,data.lng);
			var distance = controller.mapHandler.getDistance(coordinate.lat(), coordinate.lng());
			distance = distance.toFixed(2);
			if (distance <= data.allowedDistance && distance >=0){
				clearInterval(iteratorDistance);
				controller.contentHandler.grabPage(data.id);
			}
			else if (distance < 0){
				$("#distanceToActivate").text("Sie konnten nicht lokalisiert werden. Aufruf der Seite nicht möglich!");
			}
			else {
				$("#distanceToActivate").text(distance + " m.");
			}
		}, 10000);
	}

	/*grab the question and its content from the model DB*/
	this.grabQuestion = function(pageID){
		var pageid = pageID;
	
		$.ajax({
			type: 'POST',
			url: '../../controller/controller.php',
			dataType: 'json',
			async : false,
			data: {
				command: 'getQuestion',
				id: pageid
			},
			success : function(data){
				generateQuestionTemplate(data);
				$("#questionPrototype").trigger("create");
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("contentHandler.Question Problem");
			}
		});
	}
	
	//grab the help and its content from the model DB
	this.grabHelp = function(pageID, id){
		var pageid = pageID;
		$.ajax({
			type: 'POST',
			url: '../../controller/controller.php',
			dataType: 'json',
			async : false,
			data: {
				command: 'getHelp',
				id: pageid
			},
			success : function(data){
				generateHelpTemplate(data, id);
				$("#helpPrototype").trigger("create");
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("contentHandler.Help Problem");
			}
		});
	}
	
	/* check for right or wrong solution and act accordingly */
	this.checkAnswerMulti = function(){
		var radios = $('input');
		var checked;
		var text;
		
		for (var i = 0; i < radios.length; i++) {
    		if (radios[i].type == 'radio' && radios[i].checked) {
				checked = radios[i].value;
			}
		}
		
		checked = parseFloat(checked);
		
		for(var i=0; i < resultReplyCount; i++){
			resultSplit = replyArray[i].split("|");
			if(checked == parseFloat(resultSplit[0]))
				text = resultSplit[1];
		}
		if(!text)
			text = resultReplyDefault;
		
		result = parseFloat(result);
		if (checked == result){
			$("#questionPlaceHolder").css("display", "none");
			$("#solutionQuestionPrototype h3").text(text);
			$("#solutionQuestionPrototype").css("display", "block");
		}
		else {
			$("#questionPlaceHolderWrongAnswer").html("");
			$("#questionPlaceHolderWrongAnswer").prepend("<label class=\"wrong\">"+ text +"</label> <br/>");
		}
	}
	
	/* check if the result is between the correct solution range and act acordingly */
	this.checkAnswerRange = function(){
		var text;
		var resultSplit;
		var replyRanges;
		var low;
		var high;
		
		var answer = parseFloat(($("#eingabeFeld").attr("value")).replace(",","."));;
		
		for(var i=0; i < resultReplyCount; i++){
			resultSplit = replyArray[i].split("|");
			replyRanges = resultSplit[0].split(",");
			low = parseFloat(replyRanges[0]);
			high = parseFloat(replyRanges[1]);
			if(low <= answer && high > answer)
				text = resultSplit[1];
		}
		if(!text)
			text = resultReplyDefault;

		low = parseFloat(resultRanges[0]);
		high = parseFloat(resultRanges[1]);
		
		if(low <= answer && high > answer){
			$("#questionPlaceHolder").css("display", "none");
			$("#solutionQuestionPrototype h3").text(text);
			$("#solutionQuestionPrototype").css("display", "block");
		}else{
			$("#questionPlaceHolderWrongAnswer").html("");
			$("#questionPlaceHolderWrongAnswer").prepend("<label class=\"wrong\">"+ text +"</label> <br/>");
		}
		
		console.log(text);
	}

	/*reset the intervalltrigger*/
	this.resetIntervall = function(){
		clearInterval(iteratorDistance);
	}
	
	/*reset the prototypes with their initial structure */
	function resetPrototypesQuestion(){
		$("#field").empty();
		$("#questionPlaceHolderWrongAnswer").html("");
		$("#solutionQuestionPrototype").css("display", "none");
		$("#questionPlaceHolder").css("display", "none");
	}
	
	//swap the information into your contentPrototype;
	function generateContentTemplate(data){
		var hasMoreInfos = data.hasMoreInfos;
		var hasQuestion = data.hasQuestion;
		var id = data.id;
		var content = data.content;
		var title = content.match(/==(.*)==/);
		if (title){
			title = title[1];
			var description = content.replace("==" + title + "==", "");
			$("#ueberschriftContent").text(title);
			$("#descriptionContent").text(description);
		}
		var lat = data.lat;
		var lng = data.lng;
		var allowedDistance = data.allowedDistance;
					
		/* if a content has a question: then put a button into the div, linking to the specific question */
		if (hasQuestion){
			$("#questionButton").html("<a href=\"#questionPrototype\" data-role=\"button\" onClick='controller.contentHandler.grabQuestion("+id+")'\">Zur Frage</a>");
		}
	
		/*push infos into the preview site*/
		generatePreviewDistance(data);
		
	}
	
	/* swap the information into your questionPrototype */
	function generateQuestionTemplate(data){
		var question = data.question;
		var pic = data.pic;
		var email = data.email;
		var autor = data.autor;
		var tools = data.tools;
		var helpCount = data.countHelp;
		var helpArray = data.helpArray;
		var typ = data.typ;
		var possibleResults = data.possibleResults;
		var unit = data.unit;
		result = parseFloat(data.result);
		resultRanges = data.resultRanges;
		resultReplyCount = data.resultReplyCount;
		replyArray = data.replyArray;
		resultReplyDefault = data.resultReplyDefault;
		
		resetPrototypesQuestion();
		
					
		$("#descriptionQuestion").text(question);
		$("#autorQuestion").text(autor);
		$("#toolsQuestion").text(tools);
		$("#questionPic").attr("src", pic);
		$("#mailQuestion").text(email);
		$("#mailQuestion").attr("href", "mailto:"+email);
		
		//Generate the correct number of HelpButtons in the Help-Overview
		$("#helpOverviewButtons").html("");
		for (var i=1; i <= helpCount; i++){
			$("#helpOverviewButtons").append("<a href=\"#helpPrototype\" onClick=\'controller.contentHandler.grabHelp(\""+helpArray[i-1]+"\","+i+")' data-role=\"button\">Hilfe " + i + "</a></br>");
		}
		$("#helpOverviewPrototype").trigger("create");

		/* QUESTION SECTION */
		if (typ == "multi"){
			$("#questionPlaceHolder").css("display", "block");
			//Generate the right texts for the possible Answers in the multipleChoice Question 
			for(var i = 0; i < possibleResults.length; i++){
				$("#field").append("<input type='radio' name='choice' id='checkbox" + i + "' value='"+ possibleResults[i] +"' />");
				$("#field").append("<label for='checkbox" + i + "'>" + possibleResults[i] +" " + unit + "</label>");
				$("#checkbox" + i).checkboxradio();
			}
			$("#checkbox0").attr("checked", "checked");
			$("#field").controlgroup("refresh");
		
			//Generate the parameters for the checkAnswer function
			$("#buttonSolution").attr("onClick", "controller.contentHandler.checkAnswerMulti()");
		}
		if (typ == "eingabe"){
			$("#questionPlaceHolder").css("display", "block");	
			//Generate the Range question textbox/label and button
			//2DO find a way to attach the unit to the value.
			//$("#field").append("<input id=\"eingabeFeld\" onclick=\"if(this.value=='Einheit in " + unit + "'){this.value=''}\" onblur=\"alert(' "+ $("#eingabeFeld").attr('value')+ unit + "') \" name=\"rangeResult\" type=\"text\" value=\"Einheit in " + unit +"\"/>");
			//last version: $("#field").append("<input id=\"eingabeFeld\" onclick=\"if(this.value=='Einheit in " + unit + "'){this.value=''}\" onblur=\"if(this.value==''){this.value = 'Einheit in " + unit + "'}\" name=\"rangeResult\" type=\"text\" value=\"Einheit in " + unit +"\"/>");
			$("#field").append("<input id=\"eingabeFeld\" onclick=\"if(this.value=='Einheit in " + unit + "'){this.value=''}\" onblur=\"this.value = this.value.toString(); "+ unit + "\" name=\"rangeResult\" type=\"text\" value=\"Einheit in " + unit +"\"/>");
			//$("#questionGenerator").append("<div data-role=\"fieldcontain\"><label for=\"rangeAnswer\">Gib deine Antwort ein: </label><form><input type=\"text\" name=\"rangeAnswer\" id=\"rangeAnswer\" value=\"\" /><br /><br /><input name=\"eingabeFeld\" type=\"button\" data-theme=\"b\" value=\"OK\" onclick=\"controller.contentHandler.checkAnswerRange("+this.form.value+")\"/></form></div>");
			
			$("#field").controlgroup("refresh");
			
			//Generate the parameters for the checkAnswer function
			//$("#buttonMultiSolution").attr("onClick", "controller.contentHandler.checkAnswerRange()");
			$("#buttonSolution").attr("onClick", "controller.contentHandler.checkAnswerRange()");	
		}
		
		/* check for content, to decide if contentPrototype should be seen from question or not */
		if (contentExist == false){
			$("#backToContentLink").attr("href", "#gps_map");
		}
		
		/*push infos into the preview site*/
		generatePreviewDistance(data);
		
		
	}
	
		
	
	/*swap the information into your helpPrototype*/
	function generateHelpTemplate(data, id){
		var pic = data.helpPic;
		var help = data.help;
		var id = id;
		$("#helpID").html("");
		
		$("#helpHeader").text("Hilfe " + id);
		$("#helpID").html(help);
		$("#helpPic").attr("src", pic);
		$("#helpPic").attr("alt", pic);
	}
	
	/*push information into the preview distance site, gets called within function createContent and createQuestion*/
	function generatePreviewDistance(data){
		$("distancePreviewHeader").text(data.title);
	}
	
}
