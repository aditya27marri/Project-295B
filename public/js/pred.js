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

$(function () {
	  $.getJSON('/peopreStats', function (data) {
		  var usage1=[],usage2=[],usage3=[],other=[],ndate=[];
		    var startDate = new Date();
		    for(var i = 0; i <= 7; i++) {
		        var currentDate = new Date();
		        currentDate.setDate(startDate.getDate() + i);
		        ndate.push(DayAsString(currentDate.getDay()) + ", " + currentDate.getDate() + " " + MonthAsString(currentDate.getMonth()) + " " + currentDate.getFullYear());
		    }
		    function MonthAsString(monthIndex) {
		        var d=new Date();
		        var month=new Array();
		        month[0]="January";
		        month[1]="February";
		        month[2]="March";
		        month[3]="April";
		        month[4]="May";
		        month[5]="June";
		        month[6]="July";
		        month[7]="August";
		        month[8]="September";
		        month[9]="October";
		        month[10]="November";
		        month[11]="December";
		        
		        return month[monthIndex];
		    }

		    function DayAsString(dayIndex) {
		        var weekdays = new Array(7);
		        weekdays[0] = "Sunday";
		        weekdays[1] = "Monday";
		        weekdays[2] = "Tuesday";
		        weekdays[3] = "Wednesday";
		        weekdays[4] = "Thursday";
		        weekdays[5] = "Friday";
		        weekdays[6] = "Saturday";
		        
		        return weekdays[dayIndex];
		    }
	      console.log("other data"+JSON.stringify(data));
	      var j=0,k=0,f=0,g=0;
		  for(i=0;i<data.length;i++){
	      	if(data[i].x<7 && j<8){
	      		other[j]=data[i].y+3.75;
	      		j++;
	      	}else if(data[i].x<8 && k<8){
	      		usage1[k]=data[i].y+0.3;
	      		k++;
	      	}else if(data[i].x<9 && f<8){
	      		usage2[f]=data[i].y+1.35;
	      		f++;
	      	}else if(data[i].x<10 && g<8){
	      		usage3[g]=data[i].y+2.28;
	      		g++;
	      	}
	      }
	      console.log("otherpre"+other);
	      console.log("otherpre"+usage1);
	      console.log("otherpre"+usage2);
	      console.log("otherpre"+usage3);
	    $('#peoprecontainer').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: 'Cost predicition based on people'
	        },
	        subtitle: {
	            text: 'Next seven days cost based on number of people'
	        },
	        xAxis: {
	            categories: ndate,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Cost ($)'
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f} $</b></td></tr>',
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