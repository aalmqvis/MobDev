// JavaScript code


var mSensors = {
        1: {
            "location":"Whiteboard",
            "floor":"upstairs", 
            "key":"BQa4EqqbgxfMgpBQ8XwNhvP82Dj",
            "image":"https://evothings.com/demos/dome_pics/IMG_1758.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        2: {
            "location":"Conference room",  
            "floor":"upstairs", 
            "key":"J3Wgj9qegGFX4r9KlxxGfaeMXQB",
            "image":"https://evothings.com/demos/dome_pics/IMG_1759.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        3: {
            "location":"Conference room", 
            "floor":"downstairs",   
            "key":"lB6p49pzXdFGQjpLwzzOTWj10rd",
            "image":"https://evothings.com/demos/dome_pics/IMG_1762.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        4: {
            "location":"Underneath the stairs",  
            "floor":"downstairs",   
            "key":"L4D98lO9ObtOdzx3PggKIaWmMGA",
            "image":"https://evothings.com/demos/dome_pics/IMG_1763.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        5: {
            "location":"Entrance, conference room",  
            "floor":"downstairs",  
            "key":"LAjQ9E8PBOiOdzx3PggKIaWmMGA",
            "image":"https://evothings.com/demos/dome_pics/IMG_1761.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        6: { 
            "location":"Entrance, conference room",  
            "floor":"upstairs",  
            "key":"BkPNOapq2WSMgpVlNQQKFYXPBWr",
            "image":"https://evothings.com/demos/dome_pics/IMG_1760.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"}
    };


function retrieverTicker() {

    console.log("Very slow start up! BE PATIENT :) Probably this can be fixed somehow...?");

	// Create chart and the line in it
	var chartComponents = createChart();
	var line = chartComponents.createdLine;
	var chartForLine = chartComponents.createdChart;

	// Retrieving new sensor data 
	// and calling printData() and updateChart() to visualize the new data
	setInterval( function(){
		getJSON(line,chartForLine);
	}, 1000);
	
	getJSON(line,chartForLine);
}


// Function to retrieve data, placing it in a "response" object
function getJSON(line, chartForLine) 
    {
    if (window.cordova) 
        {
            console.log('Using Apache Cordova HTTP GET function');
            cordovaHTTP.get(
                mSensors[2].dataStreamURL + mSensors[2].key + '.json?gt[timestamp]=now-1day&page=1',
                function (response) 
                    {
                        if (response) 
                            {
                                mSensors[2].data = JSON.parse(response.data)[0];
                                mSensors[2].fullData = JSON.parse(response.data);
                                printData();
                            }
                    },
                function (error) 
                    {
                    console.log(JSON.stringify(error));
                    });
        }    
    else 
        {
            console.log('Not using Cordova, fallback to AJAX via jquery');

            $.ajax({
                    url: mSensors[2].dataStreamURL + mSensors[2].key + ".json?gt[timestamp]=now- 1day",
                    jsonp: "callback",
                    cache: true,
                    dataType: "jsonp",
                    data: 
                        {
                            page: 1
                        },
                    success: function(response) 
                        {
                            if (response && response[0]) 
                                {
                                    mSensors[2].data = response[0];
                                    mSensors[2].fullData = response;
                                    console.log(mSensors[2].fullData[0].c);
                                    // To do: add every value of full data in the array line1
                                    // and then increment it for every new value
                                    var hours = new Date().getHours();
                                    var minutes = new Date().getMinutes();
                                    var seconds = new Date().getSeconds();
                                    //console.log(hours+":"+minutes+":"+seconds);
                                    var tid = (hours+":"+minutes+":"+seconds);
                                    printData();
                                    updateChart(line,chartForLine,mSensors[2]);
                                    //updateChartUpToSpeed(line,chartForLine,mSensors[2].fullData,tid);
                                }
                        }
                });

        }
}



function printData()    
    {
        if (mSensors[2] && mSensors[2].data) 
            {
            // Display the info.
                html = '<h1>Sensor Data</h1>'
                  + '<br /><div id="time">Time  ' + mSensors[2].data.timestamp + '</div>'
                  + '<div id="hum">Humidity ' + mSensors[2].data.h + ' % (rel)</div>'
                  + '<div id="temp">Temperature ' + mSensors[2].data.t + ' celcius</div>'
                  + '<div id="temp">Pressure ' + mSensors[2].data.p + ' Pa</div>'
                  + '<div id="temp">Carbon Dioxide ' + mSensors[2].data.c + ' ppm</div>'
                  + '<div id="temp">Lumination ' + mSensors[2].data.l + ' Lux</div>'
                  + '<div id="temp">No movement ' + mSensors[2].data.np + ' </div>'
                  + '<div id="temp">Movement ' + mSensors[2].data.pp + ' </div>'
                  + '<img src="' + mSensors[2].image + '" />'
            } 
    else 
            {
                html = '<h1>Sensor Data</h1>'
                 + '<br />Sorry, sensor data not available right now :(</br>'
                 + '<img src="' + mSensors[2].image + '" />'
            }
    document.getElementById("printHere").innerHTML= html;
    }


function createChart() {
    // Create chart
    var chart = new SmoothieChart({	millisPerPixel:250,
    								maxValueScale:1.15,
    								minValue:13.5,
    								timestampFormatter:SmoothieChart.timeFormatter, 
    					// 			labels:{disabled:false,
									// grid:{millisPerLine:6000},
    								});
    // Create line to later put in chart
    var line = new TimeSeries();

    chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 }); 
    chart.streamTo(document.getElementById("chart"), 3000);

    return {createdLine: line, createdChart: chart};
}

function updateChart(line,chartForLine,mSensor2) {
	var line = line; 
	var chart = chartForLine;
	var mSensor = mSensor2;  
    line.append(new Date().getTime(), mSensor.data.h); 
    chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 }); 
        
}


// Adding fulldata to the chart
function updateChartUpToSpeed(line,chartForLine,mSensor2, fullData) {
    var line = line; 
    var chart = chartForLine;
    var mSensor = mSensor2;  
    var mSensorFullData = fullData;

    for (i = 0; i < mSensorFullData.length.h; i++){
        line.append(mSensorFullData.timestamp);
    }
    line.append(new Date().getTime(), mSensor.data.h); 
    chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 }); 
        
}

