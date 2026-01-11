import re
import pandas as pd
import io
import time
from collections import Counter
from textblob import TextBlob
from langdetect import detect
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor

class TextAnalyzer:
    def __init__(self):
        self.stop_words = {'i', 'me', 'my', 'the', 'and', 'a', 'an', 'is', 'it', 'of', 'to', 'in', 'that'}
        self.sentiment_rules = {
            'positive': ['total', 'graduate', 'agriculture', 'forestry', 'fishing', 'support', 'active', 'success', 'helpful', 'profit'],
            'negative': ['debt', 'overdraft', 'outstanding', 'issue', 'delayed', 'fail', 'error', 'poor', 'unpaid', 'loss']
        }
        self.pattern_registry = {
            "Financial Indicators": r"\b(debt|overdraft|income|value|finance|bank)\b",
            "Industrial Sectors": r"\b(agriculture|forestry|retail|manufacturing|mining)\b"
        }

    def _get_df(self, text):
        try:
            return pd.read_csv(io.StringIO(text.strip()), sep=None, engine='python', skipinitialspace=True)
        except: return None

    def _score_text_logic(self, t):
        score = 0
        text_lower = str(t).lower()
        for word in self.sentiment_rules['positive']:
            if word in text_lower: score += 1
        for word in self.sentiment_rules['negative']:
            if word in text_lower: score -= 1
        return score

    def run_pipeline(self, raw_text, operations):
        df = self._get_df(raw_text)
        if df is None or df.empty:
            return [{"title": "Error", "output": "Invalid Data", "success": False}], None, None, None

        start_time = time.time()
        total_records = len(df)
        candidates = [c for c in df.columns if c.lower() not in ['id', 'value', 'line_code', 'year']]
        target_col = max(candidates, key=lambda c: df[c].astype(str).str.len().mean())

        # Milestone 2: Pattern Filtering
        sample_block = " ".join(df[target_col].astype(str).head(20)).lower() 
        detected_patterns = [p for p, reg in self.pattern_registry.items() if re.findall(reg, sample_block)]

        # Multilingual Golden Rule
        try: lang = detect(" ".join(df[target_col].astype(str).head(5)))
        except: lang = 'en'
        
        working_col = target_col
        if lang != 'en':
            translator = GoogleTranslator(source='auto', target='en')
            translate_limit = min(total_records, 50)
            with ThreadPoolExecutor(max_workers=10) as ex:
                translated = list(ex.map(lambda x: translator.translate(str(x)), df[target_col].head(translate_limit).tolist()))
            df[f'{target_col}_en'] = df[target_col]
            df.iloc[0:translate_limit, df.columns.get_loc(f'{target_col}_en')] = translated
            working_col = f'{target_col}_en'

        # Milestone 3: Parallel Scoring
        with ThreadPoolExecutor(max_workers=10) as ex:
            scores = list(ex.map(self._score_text_logic, df[working_col].tolist()))
        
        avg_score = sum(scores) / len(scores) if scores else 0
        results = []

        for op in operations:
            output = ""
            if op == "Summarization":
                output = f"📊 Data Distribution Analysis\n- Total Records: {total_records}\n- Patterns Found: {', '.join(detected_patterns)}\n"
                num_df = df.select_dtypes(include=['number'])
                for col in num_df.columns:
                    if 'id' not in col.lower(): output += f"- Mean {col}: {df[col].mean():.2f}\n"
            elif op == "Sentiment Analysis":
                label = "Growth/Positive" if avg_score > 0 else "Risk/Negative" if avg_score < 0 else "Neutral"
                output = f"🧠 Analytics Rule Engine: {label}\n- Sentiment Index: {avg_score:.2f}\n- Hits: {sum(1 for s in scores if s != 0)} records."
            elif op == "Keyword Extraction":
                output = "🔑 Category Frequency:\n"
                for col in candidates[:3]:
                    top = df[col].value_counts().head(3)
                    dist = ", ".join([f"{k}({v})" for k, v in top.items()])
                    output += f"- {col.capitalize()}: {dist}\n"
            elif op == "Translation":
                output = f"🌐 Translation Engine: Active\n- Detected: {lang.upper()}\n- Standard: English Analysis."
            elif op == "Convert Case":
                output = f"Transformation (UPPERCASE):\n{str(df[target_col].iloc[0]).upper()}"
            else:
                output = "Status: Not Applicable\nReason: Dataset contains tabular factual data."

            results.append({"title": op, "output": output, "success": True})

        stats = {"total_chunks": (total_records // 10) + 1, "processing_time": time.time() - start_time, "alert": avg_score < -0.3, "avg_score": avg_score}
        return results, df.to_dict('records'), stats, scores