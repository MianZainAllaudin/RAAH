# backend/server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native app

# Path to db.json file (in the same directory as server.py)
DB_FILE = 'db.json'

# Initialize db.json if it doesn't exist
def init_db():
    if not os.path.exists(DB_FILE):
        initial_data = {
            "reports": []
        }
        with open(DB_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        print(f"✅ Created {DB_FILE}")
    else:
        print(f"✅ {DB_FILE} already exists")

# Read database
def read_db():
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error reading database: {e}")
        return {"reports": []}

# Write to database
def write_db(data):
    try:
        with open(DB_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"❌ Error writing to database: {e}")
        return False

# Submit report endpoint
@app.route('/api/reports', methods=['POST'])
def submit_report():
    try:
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        if not data.get('description'):
            return jsonify({'error': 'Description is required'}), 400
        
        if not data.get('severity'):
            return jsonify({'error': 'Severity is required'}), 400
        
        # Read current database
        db = read_db()
        
        # Create new report
        new_report = {
            'id': str(int(datetime.now().timestamp() * 1000)),
            'location': data.get('location', {
                'address': 'Unknown',
                'coordinates': None
            }),
            'image': data.get('image'),
            'description': data.get('description'),
            'severity': data.get('severity'),
            'timestamp': datetime.now().isoformat(),
            'status': 'pending'
        }
        
        # Add to reports array
        db['reports'].append(new_report)
        
        # Write to database
        if write_db(db):
            print(f"✅ New report added: ID {new_report['id']}")
            print(f"   Location: {new_report['location']['address']}")
            print(f"   Severity: {new_report['severity']}")
            return jsonify({
                'message': 'Report submitted successfully',
                'report': new_report
            }), 201
        else:
            return jsonify({'error': 'Failed to save report'}), 500
            
    except Exception as e:
        print(f"❌ Error in submit_report: {e}")
        return jsonify({'error': str(e)}), 500

# Get all reports
@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        db = read_db()
        print(f"📋 Fetching all reports: {len(db['reports'])} found")
        return jsonify({'reports': db['reports']}), 200
    except Exception as e:
        print(f"❌ Error in get_reports: {e}")
        return jsonify({'error': str(e)}), 500

# Get single report by ID
@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    try:
        db = read_db()
        report = next((r for r in db['reports'] if r['id'] == report_id), None)
        
        if report:
            print(f"📄 Report found: ID {report_id}")
            return jsonify({'report': report}), 200
        else:
            print(f"❌ Report not found: ID {report_id}")
            return jsonify({'error': 'Report not found'}), 404
    except Exception as e:
        print(f"❌ Error in get_report: {e}")
        return jsonify({'error': str(e)}), 500

# Update report status
@app.route('/api/reports/<report_id>', methods=['PUT'])
def update_report(report_id):
    try:
        db = read_db()
        data = request.get_json()
        
        for report in db['reports']:
            if report['id'] == report_id:
                # Update fields
                if 'status' in data:
                    report['status'] = data['status']
                if 'description' in data:
                    report['description'] = data['description']
                if 'severity' in data:
                    report['severity'] = data['severity']
                
                if write_db(db):
                    print(f"✅ Report updated: ID {report_id}")
                    return jsonify({'message': 'Report updated successfully', 'report': report}), 200
                else:
                    return jsonify({'error': 'Failed to update report'}), 500
        
        return jsonify({'error': 'Report not found'}), 404
    except Exception as e:
        print(f"❌ Error in update_report: {e}")
        return jsonify({'error': str(e)}), 500

# Delete report by ID
@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    try:
        db = read_db()
        initial_length = len(db['reports'])
        db['reports'] = [r for r in db['reports'] if r['id'] != report_id]
        
        if len(db['reports']) < initial_length:
            if write_db(db):
                print(f"🗑️  Report deleted: ID {report_id}")
                return jsonify({'message': 'Report deleted successfully'}), 200
            else:
                return jsonify({'error': 'Failed to delete report'}), 500
        else:
            return jsonify({'error': 'Report not found'}), 404
    except Exception as e:
        print(f"❌ Error in delete_report: {e}")
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Server is running', 'timestamp': datetime.now().isoformat()}), 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'RAAH Disaster Reporting API',
        'version': '1.0',
        'endpoints': {
            'health': '/health',
            'reports': '/api/reports',
            'single_report': '/api/reports/<id>'
        }
    }), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run server
    print("\n" + "="*50)
    print("🚀 RAAH Backend Server Starting...")
    print("="*50)
    print("📍 Server running on: http://0.0.0.0:3000")
    print("📍 Local access: http://127.0.0.1:3000")
    print("📍 Network access: http://192.168.0.102:3000")
    print("="*50)
    print("⚠️  Make sure your React Native app uses: http://192.168.0.102:3000")
    print("⚠️  Both devices must be on the same WiFi network")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=3000, debug=True)