from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sqlite3, json, smtplib, os, traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.security import generate_password_hash, check_password_hash

# Import your intelligent logic file
from backend_text_analysis import TextAnalyzer

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE_PATH = 'users.db'

# ==========================================
# GMAIL SMTP CONFIGURATION (REAL)
# ==========================================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465 
SENDER_EMAIL = "anushkaswamysetty@gmail.com"
# ENSURE THIS IS THE 16-DIGIT APP PASSWORD FROM GOOGLE
SENDER_PASSWORD = "lmrj rtvd ydsz xfri" # <-- Double check if a character is missing!

def send_analysis_email(recipient, filename, results_list):
    """ACTUALLY sends a real email via Google SMTP servers."""
    try:
        subject = f"TextFlow Analytics Report – {filename}"
        body = f"Hello,\n\nYour analysis task for '{filename}' is complete.\n\n"
        body += "---------- SUMMARY REPORT ----------\n"
        for r in results_list:
            body += f"\n[{r['title']}]\n{r['output']}\n"
        body += "\n\nThis is an automated report from your TextFlow App."

        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = recipient
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=20)
        server.login(SENDER_EMAIL, SENDER_PASSWORD.strip())
        server.send_message(msg)
        server.quit()

        print(f"✅ REAL GMAIL SENT SUCCESSFULLY TO {recipient}")
        return True
    except Exception as e:
        print(f"❌ REAL GMAIL FAILURE: {str(e)}")
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
        db.execute("""CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)""")
        db.execute("""CREATE TABLE IF NOT EXISTS inbox (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, message TEXT, type TEXT, report_data TEXT, email_sent INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
        db.execute("""CREATE TABLE IF NOT EXISTS activity_history (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, operations TEXT, status TEXT, records_count INTEGER, processing_time REAL, report_data TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
        db.execute('''CREATE TABLE IF NOT EXISTS processed_history (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, score REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
        db.execute('CREATE INDEX IF NOT EXISTS idx_content ON processed_history(content)')
        db.execute('CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)')
    print("✅ DATABASE & ALL TABLES SYNCHRONIZED")

init_db()

# ==========================================
# ROUTES
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
    except: return jsonify({"message": "User exists"}), 400

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE email = ?", (data.get("email"),)).fetchone()
    if user and check_password_hash(user['password'], data.get("password")):
        return jsonify({"message": "OK", "user": data.get("email")}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    raw_text = data.get("text", "")
    operations = data.get("operations", [])
    want_email = data.get("email_summary", False)
    user_email = data.get("email", "Guest")
    filename = data.get("filename", "Uploaded_Data.csv")

    analyzer = TextAnalyzer()
    results, raw_rows, stats, scores = analyzer.run_pipeline(raw_text, operations)

    report_json = json.dumps(results)
    email_status_note = "Email not requested"
    email_flag = 0 

    if want_email and user_email != "Guest":
        success = send_analysis_email(user_email, filename, results)
        email_status_note = f"Report dispatched to {user_email}" if success else "Gmail delivery failed"
        email_flag = 1 if success else 2

    with get_db() as db:
        for idx, row in enumerate(raw_rows[:50]):
            db.execute("INSERT INTO processed_history (content, score) VALUES (?, ?)", (str(row), scores[idx] if idx < len(scores) else 0))
        db.execute("INSERT INTO inbox (title, message, type, report_data, email_sent) VALUES (?, ?, ?, ?, ?)",
            ("Analysis Task Completed", f"Processed {len(raw_rows)} records. Status: {email_status_note}", "success", report_json, email_flag))
        db.execute("INSERT INTO activity_history (filename, operations, status, records_count, processing_time, report_data) VALUES (?, ?, ?, ?, ?, ?)",
            (filename, ", ".join(operations), "Completed", len(raw_rows), stats["processing_time"], report_json))
        db.commit()

    return jsonify({"results": results, "stats": stats})

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

@app.route('/api/search')
def search():
    q = request.args.get('q', '')
    with get_db() as db:
        rows = db.execute("SELECT * FROM processed_history WHERE content LIKE ? LIMIT 15", (f'%{q}%',)).fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/health")
def health():
    return jsonify({"status": "Active", "port": 5001})

if __name__ == '__main__':
    app.run(debug=True, port=5001)