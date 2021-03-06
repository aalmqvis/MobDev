    // JavaScript code

var stufftoKeeptrackof;
var fullDataTableCarbon;
var fullDataTableMovement;
var fullDataTableTemp;
var fullDataRetrieved = false;
//backup.evothings.com:8080

var mSensors = {
        1: {
            "location":"Whiteboard, upstairs",
            "key":"BQa4EqqbgxfMgpBQ8XwNhvP82Dj",
            "image":"https://evothings.com/demos/dome_pics/IMG_1758.JPG",
            //"dataStreamURL":"http://backup.evothings.com:8080/output/"},
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/"},
            //"homeChartName":"chartWhiteboard",
        2: {
            "location":"Conference room, upstairs", 
            "loc":"Upstairs", 
            "key":"J3Wgj9qegGFX4r9KlxxGfaeMXQB",
            "image":"https://evothings.com/demos/dome_pics/IMG_1759.JPG",
            //"dataStreamURL":"http://backup.evothings.com:8080/output/",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/",
            "homeChartData":"dataUpstairs",
            "chartFullData":"chartFullDataUpstairs",
            "homeChartName":"chartUpstairs"},
        3: {
            "location":"Conference room, downstairs", 
            "loc":"Downstairs", 
            "key":"lB6p49pzXdFGQjpLwzzOTWj10rd",
            "image":"https://evothings.com/demos/dome_pics/IMG_1762.JPG",
            //"dataStreamURL":"http://backup.evothings.com:8080/output/",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/",
            "homeChartData":"dataDownstairs",
            "chartFullData":"chartFullDataDownstairs",
            "homeChartName":"chartDownstairs"},
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
            "loc":"Entrance", 
            "key":"BkPNOapq2WSMgpVlNQQKFYXPBWr",
            "image":"https://evothings.com/demos/dome_pics/IMG_1760.JPG",
            "dataStreamURL":"http://smartspaces.r1.kth.se:8082/output/",
            //"dataStreamURL":"http://backup.evothings.com:8080/output/",
            "homeChartData":"dataEntrance",
            "chartFullData":"chartFullDataEntrance",
            "homeChartName":"chartEntrance"},

    };

function retrieverTicker(sensorKey, latestDataQuery, fullDataQuery, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature) {
    //console.log("Very slow start up! BE PATIENT :) Probably this can be fixed somehow...?");
    if (fullDataQuery == true) {
        console.log("Sensor number " +sensorKey+" called. Getting fullData from it!");
        getJSONFullData(sensorKey);
    }    
    if (latestDataQuery == true) {

        setInterval( function(){
            getJSONLatestData(sensorKey, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature); 
        }, 30000);  // change to once every 30 sec 
        getJSONLatestData(sensorKey, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature); 
    }
}

// Function to retrieve data, placing it in a "response" object
function getJSONFullData(sensorKey) 
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
                                // if (sensorKey == 0) {
                                //     mSensors[sensorKey].data = JSON.parse(response.data)[0];
                                //     mSensors[sensorKey].data = JSON.parse(response.data)[0];
                                //     mSensors[sensorKey].data = JSON.parse(response.data)[0];
                                //     printData(sensorKey)
                                // }
                                mSensors[sensorKey].fullData = JSON.parse(response.data);
                                printFullData(mSensors[sensorKey], sensorKey);
                                printData(sensorKey);
                                //console.log("Fulldata received for sensor: " +sensorKey);
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

                                    mSensors[sensorKey].fullData = response;
                                    //console.log("Fulldata received for sensor: " +sensorKey);
                                    console.log("Running print full data with false")
                                    printFullData(mSensors[sensorKey],sensorKey, false);
                                    printData(sensorKey);
                                    //drawChart();
                                }
                            else {
                                console.log("no response (trying to get fullData for sensor: " +sensorKey +")");
                            }
                        }

                });

        }
}

