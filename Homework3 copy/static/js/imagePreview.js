
document.getElementById('imageUpload').addEventListener('change', function(event) {
    var input = event.target;
    var image = document.getElementById('preview');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
});

document.getElementById('notifyRecipient').addEventListener('change', function() {
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');

    if (this.value === 'email') {
        emailInput.required = true;
        phoneInput.required = false;
    } else if (this.value === 'sms') {
        emailInput.required = false;
        phoneInput.required = true;
    } else {
        emailInput.required = false;
        phoneInput.required = false;
    }
});

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var currentDate = new Date();
    var expirationDate = new Date(document.getElementById('expiration').value);

    if (expirationDate < currentDate) {
        alert('The card is expired. Please provide a valid card.');
    } else {
        this.submit();
    }
});