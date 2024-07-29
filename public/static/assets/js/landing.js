(function ($) {
  "use strict";
  // localstorage all setting
  $(".page-wrapper").attr("class", localStorage.getItem("page-wrapper"));
  // dubai layout
  $(".default-view").click(function () {
    localStorage.setItem("page-wrapper", "compact-wrapper");
  });
  $(".los-view").click(function () {
    localStorage.setItem("page-wrapper", "horizontal-wrapper material-type");
  });
  $(".paris-view").click(function () {
    localStorage.setItem("page-wrapper", "compact-wrapper dark-sidebar");
  });
  $(".tokyo-view").click(function () {
    localStorage.setItem("page-wrapper", "compact-sidebar");
  });
  $(".moscow-view").click(function () {
    localStorage.setItem("page-wrapper", "compact-sidebar compact-small");
  });
  $(".singapore-view").click(function () {
    localStorage.setItem("page-wrapper", "horizontal-wrapper enterprice-type");
  });
  $(".newyork-view").click(function () {
    localStorage.setItem("page-wrapper", "compact-wrapper box-layout");
  });
  $(".barcelona-view").click(function () {
    localStorage.setItem(
      "page-wrapper",
      "horizontal-wrapper enterprice-type advance-layout"
    );
  });
  $(".madrid-view").click(function () {
    localStorage.setItem("page-wrapper", "compact-wrapper color-sidebar");
  });
  $(".rome-view").click(function () {
    localStorage.setItem(
      "page-wrapper",
      "compact-sidebar compact-small material-icon"
    );
  });
  $(".seoul-view").click(function () {
    localStorage.setItem("compact-wrapper modern-type");
  });
  $(".landon-view").click(function () {
    localStorage.setItem("page-wrapper", " only-body");
  });
  $(".prooduct-details-box .close").on("click", function (e) {
    var tets = $(this).parent().parent().parent().parent().addClass("d-none");
    console.log(tets);
  });
  $(".bg-center").parent().addClass("b-center");
  $(".bg-img-cover").parent().addClass("bg-size");
  $(".bg-img-cover").each(function () {
    var el = $(this),
      src = el.attr("src"),
      parent = el.parent();
    parent.css({
      "background-image": "url(" + src + ")",
      "background-size": "cover",
      "background-position": "center",
      display: "block",
    });
    el.hide();
  });
  //landing header //
  $(".toggle-menu").click(function(){
    $('.landing-menu').toggleClass('open');
  });   
  $(".menu-back").click(function(){
    $('.landing-menu').toggleClass('open');
  });  
  $(".md-sidebar-toggle").click(function(){
    $('.md-sidebar-aside').toggleClass('open');
  });
})(jQuery);