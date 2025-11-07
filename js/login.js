const user = document.getElementById('usuario').value;
const pass = document.getElementById('password').value;
const loginForm = document.getElementById('loginForm');
const error = document.getElementById('errorMsg');

async function login(user, pass){
    const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user, pass})
    });

    if (res.ok) {
        localStorage.setItem('loginActivo', 'true');
        window.href.location = "administracion.html";
    }
    else {
        error.style.removeProperty = "display"
    }

    const data = res.json();
    sessionStorage.setItem("accessToken", data.token);
}

loginForm.addEventListener("click", login(user, pass))