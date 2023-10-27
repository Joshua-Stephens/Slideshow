"use strict";
/*    JavaScript 7th Edition
      Chapter 5
      Chapter Case

      Application to generate a slide show
      Author: Joshua Stephens
      Date: Friday March 10, 2023  

      Filename: js05_txt.js
*/

window.addEventListener("load", createLightbox);
window.addEventListener("load", createFavourites);

function createFavourites() {
   // Favebox Container
   let faveBox = document.getElementById("favourites");

   // Parts of the favebox
   let faveTitle = document.createElement("h1");
   let faveImages = document.createElement("div");

   // Design the favebox title
   faveBox.appendChild(faveTitle);
   faveTitle.id = "faveTitle";
   faveTitle.textContent = "Favourites";

   // Design the favebox images container
   faveBox.appendChild(faveImages);
   faveImages.id = "faveImages";
}

function createLightbox() {
   // Lightbox Container
   let lightBox = document.getElementById("lightbox");

   // Parts of the lightbox
   let lbTitle = document.createElement("h1");
   let lbCounter = document.createElement("div");
   let lbPrev = document.createElement("div");
   let lbNext = document.createElement("div");
   let lbPlay = document.createElement("div");
   let lbImages = document.createElement("div");

   // Design the lightbox title
   lightBox.appendChild(lbTitle);
   lbTitle.id = "lbTitle";
   lbTitle.textContent = lightboxTitle;

   // Design the lightbox slide counter
   lightBox.appendChild(lbCounter);
   lbCounter.id = "lbCounter";
   let currentImg = 1;
   lbCounter.textContent = currentImg + " / " + imgCount;

   // Design the lightbox previous slide button
   lightBox.appendChild(lbPrev);
   lbPrev.id = "lbPrev";
   lbPrev.innerHTML = "&#9664;";
   lbPrev.onclick = showPrev;

   // Design the lightbox next slide button
   lightBox.appendChild(lbNext);
   lbNext.id = "lbNext";
   lbNext.innerHTML = "&#9654;";
   lbNext.onclick = showNext;

   // Design the lightbox Play-Pause button
   lightBox.appendChild(lbPlay);
   lbPlay.id = "lbPlay";
   lbPlay.innerHTML = "&#9199;";
   let timeID;
   lbPlay.onclick = function () {
      if (timeID !== undefined) {
         // Stop the slideshow
         clearInterval(timeID);
         timeID = undefined;
      } else {
         // Start the slideshow
         showNext();
         timeID = setInterval(showNext, 1500);
      }
   }

   // Design the lightbox images container
   lightBox.appendChild(lbImages);
   lbImages.id = "lbImages";
   // Add images from the imgFiles array to the container
   for (let i = 0; i < imgCount; i++) {
      let image = document.createElement("img");
      image.src = imgFiles[i];
      image.alt = imgCaptions[i];
      image.onclick = createOverlay;
      lbImages.appendChild(image);
   }

   function showNext() {
      lbImages.appendChild(lbImages.firstElementChild);
      (currentImg < imgCount) ? currentImg++ : currentImg = 1;
      lbCounter.textContent = currentImg + " / " + imgCount;
   }

   function showPrev() {
      lbImages.insertBefore(lbImages.lastElementChild, lbImages.firstElementChild);
      (currentImg > 1) ? currentImg-- : currentImg = imgCount;
      lbCounter.textContent = currentImg + " / " + imgCount;
   }

   function createOverlay() {
      let newWindow = window.open('', 'name', 'height=' + screen.height + ', width=' + screen.width);
      newWindow.document.write('<link rel="stylesheet" href="lightbox.css" />');
      newWindow.document.write('<link rel="stylesheet" href="styles.css" />');
      newWindow.document.title = "Photo Overlay";

      let overlay = document.createElement("div");
      overlay.id = "lbOverlay";

      // Add the figure box to the overlay
      let figureBox = document.createElement('figure');
      overlay.appendChild(figureBox);

      // Add the image to the figure box.
      let overlayImage = this.cloneNode("true");
      figureBox.appendChild(overlayImage);

      // Add the caption to the figure box.
      let overlayCaption = document.createElement('figcaption');
      overlayCaption.textContent = this.alt;
      figureBox.appendChild(overlayCaption);

      // Add a save to favourites button to the figure box.
      let saveButtonDiv = document.createElement('div');
      saveButtonDiv.id = "saveButtonDiv"
      let saveButton = document.createElement('button');
      saveButtonDiv.appendChild(saveButton);
      saveButton.textContent = "Save to Favourites";
      let imageSource = this.src;

      saveButton.onclick = function () {
         saveToFavourites(imageSource);
         newWindow.window.close();
      }
      figureBox.appendChild(saveButtonDiv);

      // Add a close button to the overlay
      let closeBox = document.createElement('div');
      closeBox.id = "lbOverlayClose"
      closeBox.innerHTML = "&times;";
      closeBox.onclick = function () {
         //   document.body.removeChild(overlay);
         newWindow.window.close();
      }
      overlay.appendChild(closeBox);

      // Append to the body of the document
      // document.body.appendChild(overlay);
      newWindow.document.write("<div></div>");
      newWindow.document.body.appendChild(overlay);
   }

   // Save a photo to the Favourites list
   function saveToFavourites(imgSrc) {
      let faveBox = document.getElementById("favourites");
      if (faveImagesArray.length <= 4) {
         let oldFaveImages = document.getElementById("faveImages");
         if (oldFaveImages != null) {
            oldFaveImages.remove();
         }
         let faveImages = document.createElement("div");
         faveBox.appendChild(faveImages);
         faveImages.id = "faveImages";
         let duplicateFound = false;
         for (let i = 0; i < faveImagesArray.length; i++) {
            if (faveImagesArray[i] == imgSrc) {
               duplicateFound = true;
            }
         }
         if (duplicateFound == false) {
            faveImagesArray[faveImagesArray.length] = imgSrc;
         } else {
            alert("Photo already saved to Favourites list!");
         }

         for (let i = 0; i < faveImagesArray.length; i++) {
            let image = document.createElement("img");
            image.src = faveImagesArray[i];
            image.onclick = function () {
               removeFromFavourites(faveImagesArray[i]);
            }
            faveImages.appendChild(image);
         }
      }
      else {
         alert("Favourites list cannot be more than 5 pictures. Please remove a picture from your Favourites list.");
      }
   }
}

