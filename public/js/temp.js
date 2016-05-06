$(function () {
	$.getJSON('/monHumStats', function (data) {
		var month=[],temp_in=[],temp_out=[];
        for(i=0;i<data.length;i++){
        	month.push(data[i].month);
        	temp_in.push(data[i].temp_in);
        	temp_out.push(data[i].temp_out);
        }
		$('#container').highcharts({
        chart: {
            type: 'spline'       
            	},
        
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'comparing with outside and inside'
        },
        xAxis: {
            categories: month
        },
        yAxis: {
            title: {
                text: 'Temperature'
            },
            labels: {
                formatter: function () {
                    return this.value + '°';
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Outside',
            marker: {
                symbol: 'square'
            },
            data: temp_out

        }, {
            name: 'Inside',
            marker: {
                symbol: 'diamond'
            },
            data: temp_in
        }]
    });
   });
});

$(function () {
   $.getJSON('/getMonthStats', function (Pdata) {	
	$.getJSON('/threeWeaStats', function (Tdata) {
		var month=[],humid_out=[],temp_out=[];
        for(i=0;i<Tdata.length;i++){
        	month.push(Tdata[i].month);
        	humid_out.push(Tdata[i].humid_out);
        	temp_out.push(Tdata[i].temp_out);
        }
	
      $('#comcontainer').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Average Monthly Weather Data for tenant'
        },
        subtitle: {
            text: 'comparing weather and humidity with power'
        },
        xAxis: [{
            categories: month,
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
                    color: Highcharts.getOptions().colors[0]
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
            data: Pdata,
            tooltip: {
                valueSuffix: ' KW'
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

