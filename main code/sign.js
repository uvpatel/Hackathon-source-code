const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// Toggle between login and signup
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Form validation functions
function showError(input, message) {
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = message;
  input.classList.add('error');
}

function clearError(input) {
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = '';
  input.classList.remove('error');
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
}

// Password strength checker
function checkPasswordStrength(password) {
  let strength = 0;
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');

  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

  switch (strength) {
    case 0:
      strengthBar.style.width = "0%";
      strengthBar.style.backgroundColor = "#ff4d4d";
      strengthText.textContent = "Very Weak";
      break;
    case 1:
      strengthBar.style.width = "25%";
      strengthBar.style.backgroundColor = "#ff4d4d";
      strengthText.textContent = "Weak";
      break;
    case 2:
      strengthBar.style.width = "50%";
      strengthBar.style.backgroundColor = "#ffd700";
      strengthText.textContent = "Medium";
      break;
    case 3:
      strengthBar.style.width = "75%";
      strengthBar.style.backgroundColor = "#9bdb4d";
      strengthText.textContent = "Strong";
      break;
    case 4:
    case 5:
      strengthBar.style.width = "100%";
      strengthBar.style.backgroundColor = "#33cc33";
      strengthText.textContent = "Very Strong";
      break;
  }
  return strength;
}

// Sign up form validation
if (signupForm) {
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  // Password strength check on input
  password.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
    if (confirmPassword.value) {
      if (e.target.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
      } else {
        clearError(confirmPassword);
      }
    }
  });

  // Confirm password check
  confirmPassword.addEventListener('input', (e) => {
    if (e.target.value !== password.value) {
      showError(confirmPassword, 'Passwords do not match');
    } else {
      clearError(confirmPassword);
    }
  });

  // Form submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate First Name
    const firstName = document.getElementById('firstName');
    if (!firstName.value.trim()) {
      showError(firstName, 'First name is required');
      isValid = false;
    } else {
      clearError(firstName);
    }

    // Validate Last Name
    const lastName = document.getElementById('lastName');
    if (!lastName.value.trim()) {
      showError(lastName, 'Last name is required');
      isValid = false;
    } else {
      clearError(lastName);
    }

    // Validate Email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    } else {
      clearError(email);
    }

    // Validate Password
    if (!password.value) {
      showError(password, 'Password is required');
      isValid = false;
    } else if (!validatePassword(password.value)) {
      showError(password, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      isValid = false;
    } else {
      clearError(password);
    }

    // Validate Confirm Password
    if (!confirmPassword.value) {
      showError(confirmPassword, 'Please confirm your password');
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      showError(confirmPassword, 'Passwords do not match');
      isValid = false;
    } else {
      clearError(confirmPassword);
    }

    // Validate Terms Agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
      showError(agreeTerms, 'You must agree to the Terms & Conditions');
      isValid = false;
    } else {
      clearError(agreeTerms);
    }

    if (isValid) {
      // Create user object
      const userData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
      };

      // Here you would typically send this data to your server
      console.log('Form submitted successfully:', userData);
      
      // Clear form
      signupForm.reset();
      container.classList.remove("active");
      
      // Show success message
      alert('Account created successfully! Please sign in.');
    }
  });
}

// Login form validation
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    // Validate Email
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    } else {
      clearError(email);
    }

    // Validate Password
    if (!password.value) {
      showError(password, 'Password is required');
      isValid = false;
    } else {
      clearError(password);
    }

    if (isValid) {
      // Here you would typically send this data to your server
      console.log('Login attempt:', { email: email.value });
      
      // Clear form
      loginForm.reset();
      
      // Show success message
      alert('Login successful!');
    }
  });
}