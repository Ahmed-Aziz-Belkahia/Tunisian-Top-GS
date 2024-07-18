var options = {
    series: [{
      name: 'Revenue',
      data: [92, 64, 43, 80, 58, 92, 46, 76, 80]
    }, {
      name: 'Revenue',
      data: [20, 48, 69, 32, 54, 20, 66, 36, 32],
    },
  ],
  chart: {
    type: 'bar',
    offsetY: 30,
    toolbar: {
      show: false
    },
    height: 100,
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
      columnWidth: '55%',
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
    dataLabels: {
      enabled: true
    },
  },
  fill: {
    opacity: 1,
    colors: [CrocsAdminConfig.primary, '#dedffc']
  },
  legend: {
    show: false
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex,}) {
      return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Revenue' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
    },
  },
};
var chart = new ApexCharts(document.querySelector("#earning-chart"), options);
chart.render();
var options = {
    series: [{
      name: "Sales",
      data: [15, 25, 20, 35, 16, 18 , 10 , 22 , 18 , 25 , 17],
  }],
    chart: {
    type: 'area',
    height: 120,
    offsetY: 50,
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
      color: CrocsAdminConfig.secondary,
      opacity: 0.2,
    },
  },
  colors: [CrocsAdminConfig.secondary],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
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
      width: 2,
    },
    tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex,}) {
          return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Sales' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
        },
      },
  };
  var chart = new ApexCharts(document.querySelector("#sales-chart"), options);
  chart.render();
  var options = {
    series: [{
      name: "Desktops",
      data: [10, 35, 15, 78, 40, 60, 12, 60],
  }],
    chart: {
    type: 'area',
    height: 120,
    offsetY: 50,
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
      color: '#61AE41',
      opacity: 0.2,
    },
  },
  colors: ['#61AE41'],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
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
      curve: 'straight',
      width: 2,
    },
    tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex,}) {
          return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'customer' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
        },
      },
  };
  var chart = new ApexCharts(document.querySelector("#total-customer-chart"), options);
  chart.render();
  var income = {
    series: [80],
    chart: {
      type: 'radialBar',
      offsetY: 50,
      height: 180, 
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '55%',
        },
        track: {
          background: "#daeef7",
          strokeWidth: '120%',
        },
        dataLabels: {
          name: {
            show: false,
            color: 'var(--title)',
            fontSize: '17px',
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
          }
        }
      }
    },
    xaxis: {
    },
    stroke: {
      lineCap: 'round'
    },
    colors: ['#44A8D7'],
  };
  var IncomechrtchartEl = new ApexCharts(document.querySelector("#total-product-chart"), income);
  IncomechrtchartEl.render();
  var options1 = {
    chart: {
        height: 200,
        type: 'area',
        toolbar:{
          show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    series: [{
        name: 'series1',
        data: [0, 40, 25,80,35,40,38, 50, 35, 70, 50 , 100 , 0]
    }, {
        name: 'series2',
        data: [5, 50, 70,55,78,45,100, 80, 85, 60, 35 , 80 , 0]
    }],
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct" , "Nov" , "Dec" ,"jan"],
        labels: {
          style: {
            fontSize: "13px",
            colors: "#959595",
            fontFamily: "Lexend, sans-serif",
          },
        },
        axisBorder: {
          show: false
        },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return "$" + val + "k";
        },
        style: {
          fontSize: "14px",
          colors: "$black",
          fontWeight: 500,
          fontFamily: "Lexend, sans-serif",
        },
      },
    },
    grid: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    legend: {
      show: false,
    },
    fill: {
      colors: [ CrocsAdminConfig.primary , CrocsAdminConfig.secondary],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      },
    },
    colors:[ CrocsAdminConfig.primary , CrocsAdminConfig.secondary],
    tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex,}) {
          return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Visitors' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
        },
    },
  }
  var chart1 = new ApexCharts(
    document.querySelector("#area-line"),
    options1
  );
  chart1.render();
  var options = {
    series: [80, 55 , 44],
    chart: {
    type: 'donut',
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      donut: {
        size: "75%",
        labels: {
          show: true,
          name: {
            offsetY: -10,
          },
          value: {
            offsetY: -50,
          },
          total: {
            show: true,
            fontSize: "18px",
            fontFamily: "Outfit",
            fontWeight: 500,
            label: "Product Sales",
            color: "#959595",
            formatter: (w) => "14,937",
          },
        },
      },
      customScale: 1,
      offsetX: 0,
      offsetY: 0,
    },
  },
  grid: {
    padding: {
      bottom: -120
    }
  },
  colors: [ CrocsAdminConfig.primary , CrocsAdminConfig.secondary , "#61AE41"],
  responsive: [
    {
      breakpoint: 1800,
      options: {
        chart: {
          height: 392,
        },
      },
    },
    {
      breakpoint: 1601,
      options: {
        chart: {
          height: 350,
        },
      },
    },
    {
      breakpoint: 1401,
      options: {
        chart: {
          height: 275,
        },
      },
    },
  ],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  };
