document.addEventListener("DOMContentLoaded", function()
{

	var scrollToTopBtn= document.getElementById("scrollToTopBtn");

	window.onscroll=
	function()
	{
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)
		{
			scrollToTopBtn.classList.add("show");
		}
		else
		{
			scrollToTopBtn.classList.remove("show");
		}
	};

	scrollToTopBtn.addEventListener("click", function()
	{
		window.scrollTo(
		{
			top: 0,
			behavior: 'smooth'
		});
	});

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
                    <div class="details-button"><span>Get Started Now</span></div>
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

	const slider= document.getElementById("slider");
	const reverseSlider= document.getElementById("reverseSlider");

	const onScroll = () =>
	{
		const scrollPosition = window.scrollY ;
		slider.style.transform= `translateX(-${scrollPosition/65}%)`;
		reverseSlider.style.transform= `translateX(-${scrollPosition/45}%)`;
	};

	window.addEventListener('scroll', () =>
	{
		requestAnimationFrame(onScroll);
	});

	lightGallery(document.getElementById('sliderContainer'),
	{
		selector: '.sliderImage'
	});

	lightGallery(document.getElementById('reverseSliderContainer'),
	{
		selector: '.sliderImage'
	});

	let isDown= false;
	let startX;
	let scrollLeft;

	slider.addEventListener('mousedown', (e) =>
	{
		isDown= true;
		startX= e.pageX - slider.offsetLeft;
		scrollLeft= slider.scrollLeft;
	});

	slider.addEventListener('mouseleave', () =>
	{
		isDown= false;
	});

	slider.addEventListener('mouseup', () =>
	{
		isDown= false;
	});

	slider.addEventListener('mousemove', (e) =>
	{
		if (!isDown) return;
		e.preventDefault();
		const x= e.pageX - slider.offsetLeft;
		const walk=(x - startX) * 3;
		slider.scrollLeft= scrollLeft - walk;
	});

	reverseSlider.addEventListener('mousedown', (e) =>
	{
		isDown= true;
		startX= e.pageX - reverseSlider.offsetLeft;
		scrollLeft= reverseSlider.scrollLeft;
	});

	reverseSlider.addEventListener('mouseleave', () =>
	{
		isDown= false;
	});

	reverseSlider.addEventListener('mouseup', () =>
	{
		isDown= false;
	});

	reverseSlider.addEventListener('mousemove', (e) =>
	{
		if (!isDown) return;
		e.preventDefault();
		const x= e.pageX - reverseSlider.offsetLeft;
		const walk=(x - startX) * 3;
		reverseSlider.scrollLeft= scrollLeft - walk;
	});

	const addMouseDragFunctionality=(element) =>
	{
		let isDown= false;
		let startX;
		let scrollLeft;

		element.addEventListener('mousedown', (e) =>
		{
			isDown= true;
			element.classList.add('active');
			startX= e.pageX - element.offsetLeft;
			scrollLeft= element.scrollLeft;
		});

		element.addEventListener('mouseleave', () =>
		{
			isDown= false;
			element.classList.remove('active');
		});

		element.addEventListener('mouseup', () =>
		{
			isDown= false;
			element.classList.remove('active');
		});

		element.addEventListener('mousemove', (e) =>
		{
			if (!isDown) return;
			e.preventDefault();
			const x= e.pageX - element.offsetLeft;
			const walk=(x - startX) * 3;
			element.scrollLeft= scrollLeft - walk;
		});
	};

	addMouseDragFunctionality(slider);
	addMouseDragFunctionality(reverseSlider);

});