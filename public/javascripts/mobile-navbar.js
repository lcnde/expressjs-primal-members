const cb = document.getElementById('menu-trigger');
cb.addEventListener('click', event => {
  // console.log(cb.checked);
  if (cb.checked === true) {
    document.body.classList.add('no-scrolling');
  } else {
    document.body.classList.remove('no-scrolling');
  };
});