function getJSONLatestData(sensorKey, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature) 
    {
    if (window.cordova) 
        {
            //console.log('Using Apache Cordova HTTP GET function');
            cordovaHTTP.get(
                mSensors[sensorKey].dataStreamURL + mSensors[sensorKey].key + '.json?limit=1',
                function (response) 
                    {
                        if (response) 
                            {
                                mSensors[sensorKey].data = JSON.parse(response.data)[0];
                                //console.log("latestData received for sensor: " +sensorKey);
                                sendHomepageData(sensorKey, mSensors[sensorKey], dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature);
                                if(fullDataRetrieved){
                                    console.log("new data");
                                    printFullData(mSensors[sensorKey],sensorKey, true);
                                }
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
            $.ajax({
                    url: mSensors[sensorKey].dataStreamURL + mSensors[sensorKey].key + ".json?limit=1",
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

                                    if (sensorKey)
                                    mSensors[sensorKey].data = response[0];
                                    //console.log("latestData received for sensor: " +sensorKey);
                                    //mSensors[sensorKey].fullData = response;
                                    
 
                                    sendHomepageData(sensorKey, mSensors[sensorKey], dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature);
                                    if(fullDataRetrieved){
                                        console.log("new data");
                                        printFullData(mSensors[sensorKey],sensorKey, true);
                                    }

                                }
                            else {
                                console.log("no response (trying to get latest data for sensor: " +sensorKey +")");
                            }
                        }

                });

        }
}

function createHomepageVisuals() {
    var dataCarbon = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Entrance', 0],
      ['Upstairs', 0],
      ['Downstairs', 0]
    ]);

    var dataMovement = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Entrance', 0],
      ['Upstairs', 0],
      ['Downstairs', 0]
    ]);

    var dataTemperature = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Entrance', 0],
      ['Upstairs', 0],
      ['Downstairs', 0]
    ]);

    var optionsCarbon = {
      width: 350, height: 90,
      redFrom: 570, redTo: 650,
      yellowFrom:490, yellowTo: 570,
      minorTicks: 20, max: 650
    };
     var optionsMovement = {
      width: 350, height: 90,
      redFrom: 1200, redTo: 1500,
      yellowFrom:700, yellowTo: 1200,
      minorTicks: 20, max: 1500
    };
     var optionsTemperature = {
      width: 350, height: 90,
      redFrom: 29, redTo: 35,
      yellowFrom:25, yellowTo: 29,
      minorTicks: 20, max: 35
    };

    var chartCarbon = new google.visualization.Gauge(document.getElementById('chartHomeCarbon'));
    var chartMovement = new google.visualization.Gauge(document.getElementById('chartHomeMovement'));
    var chartTemperature = new google.visualization.Gauge(document.getElementById('chartHomeTemperature'));

    chartCarbon.draw(dataCarbon, optionsCarbon);
    chartMovement.draw(dataMovement, optionsMovement);
    chartTemperature.draw(dataTemperature, optionsTemperature);
    retrieverTicker(2, true, false, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature);
    retrieverTicker(3, true, false, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature);
    retrieverTicker(6, true, false, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature);

}

function sendHomepageData(sensorKey, mSensors, dataCarbon, dataMovement, dataTemperature, chartCarbon, chartMovement, chartTemperature, optionsCarbon, optionsMovement, optionsTemperature) {
    // send latest data of 2,3 and 6 to charts
    // How do I send the right data to the right gauge?

    // TO DO:
    // Add values from mSensor to proper gauge
    // Make graphics for fullData using some chart
    // Could use smoothie or https://developers.google.com/chart/interactive/docs/gallery/linechart
    // Done?

    //console.log("sendHomepageData successfull" + mSensors.homeChartName);

    // sensorKey 6 is entrance sensor, 2 upstairs , 3 downstairs
    // chart number 0 is entrance ,  1 is upstairs , 2 is downstairs
    if (sensorKey == 6) {
        // Set chart value
        dataCarbon.setValue(0, 1, mSensors.data.c);
        dataMovement.setValue(0, 1, mSensors.data.pp);
        dataTemperature.setValue(0, 1, mSensors.data.t);

        // Draw new chart
        chartCarbon.draw(dataCarbon, optionsCarbon);
        chartMovement.draw(dataMovement, optionsMovement);
        chartTemperature.draw(dataTemperature, optionsTemperature);
    }
    if (sensorKey == 2) {
        dataCarbon.setValue(1, 1, mSensors.data.c);   
        dataMovement.setValue(1, 1, mSensors.data.pp);
        dataTemperature.setValue(1, 1, mSensors.data.t);

        chartCarbon.draw(dataCarbon, optionsCarbon);
        chartMovement.draw(dataMovement, optionsMovement);
        chartTemperature.draw(dataTemperature, optionsTemperature);
    }
    if (sensorKey == 3) {
        dataCarbon.setValue(2, 1, mSensors.data.c);
        dataMovement.setValue(2, 1, mSensors.data.pp);
        dataTemperature.setValue(2, 1, mSensors.data.t);

        chartCarbon.draw(dataCarbon, optionsCarbon);
        chartMovement.draw(dataMovement, optionsMovement);
        chartTemperature.draw(dataTemperature, optionsTemperature);
    }
}

