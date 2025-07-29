from flask import Blueprint, render_template, request, redirect, url_for

events_bp = Blueprint('events', __name__)

events = []
event_id_counter = 1

@events_bp.route('/events', methods=['GET', 'POST'])
def add_event():
    global event_id_counter

    # Import tasks here to avoid circular import
    from .views import tasks  

    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')
        if title and date:
            events.append({
                'id': event_id_counter,
                'title': title,
                'description': description,
                'date': date
            })
            event_id_counter += 1
        return redirect(url_for('events.add_event'))

    num_tasks = len(tasks)  # number of current tasks
    return render_template('events.html', events=events, edit_event=None, num_tasks=num_tasks)

@events_bp.route('/events/delete/<int:event_id>', methods=['POST'])
def delete_event(event_id):
    global events
    events = [event for event in events if event['id'] != event_id]
    return redirect(url_for('events.add_event'))

@events_bp.route('/events/edit/<int:event_id>', methods=['GET', 'POST'])
def edit_event(event_id):
    from .views import tasks  # import tasks again here

    global events

    event = next((e for e in events if e['id'] == event_id), None)
    if not event:
        return redirect(url_for('events.add_event'))

    if request.method == 'POST':
        event['title'] = request.form.get('title')
        event['description'] = request.form.get('description')
        event['date'] = request.form.get('date')
        return redirect(url_for('events.add_event'))

    num_tasks = len(tasks)
    return render_template('events.html', events=events, edit_event=event, num_tasks=num_tasks)

@events_bp.route('/calendar')
def calendar():
    return render_template('calendar.html', events=events)