var chart = new ApexCharts(document.querySelector("#categories"), options);
chart.render();
var options = {
  series: [{
    name: "Product Sales",
    data: [5, 15, 65, 40, 39, 50, 35, 38, 47, 40 , 90, 58, 65, 70 , 75 , 70 , 67 , 30 , 69, 65, 75, 72, 65, 72, 95, 50 , 45 , 57 , 54 , 48 , 53 , 60 , 25, 30]
}],
  chart: {
  height: 270,
  type: 'area',
  zoom: {
    enabled: false
  },
  toolbar:{
    show: false,
  },  
},
dataLabels: {
  enabled: false
},
stroke: {
  curve: 'straight',
  width: 3,
},
colors:[ CrocsAdminConfig.primary ],
fill: {
  type: "gradient",
  gradient: {
    shadeIntensity: 1,
    opacityFrom: 0.4,
    opacityTo: 0.2,
    stops: [0, 100, 100]
  }
},
grid: {
  row: {
    colors: ['transparent'], // takes an array which will be repeated on columns
    opacity: 0.5
  },
},
xaxis: {
  categories: [' ', ' ', '12:00', ' ', ' ', ' ', '', ' ', '15:00' , ' ' , ' ' , ' ' , ' ' , ' ' , '18:00', ' ', ' ', ' ', ' ', ' ', '21:00', ' ', ' ' , ' ' , ' ' , ' ' , '03:00' , ' ' , ' ', ' ', ' ', ' ' , '04:00' , ' ' , ' ' ],
  labels: {
    style: {
      fontSize: "13px",
      colors: "#959595",
      fontFamily: "Lexend, sans-serif",
    },
  },
  axisBorder: {
    show: false
  },
},
yaxis: {
  labels: {
    formatter: function (val) {
      return "$" + val + "" + "k";
    },
    style: {
      fontSize: "14px",
      colors: "#171829",
      fontWeight: "500",
      fontFamily: "Lexend, sans-serif",
    },
  },
},
tooltip: {
  custom: function ({ series, seriesIndex, dataPointIndex,}) {
    return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Product Sales' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
  },
},
};
var chart = new ApexCharts(document.querySelector("#product-sales"), options);
chart.render();
// column chart
var options3 = {
  chart: {
    height: 285,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      endingShape: "rounded",
      columnWidth: "55%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 3,
    colors: ["transparent"],
  },
  series: [
    {
      name: "Sales Account",
      data: [162, 85, 26, 101, 185, 108, 157, 58, 26, 101, 102, 101],
    },
    {
      name: "General Leads",
      data: [117, 117, 83, 139, 56, 85, 117, 117, 83 ,139 , 56, 139],
    },
    {
      name: "Churn Rate",
      data: [31, 56, 164, 85, 128, 31, 31, 56, 164, 85, 128, 85],
    },
  ],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct" , "Nov" , "Dec"],
    axisBorder: {
      show: false
    },
    labels: {
      style: {
        fontSize: "13px",
        colors: "#959595",
        fontFamily: "Lexend, sans-serif",
      },
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
  colors: [CrocsAdminConfig.primary, CrocsAdminConfig.secondary, "#51bb25"],
};
var chart3 = new ApexCharts(document.querySelector("#report-chart"), options3);
chart3.render();