function printData(sensorKey)    
    {
        if (mSensors[sensorKey] && mSensors[sensorKey].data) 
            {
            // Display the info.
                html = '<h1>Sensor Data</h1>'
                  +'<div class="container"><img id="background_img" src="' + mSensors[sensorKey].image + '" width="100%" height="auto" />'
                  + '<div class="data_reads"><p id="hum">Humidity ' + mSensors[sensorKey].data.h + ' % (rel)</p>'
                  + '<p id="temp">Temperature ' + mSensors[sensorKey].data.t + ' celcius</p>'
                  + '<p id="temp">Pressure ' + mSensors[sensorKey].data.p + ' Pa</p>'
                  + '<p id="temp">Carbon Dioxide ' + mSensors[sensorKey].data.c + ' ppm</p>'
                  + '<p id="temp">Lumination ' + mSensors[sensorKey].data.l + ' Lux</p>'
                  + '<p id="temp">No movement ' + mSensors[sensorKey].data.np + ' </p>'
                  + '<p id="temp">Movement ' + mSensors[sensorKey].data.pp + ' </p></div></div>';

                  //document.body["background-image"] =url(mSensors[sensorKey].image );
                //console.log("print data successfull");
            } 
    else 
            {
                html = '<h1>Sensor Data</h1>'
                 + '<br />Sorry, sensor data not available right now :(</br>'
                 + '<img src="' + mSensors[sensorKey].image + '" />'
                //console.log("print data successfull");

            }
    //console.log("printFor"+mSensors[sensorKey].location);
    document.getElementById("printFor"+mSensors[sensorKey].location).innerHTML= html;
    }

// function drawChart() {
//     var data = google.visualization.arrayToDataTable([
//       ['Label', 'Value'],
//       ['Memory', 80],
//       ['CPU', 55],
//       ['Network', 68]
//     ]);

//     var options = {
//       width: 400, height: 120,
//       redFrom: 90, redTo: 100,
//       yellowFrom:75, yellowTo: 90,
//       minorTicks: 5
//     };

//     var chart = new google.visualization.Gauge(document.getElementById('chartHome'));

//     chart.draw(data, options);

//     setInterval(function() {
//       data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
//       chart.draw(data, options);
//     }, 13000);
//     setInterval(function() {
//       data.setValue(1, 1, 40 + Math.round(60 * Math.random()));
//       chart.draw(data, options);
//     }, 5000);
//     setInterval(function() {
//       data.setValue(2, 1, 60 + Math.round(20 * Math.random()));
//       chart.draw(data, options);
//     }, 26000);
// }

