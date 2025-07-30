from flask import Blueprint, render_template, request, redirect, url_for
from .events import events  # Import from another location

# Views blueprint created
views = Blueprint('views', __name__)  

# Global Task Storage
tasks = []                
task_id_counter = 1       

# Day options
DAY_NAMES = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Task List View + Add Tasks
@views.route('/tasks', methods=['GET', 'POST'])
def task_list():
    global task_id_counter  

    # Day selection from day list
    selected_day = request.args.get('day', 'Today')
    if selected_day not in DAY_NAMES:
        selected_day = 'Today'  

    # Form submission
    if request.method == 'POST':
        task_text = request.form.get('task')
        task_day = request.form.get('day', 'Today')

        # Validate input and add new task
        if task_text and task_day in DAY_NAMES:
            tasks.append({
                'id': task_id_counter,
                'text': task_text,
                'completed': False,
                'day': task_day
            })
            task_id_counter += 1 

        # Avoid form resubmission and maintain selected day
        return redirect(url_for('views.task_list', day=task_day))

    # Render the task list
    return render_template(
        'daily_organiser.html',
        tasks=tasks,
        selected_day=selected_day,
        selected_day_index=DAY_NAMES.index(selected_day)
    )

# Delete a task or remove same task of same name
@views.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    global tasks
    
    tasks = [task for task in tasks if task['id'] != task_id]
    
    return redirect(request.referrer or url_for('views.task_list'))

# Mark task complete/incomplete
@views.route('/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']  
            break
    return redirect(request.referrer or url_for('views.task_list'))

# Edit a tasks text
@views.route('/edit/<int:task_id>', methods=['POST'])
def edit_task(task_id):
    new_text = request.form.get('edited_text')
    for task in tasks:
        if task['id'] == task_id and new_text:
            task['text'] = new_text 
            break
    return redirect(request.referrer or url_for('views.task_list'))

# Redirect for Home Page to be Main page
@views.route('/')
def index():
    return redirect(url_for('auth.home'))

# Calendar view
@views.route('/calendar')
def calendar():
    # Render a calendar template and pass in events
    return render_template('calendar.html', events=events)


