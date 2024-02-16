(() => {
  navigator.serviceWorker.register('/sw.js');
  getData();
  addListeners();
})();

function getData() {
  //fetch some data then add it to #datalist on the page.
  let url = 'https://random-data-api.com/api/v2/users?size=10';
  fetch(url)
    .then((resp) => {
      if (!resp.ok) throw new Error('Failed to fetch data');
      return resp.json();
    })
    .then((data) => {
      let html = data
        .map(({ uid, first_name, last_name, email }) => {
          return `<li data-ref="${uid}">
          <h3>${first_name} ${last_name}</h3>
          <p>${email}</p>
        </li>`;
        })
        .join('');
      document.getElementById('datalist').innerHTML = html;
    });
}

function addListeners() {
  document.querySelector('main h2').addEventListener('click', (ev) => {
    getData();
  });
}
