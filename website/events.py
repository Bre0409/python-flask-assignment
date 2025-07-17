from flask import Blueprint, render_template, request, redirect, url_for

# Create blueprint
events_bp = Blueprint('events', __name__)

# In-memory event list
events = []
event_id_counter = 1

@events_bp.route('/events', methods=['GET', 'POST'])
def add_event():
    global event_id_counter

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

    return render_template('events.html', events=events, edit_event=None)

@events_bp.route('/events/delete/<int:event_id>', methods=['POST'])
def delete_event(event_id):
    global events
    events = [event for event in events if event['id'] != event_id]
    return redirect(url_for('events.add_event'))

@events_bp.route('/events/edit/<int:event_id>', methods=['GET', 'POST'])
def edit_event(event_id):
    global events

    # Find the event
    event = next((e for e in events if e['id'] == event_id), None)

    if not event:
        return redirect(url_for('events.add_event'))

    if request.method == 'POST':
        # Update event fields
        event['title'] = request.form.get('title')
        event['description'] = request.form.get('description')
        event['date'] = request.form.get('date')
        return redirect(url_for('events.add_event'))

    # Render same page with edit_event passed to template
    return render_template('events.html', events=events, edit_event=event)

@events_bp.route('/calendar')
def calendar():
    # Pass all events to calendar page
    return render_template('calendar.html', events=events)


