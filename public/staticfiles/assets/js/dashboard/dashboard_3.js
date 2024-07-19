var options = {
    series: [
      {
        name: "Earning",
        data: [78, 45, 60, 78, 78, 45, 25, 50 ,60, 60, 78, 40],
      },
      {
        name: "Expense",
        data: [-70, -70, -40, -30, -70, -30, -25, -45, -40, -50, -70, -50],
      },
    ],
    chart: {
      type: "bar",
      height: 316,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: [CrocsAdminConfig.primary, CrocsAdminConfig.secondary],
    plotOptions: {
      bar: {
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 10,
      colors: ["#fff"]
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
        labels: {
          formatter: function (val) {
            return + val ;
          },
          style: {
            fontSize: "14px",
            colors: "$black",
            fontWeight: 500,
            fontFamily: "Lexend, sans-serif",
          },
        },
      },
    xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct" , "Nov" , "Dec"],
    labels: {
        style: {
          fontSize: "13px",
          colors: "#959595",
          fontFamily: "Lexend, sans-serif",
        },
    },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1501,
        options: {
          chart: {
            height: 298,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "150%",
            },
          },
        },
      },
    ],
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex,}) {
        return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Revenue' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
      },
  },
  };
  var chart = new ApexCharts(document.querySelector("#revenue-chart"), options);
  chart.render();
