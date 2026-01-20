from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sqlite3, json, smtplib, io, csv, time, traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.security import generate_password_hash, check_password_hash
from backend_text_analysis import TextAnalyzer

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE_PATH = 'users.db'

# ==========================================
# GMAIL SMTP CONFIGURATION
# ==========================================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465 
SENDER_EMAIL = "anushkaswamysetty@gmail.com"
SENDER_PASSWORD = "lmrj rtvd ydsz xfri" # 16-digit App Password

def send_analysis_email(recipient, filename, results_list):
    try:
        subject = f"TextFlow Intelligence Report: {filename}"
        body = f"Hello,\n\nYour analysis for '{filename}' is complete.\n\n"
        body += "---------- SUMMARY REPORT ----------\n"
        for r in results_list:
            body += f"\n>> {r['title']}\n{r['output']}\n"
        body += "\nThis is an automated report from TextFlow."

        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = recipient
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=20)
        server.login(SENDER_EMAIL, SENDER_PASSWORD.replace(" ", ""))
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False

# ==========================================
# DATABASE INITIALIZATION
# ==========================================
def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as db:
        # Milestone 1: Users
        db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)")
        
        # Milestone 4: Search Index
        db.execute("""CREATE TABLE IF NOT EXISTS search_index (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            column_name TEXT,
            content TEXT,
            sentiment_score REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
        db.execute('CREATE INDEX IF NOT EXISTS idx_global_content ON search_index(content)')

        # Milestone 3: Inbox
        db.execute("""CREATE TABLE IF NOT EXISTS inbox (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT, message TEXT, type TEXT, 
            report_data TEXT, email_sent INTEGER DEFAULT 0, 
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
        
        # Calendar: Activity History
        db.execute("""CREATE TABLE IF NOT EXISTS activity_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            filename TEXT, operations TEXT, status TEXT, 
            records_count INTEGER, processing_time REAL, 
            report_data TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
        
        # Contact Support Table (FIXED)
        db.execute("""CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, email TEXT, message TEXT, 
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
            
    print("✅ ALL DATABASE SYSTEMS SYNCHRONIZED")

init_db()

# ==========================================
# AUTH & CONTACT ROUTES
# ==========================================

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    pw = generate_password_hash(data.get("password"))
    try:
        with get_db() as db:
            db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (data.get("full_name"), data.get("email"), pw))
            db.commit()
        return jsonify({"message": "Success"}), 201
    except: return jsonify({"message": "Error"}), 400

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE email = ?", (data.get("email"),)).fetchone()
    if user and check_password_hash(user['password'], data.get("password")):
        return jsonify({"message": "OK", "user": data.get("email")}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.json
        with get_db() as db:
            db.execute("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)", 
                       (data.get('name'), data.get('email'), data.get('message')))
            db.commit()
        return jsonify({"message": "Ticket received"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================
# ANALYSIS PIPELINE
# ==========================================

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    raw_text = data.get("text", "")
    operations = data.get("operations", [])
    want_email = data.get("email_summary", False)
    user_email = data.get("email", "Guest")
    filename = data.get("filename", "Bulk_Dataset.csv")

    analyzer = TextAnalyzer()
    results, raw_rows, stats, scores = analyzer.run_pipeline(raw_text, operations)

    report_json = json.dumps(results)
    email_status = "Not Requested"
    email_flag = 0 

    if want_email and user_email != "Guest":
        success = send_analysis_email(user_email, filename, results)
        email_status = f"Report sent to {user_email}" if success else "Email failed"
        email_flag = 1 if success else 2

    with get_db() as db:
        # Milestone 4: Indexing
        for idx, row in enumerate(raw_rows[:50]):
            for col_name, value in row.items():
                if len(str(value)) > 2:
                    db.execute("INSERT INTO search_index (filename, column_name, content, sentiment_score) VALUES (?, ?, ?, ?)",
                               (filename, col_name, str(value), scores[idx] if idx < len(scores) else 0))

        db.execute("INSERT INTO inbox (title, message, type, report_data, email_sent) VALUES (?, ?, ?, ?, ?)",
            ("Analysis Task Completed", f"Processed {len(raw_rows)} records. {email_status}", "success", report_json, email_flag))
        
        db.execute("INSERT INTO activity_history (filename, operations, status, records_count, processing_time, report_data) VALUES (?, ?, ?, ?, ?, ?)",
            (filename, ", ".join(operations), "Completed", len(raw_rows), stats["processing_time"], report_json))
        db.commit()

    return jsonify({"results": results, "stats": stats})

# ==========================================
# DATA RETRIEVAL
# ==========================================

@app.route('/api/search')
def search():
    q = request.args.get('q', '').lower()
    with get_db() as db:
        rows = db.execute("SELECT * FROM search_index WHERE content LIKE ? ORDER BY timestamp DESC LIMIT 20", (f'%{q}%',)).fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/inbox")
def get_inbox():
    with get_db() as db:
        rows = db.execute("SELECT * FROM inbox ORDER BY timestamp DESC").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/history")
def get_history():
    with get_db() as db:
        rows = db.execute("SELECT * FROM activity_history ORDER BY timestamp DESC").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/api/cleanup', methods=['POST'])
def cleanup():
    with get_db() as db:
        db.execute("DELETE FROM search_index")
        db.execute("DELETE FROM activity_history")
        db.execute("DELETE FROM inbox")
        db.commit()
    return jsonify({"message": "System logs purged"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)