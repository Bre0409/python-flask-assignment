from flask import Blueprint, render_template, request, redirect, url_for
from .events import events  # ✅ Import the in-memory events list

views = Blueprint('views', __name__)

tasks = []
task_id_counter = 1

@views.route('/tasks', methods=['GET', 'POST'])
def task_list():
    global task_id_counter

    if request.method == 'POST':
        task_text = request.form.get('task')
        if task_text:
            tasks.append({
                'id': task_id_counter,
                'text': task_text,
                'completed': False
            })
            task_id_counter += 1
        return redirect(url_for('views.task_list'))

    return render_template('todolist.html', tasks=tasks)

@views.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return redirect(url_for('views.task_list'))

@views.route('/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            break
    return redirect(url_for('views.task_list'))

@views.route('/edit/<int:task_id>', methods=['POST'])
def edit_task(task_id):
    new_text = request.form.get('edited_text')
    for task in tasks:
        if task['id'] == task_id:
            task['text'] = new_text
            break
    return redirect(url_for('views.task_list'))

@views.route('/')
def index():
    return redirect(url_for('events.add_event'))

@views.route('/calendar')
def calendar():
    return render_template('calendar.html', events=events)  


