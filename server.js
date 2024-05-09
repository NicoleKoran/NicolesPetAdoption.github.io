const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

const app = express();

// Session middleware setup
app.use(session({
   secret: 'your-secret-key',
   resave: false,
   saveUninitialized: true
}));



// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));


// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));


// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Middleware to set the current date and time
app.use((req, res, next) => {
   res.locals.currentDateTime = new Date().toLocaleString();
   next();
});

// Route for the root URL ("/")
app.get('/', (req, res) => {
   res.render('home', { pageTitle: 'Home Page' });
});

// Route to render EJS files with header and footer
app.get('/home', (req, res) => {
   res.render('home', { pageTitle: 'Home Page' });
});


app.get('/findPet', (req, res) => {
   res.render('findPet', { pageTitle: 'Find a Dog/Cat' });
});


app.get('/dogCare', (req, res) => {
   res.render('dogCare', { pageTitle: 'Dog Care' });
});


app.get('/catCare', (req, res) => {
   res.render('catCare', { pageTitle: 'Cat Care' });
});


app.get('/login', (req, res) => {
   res.render('login', { pageTitle: 'Login' });
});


app.get('/account', (req, res) => {
   res.render('account', { pageTitle: 'Create an Account' });
});


app.get('/contact', (req, res) => {
   res.render('contact', { pageTitle: 'Contact Us' });
});


app.get('/privacyDisclaimer', (req, res) => {
    res.render('privacyDisclaimer', { pageTitle: 'Privacy/Disclaimer Statement' }); 
}); 


app.get('/petGiveAway', (req, res) => {
   res.render('petGiveAway', { pageTitle: 'Have a Pet to Give Away' });
});


// Route to handle form submission
app.post('/register', (req, res) => {
   const { username, password } = req.body;
 
   // Check if username already exists
   fs.readFile('login.txt', 'utf8', (err, data) => {
     if (err) {
       console.error('Error reading file:', err);
       res.status(500).send('Error reading file');
       return;
     }
 
     const existingUsernames = data.split('\n').map(line => line.split(':')[0]);
     if (existingUsernames.includes(username)) {
       res.status(400).send('Username already exists. Please choose a different username.');
       return;
     }
 
     // Write the username and password to a text file
     fs.appendFile('login.txt', `${username}:${password}\n`, (err) => {
       if (err) {
         console.error('Error writing to file:', err);
         res.status(500).send('Error writing to file');
       } else {
         console.log('User registered successfully');
         res.status(200).send('Account created successfully. You can now login.');
       }
     });
   });
 });


// Route for handling login verification
app.post('/loginVerify', (req, res) => {
   const { username, password } = req.body;

   // Read the login.txt file
   fs.readFile('login.txt', 'utf8', (err, data) => {
       if (err) {
           console.error(err);
           return res.status(500).send('Internal Server Error');
       }

       // Split the file contents into an array of lines
       const lines = data.split('\n');

       // Loop through each line to check for username and password match
       for (const line of lines) {
           const [storedUsername, storedPassword] = line.split(':');
           if (storedUsername === username && storedPassword === password) {
               // If username and password match, redirect to /petGiveAway
               return res.redirect('/petGiveAway');
           }
       }

       // If no match is found, display error message
       res.send('<div style="color: red;">Invalid username or password</div>');
   });
});

// Route for handling pet adoption submission
app.post('/submitAdoption', (req, res) => {
   const { dogCatAway, breedAway, ageAway, genderAway, getAlongWith, brag, fname, lname, ownerEmail } = req.body;

   // Read the available pet information file
   fs.readFile('available_pets.txt', 'utf8', (err, data) => {
       if (err) {
           console.error(err);
           return res.status(500).send('Internal Server Error');
       }

       // Split the file contents into an array of lines
       const lines = data.split('\n');

       // Find the maximum id to assign a unique id to the new entry
       let maxId = 0;
       for (const line of lines) {
           const id = parseInt(line.split(':')[0]);
           if (!isNaN(id) && id > maxId) {
               maxId = id;
           }
       }

       // Generate the new entry with a unique id
       const newEntry = `${maxId + 1}:${fname}:${lname}:${dogCatAway}:${breedAway}:${ageAway}:${genderAway}:${getAlongWith}:${brag}:${ownerEmail}`;

       // Append the new entry to the file
       fs.appendFile('available_pets.txt', newEntry + '\n', (err) => {
           if (err) {
               console.error(err);
               return res.status(500).send('Internal Server Error');
           }

           // Display success message
           res.send('<div style="color: green;">Pet was successfully added!</div>');
       });
   });
});


// Route to handle form submission
app.post('/findPetSubmit', (req, res) => {
   const { findDogCat, findBreed, findAge, findGender, getAlongWith } = req.body;

   // Read the pet information from the text file
   fs.readFile('available_pets.txt', 'utf8', (err, data) => {
       if (err) {
           console.error(err);
           return res.status(500).send('Internal Server Error');
       }

       // Split the data into individual pet entries
       const petEntries = data.split('\n');

       // Filter pets based on form criteria
      const matches = petEntries.filter(entry => {
      const [_, __, ___, dogCatAway, breedAway, ageAway, genderAway, getAlongWithAway, brag, ownerEmail] = entry.split(':');
         return (
            (!findDogCat || dogCatAway === findDogCat) &&
            (!findBreed || breedAway.toLowerCase().includes(findBreed.toLowerCase()) || findBreed === '') &&
            (!findAge || ageAway === findAge || findAge === 'No age preference') &&
            (!findGender || genderAway === findGender || findGender === 'noPreference') &&
            (!getAlongWith || getAlongWithAway.includes(getAlongWith) || getAlongWith === '')
         );
      });

       // Process the matches to prepare data for rendering
       const petsData = matches.map(entry => {
           const [id, fname, lname, dogCatAway, breedAway, ageAway, genderAway, getAlongWith, brag, ownerEmail] = entry.split(':');
           return {
               type: dogCatAway === 'dog' ? 'Dog' : 'Cat',
               breed: breedAway,
               age: ageAway,
               gender: genderAway,
               getsAlongWith: getAlongWith,
               reasonForAdoption: brag,
               owner: fname + ' ' + lname,
           };
       });

       // Render the pets.ejs template with the pets data
         ejs.renderFile('public/pets.ejs', { pets: petsData }, (err, html) => {  
            if (err) {
             console.error('Error rendering pets.ejs:', err);
            return res.status(500).send('Internal Server Error: ' + err.message);
            }
         // Send the rendered HTML back to the client
         res.send(html);
       });
   });
});


app.post('/logOut', (req, res) => {
   req.session.destroy((err) => {
       if (err) {
           console.error('Error destroying session:', err);
           return res.status(500).send('Internal Server Error');
       }
       res.send('Logged out successfully');
   });
});



// 404 Error handler
app.use((req, res) => {
   res.status(404).send('<h1>Error 404: resource not found.</h1>');
});


// Start the server
const port = process.env.PORT || 5222;
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});