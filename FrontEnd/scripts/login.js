import { apiURL } from "./env.js";
import { mainNavStyle } from "./mainNav.js";

const loginErrorMessage = "Erreur dans l'identifiant ou le mot de passe";

function sendLoginForm() {
    const loginForm = document.querySelector(".login");

    //Pour test
    loginForm.querySelector("[name=email]").value = "sophie.bluel@test.tld";
    //Fin test

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const loginData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        const body = JSON.stringify(loginData);
        const response = await fetch(`${apiURL}users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });
        if (response.status === 200) {
            const result = await response.json();
            window.localStorage.setItem("token", result.token);
            window.location.href = "index.html";
        } else {
            if (!(document.querySelector(".error-message"))) {
                const form = document.querySelector(".login");
                const submitButton = document.querySelector("#connect");
                const loginError = document.createElement("p");
                loginError.classList.add("error-message");
                loginError.textContent = loginErrorMessage;
                form.insertBefore(loginError, submitButton);
            } else {
                document.querySelector(".error-message").textContent = "";
                document.querySelector(".error-message").textContent = loginErrorMessage;
            };
        };
    });
};

mainNavStyle();
sendLoginForm();