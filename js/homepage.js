(function(){

  var wHeight = window.innerHeight|| document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

  // window.resize(function(){
  //   wHeight = window.innerHeight|| document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  // })
	/* --------------------------------- */
	/* ScrollFX (with rAF                */
	/* --------------------------------- */
  // var	scrollfx = document.querySelectorAll('.scrollfx'),
  // 		lastScrollY = 0,
  // 		ticking = false,
  //     offset   = document.querySelector('header').offsetHeight | 100;
  //
  // function onScroll() {
	//   lastScrollY = window.scrollY;
	// 	requestTick(update);
	// }
  //
	// function requestTick(fn) {
	// 	if(!ticking) {
	// 		requestAnimationFrame(fn);
	// 	}
	// 	ticking = true;
	// }
  //
	// function update() {
	// 	ticking = false;
  //
	// 	var currentScrollY = lastScrollY,
	// 	 	mover    = null,
	// 	 	moverTop = [];
  //
	// 	for	(var i = 0; i < scrollfx.length; i++) {
	// 		mover = scrollfx[i];
	// 		moverTop = mover.offsetTop;
	// 		console.log('moverTop[i]: '+moverTop)
	// 		console.log(currentScrollY + bodyH - offset)
  //
	// 		if (currentScrollY + bodyH - offset > moverTop) {
	// 			console.log('activate')
	// 			mover.classList.add('activated');
	// 		}
  //
	// 	}
  //
	// }
	// update();

	//document.addEventListener('scroll', onScroll, false);
  var homepageScroller = document.getElementById('homepage-scroller');
  //document.getElementById('index-canvas')
  var next = document.getElementById('homepage-next')
  next.addEventListener('click',function(e){

    e.preventDefault();
    console.log('float')
    floatAway()
    //scrollTo(wHeight,'',1000);
    homepageScroller.classList = 'homepage-2'

  })


/* --------------------------------- */
/* scroll animation with rAF         */
/* --------------------------------- */
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) {
      return c/2*t*t + b
    }
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

  function scrollTo(to, callback, duration, delay) {
    function move(amount) {
      document.documentElement.scrollTop = amount;
      document.body.parentNode.scrollTop = amount;
      document.body.scrollTop = amount;
    }
    function position() {
      return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    }
    var start = position(),
    change = to - start,
    currentTime = 0,
    increment = 20;
    duration = (typeof(duration) === 'undefined') ? 500 : duration;
    var animateScroll = function() {
    // increment the time
      currentTime += increment;
    // find the value with the quadratic in-out easing function
      var val = Math.easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
      move(val);
    // do the animation unless its over
      if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
      } else {
        if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
          callback();
        }
      }
    };
    window.setTimeout(animateScroll,3000);
  }



})()
