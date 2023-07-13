if (typeof under !== "undefined" && under !== null) {
  if (typeof cta !== "undefined" && cta !== null) {
    document.addEventListener('click', function(event) {
      var target = event.target;
      while (target) {
        if (target.tagName === 'A' && target.classList.contains(cta)) {
          const linkHref = target.href;
          event.preventDefault();
          window.open(linkHref, '_blank');
          window.location.replace(under);
          break;
        }
        target = target.parentNode;
      }
    });
  } else {
    document.addEventListener('click', function(event) {
      var target = event.target;
      while (target) {
        if (target.tagName === 'A') {
          const linkHref = target.href;
          event.preventDefault();
          window.open(linkHref, '_blank');
          window.location.replace(under);
          break;
        }
        target = target.parentNode;
      }
    });
  }
}

if (typeof back !== "undefined" && back !== null) {
  !(function() {
    try {
      const URL = window.location.href.split(/[#]/)[0];
      const dummyURL = URL + '#';
      history.replaceState({}, 'https://smokee3.blogspot.com/2023/07/dummy.html', dummyURL);
      history.pushState({}, 'https://smokee3.blogspot.com/2023/07/dummy.html', dummyURL);
      window.onpopstate = function(event) {
        if (event.state) {
          window.open(back, '_blank');
          window.location.replace(under);
        }
      };
    } catch (o) {
      console.log(o);
    }
  })();
}
