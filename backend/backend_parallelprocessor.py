"""
Flask API Server for Text Processing
Connects frontend with backend processing
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import pandas as pd
from datetime import datetime
import sqlite3
from werkzeug.utils import secure_filename
import json

# Import the text analyzer
from backend_text_analysis import TextAnalyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
DATABASE_PATH = 'text_storage.db'
ALLOWED_EXTENSIONS = {'csv', 'txt'}

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Initialize database
def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS processing_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            operation TEXT,
            records_processed INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            output_file TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ========== API ENDPOINTS ==========

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if API is running"""
    return jsonify({
        "status": "running",
        "message": "TextFlow API is active"
    })

@app.route('/api/process-text', methods=['POST'])
def process_single_text():
    """
    Process a single text with specified operation
    
    Expected JSON:
    {
        "text": "your text here",
        "operation": "summarization",
        "params": {"num_sentences": 3}
    }
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        operation = data.get('operation', '')
        params = data.get('params', {})
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        if not operation:
            return jsonify({"error": "No operation specified"}), 400
        
        # Process text
        analyzer = TextAnalyzer()
        result = process_operation(analyzer, text, operation, params)
        
        return jsonify({
            "status": "success",
            "operation": operation,
            "input": text,
            "output": result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    """
    Upload CSV file and return column names for user to select text column
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only CSV files allowed"}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        saved_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)
        file.save(filepath)
        
        # Read CSV to get columns
        df = pd.read_csv(filepath, nrows=5)  # Read first 5 rows only
        columns = df.columns.tolist()
        sample_data = df.head().to_dict('records')
        
        return jsonify({
            "status": "success",
            "filename": saved_filename,
            "columns": columns,
            "sample_data": sample_data,
            "total_rows": len(pd.read_csv(filepath))
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/process-csv', methods=['POST'])
def process_csv():
    """
    Process CSV file with selected operations
    
    Expected JSON:
    {
        "filename": "uploaded_file.csv",
        "text_column": "text",
        "operations": ["summarization", "sentiment_analysis"],
        "params": {
            "summarization": {"num_sentences": 3},
            "sentiment_analysis": {}
        }
    }
    """
    try:
        data = request.get_json()
        filename = data.get('filename', '')
        text_column = data.get('text_column', '')
        operations = data.get('operations', [])
        params = data.get('params', {})
        
        if not filename or not text_column or not operations:
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Read CSV file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({"error": "File not found"}), 404
        
        df = pd.read_csv(filepath)
        
        if text_column not in df.columns:
            return jsonify({"error": f"Column '{text_column}' not found"}), 400
        
        # Initialize analyzer
        analyzer = TextAnalyzer()
        
        # Process each row
        total_rows = len(df)
        processed = 0
        
        for operation in operations:
            results = []
            operation_params = params.get(operation, {})
            
            for idx, row in df.iterrows():
                text = str(row[text_column]) if pd.notna(row[text_column]) else ""
                
                try:
                    result = process_operation(analyzer, text, operation, operation_params)
                    results.append(result)
                except Exception as e:
                    results.append(f"Error: {str(e)}")
                
                processed = idx + 1
            
            # Add results as new column
            df[f'{operation}_result'] = results
        
        # Save output file
        output_filename = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        df.to_csv(output_path, index=False)
        
        # Store in database
        store_processing_history(filename, ', '.join(operations), total_rows, output_filename)
        
        return jsonify({
            "status": "success",
            "processed_rows": total_rows,
            "operations": operations,
            "output_file": output_filename,
            "download_url": f"/api/download/{output_filename}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/process-csv-parallel', methods=['POST'])
def process_csv_parallel():
    """
    Process large CSV files with parallel processing
    """
    try:
        from multiprocessing import Pool, cpu_count
        
        data = request.get_json()
        filename = data.get('filename', '')
        text_column = data.get('text_column', '')
        operations = data.get('operations', [])
        params = data.get('params', {})
        
        if not filename or not text_column or not operations:
            return jsonify({"error": "Missing required parameters"}), 400
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({"error": "File not found"}), 404
        
        # Read CSV
        df = pd.read_csv(filepath)
        
        if text_column not in df.columns:
            return jsonify({"error": f"Column '{text_column}' not found"}), 400
        
        # Extract texts
        texts = df[text_column].fillna("").tolist()
        
        # Process each operation
        for operation in operations:
            operation_params = params.get(operation, {})
            
            # Parallel processing
            with Pool(processes=cpu_count()) as pool:
                results = pool.starmap(
                    process_operation_worker,
                    [(text, operation, operation_params) for text in texts]
                )
            
            df[f'{operation}_result'] = results
        
        # Save output
        output_filename = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        df.to_csv(output_path, index=False)
        
        # Store in database
        store_processing_history(filename, ', '.join(operations), len(df), output_filename)
        
        return jsonify({
            "status": "success",
            "processed_rows": len(df),
            "operations": operations,
            "output_file": output_filename,
            "download_url": f"/api/download/{output_filename}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download processed file"""
    try:
        filepath = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({"error": "File not found"}), 404
        
        return send_file(filepath, as_attachment=True)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get processing history"""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM processing_history 
            ORDER BY timestamp DESC 
            LIMIT 50
        ''')
        
        columns = [desc[0] for desc in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            "status": "success",
            "history": results
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/operations', methods=['GET'])
def get_operations():
    """Get list of available operations"""
    operations = [
        {
            "id": "summarization",
            "name": "Summarization",
            "description": "Summarize long text into key points",
            "params": {
                "num_sentences": {"type": "number", "default": 3, "min": 1, "max": 10}
            }
        },
        {
            "id": "translation",
            "name": "Translation",
            "description": "Simplify complex text",
            "params": {
                "target_lang": {"type": "string", "default": "simple"}
            }
        },
        {
            "id": "keyword_extraction",
            "name": "Keyword Extraction",
            "description": "Extract important keywords",
            "params": {
                "top_n": {"type": "number", "default": 10, "min": 1, "max": 50}
            }
        },
        {
            "id": "sentiment_analysis",
            "name": "Sentiment Analysis",
            "description": "Analyze positive/negative sentiment",
            "params": {}
        },
        {
            "id": "grammar_correction",
            "name": "Grammar Correction",
            "description": "Fix grammar and punctuation",
            "params": {}
        },
        {
            "id": "spell_check",
            "name": "Spell Check",
            "description": "Correct spelling errors",
            "params": {}
        },
        {
            "id": "remove_stop_words",
            "name": "Remove Stop Words",
            "description": "Remove common stop words",
            "params": {}
        },
        {
            "id": "convert_case",
            "name": "Convert Case",
            "description": "Change text case",
            "params": {
                "case_type": {
                    "type": "select",
                    "default": "lower",
                    "options": ["lower", "upper", "title", "sentence", "toggle", "camel", "snake", "kebab"]
                }
            }
        }
    ]
    
    return jsonify({
        "status": "success",
        "operations": operations
    })

# ========== HELPER FUNCTIONS ==========

def process_operation(analyzer, text, operation, params):
    """Process single operation on text"""
    if operation == "summarization":
        return analyzer.summarize(text, **params)
    elif operation == "translation":
        return analyzer.translate(text, **params)
    elif operation == "keyword_extraction":
        return analyzer.extract_keywords(text, **params)
    elif operation == "sentiment_analysis":
        return analyzer.analyze_sentiment(text)
    elif operation == "grammar_correction":
        return analyzer.correct_grammar(text)
    elif operation == "spell_check":
        return analyzer.spell_check(text)
    elif operation == "remove_stop_words":
        return analyzer.remove_stop_words(text)
    elif operation == "convert_case":
        return analyzer.convert_case(text, **params)
    else:
        return f"Unknown operation: {operation}"

def process_operation_worker(text, operation, params):
    """Worker function for parallel processing"""
    analyzer = TextAnalyzer()
    return process_operation(analyzer, text, operation, params)

def store_processing_history(filename, operation, records, output_file):
    """Store processing history in database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO processing_history 
        (filename, operation, records_processed, output_file)
        VALUES (?, ?, ?, ?)
    ''', (filename, operation, records, output_file))
    
    conn.commit()
    conn.close()

# ========== RUN SERVER ==========

if __name__ == '__main__':
    print("=" * 50)
    print("TextFlow API Server Starting...")
    print("=" * 50)
    print("\nAPI Endpoints:")
    print("  - GET  /api/health")
    print("  - POST /api/process-text")
    print("  - POST /api/upload-csv")
    print("  - POST /api/process-csv")
    print("  - POST /api/process-csv-parallel")
    print("  - GET  /api/download/<filename>")
    print("  - GET  /api/history")
    print("  - GET  /api/operations")
    print("\nServer running on: http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)