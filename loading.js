window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");
    const progressBarFill = document.getElementById("progress-bar-fill");
  
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      progressBarFill.style.width = `${progress}%`;
    }, 1000);
  
    setTimeout(() => {
      clearInterval(interval);
      loader.style.display = "none";
      content.style.display = "block";
    }, 5000);
  });