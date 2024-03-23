const limit = document.querySelector("#limit");
const tableBody = document.querySelector(".dashboard__main__table__tbody");
const listaBotones = document.querySelectorAll(".page-link");

listaBotones.forEach((element) => {
  element.addEventListener("click", async function (e) {
    console.log("elemento: ", e);
    const productos = await getProducts(e.target.text);
    console.log(productos);
    addProducts(productos);
  });
});

const getProducts = async (page) => {
  const response = await fetch(
    `http://${location.host}/api?limit=${limit.value}&page=${page}`
  );
  const products = await response.json();
  return products;
};

const addProducts = (products) => {
  const propiedades = ["id", "image", "name", "price"];

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  console.log("los productos", products);

  products.rows.forEach((element) => {
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
      tr.appendChild(td);
    });

    const td = document.createElement("td");
    td.classList.add("dashboard__main__table__tbody__buttons");
    const enlaceDetail = document.createElement("a");
    const enlaceUpdate = document.createElement("a");
    const buttonDelete = document.createElement("button");
    const iconoDetail = document.createElement("i");
    const iconoUpdate = document.createElement("i");
    const iconoDelete = document.createElement("i");

    enlaceDetail.href = `/products/detail/${element.id}`;
    enlaceUpdate.href = `/products/formEdit/${element.id}`;
    buttonDelete.addEventListener("click", function (e) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(
            `http://${location.host}/api/delete/${element.id}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            const row = document.querySelector(`#rowId${element.id}`);
            console.log("row: ", row);
            tableBody.removeChild(row);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ago salio mal!",
            footer: "Intenta en otro momento",
          });
        }
      });
    });
    buttonDelete.classList.add("eliminar");
    iconoDetail.classList.add("fa-solid");
    iconoDetail.classList.add("fa-eye");
    iconoUpdate.classList.add("fa-solid");
    iconoUpdate.classList.add("fa-pen-to-square");
    iconoDelete.classList.add("fa-solid");
    iconoDelete.classList.add("fa-trash");

    enlaceDetail.appendChild(iconoDetail);
    enlaceUpdate.appendChild(iconoUpdate);
    buttonDelete.appendChild(iconoDelete);

    td.appendChild(enlaceDetail);
    td.appendChild(enlaceUpdate);
    td.appendChild(buttonDelete);

    tr.id = `rowId${element.id}`;
    tr.appendChild(td);
    tr.classList.add('dashboard__main__table__tbody__fila');
    tableBody.appendChild(tr);
  });
};

// const user = decodeURIComponent(document.cookie);

// console.log(user);
// console.log(typeof user);
// const start = user.indexOf('{')
// const end = user.indexOf('}')
// const obj = user.slice(start, end + 1);
// console.log(obj);

// localStorage.setItem("user",obj);
// const example = localStorage.getItem('user')
// console.log(example)
