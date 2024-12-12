window.addEventListener("load", function () {
  document.getElementById("registration")
  .addEventListener("submit", function (e) {
      e.preventDefault();

      let username = document.getElementById("username").value.trim();
      let email = document.getElementById("email").value.trim();
      let password = document.getElementById("password").value;
      let confirmPassword = document.getElementById("confirmPassword").value;

      if (!username || !email) {
        alert("Username and email are required.");
        return;
      }
      if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
      }
      if (!password || !confirmPassword) {
        alert("Password and confirmation are required.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      form.submit();
    });
});