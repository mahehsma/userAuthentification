$(document).ready(() => {
  $("#form").submit((event) => {
    event.preventDefault();
    var username = document.getElementById("inputUsername4").value;
    var password = document.getElementById("inputPassword4").value;

    $.post(
      "http://localhost:3000/signin",
      {
        username: username,
        password: password,
      },
      (data, status) => {
        console.log(data.token + ", " + status);
        localStorage.setItem("token", data.token);
      }
    );
  });
});