$(".today-task table").on("click", ".remove", function (event) {
  var ndx = $(this).parent().index() + 1;
  $("tr", event.delegateTarget).remove(":nth-child(" + ndx + ")");
}); 
var options3 = {
  series: [
    {
      name: "Total",
      data: [10, 5, 10, 7, 40, 20, 30, 27, 40]
    },
  ],
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
  },
  colors: [CrocsAdminConfig.primary],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.2,
      stops: [0, 100, 100]
    }
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
    curve: "smooth",
  },
  grid: {
    show: false,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      show: false,
    },
    z: {
      show: false,
    },
    marker: {
      show: false,
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
    tooltip: {
      enabled: false,
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
};
var chart3 = new ApexCharts(document.querySelector("#monthlychart"), options3);
chart3.render();
function generateData(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
      var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
      series.push([baseval, y, z]);
      baseval += 86400000;
      i++;
  }
  return series;
}
var options = {
  chart: {
      height: 252,
      type: "bubble",
      toolbar: {
          show: false,
      },
  },
  dataLabels: {
      enabled: false,
  },
  series: [
      {
          name: "Product1",
          data: generateData(new Date("01 Jan 2023 GMT").getTime(), 20, {
              min: 20,
              max: 55,
          }),
      },
      {
          name: "Product2",
          data: generateData(new Date("01 Jan 2023 GMT").getTime(), 20, {
              min: 10,
              max: 55,
          }),
      },
      {
          name: "Product3",
          data: generateData(new Date("01 Jan 2023 GMT").getTime(), 20, {
              min: 10,
              max: 55,
          }),
      },
      {
          name: "Product4",
          data: generateData(new Date("01 Jan 2023 GMT").getTime(), 20, {
              min: 10,
              max: 55,
          }),
      },
  ],
  fill: {
      type: "gradient",
  },
  legend: {
      show: false,
  },
  xaxis: {
      tickAmount: 12,
      type: "datetime",
      labels: {
        rotate: 0,
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
          formatter: function (value) {
              return value ;
          },
          style: {
            fontSize: "14px",
            colors: "$black",
            fontWeight: 500,
            fontFamily: "Lexend, sans-serif",
          },
      },
  },
  theme: {
      palette: "palette2",
  },
  colors: [CrocsAdminConfig.primary, CrocsAdminConfig.secondary, "#61AE41"],
  tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          return '<ul class="p-2">' +
              '<li><b>Order</b>: ' + w.globals.labels[dataPointIndex] + '</li>' +
              '</ul>';
      }
  }
};
var chart = new ApexCharts(document.querySelector("#Statistics"), options);
chart.render();
var options = {
  series: [
    {
      name: "This Month ",
      type: "area",
      data: [215, 260, 360, 420, 320, 280, 360]
    },
    {
      name: "This Month",
      type: "area",
      data: [90, 130, 280, 350, 400, 350, 400],
    },
  ],
  chart: {
    height: 330,
    type: "area",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [3, 3],
    curve: "straight",
    dashArray: [0, 6],
  },
  colors: [ CrocsAdminConfig.secondary , CrocsAdminConfig.primary ],
  markers: {
    discrete: [{
      seriesIndex: 0,
      dataPointIndex: 0,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 1,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 2,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 3,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 4,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 5,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    {
      seriesIndex: 0,
      dataPointIndex: 6,
      fillColor: "#fff",
      strokeColor: CrocsAdminConfig.secondary,
      size: 5,
      shape: "circle"
    },
    ],
  },
  xaxis: {
    categories: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
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
    labels: {
      formatter: function (val) {
        return val + "" + "k";
      },
      style: {
        fontSize: "14px",
        colors: "$black",
        fontWeight: 500,
        fontFamily: "Lexend, sans-serif",
      },
    },
  },
  fill: {
    colors: [ CrocsAdminConfig.secondary , CrocsAdminConfig.primary ],
    type: ["gradient", "gradient"],
    gradient: {
      shade: "light",
      type: "vertical",
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100 , 0 , 0],
    },
  },
  grid: {
    borderColor: "#f1f1f1",
  },
  legend: {
    show: false,
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex,}) {
      return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Deliveries' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
    },
  },
};
var chart = new ApexCharts(document.querySelector("#company-viewchart"), options);
chart.render();
// lesson charts
function lessonCommonOption(data) {
  return {
    series: data.lessonYseries,
    chart: {
      type: "donut",
      height: 80,
      width: 80,
    },
    colors: data.color,
    legend: {
      show: false,
    },
    stroke: {
      width: 1,
      colors: "var(--white)",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              fontSize: "11px",
              fontFamily: "Rubik, sans-serif",
              fontWeight: 400,
              color: "#000",
              offsetY: -12,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              showAlways: false,
              label: "Total",
              fontSize: "11px",
              fontFamily: "Rubik, sans-serif",
            },
          },
        },
      },
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
  };
}
const lesson1 = {
  color: [
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    CrocsAdminConfig.primary,
    "#ced0fb",
    "#ced0fb",
    "#ced0fb",
  ],
  lessonYseries: [5, 5, 5, 5, 5, 5,5, 5, 5, 5, 5, 5],
};
const lessonactivechart1 = document.querySelector("#teamChart1");
if (lessonactivechart1) {
  var lessonChart1 = new ApexCharts(
    lessonactivechart1,
    lessonCommonOption(lesson1)
  );
  lessonChart1.render();
}
const lesson2 = {
  color: [
    CrocsAdminConfig.secondary,
    CrocsAdminConfig.secondary,
    CrocsAdminConfig.secondary,
    CrocsAdminConfig.secondary,
    CrocsAdminConfig.secondary,
    CrocsAdminConfig.secondary,
    CrocsAdminConfig.secondary,
    "#ffe0d1",
    "#ffe0d1",
    "#ffe0d1",
    "#ffe0d1",
    "#ffe0d1",
  ],
  lessonYseries: [5, 5, 5, 5, 5, 5,5, 5, 5, 5, 5, 5],
};
const lessonactivechart2 = document.querySelector("#teamChart2");
if (lessonactivechart2) {
  var lessonChart2 = new ApexCharts(
    lessonactivechart2,
    lessonCommonOption(lesson2)
  );
  lessonChart2.render();
}
const lesson3 = {
  color: [
    "#61AE41",
    "#61AE41",
    "#61AE41",
    "#61AE41",
    "#61AE41",
    "#61AE41",
    "#d0e7c6",
    "#d0e7c6",
    "#d0e7c6",
    "#d0e7c6",
    "#d0e7c6",
    "#d0e7c6",
  ],
  lessonYseries: [5, 5, 5, 5, 5, 5,5, 5, 5, 5, 5, 5],
};
const lessonactivechart3 = document.querySelector("#teamChart3");
if (lessonactivechart3) {
  var lessonChart3 = new ApexCharts(
    lessonactivechart3,
    lessonCommonOption(lesson3)
  );
  lessonChart3.render();
}
const lesson4 = {
  color: [
    "#F81F58",
    "#F81F58",
    "#F81F58",
    "#F81F58",
    "#F81F58",
    "#fdbccd",
    "#fdbccd",
    "#fdbccd",
    "#fdbccd",
    "#fdbccd",
    "#fdbccd",
    "#fdbccd",
  ],
  lessonYseries: [5, 5, 5, 5, 5, 5,5, 5, 5, 5, 5, 5],
};
const lessonactivechart4 = document.querySelector("#teamChart4");
if (lessonactivechart4) {
  var lessonChart4 = new ApexCharts(
    lessonactivechart4,
    lessonCommonOption(lesson4)
  );
  lessonChart4.render();
}