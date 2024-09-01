fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    function afficherImages(filtre) {
      const galleryContainer = document.querySelector(".gallery");
      galleryContainer.innerHTML = "";

      data.forEach((item) => {
        if (filtre === "Tous" || item.category.name === filtre) {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          const figcaption = document.createElement("figcaption");

          img.src = item.imageUrl;
          img.alt = item.title;
          figcaption.textContent = item.title;

          figure.appendChild(img);
          figure.appendChild(figcaption);
          galleryContainer.appendChild(figure);
        }
      });
    }

    const existingFilters = [
      "Tous",
      "Objets",
      "Appartements",
      "Hotels & restaurants",
    ];

    const filterButtons = document.querySelectorAll(".filter-button");

    filterButtons.forEach((button, index) => {
      button.textContent = existingFilters[index];
      button.addEventListener("click", () => {
        const selectedFilter = existingFilters[index];
        afficherImages(selectedFilter);

        filterButtons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
      });
    });

    filterButtons[0].classList.add("selected");
  });

const catergoryId = [
  { id: 0, name: "Objets" },
  { id: 1, name: "Appartements" },
  { id: 2, name: "Hotels & restaurants" },
];
console.log(catergoryId);

let catergoryInput = [];

function afficherImage() {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = item.imageUrl;
        img.alt = item.title;
        figcaption.textContent = item.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);
      });
    });
}

afficherImage();

// LOGIN

const logout = document.getElementById("login");

console.log(logout);

logout.addEventListener("click", function () {
  localStorage.removeItem("token");
  logout.textContent = "login";
});

