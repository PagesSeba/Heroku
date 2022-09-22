document
  .getElementById("formRegister")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      let urlAvatar;
      const dataAvatar = new FormData(document.getElementById("updateAvatar"));
      const formDataObj = {};
      dataAvatar.forEach((value, key) => (formDataObj[key] = value));
      if (formDataObj.avatar.name != "") {
        const response = await fetch("/register/upload", {
          method: "POST",
          body: dataAvatar,
        });
        urlAvatar = await response.text();
      } else {
        urlAvatar = "default.png";
      }

      const dataForm = document.getElementsByClassName("form-control");
      const datos = {};
      for (let i = 0; i < dataForm.length; i++) {
        datos[dataForm[i].name] = dataForm[i].value;
      }
      const cart = await newCart();
      const data = new URLSearchParams({
        ...datos,
        avatar: urlAvatar,
        id_cart: cart._id,
      });
      let res = await fetch("/register", {
        method: "POST",
        body: data,
      });
      if (res.status == 200) window.location.reload();
    } catch (error) {
      console.log(error);
    }
  });

async function newCart() {
  try {
    const response = await fetch("/api/carrito", {
      method: "POST",
    });
    const cart = await response.json();
    return cart;
  } catch (error) {
    console.log(error);
  }
}