// Remove a photo to the Favourites list
function removeFromFavourites(imgSrc) {
   let faveBox = document.getElementById("favourites");
   let removeButton = document.createElement("button");
   if (document.getElementById("removeButton") != null) {
      document.getElementById("removeButton").remove();
   }
   faveBox.appendChild(removeButton);
   removeButton.id = "removeButton";
   removeButton.textContent = "Remove from Favourites";
   document.getElementById("removeButton").scrollIntoView();

   removeButton.onclick = function () {
      for (let i = 0; i < faveImagesArray.length; i++) {
         if (imgSrc == faveImagesArray[i]) {
            const removedImg = faveImagesArray.splice(i, 1);

            let oldFaveImages = document.getElementById("faveImages");
            if (oldFaveImages != null) {
               oldFaveImages.remove();
            }
            let faveImages = document.createElement("div");
            faveBox.appendChild(faveImages);
            faveImages.id = "faveImages";
            for (let i = 0; i < faveImagesArray.length; i++) {
               let image = document.createElement("img");
               image.src = faveImagesArray[i];
               image.onclick = function () {
                  removeFromFavourites(faveImagesArray[i]);
               }
               faveImages.appendChild(image);
            }
            document.getElementById("removeButton").remove();
         }
      }
   }
   faveBox.appendChild(removeButton);
} 