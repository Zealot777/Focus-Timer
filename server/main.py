#server/main.py
import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta, date

DATA_FILE = 'data.json'
app = Flask("focus-timer")
CORS(app,resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return "서버가 정상적으로 작동 중입니다!"
@app.route('/subjects', methods=['GET'])
def get_subjects():
    data = load_data()
    return jsonify(data['subjects'])
    
def load_data():
    if not os.path.exists(DATA_FILE):
        return {"subjects": [], "sessions": []}
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)
@app.route('/subjects', methods=['POST']) 
def add_subject():                        
    new_subject = request.json            
    data = load_data()                    
    if not data['subjects']:              
        new_id = 1                        
    else:                                 
        new_id = max(subject['id'] for subject in data['subjects']) + 1 
    new_subject['id'] = new_id            
    data['subjects'].append(new_subject)  
    save_data(data)                       
    return jsonify({                      
        "success": True,
        "new_subject": new_subject
    }), 201
def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.route('/subjects/<int:subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    data = load_data()
    original_count = len(data['subjects'])
    data['subjects'] = [s for s in data['subjects'] if s['id'] != subject_id]
    if len(data['subjects']) == original_count:
        return jsonify({"success": False, "message": "과목을 찾을 수 없습니다."}), 404
    save_data(data)
    return jsonify({"success": True}), 200



@app.route('/history', methods=['GET'])
def get_sessions():
    subject_id = request.args.get('subject_id')
    data = load_data()
    sessions = data['sessions']
    
    if subject_id:
        sessions = [s for s in sessions if str(s['subject_id']) == subject_id]
        
    for s in sessions:
        subject = next((sub for sub in data['subjects'] if sub['id'] == s['subject_id']), None)
        s['subject_name'] = subject['name'] if subject else "알 수 없음"
        
    return jsonify(sessions)

@app.route('/history', methods=['POST'])
def add_session():
    new_data = request.json
    data = load_data()
    
    new_id = (max([s['id'] for s in data['sessions']], default=0)) + 1
    record = {
        "id": new_id,
        "subject_id": new_data['subject_id'],
        "subject_name": new_data['subject_name'],
        "duration": new_data['duration'],
        "created_at": datetime.now().isoformat()
    }
    
    data['sessions'].append(record)
    save_data(data)
    return jsonify(record), 201

@app.route('/history/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    data = load_data()
    data['sessions'] = [s for s in data['sessions'] if s['id'] != session_id]
    save_data(data)
    return jsonify({"success": True}), 200
@app.route('/stats', methods=['GET'])
def get_stats():
    data = load_data()
    sessions = data['sessions']
    subjects = {s['id']: s['name'] for s in data['subjects']}
    today = date.today()
    
    # 1. 총 집중 시간
    total_seconds = sum(s['duration'] for s in sessions)
    total_hours = round(total_seconds / 3600, 1)

    # 2. 이번 주 세션 수
    week_ago = today - timedelta(days=7)
    sessions_this_week = [
        s for s in sessions 
        if datetime.fromisoformat(s['created_at']).date() >= week_ago
    ]
    
    # 3. 과목별 시간
    subject_map = {}
    for s in sessions:
        name = subjects.get(s['subject_id'], "Unknown")
        subject_map[name] = subject_map.get(name, 0) + s['duration']
    by_subject = [{"name": name, "minutes": sec // 60} for name, sec in subject_map.items()]

    # 4. 주간 패턴
    weekday_map = {"Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0}
    days_eng = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for s in sessions:
        dt = datetime.fromisoformat(s['created_at'])
        if dt.date() >= week_ago:
            day_name = dt.strftime('%a')
            weekday_map[day_name] = weekday_map.get(day_name, 0) + (s['duration'] // 60)
            
    # 5. 연속 기록
    streak = 0
    if sessions:
        study_dates = sorted(list(set(datetime.fromisoformat(s['created_at']).date() for s in sessions)), reverse=True)
        if study_dates[0] in [today, today - timedelta(days=1)]:
            current_date = study_dates[0]
            for d in study_dates:
                if d == current_date:
                    streak += 1
                    current_date -= timedelta(days=1)
                else: break

    return jsonify({
        "streak": streak,
        "total_hours": total_hours,
        "sessions_this_week": len(sessions_this_week),
        "by_subject": by_subject,
        "by_weekday": [{"day": k, "minutes": v} for k, v in weekday_map.items()]
    })
if __name__ == '__main__':
    app.run(debug=True, port=5000)