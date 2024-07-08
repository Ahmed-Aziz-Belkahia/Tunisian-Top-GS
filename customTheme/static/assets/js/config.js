(function () {
  var primary = localStorage.getItem("primary") || "#5C61F2";
  var secondary = localStorage.getItem("secondary") || "#FF9766";

  window.CrocsAdminConfig = {
    // Theme Primary Color
    primary: primary,
    // theme secondary color
    secondary: secondary,
  };
})();
