$(function () {
    $.getJSON('/getDayStats', function (data) {
        console.log("data:"+data);
        $('#container').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Electricity bills around the year'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'cost per day'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Dollars',
                data: data
            }]
        });
    });
});


$(function () {
	 $.getJSON('/getMonthStats', function (data) {
		 console.log("barr data:"+data);
    $('#barcontainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Usage'
        },
        subtitle: {
            text: 'Electricity usage'
        },
        xAxis: {
            categories: [
'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct',
'Nov', 'Dec','Jan', 'Feb', 'Mar', 'Apr'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Kwatts'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} KW</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Usage',
            data: data

        }]
    });
  });
});
$(function () {
    $.getJSON('/preCost', function (data) {

        $('#precontainer').highcharts({

            chart: {
                type: 'arearange',
                zoomType: 'x'
            },

            title: {
                text: 'Electricity bill in 2015-16 and predicted value in 2016-17'
            },

            xAxis: {
                type: 'datetime'
            },

            yAxis: {
                title: {
                    text: null
                }
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '$'
            },

            legend: {
                enabled: false
            },

            series: [{
                name: 'Electricity bill in  predicted-past',
                data: data
            }]

        });
    });

});


$(function () {
	$.getJSON('/getMonthStats', function (predata) {
	 $.getJSON('/monthStats', function (data) {
	        console.log("predata:"+predata);
	        console.log("data:"+data);
			    
       $('#prebcontainer').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Average Monthly power consumption and prediction'
        },
        subtitle: {
            text: 'For year 2015-16 and 2016-17'
        },
        xAxis: [{
            categories: [ 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct',
                 'Nov', 'Dec','Jan', 'Feb', 'Mar', 'Apr'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}KW',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Past Usage ',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Predicted Usage',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} KW',
                style: {
                    color: Highcharts.getOptions().colors[0]
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
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'Past Usage',
            type: 'column',
            yAxis: 1,
            data: predata,
            tooltip: {
                valueSuffix: ' KW'
            }

        }, {
            name: 'Predicted Usage',
            type: 'spline',
            data: data,
            tooltip: {
                valueSuffix: 'Kw'
            }
        }]
    });
   });
   });	 
});

$(function () {
  $.getJSON('/peoStats', function (data) {
	  var usage1=[],usage2=[],usage3=[],other=[];
      console.log("other data"+JSON.stringify(data));
      var j=0,k=0,f=0,g=0;
	  for(i=0;i<data.length;i++){
      	if(data[i].people===1){
      		other[j]=data[i].tusage;
      		j++;
      	}else if(data[i].people===2){
      		usage1[k]=data[i].tusage;
      		k++;
      	}else if(data[i].people===3){
      		usage2[f]=data[i].tusage;
      		f++;
      	}else if(data[i].people===4){
      		usage3[g]=data[i].tusage;
      		g++;
      	}
      }
      console.log("other"+other);
      console.log("other"+usage1);
      console.log("other"+usage2);
      console.log("other"+usage3);
    $('#peocontainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Power Consumpition based on people'
        },
        subtitle: {
            text: 'every month based on number of people'
        },
        xAxis: {
            categories: [
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
                'Jan',
                'Feb',
                'Mar',
                'Apr',
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Usage (KW)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} KW</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '2 People',
            data:  usage1
        }, {
            name: '3 people',
            data: usage2
        }, {
            name: '4 people',
            data: usage3
        }, {
            name: 'other',
            data: other
        }]
    });
  });
 });