const IsConneted = localStorage.getItem("token");
if (IsConneted) {
  console.log("connecté");
  logout.textContent = "logout";

  // A ENLEVER

  const elementToRemove = document.querySelector(".filter-buttons");
  if (elementToRemove) {
    elementToRemove.remove();
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Initialisation des différentes parties
    createEditionModeIcon();
    addModifyButton();
    loadProjectsData();
    setupModalCloseEvent();
  });

  // Fonction pour créer et insérer l'icône du mode édition
  function createEditionModeIcon() {
    const icon = createIcon("fas fa-edit", "10px");
    const modeEdition = document.createElement("div");
    modeEdition.id = "modeEdition";
    modeEdition.appendChild(icon);
    modeEdition.appendChild(document.createTextNode("Mode édition"));
    document.body.insertBefore(modeEdition, document.body.firstChild);
  }

  // Fonction pour créer et insérer le bouton de modification
  function addModifyButton() {
    const portfolioSection = document.getElementById("portfolio");
    const projectsTitle = portfolioSection.querySelector("h2");
    const modifyContainer = document.createElement("a");
    modifyContainer.id = "logoModifier";

    const modifyIcon = createIcon("fas fa-edit", "5px");
    const modifyText = document.createTextNode("modifier");

    modifyContainer.appendChild(modifyIcon);
    modifyContainer.appendChild(modifyText);
    projectsTitle.appendChild(modifyContainer);

    // Événement pour afficher la modale
    modifyContainer.addEventListener("click", function () {
      const modal = document.getElementById("modal");
      modal.classList.add("active");
    });
  }

  // Fonction pour charger les projets depuis l'API et afficher les images
  function loadProjectsData() {
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => renderImagesInModal(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des projets:", error)
      );
  }

  // Fonction pour créer les images et les ajouter dans la modal
  function renderImagesInModal(data) {
    const galleryContainer = document.querySelector(".modal-body");
    const imagesContainer = document.createElement("div");
    imagesContainer.classList.add("images-container");

    galleryContainer.innerHTML = ""; // Vider le contenu actuel avant de le remplir

    data.forEach((item) => {
      const imageWrapper = createImageWrapper(item);
      imagesContainer.appendChild(imageWrapper);
    });

    galleryContainer.appendChild(imagesContainer);
  }

  // Ajout de cette fonction pour recharger les images après ajout
  function refreshContentAfterAdd() {
    afficherImage();
    loadProjectsData(); 
  }

  // Fonction pour créer un conteneur d'image avec l'icône de suppression
  function createImageWrapper(item) {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.style.position = "relative";

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;
    img.style.display = "block";

    const trashIcon = createIcon("fas fa-trash-alt");
    trashIcon.style.position = "absolute";
    trashIcon.style.top = "5px";
    trashIcon.style.right = "5px";
    trashIcon.style.cursor = "pointer";
    trashIcon.style.color = "white";
    trashIcon.style.backgroundColor = "black";
    trashIcon.style.padding = "2px";

    trashIcon.addEventListener("click", function () {
      handleDeleteProject(item.id, imageWrapper);
    });

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(trashIcon);

    return imageWrapper;
  }

  // Fonction pour gérer la suppression du projet
  function handleDeleteProject(projectId, imageWrapper) {
      const token = localStorage.getItem("token");

      if (token) {
        fetch(`http://localhost:5678/api/works/${projectId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              imageWrapper.remove();

              afficherImage();

              alert("Projet supprimé avec succès.");
            } else {
              return response.text().then((text) => {
                throw new Error(text);
              });
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression du projet:", error);
            alert(`Une erreur s'est produite : ${error.message}`);
          });
      } else {
        alert("Vous devez être connecté pour supprimer un projet.");
      }
  }

  // Fonction pour configurer l'événement de fermeture de la modale
  function setupModalCloseEvent() {
    const closeButton = document.querySelector(".modal-close");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        const modal = document.getElementById("modal");
        modal.classList.remove("active");
      });
    }
  }

  // Fonction utilitaire pour créer une icône FontAwesome avec des marges
  function createIcon(iconClass, marginRight = "0px") {
    const icon = document.createElement("i");
    icon.className = iconClass;
    icon.style.marginRight = marginRight;
    return icon;
  }

  // 2EME MODAL

  document.addEventListener("DOMContentLoaded", function () {
    // Logique pour la première modale
    const addPhotoButton = document.getElementById("modal-addPic");
    const firstModal = document.getElementById("modal");
    const secondModal = document.getElementById("modal-add-photo");
    const backButton = document.getElementById("modal-back");
    const closeButtons = document.querySelectorAll(".modal-close");

    // Fonction pour afficher la deuxième modale
    addPhotoButton.addEventListener("click", function () {
      firstModal.style.display = "none";
      secondModal.style.display = "flex";
    });

    // Fonction pour revenir à la première modale
    backButton.addEventListener("click", function () {
      secondModal.style.display = "none";
      firstModal.style.display = "block";
    });

    // Fonction pour fermer toutes les modales
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Ferme explicitement les deux modales
        firstModal.style.display = "none";
        secondModal.style.display = "none";
      });
    });

    // Prévisualisation de l'image
    const photoUploadInput = document.getElementById("photo-upload");
    const imagePreview = document.getElementById("image-preview");
    const uploadContent = document.getElementById("upload-content");

    // Fonction pour gérer l'affichage de la prévisualisation de l'image
    photoUploadInput.addEventListener("change", function (event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          // Mettre à jour la source de l'image et l'afficher
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";

          uploadContent.style.display = "none";

          imagePreview.style.width = "100%";
          imagePreview.style.height = "100%";
          imagePreview.style.objectFit = "contain"; 
        };

        // Lire le contenu du fichier sous forme d'URL
        reader.readAsDataURL(file);
      }
    });

    // Sélection du menu déroulant par son id
    const categorySelect = document.getElementById("photo-category");

    // Fonction pour ajouter dynamiquement les options au <select>
    function populateCategoryDropdown() {
      console.log("Fonction populateCategoryDropdown appelée");

      // Efface toutes les options existantes (au cas où)
      categorySelect.innerHTML = "";

      // Parcourt les éléments du tableau existingFilters en excluant "Tous"
      catergoryId.forEach((category) => {
        const option = document.createElement("option");
        option.value = category; 
        option.textContent = category.name; 

        catergoryInput = category.id;

        // Ajoute l'option au <select>
        categorySelect.appendChild(option);
      });
    }

    // Appel de la fonction pour remplir le <select> lorsque la page est chargée
    populateCategoryDropdown();
  });

  document.addEventListener("DOMContentLoaded", function () {
    const addPhotoForm = document.getElementById("add-photo-form");
    const photoUploadInput = document.getElementById("photo-upload");
    const photoTitleInput = document.getElementById("photo-title");
    const photoCategorySelect = document.getElementById("photo-category");
    const submitButton = document.querySelector(".modal-submit");

    // Fonction pour vérifier si tous les champs sont remplis
    function checkFormValidity() {
      const isFormValid =
        photoUploadInput.files.length > 0 &&
        photoTitleInput.value.trim() !== "" &&
        photoCategorySelect.value.trim() !== "";

      submitButton.disabled = !isFormValid;
    }

    // Vérification en temps réel si le formulaire est valide
    photoUploadInput.addEventListener("change", checkFormValidity);
    photoTitleInput.addEventListener("input", checkFormValidity);
    photoCategorySelect.addEventListener("change", checkFormValidity);

    // Désactiver le bouton par défaut
    checkFormValidity();

    // Fonction de soumission du formulaire
    addPhotoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Récupération des valeurs du formulaire
      const formData = new FormData();
      formData.append("image", photoUploadInput.files[0]);
      formData.append("title", photoTitleInput.value);
      formData.append("category", catergoryInput);

      // Affiche le contenu de formData pour déboguer
      console.log(photoUploadInput.files[0]);

      // Récupère le token d'authentification depuis le localStorage
      const token = localStorage.getItem("token");

      // Requête POST pour ajouter le nouveau projet
      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
        },
        body: formData, // Envoie des données multipart/form-data
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Transforme la réponse en JSON
          } else {
            return response.text().then((text) => {
              throw new Error(text); // Lève une erreur avec le texte de la réponse
            });
          }
        })
        .then((data) => {
          console.log("Projet ajouté avec succès:", data);

          // Réinitialiser le formulaire
          addPhotoForm.reset();
          checkFormValidity(); // Désactiver le bouton "Valider" après réinitialisation
          document.getElementById("upload-content").style.display = "flex"; // Réafficher le contenu de téléchargement
          document.getElementById("image-preview").style.display = "none"; // Masquer l'aperçu de l'image

          // Rafraîchir la galerie et la modale
          refreshContentAfterAdd();

          // Fermer la modale
          const secondModal = document.getElementById("modal-add-photo");
          secondModal.style.display = "none";
        })
        .catch((error) => {
          console.error("Erreur:", error);
          alert("Une erreur s'est produite lors de l'ajout du projet");
        });
    });
  });
}
