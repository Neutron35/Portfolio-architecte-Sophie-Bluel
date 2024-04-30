import { apiURL } from "./env.js";
import { mainNavStyle } from "./mainNav.js";

const response = await fetch(`${apiURL}works`);
const works = await response.json();

const categories = new Set();
const divGallery = document.querySelector(".gallery");
const categoriesMenu = document.createElement("div");
const portfolio = document.querySelector("#portfolio");
const contact = document.querySelector("#contact");

const navLogin = document.querySelector("#login");

const modalGallery = document.querySelector(".modal-gallery");

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

// Génération de l'affichage des projets
function generateWorks(works) {
    works.forEach((work) => {
        categories.add(work.category.name);

        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const nameElement = document.createElement("figcaption");
        nameElement.textContent = work.title;

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nameElement);
    });
};

// Génération du menu des catégories/filtres
function generateCategoriesMenu() {
    
    categoriesMenu.setAttribute("id", "categories-menu");
    portfolio.insertBefore(categoriesMenu, divGallery);

    const categoryAll = document.createElement("button");
    categoryAll.textContent = "Tous";
    categoryAll.classList.add("category-button", "active");
    categoriesMenu.appendChild(categoryAll);
    
    categories.forEach((category) => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = category;
        categoryButton.classList.add("category-button");
        categoriesMenu.appendChild(categoryButton);
    });
};

// Création de la bannière "Mode édition" en haut
function createTopBanner() {
    const body = document.querySelector("body");
    const header = document.querySelector("header");

    const editModeBanner = document.createElement("section");
    editModeBanner.setAttribute("id", "edit-mode-banner");
    body.insertBefore(editModeBanner, header);

    header.style.marginTop = "100px";

    const editModeIcon = document.createElement("i");
    editModeIcon.classList.add("fas", "fa-edit");
    editModeBanner.appendChild(editModeIcon);

    const editModeWarning = document.createElement("p");
    editModeWarning.innerText = "Mode édition";
    editModeBanner.appendChild(editModeWarning);
};

// On enlève le token quand on clique sur "logout"
function logout() {
    navLogin.addEventListener("click", function () {
        window.localStorage.removeItem("token");
    });
};

// On insère le logo & "modifier" à côté de "Mes projets"
function createEditMode() {
    const projectsTitle = document.querySelector("#portfolio h2");

    const titleAndEdit = document.createElement("div");
    titleAndEdit.setAttribute("id", "title-and-edit");
    portfolio.insertBefore(titleAndEdit, categoriesMenu);
    titleAndEdit.style.marginBottom = "30px";
    titleAndEdit.appendChild(projectsTitle);
    projectsTitle.style.marginBottom = "0px";

    const editMode = document.createElement("a");
    editMode.setAttribute("id", "edit-mode");
    editMode.classList.add("js-modal");
    editMode.setAttribute("href", "#modal1");
    titleAndEdit.appendChild(editMode);

    const editModeIcon = document.createElement("i");
    editModeIcon.classList.add("fas", "fa-edit");
    editMode.appendChild(editModeIcon);

    const editModeMessage = document.createElement("span");
    editModeMessage.innerText = "modifier";
    editMode.appendChild(editModeMessage);
};

// On ajoute les photos dans la modale
function populateModalGallery(works, container) {
    works.forEach((work) => {
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const blockIcon = document.createElement("button");
        blockIcon.classList.add("delete-work");
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        container.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(blockIcon);
        blockIcon.appendChild(deleteIcon);
    });
};

// Création modale
const createModal = function (e) {
    e.preventDefault();

    const modalAside = document.createElement("aside");
    modalAside.setAttribute("id", "modal1");
    modalAside.classList.add("modal");
    modalAside.setAttribute("role", "dialog");
    modalAside.setAttribute("aria-labelledby", "modal-title")
    const main = document.querySelector("main");
    main.insertBefore(modalAside, contact);

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add("modal-wrapper", "js-modal-stop");
    modalAside.appendChild(modalWrapper);

    const closeModalButton = document.createElement("button");
    closeModalButton.classList.add("js-modal-close");
    modalWrapper.appendChild(closeModalButton);

    const closeModalX = document.createElement("span");
    closeModalX.setAttribute("aria-hidden", "true");
    closeModalX.innerText = "\u00D7";
    closeModalButton.appendChild(closeModalX);

    const modalTitle = document.createElement("h3");
    modalTitle.setAttribute("id", "modal-title");
    modalTitle.innerText = "Galerie photo";
    modalWrapper.appendChild(modalTitle);

    const modalGallery = document.createElement("div");
    modalGallery.classList.add("modal-gallery");
    modalWrapper.appendChild(modalGallery);

    const addPictureButton = document.createElement("button");
    addPictureButton.classList.add("add-picture");
    addPictureButton.innerText = "Ajouter une photo";
    modalWrapper.appendChild(addPictureButton);

    modal = document.querySelector(e.target.parentNode.getAttribute("href"));
    openModal(modalGallery);
}

// Ouverture modale
function openModal (container) {
    populateModalGallery(works, container);
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    console.log(focusables);
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

// Fermeture modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.remove();
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

// On vérifie si l'utilisateur est connecté
function loggedInCheck() {
    const isAuth = window.localStorage.getItem("token");
    if (isAuth === null) {
        console.log("Utilisateur non connecté");
    } else {
        console.log("Utilisateur connecté");

        navLogin.innerText = "logout";
        navLogin.setAttribute("href", "index.html");
        createTopBanner();
        createEditMode();
        document.querySelector("#categories-menu").style.display = "none";
        logout();
    };
};

mainNavStyle();
generateWorks(works);
generateCategoriesMenu();
loggedInCheck();

// Changement couleur quand clic sur catégorie
const categoriesButtons = document.querySelectorAll(".category-button");

document.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
        return
    };

    if (event.target.classList.contains("category-button")) {
        categoriesButtons.forEach(function(button) {
            button.classList.remove("active");
        });
        event.target.classList.add("active");
    };

    if (!(event.target.textContent === "Tous")) {
        const sortedWorks = works.filter(function (work) {
            return work.category.name === event.target.textContent;
        });
        divGallery.innerHTML = "";
        generateWorks(sortedWorks);
    } else {
        divGallery.innerHTML = "";
        generateWorks(works);
    };
});

const focusInModal = function (e) {
    e.preventDefault();
    console.log(focusables);
}

// Apparition modale selon le clic
const modalLinks = document.querySelectorAll(".js-modal");
modalLinks.forEach(a => {
    a.addEventListener("click", createModal);
});

// Fermer modale si on appuie sur Echap
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});