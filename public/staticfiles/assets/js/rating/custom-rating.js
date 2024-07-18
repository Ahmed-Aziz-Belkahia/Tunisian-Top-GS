// star rating

let startsbox = document.querySelectorAll(".starbox");
startsbox.forEach((box) => {
  let stars = box.querySelectorAll("svg");
  stars.forEach((star, index, arr) => {
    star.addEventListener("click", function () {
      let current = index;
      arr.forEach((_star, _index) => {
        if (_index <= current) {
          _star.style.fill = "#FFAA05";
        } else {
          _star.style.fill = "rgba(82, 82, 108, 0.8)";
        }
      });
    });
  });
});
