from flask import Blueprint, render_template, request, redirect, url_for
from .events import events  # Make sure events is defined/exported from events.py

views = Blueprint('views', __name__)

# In-memory storage for tasks (temporary)
tasks = []
task_id_counter = 1

# Supported day labels
DAY_NAMES = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# ----------------------
# Task Management Routes
# ----------------------

@views.route('/tasks', methods=['GET', 'POST'])
def task_list():
    global task_id_counter

    selected_day = request.args.get('day', 'Today')
    if selected_day not in DAY_NAMES:
        selected_day = 'Today'

    if request.method == 'POST':
        task_text = request.form.get('task')
        task_day = request.form.get('day', 'Today')

        if task_text and task_day in DAY_NAMES:
            tasks.append({
                'id': task_id_counter,
                'text': task_text,
                'completed': False,
                'day': task_day
            })
            task_id_counter += 1
        return redirect(url_for('views.task_list', day=task_day))

    return render_template(
        'daily_organiser.html',
        tasks=tasks,
        selected_day=selected_day,
        selected_day_index=DAY_NAMES.index(selected_day)
    )

@views.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return redirect(request.referrer or url_for('views.task_list'))

@views.route('/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            break
    return redirect(request.referrer or url_for('views.task_list'))

@views.route('/edit/<int:task_id>', methods=['POST'])
def edit_task(task_id):
    new_text = request.form.get('edited_text')
    for task in tasks:
        if task['id'] == task_id and new_text:
            task['text'] = new_text
            break
    return redirect(request.referrer or url_for('views.task_list'))

# ----------------------
# Navigation & Calendar
# ----------------------

@views.route('/')
def index():
    # Redirect root to the event-adding route
    return redirect(url_for('events.add_event'))

@views.route('/calendar')
def calendar():
    return render_template('calendar.html', events=events)


