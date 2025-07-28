// SIGNUP FORM VALIDATION
document.addEventListener("DOMContentLoaded", function () {
  const signupform = document.getElementById('signup-form');
  if (!signupform) return;  // Only run on signup page

  const firstname_input = document.getElementById('firstName');
  const email_input = document.getElementById('email');
  const password_input = document.getElementById('password1');
  const re_enter_password_input = document.getElementById('password2');
  const error_message = document.getElementById('error-message');
  const success_message = document.getElementById('success-message');

  signupform.addEventListener('submit', (e) => {
    let errors = getSignupFormErrors(
      firstname_input.value.trim(),
      email_input.value.trim(),
      password_input.value,
      re_enter_password_input.value
    );

    if (errors.length > 0) {
      e.preventDefault();
      error_message.innerHTML = errors.join('<br>');
      success_message.innerText = '';
    } else {
      // Let the form submit normally here to trigger server-side signup
      // Remove e.preventDefault() to allow submission
      // If you want to keep success message and prevent submission, uncomment below:
      // e.preventDefault();
      // success_message.innerText = 'You have been successfully signed up!';
      // error_message.innerText = '';
      // signupform.reset();
    }
  });

  function getSignupFormErrors(firstname, email, password, reenterPassword) {
    let errors = [];

    // Clear previous error highlights
    [firstname_input, email_input, password_input, re_enter_password_input].forEach(input => {
      input.classList.remove('incorrect');
    });

    if (!firstname) {
      errors.push('First name is required');
      firstname_input.classList.add('incorrect');
    }

    if (!email) {
      errors.push('Email is required');
      email_input.classList.add('incorrect');
    } else {
      // Basic email format check (optional)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
        email_input.classList.add('incorrect');
      }
    }

    if (!password) {
      errors.push('Password is required');
      password_input.classList.add('incorrect');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
      password_input.classList.add('incorrect');
    }

    if (password !== reenterPassword) {
      errors.push('Passwords do not match');
      password_input.classList.add('incorrect');
      re_enter_password_input.classList.add('incorrect');
    }

    return errors;
  }

  // Clear error and success messages on input change
  [firstname_input, email_input, password_input, re_enter_password_input].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('incorrect');
      error_message.innerText = '';
      success_message.innerText = '';
    });
  });
});


// LOGIN FORM VALIDATION
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;  // Only run on login page

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Create message containers if not present
  let errorMessage = document.getElementById('login-error-message');
  let successMessage = document.getElementById('login-success-message');

  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.id = 'login-error-message';
    errorMessage.style.color = 'red';
    loginForm.appendChild(errorMessage);
  }

  if (!successMessage) {
    successMessage = document.createElement('div');
    successMessage.id = 'login-success-message';
    successMessage.style.color = 'green';
    loginForm.appendChild(successMessage);
  }

  loginForm.addEventListener('submit', function (e) {
    let errors = [];

    // Clear previous error highlights
    [emailInput, passwordInput].forEach(input => input.classList.remove('incorrect'));

    if (!emailInput.value.trim()) {
      errors.push('Email is required');
      emailInput.classList.add('incorrect');
    }

    if (!passwordInput.value.trim()) {
      errors.push('Password is required');
      passwordInput.classList.add('incorrect');
    }

    if (errors.length > 0) {
      e.preventDefault();
      errorMessage.innerHTML = errors.join('<br>');
      successMessage.innerText = '';
    } else {
      // Allow normal form submission here to perform login
      // If you want to prevent submit for demo uncomment below:
      // e.preventDefault();
      // successMessage.innerText = 'Login submitted successfully!';
      // errorMessage.innerText = '';
    }
  });

  // Clear messages on input
  [emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('incorrect');
      errorMessage.innerText = '';
      successMessage.innerText = '';
    });
  });
});


// Home page typed.js animation (no changes needed)
document.addEventListener('DOMContentLoaded', function () {
  const subtitleEl = document.getElementById('typed-output');

  if (subtitleEl) {
    setTimeout(() => {
      new Typed('#typed-output', {
        strings: [
          'Organize your life effortlessly.',
          'Add tasks to your To-Do List.',
          'Schedule events into your Calendar.',
          'Welcome to your personal planner.'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 500,
        loop: false,
        showCursor: true
      });
    }, 1000);
  }
});


// Calendar script (no changes needed)
document.addEventListener('DOMContentLoaded', () => {
  const monthSelect = document.getElementById('month-select');
  const yearSelect = document.getElementById('year-select');
  const daySelect = document.getElementById('day-select');
  const resetBtn = document.getElementById('reset-btn');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  if (!monthSelect || !yearSelect || !daySelect || !resetBtn || !calendarGrid || !prevMonthBtn || !nextMonthBtn) return;

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  let currentDate = new Date();

  // These events would be injected from Flask in your template:
  const events = window.calendarEvents || [];

  function populateMonths() {
    monthSelect.innerHTML = '';
    monthNames.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = month;
      monthSelect.appendChild(option);
    });
  }

  function populateYears() {
    yearSelect.innerHTML = '';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
      const option = document.createElement('option');
      option.value = y;
      option.textContent = y;
      yearSelect.appendChild(option);
    }
  }

  function populateDays(year, month) {
    daySelect.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const option = document.createElement('option');
      option.value = d;
      option.textContent = d;
      daySelect.appendChild(option);
    }
  }

  function renderCalendar(year, month) {
    calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'calendar-day empty';
      calendarGrid.appendChild(blank);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      dayDiv.textContent = day;

      // Check if events exist for this date
      const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);

      if (dayEvents.length > 0) {
        const eventList = document.createElement('ul');
        eventList.className = 'event-list';

        dayEvents.forEach(event => {
          const li = document.createElement('li');
          li.textContent = event.title;
          eventList.appendChild(li);
        });

        dayDiv.appendChild(eventList);
      }

      calendarGrid.appendChild(dayDiv);
    }
  }

  function updateCalendar() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    populateDays(year, month);
    renderCalendar(year, month);
  }

  // Initialize selects and calendar
  populateMonths();
  populateYears();

  monthSelect.value = currentDate.getMonth();
  yearSelect.value = currentDate.getFullYear();

  updateCalendar();

  monthSelect.addEventListener('change', updateCalendar);
  yearSelect.addEventListener('change', updateCalendar);

  resetBtn.addEventListener('click', () => {
    currentDate = new Date();
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    updateCalendar();
  });

  prevMonthBtn.addEventListener('click', () => {
    let month = parseInt(monthSelect.value);
    let year = parseInt(yearSelect.value);
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    monthSelect.value = month;
    yearSelect.value = year;
    updateCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    let month = parseInt(monthSelect.value);
    let year = parseInt(yearSelect.value);
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    monthSelect.value = month;
    yearSelect.value = year;
    updateCalendar();
  });
});
