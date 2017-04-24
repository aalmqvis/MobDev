// JavaScript code


var mSensors = {
        1: {
            "location":"Whiteboard, upstairs",
            "key":"BQa4EqqbgxfMgpBQ8XwNhvP82Dj",
            "image":"https://evothings.com/demos/dome_pics/IMG_1758.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        2: {
            "location":"Conference room, upstairs",  
            "key":"J3Wgj9qegGFX4r9KlxxGfaeMXQB",
            "image":"https://evothings.com/demos/dome_pics/IMG_1759.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        3: {
            "location":"Conference room, downstairs", 
            "key":"lB6p49pzXdFGQjpLwzzOTWj10rd",
            "image":"https://evothings.com/demos/dome_pics/IMG_1762.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        4: {
            "location":"Underneath the stairs, downstairs",  
            "key":"L4D98lO9ObtOdzx3PggKIaWmMGA",
            "image":"https://evothings.com/demos/dome_pics/IMG_1763.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        5: {
            "location":"Entrance, conference room, downstairs",  
            "key":"LAjQ9E8PBOiOdzx3PggKIaWmMGA",
            "image":"https://evothings.com/demos/dome_pics/IMG_1761.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
        6: { 
            "location":"Entrance, conference room, upstairs",  
            "key":"BkPNOapq2WSMgpVlNQQKFYXPBWr",
            "image":"https://evothings.com/demos/dome_pics/IMG_1760.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"}
    };

function retrieverTicker(sensorKey) {
    console.log("Very slow start up! BE PATIENT :) Probably this can be fixed somehow...?");
    console.log(mSensors[sensorKey].location);
	// Create chart and the line in it
	var chartComponents = createChart();
	var line = chartComponents.createdLine;
	var chartForLine = chartComponents.createdChart;
    var fillChart = true;
	// Retrieving new sensor data 
	// and calling printData() and updateChart() to visualize the new data
	setInterval( function(){
		getJSON(sensorKey,line,chartForLine);
	}, 1000);
	
	getJSON(sensorKey,line,chartForLine);
}


// Function to retrieve data, placing it in a "response" object
function getJSON(sensorKey,line,chartForLine,fillChart) 
    {
    if (window.cordova) 
        {
            console.log('Using Apache Cordova HTTP GET function');
            cordovaHTTP.get(
                mSensors[sensorKey].dataStreamURL + mSensors[sensorKey].key + '.json?gt[timestamp]=now-1day&page=1',
                function (response) 
                    {
                        if (response) 
                            {
                                mSensors[sensorKey].data = JSON.parse(response.data)[0];
                                mSensors[sensorKey].fullData = JSON.parse(response.data);
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
            //console.log('Not using Cordova, fallback to AJAX via jquery');
            //console.log(mSensors[sensorKey].dataStreamURL);
            $.ajax({
                    url: mSensors[sensorKey].dataStreamURL + mSensors[sensorKey].key + ".json?gt[timestamp]=now- 1day",
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
                                    mSensors[sensorKey].data = response[0];
                                    mSensors[sensorKey].fullData = response;
                                    var str = mSensors[sensorKey].fullData[0].timestamp;
                                    //console.log(str.substring(12,str.length-5)); //mSensors[2].fullData);
                                    //console.log(str)
                                    // Smoothie works in timestamps that is ms after 1 jan 1970.


                                    // To do: add every value of full data in the array line1
                                    // and then increment it for every new value


                                    /*if (fillChart == true){
                                        updateChartUpToSpeed(line,chartForLine,mSensors[2].fullData,tid);
                                    }*/
                                    printData(sensorKey);
                                    updateChart(line,chartForLine,mSensors[sensorKey]);
                                }
                            else {
                                console.log("no response");
                            }
                        }

                });

        }
}



function printData(sensorKey)    
    {
        if (mSensors[sensorKey] && mSensors[sensorKey].data) 
            {
            // Display the info.
                html = '<h1>Sensor Data</h1>'
                  + '<br /><div id="time">Time  ' + mSensors[sensorKey].data.timestamp + '</div>'
                  + '<div id="hum">Humidity ' + mSensors[sensorKey].data.h + ' % (rel)</div>'
                  + '<div id="temp">Temperature ' + mSensors[sensorKey].data.t + ' celcius</div>'
                  + '<div id="temp">Pressure ' + mSensors[sensorKey].data.p + ' Pa</div>'
                  + '<div id="temp">Carbon Dioxide ' + mSensors[sensorKey].data.c + ' ppm</div>'
                  + '<div id="temp">Lumination ' + mSensors[sensorKey].data.l + ' Lux</div>'
                  + '<div id="temp">No movement ' + mSensors[sensorKey].data.np + ' </div>'
                  + '<div id="temp">Movement ' + mSensors[sensorKey].data.pp + ' </div>'
                  + '<img src="' + mSensors[sensorKey].image + '" />'
                //console.log("print data successfull");
            } 
    else 
            {
                html = '<h1>Sensor Data</h1>'
                 + '<br />Sorry, sensor data not available right now :(</br>'
                 + '<img src="' + mSensors[sensorKey].image + '" />'
                //console.log("print data successfull");

            }
    document.getElementById("printFor"+mSensors[sensorKey].location).innerHTML= html;
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

function updateChart(line,chartForLine,mSensor) {
	var line = line; 
	var chart = chartForLine;
	var mSensor = mSensor;  
    line.append(new Date().getTime(), mSensor.data.h); 
    chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)', lineWidth: 4 }); 
        
}

// Adding fulldata to the chart
function updateChartUpToSpeed(line,chartForLine,mSensor,fullData) {
    var line = line; 
    var chart = chartForLine;
    var mSensor = mSensor;  
    var mSensorFullData = fullData;

    for (i = 0; i < Object.keys(mSensors[number].fullData).length; i++){
        // how to access timestamp for every value?
        line.append(mSensorFullData.timestamp, mSensor.h);
    }
    line.append(new Date().getTime(), mSensor.data.h); 
    chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)',   lineWidth: 4 }); 
        
}

// Turning sensor timestamps into milliseconds from 1 jan 1970
// which is the format which smoothieChart uses
function timeConverter() {

    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();
    //console.log(hours+":"+minutes+":"+seconds);
    console.log( new Date().getTime());
    var tid = (hours+":"+minutes+":"+seconds);

    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;

}

