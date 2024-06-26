import { apiURL } from "./env.js";
import { mainNavStyle } from "./mainNav.js";

let response;
let works = [];

try {
    response = await fetch(`${apiURL}works`);
    works = await response.json();
} catch (e) {
    console.log(e);
    alert("Le serveur rencontre actuellement un problème, réessayez plus tard");
}

const categoriesData = [];
const categories = new Set();
let uniqueCategories;

const body = document.querySelector("body");
const navLogin = document.getElementById("login");
const divGallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

const modalGalleryView = document.getElementById("modal-gallery-view");
const modalGallery = document.querySelector(".modal-gallery");

const modalUploadView = document.getElementById("modal-upload-view");
const modalPreviousButton = document.querySelector(".fa-arrow-left");
const addWorkForm = document.querySelector(".add-work-form");
const uploadBlock = document.querySelector(".picture-upload-block");
const uploadPictureButton = document.getElementById("upload-picture");
const uploadMessage = document.getElementById("upload-message");
const uploadPreview = document.getElementById("file-preview");
const uploadWorkTitle = document.getElementById("work-title");
const uploadWorkCategory = document.getElementById("work-category");
const confirmUploadButton = document.querySelector(".confirm-upload");

const isAuth = window.localStorage.getItem("token");

const categoriesMenu = document.createElement("div");

let modal = null;

mainNavStyle();
generateWorksGallery(works);
populateModalGallery(works);
generateCategoriesMenu();
loggedInCheck();

// Génération de l'affichage des projets
function generateWorksGallery(works) {
    works.forEach((work) => {
        createWorkInGallery(work.category, work.id, work.imageUrl, work.title);
    });
    uniqueCategories = categoriesData.filter(item => {
        const duplicate = categories.has(item.id);
        categories.add(item.id);
        return !duplicate;
    });
}

function createWorkInGallery(category, id, imageUrl, title) {
    categoriesData.push(category);
    const workElement = document.createElement("figure");
    workElement.setAttribute("data-id", id);
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = title;
    const nameElement = document.createElement("figcaption");
    nameElement.textContent = title;
    divGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(nameElement);
}

// Génération du menu des catégories/filtres
function generateCategoriesMenu() {
    categoriesMenu.setAttribute("id", "categories-menu");
    portfolio.insertBefore(categoriesMenu, divGallery);
    createCategoryButton("Tous", 1);
    uniqueCategories.forEach((category) => {
        createCategoryButton(category.name, 0);
        //On ajoute également les catégories dans le formulaire d'ajout de photo
        const categoryOption = document.createElement("option");
        categoryOption.value = category.id;
        categoryOption.innerText = category.name;
        uploadWorkCategory.appendChild(categoryOption);
    });
}

function createCategoryButton(label, isActive) {
    const button = document.createElement("button");
    button.textContent = label;
    if (isActive) {
        button.classList.add("category-button", "active");
    } else {
        button.classList.add("category-button");
    }
    categoriesMenu.appendChild(button);
}

// Création de la bannière "Mode édition" en haut
function createTopBanner() {
    const mainContainer = document.querySelector(".main-container");
    const header = document.querySelector("header");
    const editModeBanner = document.createElement("div");
    editModeBanner.setAttribute("id", "edit-mode-banner");
    body.insertBefore(editModeBanner, mainContainer);
    header.style.marginTop = "100px";
    const editModeIcon = document.createElement("i");
    editModeIcon.classList.add("fa-regular", "fa-pen-to-square");
    editModeBanner.appendChild(editModeIcon);
    const editModeWarning = document.createElement("p");
    editModeWarning.innerText = "Mode édition";
    editModeBanner.appendChild(editModeWarning);
}

// On enlève le token quand on clique sur "logout"
function logout() {
    navLogin.addEventListener("click", function () {
        window.localStorage.removeItem("token");
    });
}

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
    editModeIcon.classList.add("fa-regular", "fa-pen-to-square");
    editMode.appendChild(editModeIcon);

    const editModeMessage = document.createElement("span");
    editModeMessage.innerText = "modifier";
    editMode.appendChild(editModeMessage);
}

// On ajoute les photos dans la modale
function populateModalGallery(works) {
    if (modalGallery.hasChildNodes()) {
        modalGallery.innerHTML = "";
    }
    works.forEach((work) => {
        createWorkInModalGallery(work.id, work.imageUrl, work.title);
    });
}

function createWorkInModalGallery(id, imageUrl, title) {
    const workElement = document.createElement("figure");
    workElement.setAttribute("data-id", id);
    const imageElement = document.createElement("img");
    const blockIcon = document.createElement("button");
    blockIcon.classList.add("delete-work");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    imageElement.src = imageUrl;
    imageElement.alt = title;
    modalGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(blockIcon);
    blockIcon.appendChild(deleteIcon);
}

// Ouverture modale
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.parentNode.getAttribute("href"));
    modal.style.display = "flex";
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    openModalGalleryView();
    body.style.overflow = "hidden";
}

// Fermeture modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    resetModalUploadView();
    modal.style.display = "none";
    modalGalleryView.style.display = "none";
    modalUploadView.style.display = "none";
    modal = null;
    body.style.overflow = "auto";
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

// Affichage de la galerie photo modale
function openModalGalleryView() {
    const addPictureButton = document.querySelector(".add-picture");
    resetModalUploadView();
    modalUploadView.style.display = "none";
    modalGalleryView.style.display = "flex";
    addPictureButton.addEventListener("click", openModalUploadView);
    const deletePictureButtons = document.querySelectorAll(".delete-work");
    deletePictureButtons.forEach(button => {
        button.addEventListener("click", function () {
            const closestFigure = button.closest("figure");
            const workId = closestFigure.getAttribute("data-id");
            deleteWork(workId);
        });
    });
}

