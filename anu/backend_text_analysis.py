"""
Text Analysis Backend
Implements all text processing operations
"""

import re
from typing import List, Dict, Tuple, Set
from collections import Counter
import string

class TextAnalyzer:
    """Comprehensive text analysis operations"""
    
    def __init__(self):
        """Initialize text analyzer with necessary data"""
        self.stop_words = self._load_stop_words()
        self.sentiment_lexicon = self._load_sentiment_lexicon()
        self.common_errors = self._load_common_errors()
        
    @staticmethod
    def _load_stop_words() -> Set[str]:
        """Load common stop words"""
        return {
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
            'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how',
            'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
            'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
            'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now',
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
            'you', 'your', 'yours', 'yourself', 'yourselves', 'him', 'his',
            'himself', 'she', 'her', 'hers', 'herself', 'them', 'their',
            'theirs', 'themselves', 'am', 'been', 'being', 'do', 'does',
            'did', 'doing', 'would', 'could', 'ought', 'i\'m', 'you\'re',
            'he\'s', 'she\'s', 'it\'s', 'we\'re', 'they\'re', 'i\'ve',
            'you\'ve', 'we\'ve', 'they\'ve', 'i\'d', 'you\'d', 'he\'d',
            'she\'d', 'we\'d', 'they\'d', 'i\'ll', 'you\'ll', 'he\'ll',
            'she\'ll', 'we\'ll', 'they\'ll', 'isn\'t', 'aren\'t', 'wasn\'t',
            'weren\'t', 'hasn\'t', 'haven\'t', 'hadn\'t', 'doesn\'t',
            'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'shan\'t',
            'shouldn\'t', 'can\'t', 'cannot', 'couldn\'t', 'mustn\'t',
            'let\'s', 'that\'s', 'who\'s', 'what\'s', 'here\'s', 'there\'s',
            'when\'s', 'where\'s', 'why\'s', 'how\'s'
        }
    
    @staticmethod
    def _load_sentiment_lexicon() -> Dict[str, float]:
        """Load sentiment word scores"""
        positive_words = {
            'good': 1.0, 'great': 1.5, 'excellent': 2.0, 'amazing': 2.0,
            'wonderful': 1.5, 'fantastic': 2.0, 'awesome': 1.5, 'perfect': 2.0,
            'best': 2.0, 'love': 1.5, 'like': 0.5, 'enjoy': 1.0, 'happy': 1.5,
            'beautiful': 1.5, 'brilliant': 2.0, 'outstanding': 2.0, 'superb': 2.0,
            'delightful': 1.5, 'pleasant': 1.0, 'nice': 0.5, 'fine': 0.5,
            'positive': 1.0, 'success': 1.5, 'successful': 1.5, 'better': 1.0,
            'improve': 1.0, 'improvement': 1.0, 'beneficial': 1.0, 'advantage': 1.0,
            'superior': 1.5, 'exceptional': 2.0, 'remarkable': 1.5, 'impressive': 1.5
        }
        
        negative_words = {
            'bad': -1.0, 'terrible': -2.0, 'horrible': -2.0, 'awful': -2.0,
            'poor': -1.0, 'worst': -2.0, 'hate': -2.0, 'dislike': -1.0,
            'sad': -1.5, 'disappointed': -1.5, 'disappointing': -1.5,
            'ugly': -1.5, 'wrong': -1.0, 'problem': -1.0, 'issue': -0.5,
            'fail': -1.5, 'failure': -1.5, 'failed': -1.5, 'negative': -1.0,
            'worse': -1.0, 'inferior': -1.0, 'useless': -1.5, 'worthless': -2.0,
            'difficult': -0.5, 'hard': -0.5, 'complex': -0.5, 'complicated': -0.5,
            'error': -1.0, 'mistake': -1.0, 'weak': -1.0, 'defect': -1.5,
            'defective': -1.5, 'lacking': -1.0, 'mediocre': -1.0, 'subpar': -1.0
        }
        
        return {**positive_words, **negative_words}
    
    @staticmethod
    def _load_common_errors() -> Dict[str, str]:
        """Load common spelling errors and corrections"""
        return {
            'teh': 'the', 'thier': 'their', 'occured': 'occurred',
            'recieve': 'receive', 'seperate': 'separate', 'definately': 'definitely',
            'accomodate': 'accommodate', 'wich': 'which', 'untill': 'until',
            'begining': 'beginning', 'tommorrow': 'tomorrow', 'occassion': 'occasion',
            'sucessful': 'successful', 'concious': 'conscious', 'existance': 'existence',
            'appearence': 'appearance', 'realy': 'really', 'truely': 'truly',
            'basicly': 'basically', 'finaly': 'finally', 'naturaly': 'naturally',
            'usualy': 'usually', 'actualy': 'actually', 'generaly': 'generally',
            'totaly': 'totally', 'personaly': 'personally', 'alot': 'a lot',
            'noone': 'no one', 'cant': 'can\'t', 'wont': 'won\'t', 'dont': 'don\'t',
            'shouldnt': 'shouldn\'t', 'couldnt': 'couldn\'t', 'wouldnt': 'wouldn\'t'
        }
    
    def summarize(self, text: str, num_sentences: int = 3, 
                  method: str = 'extractive') -> str:
        """
        Summarize text using extractive method
        
        Args:
            text: Input text
            num_sentences: Number of sentences in summary
            method: Summarization method
            
        Returns:
            Summary text
        """
        if not text or not text.strip():
            return ""
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if len(sentences) <= num_sentences:
            return text
        
        # Score sentences based on word frequency
        words = re.findall(r'\b\w+\b', text.lower())
        word_freq = Counter(words)
        
        # Remove stop words from frequency
        for stop_word in self.stop_words:
            word_freq.pop(stop_word, None)
        
        # Score each sentence
        sentence_scores = {}
        for i, sentence in enumerate(sentences):
            score = 0
            words_in_sentence = re.findall(r'\b\w+\b', sentence.lower())
            for word in words_in_sentence:
                score += word_freq.get(word, 0)
            
            # Normalize by sentence length
            if len(words_in_sentence) > 0:
                sentence_scores[i] = score / len(words_in_sentence)
            else:
                sentence_scores[i] = 0
        
        # Get top sentences
        top_sentences = sorted(sentence_scores.items(), 
                              key=lambda x: x[1], 
                              reverse=True)[:num_sentences]
        
        # Sort by original position
        top_sentences = sorted(top_sentences, key=lambda x: x[0])
        
        # Build summary
        summary = '. '.join([sentences[i] for i, _ in top_sentences])
        if not summary.endswith('.'):
            summary += '.'
        
        return summary
    
    def translate(self, text: str, target_lang: str = 'simple',
                  source_lang: str = 'auto') -> str:
        """
        Simplified translation (rule-based simplification)
        Note: For real translation, integrate with translation API
        
        Args:
            text: Input text
            target_lang: Target language
            source_lang: Source language
            
        Returns:
            Translated/simplified text
        """
        if not text or not text.strip():
            return ""
        
        # Simple text simplification as a placeholder
        if target_lang == 'simple':
            # Replace complex words with simpler alternatives
            simplifications = {
                'utilize': 'use', 'demonstrate': 'show', 'accomplish': 'do',
                'implement': 'do', 'facilitate': 'help', 'obtain': 'get',
                'purchase': 'buy', 'assist': 'help', 'require': 'need',
                'sufficient': 'enough', 'approximately': 'about',
                'commence': 'start', 'terminate': 'end', 'modify': 'change',
                'nevertheless': 'but', 'therefore': 'so', 'furthermore': 'also',
                'however': 'but', 'consequently': 'so', 'subsequently': 'then'
            }
            
            result = text
            for complex_word, simple_word in simplifications.items():
                pattern = r'\b' + complex_word + r'\b'
                result = re.sub(pattern, simple_word, result, flags=re.IGNORECASE)
            
            return result
        
        # For actual translation, you would integrate with:
        # - Google Translate API
        # - Microsoft Translator
        # - DeepL API
        return f"[Translation to {target_lang}]: {text}"
    
    def extract_keywords(self, text: str, top_n: int = 10,
                        method: str = 'frequency') -> str:
        """
        Extract keywords from text
        
        Args:
            text: Input text
            top_n: Number of keywords to extract
            method: Extraction method
            
        Returns:
            Comma-separated keywords
        """
        if not text or not text.strip():
            return ""
        
        # Tokenize and clean
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Remove stop words and short words
        filtered_words = [
            word for word in words 
            if word not in self.stop_words and len(word) > 2
        ]
        
        if method == 'frequency':
            # Count frequency
            word_freq = Counter(filtered_words)
            
            # Get top N
            top_words = word_freq.most_common(top_n)
            keywords = [word for word, _ in top_words]
            
            return ', '.join(keywords)
        
        return ', '.join(filtered_words[:top_n])
    
    def analyze_sentiment(self, text: str) -> str:
        """
        Analyze sentiment of text using rule-based approach
        
        Args:
            text: Input text
            
        Returns:
            Sentiment label with score
        """
        if not text or not text.strip():
            return "Neutral (0.0)"
        
        # Tokenize
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Calculate sentiment score
        total_score = 0
        sentiment_words = 0
        
        for word in words:
            if word in self.sentiment_lexicon:
                total_score += self.sentiment_lexicon[word]
                sentiment_words += 1
        
        # Normalize score
        if sentiment_words > 0:
            avg_score = total_score / len(words)
        else:
            avg_score = 0
        
        # Classify sentiment
        if avg_score > 0.05:
            sentiment = "Positive"
        elif avg_score < -0.05:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"
        
        return f"{sentiment} ({avg_score:.3f})"
    
    def correct_grammar(self, text: str) -> str:
        """
        Basic grammar correction
        
        Args:
            text: Input text
            
        Returns:
            Grammar-corrected text
        """
        if not text or not text.strip():
            return ""
        
        result = text
        
        # Capitalize first letter
        if result and result[0].islower():
            result = result[0].upper() + result[1:]
        
        # Capitalize after period
        result = re.sub(r'([.!?]\s+)([a-z])', 
                       lambda m: m.group(1) + m.group(2).upper(), 
                       result)
        
        # Fix spacing around punctuation
        result = re.sub(r'\s+([,.!?;:])', r'\1', result)
        result = re.sub(r'([,.!?;:])\s*', r'\1 ', result)
        
        # Fix multiple spaces
        result = re.sub(r'\s+', ' ', result)
        
        # Common grammar fixes
        grammar_fixes = {
            r'\bi\b': 'I',
            r'\bi\'m\b': 'I\'m',
            r'\bi\'ve\b': 'I\'ve',
            r'\bi\'ll\b': 'I\'ll',
            r'\bi\'d\b': 'I\'d',
            r'\s+a\s+([aeiouAEIOU])': r' an \1',
            r'\bthere\s+is\s+\w+s\b': lambda m: m.group(0).replace('is', 'are'),
        }
        
        for pattern, replacement in grammar_fixes.items():
            result = re.sub(pattern, replacement, result)
        
        # Ensure sentence ends with punctuation
        if result and result[-1] not in '.!?':
            result += '.'
        
        return result.strip()
    
    def spell_check(self, text: str) -> str:
        """
        Basic spell checking and correction
        
        Args:
            text: Input text
            
        Returns:
            Spell-corrected text
        """
        if not text or not text.strip():
            return ""
        
        words = text.split()
        corrected_words = []
        
        for word in words:
            # Extract actual word without punctuation
            match = re.match(r'([^\w]*)(\w+)([^\w]*)', word)
            if match:
                prefix, actual_word, suffix = match.groups()
                
                # Check for common errors
                lower_word = actual_word.lower()
                if lower_word in self.common_errors:
                    corrected = self.common_errors[lower_word]
                    # Preserve original case
                    if actual_word[0].isupper():
                        corrected = corrected.capitalize()
                    corrected_words.append(prefix + corrected + suffix)
                else:
                    corrected_words.append(word)
            else:
                corrected_words.append(word)
        
        return ' '.join(corrected_words)
    
    def remove_stop_words(self, text: str) -> str:
        """
        Remove stop words from text
        
        Args:
            text: Input text
            
        Returns:
            Text without stop words
        """
        if not text or not text.strip():
            return ""
        
        # Tokenize while preserving punctuation
        tokens = re.findall(r'\b\w+\b|[^\w\s]', text)
        
        filtered_tokens = []
        for token in tokens:
            if token.lower() not in self.stop_words or not token.isalpha():
                filtered_tokens.append(token)
        
        # Reconstruct text
        result = ' '.join(filtered_tokens)
        
        # Fix spacing around punctuation
        result = re.sub(r'\s+([,.!?;:])', r'\1', result)
        
        return result.strip()
    
    def convert_case(self, text: str, case_type: str = 'lower') -> str:
        """
        Convert text case
        
        Args:
            text: Input text
            case_type: Type of case conversion
                      (lower, upper, title, sentence, toggle)
            
        Returns:
            Converted text
        """
        if not text or not text.strip():
            return ""
        
        if case_type == 'lower':
            return text.lower()
        
        elif case_type == 'upper':
            return text.upper()
        
        elif case_type == 'title':
            return text.title()
        
        elif case_type == 'sentence':
            # Capitalize first letter of each sentence
            result = text.lower()
            # Capitalize first character
            if result:
                result = result[0].upper() + result[1:]
            # Capitalize after sentence endings
            result = re.sub(r'([.!?]\s+)([a-z])', 
                          lambda m: m.group(1) + m.group(2).upper(), 
                          result)
            return result
        
        elif case_type == 'toggle':
            return ''.join([c.lower() if c.isupper() else c.upper() 
                           for c in text])
        
        elif case_type == 'camel':
            words = re.findall(r'\w+', text)
            if not words:
                return text
            return words[0].lower() + ''.join(w.capitalize() for w in words[1:])
        
        elif case_type == 'snake':
            words = re.findall(r'\w+', text.lower())
            return '_'.join(words)
        
        elif case_type == 'kebab':
            words = re.findall(r'\w+', text.lower())
            return '-'.join(words)
        
        return text
    
    def get_text_statistics(self, text: str) -> Dict[str, any]:
        """
        Get comprehensive text statistics
        
        Args:
            text: Input text
            
        Returns:
            Dictionary of statistics
        """
        if not text or not text.strip():
            return {
                "characters": 0,
                "words": 0,
                "sentences": 0,
                "paragraphs": 0,
                "avg_word_length": 0,
                "avg_sentence_length": 0
            }
        
        # Count characters
        char_count = len(text)
        char_no_spaces = len(text.replace(' ', ''))
        
        # Count words
        words = re.findall(r'\b\w+\b', text)
        word_count = len(words)
        
        # Count sentences
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        sentence_count = len(sentences)
        
        # Count paragraphs
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        paragraph_count = len(paragraphs)
        
        # Average word length
        avg_word_len = sum(len(w) for w in words) / word_count if word_count > 0 else 0
        
        # Average sentence length
        avg_sent_len = word_count / sentence_count if sentence_count > 0 else 0
        
        return {
            "characters": char_count,
            "characters_no_spaces": char_no_spaces,
            "words": word_count,
            "sentences": sentence_count,
            "paragraphs": paragraph_count,
            "avg_word_length": round(avg_word_len, 2),
            "avg_sentence_length": round(avg_sent_len, 2)
        }


# Example usage and testing
if __name__ == "__main__":
    analyzer = TextAnalyzer()
    
    sample_text = """
    This is a sample text for testing. The text analysis system is really 
    great and provides excellent functionality. It can process large amounts 
    of text quickly and efficiently. However, some features might need 
    improvement for better accuracy.
    """
    
    print("=== Text Analysis Examples ===\n")
    
    print("1. Summarization:")
    print(analyzer.summarize(sample_text, num_sentences=2))
    print()
    
    print("2. Keyword Extraction:")
    print(analyzer.extract_keywords(sample_text, top_n=5))
    print()
    
    print("3. Sentiment Analysis:")
    print(analyzer.analyze_sentiment(sample_text))
    print()
    
    print("4. Remove Stop Words:")
    print(analyzer.remove_stop_words(sample_text))
    print()
    
    print("5. Convert Case (Title):")
    print(analyzer.convert_case(sample_text, 'title'))
    print()
    
    print("6. Text Statistics:")
    stats = analyzer.get_text_statistics(sample_text)
    for key, value in stats.items():
        print(f"  {key}: {value}")