    function login() {
      const username = document.getElementById("username").value;
      // Save username to sessionStorage
      sessionStorage.setItem("username", username);
      // Redirect to home page
      window.location.href = "index.html";
    }
