document.addEventListener("DOMContentLoaded", function()
{



    window.setCourseDetails = function (type) {
        const devSelected = type === "dev";
        const tradeSelected = type === "trade";
        const coursesContainer = document.querySelector(".courses-container");
    
        if (!coursesContainer) return;
    
        if (devSelected || tradeSelected) {
          const courseDetailsHTML = `
            <div class="details-wrapper">
              <div class="details">
                <div class="details-container">
                  <button class="goBack">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg>
                    Go Back
                  </button>
                  <div class="details-title">
                    <span>Money Making From Trading</span>
                    <span>700DT/ Monthly</span>
                  </div>
                  <div class="details-content">
                    <div class="details-access">
                      <p>You will Get Access to:</p>
                      <p style="text-align: start;">
                        Gain access to an extensive library of over 50 video courses and carefully organized tutorials, encompassing topics ranging from the basics of contemporary trading to specialized, profit-generating strategies.
                      </p>
                    </div>
                    <div class="details-features">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; Simple-step-by-step tutorials
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; Easy-to-follow program for financial success
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; Community chat groups
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; No experience Needed
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; Live Trade , Market News
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; 2 wealth creation methods
                      </span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>&nbsp; Super advanced learning Platform
                      </span>
                    </div>
                  </div>
                  <div class="details-footer">
                    <a href="/course-detail/crypto-and-trading-masterclass/"><div class="details-button"><span>Get Started Now</span></div></a>
                    <div class="students">
                      <div>
                        <img src="../static/assets/studentsImg.png" alt="devimg" width="200" height="200" />
                      </div>
                      <div>
                        <span>Join 100+ students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
          coursesContainer.innerHTML = courseDetailsHTML;
          document.querySelector(".goBack").addEventListener("click", function () {
            coursesContainer.innerHTML = `
              <div class="courses-container">
                <div class="cr-container" onclick="setCourseDetails('trade')">
                  <div class="cr-content">
                    <span class="h2-text">Money Making From Trading</span>
                    <div class="cr-learn-more">
                      <span class="p-text">
                        Learn More &nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="move-right" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16"></path><path d="M2 12H22"></path></svg>
                      </span>
                    </div>
                  </div>
                  <div class="cr-images">
                    <img src="/static/assets/trade-img.png" alt="tradeimg" width="480" height="269" />
                  </div>
                </div>
                <div class="cr-container not-allowed">
                  <div class="cr-content">
                    <span class="h2-text">The Development Journey</span>
                    <div class="cr-learn-more">
                      <span class="p-text">
                        Learn More &nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="move-right" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16"></path><path d="M2 12H22"></path></svg>
                      </span>
                    </div>
                  </div>
                  <div class="cr-images">
                    <img src="/static/assets/dev-img.png" alt="devimg" width="480" height="269" />
                  </div>
                </div>
              </div>`;
          });
        }
      };

	  var swiper = new Swiper(".mySwiper", {
		slidesPerView: 6,
		grid: {
		  rows: 2,
		},
		spaceBetween: 30,
		loop: true,

		navigation: {
		  nextEl: ".swiper-button-next",
		  prevEl: ".swiper-button-prev",
		},
		grabCursor: true,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		  },
	  });
});