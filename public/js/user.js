async function getUser() {
  const response = await fetch(`/api/user`, {
    method: "GET",
  });
  const user = await response.json();
  return user;
}
