const express = require('express'); // Import our Express dependency
const multer = require('multer');
const upload = multer({dest: 'static/uploads/'});
const fs = require('fs');

const app = express(); // Create a new server instance
const PORT = 80; // Port number we want to use of this server

const html_path = __dirname + '/templates/'; // HTML files folder

// Set up Middleware
app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

const isEmpty = (str) => {
    return str.trim() === '';
};

const isValidEmail = (email) => {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {

    const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    return phoneRegex.test(phone);
};

const isValidCardNumber = (cardNumber) => {
    // Regular expression for validating card number format "XXXX-XXXX-XXXX-XXXX"
    const cardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    return cardNumberRegex.test(cardNumber);
};

const isCardNotExpired = (expiration) => {
    // Parse expiration date and compare with current date
    const currentDate = new Date();
    const expirationDate = new Date(expiration);
    return expirationDate > currentDate;
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(html_path + 'form.html');
});

app.post('/send', upload.single('imageUpload'), (req, res) => {
    // Validate form data
    const { senderFirstName, senderLastName, recipientFirstName, recipientLastName, message, notifyRecipient, email, phone, cardType, cardNumber, expiration, ccv, amount } = req.body;
    

    // Check for banned user
    const bannedUser = (recipientFirstName.toLowerCase() === 'stuart' && recipientLastName.toLowerCase() === 'dent') || (recipientFirstName.toLowerCase() === 'stu' && recipientLastName.toLowerCase() === 'dent');
    if (bannedUser) {
        return res.sendFile( html_path + 'error.html');
    }

    if (isEmpty(senderFirstName) || isEmpty(senderLastName) || isEmpty(recipientFirstName) || isEmpty(recipientLastName) || isEmpty(message) || !req.file || !req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return res.status(400).send('Sender and recipient names, message, and a valid image are required.');
    }

    // Check message length
    if (message.length < 10) {
        return res.status(400).send('Message must be at least 10 characters long.');
    }

    // Check optional email field if "Notify recipient" is set to "Email"
    if (notifyRecipient === 'email' && email && !isValidEmail(email)) {
        return res.status(400).send('Invalid email address.');
    }

    // Check optional phone field if "Notify recipient" is set to "SMS"
    if (notifyRecipient === 'sms' && phone && !isValidPhone(phone)) {
        return res.status(400).send('Invalid phone number.');
    }

    // Check payment details
    if (isEmpty(cardType) || isEmpty(cardNumber) || isEmpty(expiration) || isEmpty(ccv) || isEmpty(amount) || !req.body.terms || !isValidCardNumber(cardNumber) || !isCardNotExpired(expiration)) {
        return res.status(400).send('All payment details are required, and must be valid.');
    }

    if (req.file) {
        const targetPath = `static/uploads/${req.file.originalname}`;
        fs.rename(req.file.path, targetPath, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).send('Error uploading image.');
            }
            console.log('File uploaded successfully:', targetPath);
            res.sendFile(html_path + 'success.html');
        });
    } else {
        res.status(400).send('No file uploaded.');
    }

});



// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));