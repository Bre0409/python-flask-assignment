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
