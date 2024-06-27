document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mainForm');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const passwordError = document.createElement('div');
    const emailError = document.createElement('div');

    passwordError.style.color = 'red';
    passwordError.style.marginBottom = '10px';
    emailError.style.color = 'red';
    emailError.style.marginBottom = '10px';

    passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);
    emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);

    passwordInput.addEventListener('input', () => {
        validatePassword();
    });

    emailInput.addEventListener('input', () => {
        validateEmail();
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting

        let isValid = true;
        const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        if (!validateEmail()) {
            isValid = false;
        }

        if (!validatePassword()) {
            isValid = false;
        }

        if (isValid) {
            const saltedUsername = saltString(extractUsername(emailInput.value));
            const saltedPassword = saltString(passwordInput.value);
            alert(`Username: ${saltedUsername}\nPassword: ${saltedPassword}`);
        } else {
            alert('Please fill out all required fields and correct any errors.');
        }
    });

    function validateEmail() {
        const emailValue = emailInput.value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(emailValue)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.style.borderColor = 'red';
            return false;
        } else {
            emailError.textContent = '';
            emailInput.style.borderColor = '#ddd';
            return true;
        }
    }

    function validatePassword() {
        const passwordValue = passwordInput.value;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordPattern.test(passwordValue)) {
            passwordError.textContent = 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
            passwordInput.style.borderColor = 'red';
            return false;
        } else {
            passwordError.textContent = '';
            passwordInput.style.borderColor = '#ddd';
            return true;
        }
    }

    function extractUsername(email) {
        return email.split('@')[0];
    }

    function saltString(str) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomChar = () => chars[Math.floor(Math.random() * (chars.length+1))];
        const saltLength = 3;
        let saltedStr = '';
        for (let i = 0; i < str.length; i++) {
            saltedStr += str[i];
            if (i % 2 === 0) {
                for (let j = 0; j < saltLength; j++) {
                    saltedStr += randomChar();
                }
            }
        }
        return saltedStr;
    }
});
