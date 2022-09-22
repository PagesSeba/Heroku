renderCart();

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

async function renderCart() {
  try {
    const user = await getUser();
    const nav = await fetch("../views/partials/navBar.hbs");
    const navPlantilla = await nav.text();
    const navTemplate = Handlebars.compile(navPlantilla);
    document.getElementsByTagName("nav")[0].innerHTML = navTemplate({
      user: user.user,
    });

    await renderProducts(user);
  } catch (err) {
    console.log(err);
  }
}

async function renderProducts(user) {
  let cart = await getProductsInCart(user);

  const response = await fetch("../views/partials/Cart.hbs");
  const itemCart = await fetch("../views/partials/ItemCart.hbs");
  Handlebars.registerPartial({
    ItemCart: await itemCart.text(),
  });
  const plantilla = await response.text();
  const template = Handlebars.compile(plantilla, {
    partials: Handlebars.partials,
  });
  const html = template({ cart });
  document.querySelector("#item-container").innerHTML = html;

  for (let i = 0; i < cart.length; i++) {
    const prod_id = cart[i]._id;
    document.getElementById(`${prod_id}`).addEventListener("click", () => {
      fetch(`/api/carrito/${user.user.id_cart}/productos/${prod_id}`, {
        method: "DELETE",
      }).then(() => {
        renderProducts(user);
      });
    });
  }
  // const carrito = JSON.stringify(cart);
  // console.log(carrito);
  const carrito = new URLSearchParams({ cart: JSON.stringify(cart) });
  document.getElementById("sendPedido").addEventListener("click", async () => {
    await fetch("/checkout", {
      method: "POST",
      body: carrito,
    });
  });
}
