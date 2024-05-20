import { apiURL } from "./env.js";
import { mainNavStyle } from "./mainNav.js";

const loginErrorMessage = "Erreur dans l'identifiant ou le mot de passe";

function initLoginForm() {
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
        try {
            const response = await fetch(`${apiURL}users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body
            });
            if (response.ok) {
                const result = await response.json();
                window.localStorage.setItem("token", result.token);
                window.location.href = "index.html";
            } else {
                if (!(document.querySelector(".error-message"))) {
                    const submitButton = document.querySelector("#connect");
                    const loginError = document.createElement("p");
                    loginError.classList.add("error-message");
                    loginError.textContent = loginErrorMessage;
                    loginForm.insertBefore(loginError, submitButton);
                } else {
                    const loginErrorMessageContainer = document.querySelector(".error-message");
                    loginErrorMessageContainer.textContent = "";
                    loginErrorMessageContainer.textContent = loginErrorMessage;
                };
            }
        } catch {
            alert("Le serveur rencontre actuellement un problème, réessayez plus tard");
        }
    });
};

mainNavStyle();
initLoginForm();