// JavaScript code for the Arduino Beacon example app.

// Application object.
var app = {}

// Regions that define which page to show for each beacon.
app.beaconRegions =
[
	{						// Updated major and minor according to the picture in social
		id: 'page-oldies',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major: 46146,
		minor: 34612
	},
	{
		id: 'page-laidBackJazz',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major: 57356,
		minor: 14220
	},
	{
		id: 'page-rock',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major: 22296,
		minor: 48975
	}
]

// Currently displayed page.
app.currentPage = 'page-default'

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
	app.gotoPage(app.currentPage)
}

// Called when Cordova are plugins initialised,
// the iBeacon API is now available.
app.onDeviceReady = function()
{
	// Specify a shortcut for the location manager that
	// has the iBeacon functions.
	window.locationManager = cordova.plugins.locationManager

	// Start tracking beacons!
	app.startScanForBeacons()
}

app.startScanForBeacons = function()
{
	//console.log('startScanForBeacons')

	// The delegate object contains iBeacon callback functions.
	var delegate = new cordova.plugins.locationManager.Delegate()

	delegate.didDetermineStateForRegion = function(pluginResult)
	{
		//console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
	}

	delegate.didStartMonitoringForRegion = function(pluginResult)
	{
		//console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
	}

	delegate.didRangeBeaconsInRegion = function(pluginResult)
	{
		//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
		app.didRangeBeaconsInRegion(pluginResult)
	}

	// Set the delegate object to use.
	locationManager.setDelegate(delegate)

	// Start monitoring and ranging our beacons.
	for (var r in app.beaconRegions)
	{
		var region = app.beaconRegions[r]

		var beaconRegion = new locationManager.BeaconRegion(
			region.id, region.uuid, region.major, region.minor)

		// Start monitoring.
		locationManager.startMonitoringForRegion(beaconRegion)
			.fail(console.error)
			.done()

		// Start ranging.
		locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail(console.error)
			.done()



	}
}

// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function(pluginResult)
{
	//console.log('numbeacons in region: ' + pluginResult.beacons.length)

	// There must be a beacon within range.
	if (0 == pluginResult.beacons.length)
	{
		return
	}

	// Our regions are defined so that there is one beacon per region.
	// Get the first (and only) beacon in range in the region.
	var beacon = pluginResult.beacons[0]

	// The region identifier is the page id.
	var pageId = pluginResult.region.identifier

	//console.log('ranged beacon: ' + pageId + ' ' + beacon.proximity)

	// If the beacon is close and represents a new page, then show the page.
	if ((beacon.proximity == 'ProximityNear' || beacon.proximity == 'ProximityImmediate') && app.currentPage == 'page-default')
	{
		app.gotoPage(pageId)
		return
	}

	// If the beacon represents the current page but is far away,
	// then show the default page.
	if ((beacon.proximity == 'ProximityFar') && app.currentPage == pageId)
	{
		app.gotoPage('page-default')
		return
	}

	
	// document.getElementById(app.currentPage).append(beacon.rssi);
	var rssiWidth = 1; // Used when RSSI is zero or greater.

	if (beacon.rssi < -100){ 
		rssiWidth = 100; 
	}
	else if (beacon.rssi < 0){ 
		rssiWidth = 100 + beacon.rssi; 
	}

	// document.getElementById(app.currentPage).append(beacon.rssi);

	if (beacon.major == 57356 && beacon.minor == 14220) {
		var element = $(
			// 	+'<div style="background:rgb(255,128,64);height:20px;width:' + rssiWidth + '%;">'
			// '</div>'
				beacon.rssi
		);
		// curP.append(element)

	};
	// document.getElementById('rssiMeter').style.width = 100;


}

app.gotoPage = function(pageId)
{
	app.hidePage(app.currentPage)
	app.showPage(pageId)
	app.currentPage = pageId
}

app.showPage = function(pageId)
{
	document.getElementById(pageId).style.display = 'block'
}

app.hidePage = function(pageId)
{
	var sounds = document.getElementsByTagName("audio");
	for (i=0; i<sounds.length; i++) sounds[i].pause();
	document.getElementById(pageId).style.display = 'none'
}

// Set up the application.
app.initialize()
