const limit = document.querySelector("#limit");
const tableBody = document.querySelector(".dashboard__main__table__tbody");

const getProducts = async (page) => {
  const response = await fetch(
    `${location.host}/api?limit=${limit.value}&page=${page}`
  );
  const products = await response.json();
  return products;
};

const addProducts = (products) => {
  const propiedades = ["id", "image", "name", "price"];

  while (tableBody.firstChild) {
    node.removeChild(tableBody.firstChild);
  }

  products.forEach((element) => {
    const tr = document.createElement("tr");
    propiedades.forEach((prop) => {
      const td = document.createElement("td");
      if (prop == "image") {
        const img = document.createElement("img");
        img.src = `/img/${element[prop]}`;
        img.alt = element[prop];
        td.appendChild(img);
      } else {
        td.innerText = element[prop];
      }
    });
    tr.appendChild(td);
  });
  tableBody.appendChild(tr);
};

sessionStorage.setItem("user","Julian Aquino");
localStorage.setItem("user","Julian Aquino");

console.log("cookies: ",document.cookie);