function updatedEmail(input) {
      var mailId = document.getElementById("email");
      var displayLetter = document.getElementById("logo");
      var color = ["red", "blue", "yellow", "green", "orange", "cyan", "purple", "pink", "white"];
      displayLetter.innerHTML = "Hi";
      displayLetter.style.backgroundColor = "#eee";
      if (mailId.value.length > 0) {
            let i = Math.floor(Math.random() * color.length - 1);
            displayLetter.style.backgroundColor = color[i];
            displayLetter.innerHTML = mailId.value.charAt(0).toUpperCase();
      }
}