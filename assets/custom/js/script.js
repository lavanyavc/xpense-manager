function updatedEmail() {
      var mailId = document.getElementById("email");
      var displayLetter = document.getElementsByClassName("circle");
      mailId.value = mailId.value.toUpperCase();
      mailId.result = mailId.value.charAt(0);
      displayLetter[0].innerHTML = mailId.result;

      if (mailId.value.length > 0) {
            return updatedEmail();
      } else {
            return hi;
      }

}

