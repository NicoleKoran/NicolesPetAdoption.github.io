{
    // JavaScript code for displaying current date and time
        function updateDateTime() {
          const currentDateTime = new Date();
          const formattedDateTime = currentDateTime.toLocaleString(); // Convert to a human-readable string
          
          // Update the content of the span element with the current date and time
          document.getElementById("currentDateTime").textContent = formattedDateTime;
        }
    
        // Run the updateDateTime function initially to display the date and time on page load
        updateDateTime();
    
        // Set up a timer to refresh the date and time every second (1000 milliseconds)
        setInterval(updateDateTime, 1000);
    }
    
    
    
    function validateFindPetForm() {
            
        // Store the values of input fields
        var preferredAnimal = document.querySelector('input[name="findDogCat"]:checked');
        var preferredBreed = document.getElementById("findBreed").value;
        var selectedAge = document.getElementById("findAge").value;
        var preferredGender = document.querySelector('input[name="findGender"]:checked');
    
        // Check if preferred animal is selected
        if (!preferredAnimal) {
            alert("Please select which animal you are looking for.");
            return false; // Prevent form submission
        }
       
        var breedPattern = /^[a-zA-Z\s]*$/;
        if (!breedPattern.test(preferredBreed)) {
            alert("Please enter a valid breed for your pet (letters and spaces only (or blank if no preference)).");
            return false;
        }
        
        // Check selected age
        if (selectedAge === '--------------------------------------') {
            alert("Please select a preferred pet age.");
            return false; // Prevent form submission
        }
        
        // Check preferred gender
        if (!preferredGender) {
            alert("Please select the preferred gender you are looking for.");
            return false; // Prevent form submission
        }
    
        return true; // Allow form submission
    }
    
    
    function validateAdoptionForm() {
        var animalType = document.querySelector('input[name="dogCatAway"]:checked');
        var breed = document.getElementById("breedAway").value;
        var age = document.getElementById("ageAway").value;
        var gender = document.querySelector('input[name="genderAway"]:checked');
        var brag = document.getElementById("brag").value;
        var firstName = document.getElementById("fname").value;
        var lastName = document.getElementById("lname").value;
        var email = document.getElementById("ownerEmail").value;
    
        if (!animalType) {
            alert("Please select the animal type (Dog or Cat).");
            return false;
        }
        
        var breedPattern = /^[a-zA-Z\s]+$/;
        if (!breedPattern.test(breed)) {
            alert("Please enter a valid breed for your pet (letters and spaces only).");
            return false;
        }
    
        if (age === "--------------------------------------") {
            alert("Please select the correct age of your pet.");
            return false;
        }
    
        if (!gender) {
            alert("Please select the gender of your pet.");
            return false;
        }
    
    
        if (brag.trim() === "") {
            alert("Please tell us why your pet would be great for adopting.");
            return false;
        }
    
        if (firstName.trim() === "") {
            alert("Please enter your first name.");
            return false;
        }
    
        if (lastName.trim() === "") {
            alert("Please enter your last name.");
            return false;
        }
    
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
    
        return true;
    }

// validate to create an account
    function validateAccountForm() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const usernamePattern = /^[a-zA-Z0-9]+$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    
        if (!usernamePattern.test(username) || !passwordPattern.test(password)) {
          document.getElementById('error-message').innerText = "Invalid username or password format.";
          return false;
        }
    
        return true;
      }
    
    
      function confirmLogout() {
        if (confirm("Are you sure you want to log out?")) {
            document.getElementById("logoutForm").submit();
        }
    }
    