// time
function startTime() {
  var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    // var s = today.getSeconds();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    m = checkTime(m);
    // s = checkTime(s);
    document.getElementById("txt").innerHTML = h + ":" + m + " " + ampm;
    var t = setTimeout(startTime, 500);
  }
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }
  var options = {
    series: [{
      name: "Earnings",
      data: [25, 16, 27, 22, 22, 18 , 22 , 12 , 16 , 16 , 30 , 22 , 32],
  }],
    chart: {
    type: 'area',
    height: 203,  
    offsetY: -30,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    }, 
    dropShadow: {
      enabled: true,
      top: 5,
      left: 0,
      bottom: 3,
      blur: 2,
      color: CrocsAdminConfig.primary,
      opacity: 0.2,
    },
  },
  colors: [CrocsAdminConfig.primary],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.2,
      stops: [0, 100, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    show: false,
  },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
        discrete: [{
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: CrocsAdminConfig.primary,
            strokeColor: "#fff",
            size: 6,
            shape: "circle"
        },
      ],
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex,}) {
        return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Project Created' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
      },
    },
  };
  var chart = new ApexCharts(document.querySelector("#Earnings-chart"), options);
  chart.render();
  var options = {
    series: [{
      name: 'Earning',
      data: [92, 64, 43, 80, 58, 92, 46, 76]
    }, {
      name: 'Earning',
      data: [20, 48, 69, 32, 54, 20, 66, 36],
    },
  ],
  chart: {
    type: 'bar',
    offsetY: -10,
    toolbar: {
      show: false
    },
    height: 203,
    stacked: true,
  },
   states: {          
    hover: {
      filter: {
        type: 'darken',
        value: 1,
      }
    }           
  },
  plotOptions: {
    bar: {
      horizontal: false,
      s̶t̶a̶r̶t̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
      e̶n̶d̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
      borderRadius: 3,
      columnWidth: '35%',            
    }
  }, 
  dataLabels: {
    enabled: false
  },
  grid: {
    yaxis: {
      lines: {
        show: false
      }
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  fill: {
    opacity: 1,
    colors: [CrocsAdminConfig.secondary, '#F2F5FA']
  },
  legend: {
    show: false
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex,}) {
      return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Expenses' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
    },
  },
};
var chart = new ApexCharts(document.querySelector("#Expenses-chart"), options);
chart.render();
  var options = {
    series: [{
    name: 'TEAM A',
    type: 'column',
    data: [190 ,, 240, , 270, , 220, , 190, , 250, , 250, , 270, , 240]
  },{
    name: 'TEAM B',
    type: 'area',
    data: [220 , 195, 280, 180, 250, 195, 250, 170, 290 , 190 , 220 , 190 , 230 , 250 , 190 , 225 , 225]
  }],
    chart: {
    height: 315,
    type: 'area',
    stacked: false,
    toolbar: {
      show: false,
    }
  },
  stroke: {
    width: [0, 2, 5],
    curve: 'stepline'
  },
  plotOptions: {
    bar: {
      columnWidth: '50px'
    }
  },
  colors: [ '#bebebe' , CrocsAdminConfig.primary],
  dropShadow: {
    enabled: true,
    top: 5,
    left: 6,
    bottom: 5,
    blur: 2,
    color: CrocsAdminConfig.primary,
    opacity: 0.5,
  },
  fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },    
  grid :{
    xaxis: {
      lines: {
        show: true,
      }
    },
    yaxis: {
      lines: {
        show: true,
      }
    },
  },
  xaxis: {
    categories: ["Jan", "", "feb", "", "Mar", "", "Apr", "", "May", "", "Jun" ,"" , "July" , "" , "Aug" , "" , "Sep"],
    labels: {
      style: {
          fontFamily: 'Lexend, sans-serif',
          fontWeight: 600,
          colors: '#959595',
      },
    },
    axisBorder: {
      show: false
    },
  },
  dataLabels: {
    enabled: false,
  },
    yaxis: {
      labels: {
        style: {
            fontFamily: 'Lexend, sans-serif',
            fontWeight: 600,
            colors: '#171829',
        },
      },
    },
  legend:{
    show: false,
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex,}) {
      return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Growth' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
    },
  },
  };
  var chart = new ApexCharts(document.querySelector("#growth-chart"), options);
  chart.render();
    // overview chart
    var optionsoverview = {
      series: [
        {
          name: "Earning",
          type: "area",
          data: [55, 44, 47, 44, 50, 50, 55, 45, 32, 50, 60, 32, 38, 45, 40, 40, 50],
        },
        {
          name: "Order",
          type: "line",
          data: [54, 64, 40, 50, 60, 80, 60, 70, 62, 50, 45, 40, 60, 65 , 70],
        },
      ],
      chart: {
        height: 250,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 4,
          blur: 4,
          color: "#000",
          opacity: 0.08,
        },
      },
      stroke: {
        width: [2, 2],
        curve: "smooth",
        dashArray: [0, 8]
      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      colors: ["#7064F5", "#FF9766"],
      fill: {
        type: ["gradient" , "solid"],
        gradient: {
          shade: "light",
          type: "vertical",
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Aug",
        "Sep",
      ],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: "#7064F5",
            strokeColor: "var(--white)",
            size: 5,
            sizeOffset: 3,
          },
        ],
        hover: {
          size: 5,
          sizeOffset: 0,
        },
      },
      xaxis: {
        type: "category",
        tickAmount: 4,
        tickPlacement: "between",
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          color: "var(--chart-border)",
        },
        axisTicks: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      responsive: [
        {
          breakpoint: 1200,
          options: {
            chart: {
              height: 250,
            },
          },
        },
      ],
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex,}) {
          return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Earnings :' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
        },
      },
    };
    var chartoverview = new ApexCharts(
      document.querySelector("#orderoverview"),
      optionsoverview
    );
    chartoverview.render();
    // bar overview chart
  var optionsorder = {
    series: [
      {
        name: "Revenue",
        data: [ 72, 72, 63, 62, 66, 66, 66, 64, 51, 51, 64, 65, 38, 38, 36, 36, 55, 55, 50, 50, 32, 32, 50, 50, 70, 70, 62, 62, 48, 48, 57, 57, 63, 63, 75, 75, 58, 58, 72, 72, 58, 58, 72, 72, 112, 112 , 72, 72, 63, 62, 66, 66, 66, 64, 51, 51, 64, 65, 38, 38, 36, 36, 115, 115],
      },
    ],
    chart: {
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    colors: ["var(--light-bg)"],
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      opacity: 0.7,
    },
    tooltip: {
      enabled: false,
    },
    states: {
      normal: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
        },
      },
    },
    responsive: [
      {
        breakpoint: 405,
        options: {
          chart: {
            height: 150,
          },
        },
      },
    ],
  };
  var chartorder = new ApexCharts(
    document.querySelector("#order-bar"),
    optionsorder
  );
  chartorder.render();