function printFullData(sensorwithdata,sensorKey, update) {
    console.log("Full data recieved from sensor number: " +sensorKey +".");

    // 1. access mSensor.fullData and get it to the data format we need to add it to a chart
    // 2. Draw that chart
    // 3. Update that chart with latest data

    stufftoKeeptrackof =sensorwithdata;
    // fullDataLength is the number of values to add in the chart
    

    if (sensorKey == 6) {

    }

    if(!update){
        var currentDataIndex = Object.keys(sensorwithdata.fullData).length;
        console.log("length of data "+ currentDataIndex);
        fullDataTableCarbon = new google.visualization.DataTable();
        fullDataTableCarbon.addColumn('string', 'index');
        fullDataTableCarbon.addColumn('number', 'value');
        fullDataTableCarbon.addRows(currentDataIndex);

        fullDataTableMovement = new google.visualization.DataTable();
        fullDataTableMovement.addColumn('string', 'index');
        fullDataTableMovement.addColumn('number', 'value');
        fullDataTableMovement.addRows(currentDataIndex);

        fullDataTableTemp = new google.visualization.DataTable();
        fullDataTableTemp.addColumn('string', 'index');
        fullDataTableTemp.addColumn('number', 'value');
        fullDataTableTemp.addRows(currentDataIndex);


        for (i = 0; i < currentDataIndex; i++) {
            // append this thing to an array
            fullDataTableCarbon.setCell(i, 0, sensorwithdata.fullData[i].timestamp); 
            fullDataTableCarbon.setCell(i, 1, sensorwithdata.fullData[i].c); 

            if (sensorKey != 6) {
                fullDataTableMovement.setCell(i, 0, sensorwithdata.fullData[i].timestamp); 
                fullDataTableMovement.setCell(i, 1, sensorwithdata.fullData[i].pp);
            }
            
            fullDataTableTemp.setCell(i, 0, sensorwithdata.fullData[i].timestamp); 
            fullDataTableTemp.setCell(i, 1, sensorwithdata.fullData[i].t);
        }
        fullDataRetrieved = true;
    } else {
        console.log("length of data "+ currentDataIndex);
        fullDataTableCarbon.addRows(1);
        fullDataTableTemp.addRows(1);
        fullDataTableMovement.addRows(1);
        var numbOfRows = fullDataTableCarbon.getNumberOfRows();
        console.log("NEWWWW DATAAAA");
        console.log(sensorwithdata.data);
        fullDataTableCarbon.setCell(numbOfRows, 0, sensorwithdata.data.timestamp); 
        fullDataTableCarbon.setCell(numbOfRows, 1, sensorwithdata.data.c); 

        fullDataTableTemp.setCell(numbOfRows, 0, sensorwithdata.data.timestamp); 
        fullDataTableTemp.setCell(numbOfRows, 1, sensorwithdata.data.t);
        
        if (sensorKey != 6) {
           fullDataTableMovement.setCell(numbOfRows, 0, sensorwithdata.data.timestamp); 
           fullDataTableMovement.setCell(numbOfRows, 1, sensorwithdata.data.pp);
        }
         
    }

    // specify location
    //var table = new google.visualization.Table(document.getElementById("chartFullDataEntrance"));
    if (sensorKey == 6) {
        var chartentrCarbon = new google.visualization.LineChart(document.getElementById("entranceFullDataTableCarbon"));
        var chartentrTemp = new google.visualization.LineChart(document.getElementById("entranceFullDataTableTemp"));

        chartentrCarbon.draw(fullDataTableCarbon); 
        chartentrTemp.draw(fullDataTableTemp);  
 
    }
    if (sensorKey == 2) {
        var chartupstrCarbon = new google.visualization.LineChart(document.getElementById("chartFullDataUpstairsCarbon"));
        var chartupstrMovement = new google.visualization.LineChart(document.getElementById("chartFullDataUpstairsMovement"));
        var chartupstrTemp = new google.visualization.LineChart(document.getElementById("chartFullDataUpstairsTemp"));

        chartupstrCarbon.draw(fullDataTableCarbon); 
        chartupstrMovement.draw(fullDataTableMovement); 
        chartupstrTemp.draw(fullDataTableTemp);   
    }
    if (sensorKey == 3) {
        var chartdownstrCarbon = new google.visualization.LineChart(document.getElementById("chartFullDataDownstairsCarbon"));
        var chartdownstrMovement = new google.visualization.LineChart(document.getElementById("chartFullDataDownstairsMovement"));
        var chartdownstrTemp = new google.visualization.LineChart(document.getElementById("chartFullDataDownstairsTemp"));

        chartdownstrCarbon.draw(fullDataTableCarbon); 
        chartdownstrMovement.draw(fullDataTableMovement); 
        chartdownstrTemp.draw(fullDataTableTemp); 

    }

    //console.log(fullDataTable);

    //console.log(Object.keys(mSensors.fullData[1]["c"] ));
    
    //var str = mSensors.fullData[1];  //.timestamp;
    //onsole.log(str.substring(12,str.length-5)); //mSensors[2].fullData);
    //console.log(str)
}

function updateFullData(sensorKey) {
    
}


// function createChart() {
//     // Create chart
//     var chart = new SmoothieChart({	millisPerPixel:250,
//     								maxValueScale:1.15,
//     								minValue:13.5,
//     								timestampFormatter:SmoothieChart.timeFormatter, 
//     					// 			labels:{disabled:false,
// 									// grid:{millisPerLine:6000},
//      								});
//     // Create line to later put in chart
//     var line = new TimeSeries();

//     chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 }); 
//     chart.streamTo(document.getElementById("chart"), 3000);

//     return {createdLine: line, createdChart: chart};
// }

// function updateChart(line,chartForLine,mSensor) {
// 	var line = line; 
// 	var chart = chartForLine;
// 	var mSensor = mSensor;  
//     line.append(new Date().getTime(), mSensor.data.h); 
//     chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)', lineWidth: 4 }); 
        
// }

// // Adding fulldata to the chart
// function updateChartUpToSpeed(line,chartForLine,mSensor,fullData) {
//     var line = line; 
//     var chart = chartForLine;
//     var mSensor = mSensor;  
//     var mSensorFullData = fullData;

//     for (i = 0; i < Object.keys(mSensors[number].fullData).length; i++){
//         // how to access timestamp for every value?
//         line.append(mSensorFullData.timestamp, mSensor.h);
//     }
//     line.append(new Date().getTime(), mSensor.data.h); 
//     chart.addTimeSeries(line, { strokeStyle: 'rgba(0, 255, 0, 1)',   lineWidth: 4 }); 
        
// }

// // Turning sensor timestamps into milliseconds from 1 jan 1970
// // which is the format which smoothieChart uses
// function timeConverter() {

//     var hours = new Date().getHours();
//     var minutes = new Date().getMinutes();
//     var seconds = new Date().getSeconds();
//     //console.log(hours+":"+minutes+":"+seconds);
//     console.log( new Date().getTime());
//     var tid = (hours+":"+minutes+":"+seconds);

//     var minutes = 1000 * 60;
//     var hours = minutes * 60;
//     var days = hours * 24;
//     var years = days * 365;

// }

