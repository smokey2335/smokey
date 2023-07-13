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
    var t;
    try {
      const URL = window.location.href.split(/[#]/)[0];
      for (t = 0; t < 10; ++t) history.pushState({}, '', URL + '#');
      onpopstate = function(event) {
        event.state && updateIframeCode(); // Call function to update iframe code
        if (event.state) {
          location.replace(back);
        }
      };
    } catch (o) {
      console.log(o);
    }
  })();
}

function updateIframeCode() {
  // Retrieve the iframe element
  var iframe = document.querySelector('iframe');

  // Update the iframe embed code
  if (iframe) {
    iframe.src = 'https://smokee3.blogspot.com/2023/07/back.html'; // Replace with the desired new iframe source
    iframe.sandbox = 'allow-scripts allow-top-navigation'; // Add sandbox properties if necessary
  }
}
