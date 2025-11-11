const loginForm = document.getElementById('loginForm');
const error = document.getElementById('errorMsg');

// usuario: "admin"
// password: "1234"

async function login(username, password){
    try{
        const res = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();
        console.log(data)
        if (res.ok) {
            localStorage.setItem('loginActivo', 'true');
            sessionStorage.setItem("accessToken", data.accessToken);
            window.location.href = "index.html";
            return;
        }
        error.style.display = "block";
        error.textContent = data.message;
    }
    catch(err){
        console.error('Login error:', err);
        error.style.display = "block";
        error.textContent = "Error de red. Intenta más tarde."
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    login(username, password)
});