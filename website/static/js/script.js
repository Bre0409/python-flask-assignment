document.addEventListener("DOMContentLoaded", function () {
  const signupform = document.querySelector('form');
  const firstname_input = document.getElementById('firstName');
  const email_input = document.getElementById('email');
  const password_input = document.getElementById('password1');
  const re_enter_password_input = document.getElementById('password2');
  const error_message = document.getElementById('error-message');
  const success_message = document.getElementById('success-message');

  signupform.addEventListener('submit', (e) => {
    let errors = getSignupFormErrors(
      firstname_input.value,
      email_input.value,
      password_input.value,
      re_enter_password_input.value
    );

    if (errors.length > 0) {
      e.preventDefault();
      error_message.innerHTML = errors.join('<br>');
      success_message.innerText = '';
    } else {
      // Optional: keep or remove preventDefault
      e.preventDefault();
      success_message.innerText = 'You have been successfully signed up!';
      error_message.innerText = '';
      signupform.reset();
    }
  });

  function getSignupFormErrors(firstname, email, password, reenterPassword) {
    let errors = [];

    // Reset error styles
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

  // Clear error styles on input
  [firstname_input, email_input, password_input, re_enter_password_input].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('incorrect');
      error_message.innerText = '';
      success_message.innerText = '';
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector('form');
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
      //prevent form submission just for demo
      // e.preventDefault();
      successMessage.innerText = 'Login submitted successfully!';
      errorMessage.innerText = '';
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


// home page

document.addEventListener('DOMContentLoaded', function () {
  const subtitleEl = document.getElementById('typed-output');

  if (subtitleEl) {
    // Delay before starting subtitle typing
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

// to do list

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pageContainer");
  const pages = document.querySelectorAll(".page");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");

  let currentIndex = 0;

  function getPageWidth() {
    const page = pages[0];
    const pageStyle = getComputedStyle(page);
    const margin = parseInt(pageStyle.marginRight || 0);
    return page.offsetWidth + margin;
  }

  function updateView() {
    const shift = currentIndex * getPageWidth();
    container.style.transform = `translateX(-${shift}px)`;
  }

  leftBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    updateView();
  });

  rightBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pages.length;
    updateView();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftBtn.click();
    if (e.key === "ArrowRight") rightBtn.click();
  });

  updateView();
});

// edit button in to do list

function toggleEdit(taskId) {
    const textSpan = document.getElementById('text-' + taskId);
    const editForm = document.getElementById('form-' + taskId);

    if (editForm.style.display === 'none') {
        editForm.style.display = 'inline';
        textSpan.style.display = 'none';
    } else {
        editForm.style.display = 'none';
        textSpan.style.display = 'inline';
    }
}


// calender


document.addEventListener('DOMContentLoaded', () => {
  const monthSelect = document.getElementById('month-select');
  const yearSelect = document.getElementById('year-select');
  const daySelect = document.getElementById('day-select');
  const resetBtn = document.getElementById('reset-btn');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

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

    // Blank cells before the first day
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'calendar-day empty';
      calendarGrid.appendChild(blank);
    }

    // Actual day cells
    for (let day = 1; day <= totalDays; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day';

      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      const thisDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === thisDate);

      if (dayEvents.length) {
        const ul = document.createElement('ul');
        ul.className = 'event-list';
        dayEvents.forEach(ev => {
          const li = document.createElement('li');
          li.textContent = ev.title;
          ul.appendChild(li);
        });
        dayCell.appendChild(ul);
      }

      calendarGrid.appendChild(dayCell);
    }
  }

  function updateAll() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    monthSelect.value = month;
    yearSelect.value = year;

    populateDays(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    if (day > daysInMonth) {
      currentDate.setDate(daysInMonth);
    }
    daySelect.value = currentDate.getDate();
    renderCalendar(year, month);
  }

  // Event Listeners
  monthSelect.addEventListener('change', () => {
    currentDate.setMonth(parseInt(monthSelect.value));
    updateAll();
  });

  yearSelect.addEventListener('change', () => {
    currentDate.setFullYear(parseInt(yearSelect.value));
    updateAll();
  });

  daySelect.addEventListener('change', () => {
    currentDate.setDate(parseInt(daySelect.value));
    updateAll();
  });

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateAll();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateAll();
  });

  resetBtn.addEventListener('click', () => {
    currentDate = new Date();
    updateAll();
  });

  // Initial setup
  populateMonths();
  populateYears();
  updateAll();
});
