renderProducts();

async function getProducts() {
  const response = await fetch(`/api/productos`, {
    method: "GET",
  });
  const productos = await response.json();
  return productos;
}

async function renderProducts() {
  try {
    const user = await getUser();
    const nav = await fetch("../views/partials/navBar.hbs");
    const navPlantilla = await nav.text();
    const navTemplate = Handlebars.compile(navPlantilla);
    document.getElementsByTagName("nav")[0].innerHTML = navTemplate({
      user: user.user,
    });
    const response = await fetch("../views/partials/ItemList.hbs");
    const item = await fetch("../views/partials/Item.hbs");
    Handlebars.registerPartial({
      Item: await item.text(),
    });
    const plantilla = await response.text();
    let products = await getProducts();
    const template = Handlebars.compile(plantilla, {
      partials: Handlebars.partials,
    });
    const html = template({ products, admin: user.admin == "true" });

    document.querySelector("#item-container").innerHTML = html;

    if (user.admin == "true") {
      document
        .getElementById("productForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const data = new URLSearchParams(
            new FormData(document.getElementById("productForm"))
          );
          await fetch("/api/productos", {
            method: "POST",
            body: data,
          });
          await renderProducts();
        });

      const items = document.getElementsByClassName("btnDelete");
      for (let i = 0; i < items.length; i++) {
        document
          .getElementById(items[i].id)
          .addEventListener("click", async () => {
            await fetch(`/api/productos/${items[i].id}`, {
              method: "DELETE",
            });
            await renderProducts();
          });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getUser() {
  const response = await fetch(`/api/user`, {
    method: "GET",
  });
  const user = await response.json();
  return user;
}
