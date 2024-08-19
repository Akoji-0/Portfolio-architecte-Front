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
    // Crée l'élément <i> pour l'icône Font Awesome
    const icon = document.createElement("i");
    icon.className = "fas fa-edit";
    icon.style.marginRight = "10px";

    // Crée le conteneur pour le mode édition
    const modeEdition = document.createElement("div");
    modeEdition.id = "modeEdition";

    // Ajoute l'icône et le texte au nouvel élément
    modeEdition.appendChild(icon);
    modeEdition.appendChild(document.createTextNode("Mode édition"));

    // Ajoute le nouvel élément en haut du body
    document.body.insertBefore(modeEdition, document.body.firstChild);

    // Ajoute l'icône et le texte après le titre <h2>
    const portfolioSection = document.getElementById("portfolio");
    const projectsTitle = portfolioSection.querySelector("h2");

    const modifyContainer = document.createElement("a");
    modifyContainer.id = "logoModifier";

    // ICONE ET TEXTE 'MODIFIER'
    const modifyIcon = document.createElement("i");
    modifyIcon.className = "fas fa-edit";
    modifyIcon.style.marginRight = "5px"; // Espace entre l'icône et le texte

    const modifyText = document.createTextNode("modifier");

    // Ajoute l'icône et le texte au conteneur
    modifyContainer.appendChild(modifyIcon);
    modifyContainer.appendChild(modifyText);

    // Insère le conteneur après le titre <h2>
    projectsTitle.appendChild(modifyContainer);

    // Ajout de l'événement pour afficher la modale
    modifyContainer.addEventListener("click", function () {
      const modal = document.getElementById("modal");
      modal.classList.add("active");
    });

    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        function imagesModal() {
          const galleryContainer = document.querySelector(".modal-body");

          // Crée un conteneur pour les images
          const imagesContainer = document.createElement("div");
          imagesContainer.classList.add("images-container");

          // Ajoute les images au conteneur des images
          data.forEach((item) => {
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("image-wrapper");
            imageWrapper.style.position = "relative"; // Pour positionner l'icône de poubelle

            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.alt = item.title;
            img.style.display = "block";

            // Crée l'icône de poubelle
            const trashIcon = document.createElement("i");
            trashIcon.className = "fas fa-trash-alt";
            trashIcon.style.position = "absolute";
            trashIcon.style.top = "5px";
            trashIcon.style.right = "5px";
            trashIcon.style.cursor = "pointer";
            trashIcon.style.color = "white"; // Couleur de l'icône de poubelle
            trashIcon.style.backgroundColor = "black";
            trashIcon.style.padding = "2px";

            // Ajoute un événement de clic pour supprimer le projet
            trashIcon.addEventListener("click", function () {
              if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
                // Récupérez le token du localStorage
                const token = localStorage.getItem("token");

                if (token) {
                  fetch(`http://localhost:5678/api/works/${item.id}`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`, // Ajoute le token dans les en-têtes
                    },
                  })
                    .then((response) => {
                      if (response.ok) {
                        // Supprime l'élément de la modal
                        imageWrapper.remove();
                        afficherImage();
                        alert("Projet supprimé avec succès.");
                      } else {
                        return response.text().then((text) => {
                          // Obtenez le texte de la réponse
                          throw new Error(text);
                        });
                      }
                    })
                    .catch((error) => {
                      console.error("Erreur:", error); // Affiche l'erreur dans la console
                      alert(
                        `Une erreur s'est produite lors de la suppression du projet : ${error.message}`
                      );
                    });
                } else {
                  alert("Vous devez être connecté pour supprimer un projet.");
                }
              }
            });

            // Ajoute l'image et l'icône de poubelle au conteneur d'image
            imageWrapper.appendChild(img);
            imageWrapper.appendChild(trashIcon);

            // Ajoute le conteneur d'image au conteneur des images
            imagesContainer.appendChild(imageWrapper);
          });

          // Ajoute le conteneur des images à la modal-body
          galleryContainer.appendChild(imagesContainer);
        }

        imagesModal();
      });

    // Sélection de l'élément de fermeture (la croix)
    const closeButton = document.querySelector(".modal-close");

    // Ajout de l'événement pour fermer la modale avec console.log pour tester
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        const modal = document.getElementById("modal");
        modal.classList.remove("active");
      });
    }
  });
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
    secondModal.style.display = "flex"; // S'assure que la deuxième modale apparaît
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
  const photoUploadInput = document.getElementById('photo-upload');
  const imagePreview = document.getElementById('image-preview');
  const uploadContent = document.getElementById('upload-content');

  // Fonction pour gérer l'affichage de la prévisualisation de l'image
  photoUploadInput.addEventListener('change', function(event) {
      const file = event.target.files[0];

      if (file) {
          const reader = new FileReader();

          reader.onload = function(e) {
              // Mettre à jour la source de l'image et l'afficher
              imagePreview.src = e.target.result;
              imagePreview.style.display = "block"; // Affiche l'image

              // Masquer le contenu initial (icône, bouton et texte)
              uploadContent.style.display = "none";

              // Adapter l'image aux dimensions du conteneur
              imagePreview.style.width = "100%";
              imagePreview.style.height = "100%";
              imagePreview.style.objectFit = "contain"; // Permet de couvrir le conteneur sans déformation
          }

          // Lire le contenu du fichier sous forme d'URL
          reader.readAsDataURL(file);
      }
  });

  // Catégorie
  const existingFilters = [
    "Tous",
    "Objets",
    "Appartements",
    "Hotels & restaurants"
  ];

  // Sélection du menu déroulant par son id
  const categorySelect = document.getElementById('photo-category');

  // Fonction pour ajouter dynamiquement les options au <select>
  function populateCategoryDropdown() {
      console.log("Fonction populateCategoryDropdown appelée");
      
      // Efface toutes les options existantes (au cas où)
      categorySelect.innerHTML = '';

      // Parcourt les éléments du tableau existingFilters en excluant "Tous"
      existingFilters
          .filter(category => category !== "Tous") // Exclut "Tous"
          .forEach(function(category) {
              console.log("Ajout de la catégorie : " + category);
              // Crée un nouvel élément <option>
              const option = document.createElement('option');
              option.value = category.toLowerCase(); // Définit la valeur de l'option
              option.textContent = category; // Définit le texte affiché

          // Ajoute l'option au <select>
          categorySelect.appendChild(option);
      });
  }

  // Appel de la fonction pour remplir le <select> lorsque la page est chargée
  populateCategoryDropdown();
});
