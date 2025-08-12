import os
import logging
from flask import Flask, render_template, send_from_directory, after_this_request

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching during development

@app.route('/')
def index():
    """Render the panorama viewer page."""
    # Define the panorama scenes (these will be loaded dynamically in the front-end)
    panoramas = [
        {"id": "1", "name": "1", "file": "1.jpg"},
        {"id": "2", "name": "2", "file": "2.jpg"},
        {"id": "3", "name": "3", "file": "3.jpg"},
        {"id": "4", "name": "4", "file": "4.jpg"},
        {"id": "5", "name": "5", "file": "5.jpg"},
        {"id": "6", "name": "6", "file": "6.jpg"},
        {"id": "7", "name": "7", "file": "7.jpg"},
        {"id": "8", "name": "8", "file": "8.jpg"}
    ]
    return render_template('index.html', panoramas=panoramas)

@app.route('/aframe-test')
def aframe_test():
    """Simple A-Frame test page"""
    return send_from_directory('static', 'direct-test.html')

@app.route('/pannellum-test')
def pannellum_test():
    """Simple Pannellum test page"""
    return send_from_directory('static', 'pannellum-test.html')

@app.route('/simple-test')
def simple_test():
    """Simple direct image loading test page"""
    return send_from_directory('static', 'simple-test.html')

@app.route('/panorama-images/<path:filename>')
def panorama_images(filename):
    """Serve panorama images directly from the attached_assets directory."""
    @after_this_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET'
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
        
    return send_from_directory('attached_assets', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
