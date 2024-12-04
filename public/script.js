window.onload = onLoad;
function onLoad() {

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


let imgPreview= document.getElementById("preview");
let imgName = document.getElementById("screen");
console.log(imgPreview);
console.log(imgName);
imgName.addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imgPreview.src = e.target.result; 
        imgPreview.style.display="block";
      };
      reader.readAsDataURL(file); 
    }
  });
}

