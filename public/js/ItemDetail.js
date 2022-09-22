renderProduct();

async function getProduct(id) {
  const response = await fetch(`/api/productos/${id}`, {
    method: "GET",
  });
  const product = await response.json();
  return product[0];
}

async function renderProduct() {
  try {
    const querystring = window.location.search;
    let id = new URLSearchParams(querystring).get("id");
    let item = await getProduct(id);

    const user = await getUser();
    const nav = await fetch("../views/partials/navBar.hbs");
    const navPlantilla = await nav.text();
    const navTemplate = Handlebars.compile(navPlantilla);
    document.getElementsByTagName("nav")[0].innerHTML = navTemplate({
      user: user.user,
    });

    const response = await fetch("../views/partials/ItemDetail.hbs");
    const plantilla = await response.text();
    const template = Handlebars.compile(plantilla);
    const html = template({ item, admin: user.admin == "true" });

    document.querySelector("#item-container").innerHTML = html;

    document
      .querySelector("#addToCart")
      .addEventListener("click", () => AddProductToCart(item));

    if (user.admin == "true") {
      document
        .getElementById("productFormPut")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const data = new URLSearchParams(
            new FormData(document.getElementById("productFormPut"))
          );
          await fetch(`/api/productos/${id}`, {
            method: "PUT",
            body: data,
          });
          await renderProduct();
        });
    }
  } catch (err) {
    console.log(err);
  }
}

async function AddProductToCart(item) {
  const responseUser = await fetch(`/api/user`, {
    method: "GET",
  });
  const user = await responseUser.json();

  const prods = await getProductsInCart(user);
  console.log(prods);

  const querystring = window.location.search;
  let id = new URLSearchParams(querystring).get("id");
  const data = new URLSearchParams({ id_prod: id });

  let filter = prods.filter((e) => e._id === id);

  if (!filter.length) {
    await fetch(`/api/carrito/${user.user.id_cart}/productos`, {
      method: "POST",
      body: data,
    });
  }
}

async function getProductsInCart(user) {
  try {
    const response = await fetch(
      `/api/carrito/${user.user.id_cart}/productos`,
      {
        method: "GET",
      }
    );
    const productos = await response.json();
    return productos;
  } catch (err) {
    console.log(err);
  }
}
