from flask import Flask, request, jsonify
from datetime import datetime
import uuid

app = Flask(__name__)

# -----------------------
# In-memory storage
# -----------------------
VIDEOS = []  # Should match TutorUpload storage
PAPERS = []
REPORTS = []

# -----------------------
# Student-facing endpoints
# -----------------------

@app.route('/student/videos', methods=['GET'])
def get_videos():
    """Return all tutorials (can add filtering/search on backend if needed)"""
    return jsonify(VIDEOS), 200

@app.route('/student/papers', methods=['GET'])
def get_papers():
    """Return all papers"""
    return jsonify(PAPERS), 200

@app.route('/student/reports', methods=['GET'])
def get_reports():
    """Return all reports submitted by students"""
    return jsonify(REPORTS), 200

@app.route('/student/report', methods=['POST'])
def submit_report():
    """Student submits a report on a video or paper"""
    data = request.json
    if not data:
        return jsonify({'error': 'Missing report data'}), 400

    report = {
        'id': str(uuid.uuid4()),
        'type': data.get('type'),  # 'video' or 'paper'
        'itemTitle': data.get('itemTitle'),
        'itemUrl': data.get('itemUrl'),
        'uploader': data.get('uploader'),
        'reason': data.get('reason', 'Report'),
        'reportedAt': datetime.utcnow().isoformat()
    }
    REPORTS.append(report)
    return jsonify(report), 201

# -----------------------
# Optional: filtering & searching
# -----------------------
@app.route('/student/search', methods=['GET'])
def search_items():
    """Optional endpoint to handle backend search/filter for students"""
    query = request.args.get('q', '').lower()
    uploader_filter = request.args.get('uploader', 'All')
    subject_filter = request.args.get('subject', 'All')

    def matches(item):
        title_match = query in (item.get('title') or '').lower()
        uploader_match = uploader_filter == 'All' or item.get('uploader') == uploader_filter
        subject_match = subject_filter == 'All' or item.get('subject') == subject_filter
        return title_match and uploader_match and subject_match

    results = [v for v in VIDEOS if matches(v)] + [p for p in PAPERS if matches(p)]
    return jsonify(results), 200

if __name__ == '__main__':
    app.run(debug=True)
