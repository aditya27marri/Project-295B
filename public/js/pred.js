$(function () {
	   $.getJSON('/tempPreStats', function (data) {	
		   $.getJSON('/forcastWeat', function (wedata) {
			var humid_out=[],temp_out=[],tdate=[];
			//var wedata=JSON.parse(redata.body);
			console.log("wedata date"+JSON.stringify(wedata.list[0].dt));
			for(i in wedata.list){
				var d = new Date();
				var o='000';
				 d = (wedata.list[i].dt);
				 d=d*1000;
				 var t =new Date(d);
			    console.log("tadate"+t);
				tdate[i]= t;
				if(i=4){
					humid_out.push(70+i);
				}else if(i=5){
					humid_out.push(70+i-3)
				}else if(i=6){
					humid_out.push((10*i)+i);					
				}else{
					humid_out.push(JSON.stringify(wedata.list[i].humidity));
				}
	        	temp_out.push(Math.round((9/5)*(wedata.list[i].temp.max - 273) + 32+10));
	        }
		    console.log("tadate"+tdate);
		    console.log("humid_out"+humid_out);
		    console.log("temp_out"+temp_out);
	      $('#tpcontainer').highcharts({
	        chart: {
	            zoomType: 'xy'
	        },
	        title: {
	            text: 'PREDICITION FOR NEXT SEVEN DAYS'
	        },
	        subtitle: {
	            text: 'Combining weather and humidity to predicit power usage'
	        },
	        xAxis: [{
	            categories: tdate,
	            crosshair: true
	        }],
	        yAxis: [{ // Primary yAxis
	            labels: {
	                format: '{value}°C',
	                style: {
	                    color: Highcharts.getOptions().colors[2]
	                }
	            },
	            title: {
	                text: 'Temperature',
	                style: {
	                    color: Highcharts.getOptions().colors[2]
	                }
	            },
	            opposite: true

	        }, { // Secondary yAxis
	            gridLineWidth: 0,
	            title: {
	                text: 'Power',
	                style: {
	                    color: Highcharts.getOptions().colors[6]
	                }
	            },
	            labels: {
	                format: '{value} KW',
	                style: {
	                    color: Highcharts.getOptions().colors[0]
	                }
	            }

	        }, { // Tertiary yAxis
	            gridLineWidth: 0,
	            title: {
	                text: 'Humidity',
	                style: {
	                    color: Highcharts.getOptions().colors[1]
	                }
	            },
	            labels: {
	                format: '{value} %',
	                style: {
	                    color: Highcharts.getOptions().colors[1]
	                }
	            },
	            opposite: true
	        }],
	        tooltip: {
	            shared: true
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'left',
	            x: 80,
	            verticalAlign: 'top',
	            y: 55,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
	        },
	        series: [{
	            name: 'Electrcity',
	            type: 'column',
	            yAxis: 1,
	            data: data,
	            tooltip: {
	                valueSuffix: ' KW'
	            },style: {
                    color: '#8F876D'
                }

	        }, {
	            name: 'Humidity',
	            type: 'spline',
	            yAxis: 2,
	            data: humid_out,
	            marker: {
	                enabled: false
	            },
	            dashStyle: 'shortdot',
	            tooltip: {
	                valueSuffix: ' %'
	            }

	        }, {
	            name: 'Temperature',
	            type: 'spline',
	            data: temp_out,
	            tooltip: {
	                valueSuffix: ' °C'
	            }
	        }]
	    });
	   });
	  });	
	});

