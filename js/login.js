const loginForm = document.getElementById('loginForm');
const error = document.getElementById('errorMsg');

async function login(username, password){
   

    try{
        const res = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('loginActivo', 'true');
            sessionStorage.setItem("accessToken", data.accessToken);
            console.log(data)
            window.location.href = "index.html";
            return;
        }

        error.style.display = "block";
        error.textContent = data.message || "Usuario o Contraseña incorrectos.";
    }
    catch(err){
        console.error(error)
        error.style.display = "block";
        error.textContent = "Error de red. Intenta más tarde."
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    
    error.style.display = "none";
    error.textContent = "";

    login(username, password)
});