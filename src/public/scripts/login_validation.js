window.addEventListener("load", function (e) {
  document.getElementById("loginform")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    if (username == "" || password == "") {
      alert("You must enter both a username and password");
      return false;
    }
    return true;
  });
});