async function deleteWork(id) {
    try {
        const response = await fetch(`${apiURL}works/${id}`, { 
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${isAuth}`
            }
        });
        if (response.ok) {
            const matchingElements = document.querySelectorAll(`figure[data-id="${id}"]`);
            matchingElements.forEach(element => {
                element.remove();
            });
        } else {
            alert("Une erreur est survenue");
        }
    } catch (e) {
        console.log(e);
        alert("Le serveur rencontre actuellement un problème, réessayez plus tard");
    }
}

// Affichage Ajout photo modale
const openModalUploadView = function (e) {
    e.preventDefault();
    modalGalleryView.style.display = "none";
    modalUploadView.style.display = "flex";
    uploadPictureButton.addEventListener("change", checkFile);
    addWorkForm.addEventListener("submit", sendNewWork);
}

async function sendNewWork (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", uploadPictureButton.files[0]);
    formData.append("title", uploadWorkTitle.value);
    const selectedCategory = uploadWorkCategory.options[uploadWorkCategory.selectedIndex];
    const selectedCategoryId = selectedCategory.value;
    formData.append("category", selectedCategoryId);
    try {
        const response = await fetch(`${apiURL}works`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${isAuth}`
            }
        });
        const result = await response.json();
        if (response.ok) {
            createWorkInGallery(selectedCategory, result.id, result.imageUrl, result.title);
            createWorkInModalGallery(result.id, result.imageUrl, result.title);
            resetModalUploadView();
            openModalGalleryView();
        } else {
            alert("Une erreur est survenue");
        }
    } catch (e) {
        console.log(e);
        alert("Le serveur rencontre actuellement un problème, réessayez plus tard");
    }
}

function resetModalUploadView() {
    uploadBlock.style.border = "0";
    uploadMessage.style.color = "#444444";
    uploadMessage.innerHTML = "jpg, png : 4mo max";
    for (const child of uploadBlock.children) {
        child.style.display = "unset";
    }
    uploadPictureButton.style.display = "none";
    uploadPreview.src = "";
    uploadPreview.style.display = "none";
    uploadWorkTitle.style.border = "0";
    addWorkForm.reset();
    confirmUploadButton.disabled = "true";
}

// Vérification du format et du poids de l'image puis affichage preview
function checkFile() {
    let filePath = uploadPictureButton.value;
        let allowedExtensions = /(\.jpg|\.png)$/i;
        if (!allowedExtensions.exec(filePath)) {
            uploadMessage.style.color = "red";
            uploadMessage.innerHTML = "jpg, png : 4mo max </br> Format du fichier invalide";
            uploadPictureButton.value = "";
            return false;
        } else {
            let uploadedFile = uploadPictureButton.files;
            if (uploadedFile.length > 0) {
                const fileSize = uploadedFile.item(0).size;
                const fileMo = fileSize / 1000000;
                if (fileMo >= 4) {
                    uploadMessage.style.color = "red";
                    uploadMessage.innerHTML = "jpg, png : 4mo max </br> Fichier trop volumineux";
                    uploadPictureButton.value = "";
                } else {
                    for (const child of uploadBlock.children) {
                        child.style.display = "none";
                    }
                    let src = URL.createObjectURL(uploadedFile[0]);
                    uploadPreview.src = src;
                    uploadPreview.style.display = "block";
                }
            }
        }
}

// On vérifie si l'utilisateur est connecté
function loggedInCheck() {
    if (isAuth === null) {
        return
    } else {
        navLogin.innerText = "logout";
        navLogin.setAttribute("href", "index.html");
        createTopBanner();
        createEditMode();
        document.querySelector("#categories-menu").style.display = "none";
        logout();
    }
}

// Changement couleur quand clic sur catégorie
const categoriesButtons = document.querySelectorAll(".category-button");
categoriesButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        categoriesButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });
        e.target.classList.add("active");
        if (!(e.target.textContent === "Tous")) {
            const sortedWorks = works.filter(function (work) {
                return work.category.name === e.target.textContent;
            });
            divGallery.innerHTML = "";
            generateWorksGallery(sortedWorks);
        } else {
            divGallery.innerHTML = "";
            generateWorksGallery(works);
        }
    });
});

// Apparition modale selon le clic
const modalLinks = document.querySelectorAll(".js-modal");
modalLinks.forEach(a => {
    a.addEventListener("click", openModal);
});

const closeModalButtons = document.querySelectorAll(".modal-close");
closeModalButtons.forEach(button => {
    button.addEventListener("click", closeModal);
});

// Fermer modale si on appuie sur Echap
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});

modalPreviousButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetModalUploadView();
    openModalGalleryView();
});

// On active/désactive le bouton d'ajout de photo en fonction du formulaire
addWorkForm.addEventListener("change", function() {
    if (uploadPictureButton.value != "" && uploadWorkTitle.value != "") {
        uploadBlock.style.border = "0";
        uploadWorkTitle.style.border = "0";
        confirmUploadButton.disabled = false;
    } else {
        if (uploadPictureButton.value === "" && uploadWorkTitle.value === "") {
            uploadBlock.style.border = "1px solid red";
            uploadWorkTitle.style.border = "1px solid red";
        } else if (uploadPictureButton.value === "" && uploadWorkTitle.value != "") {
            uploadWorkTitle.style.border = "0";
            uploadBlock.style.border = "1px solid red";
        } else if (uploadPictureButton.value != "" && uploadWorkTitle.value === "") {
            uploadBlock.style.border = "0";
            uploadWorkTitle.style.border = "1px solid red";
        }
        confirmUploadButton.disabled = true;
    }
});