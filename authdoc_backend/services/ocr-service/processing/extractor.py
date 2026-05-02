import os
import json
import re
import time
from typing import Dict, Any, List, Optional

import google.generativeai as genai
from dotenv import load_dotenv
from google.generativeai.types import GenerationConfig

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is required")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel(MODEL)

# -------------------------
# UTILITIES
# -------------------------

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def split_text(text: str, max_chars: int = 12000) -> List[str]:
    return [text[i:i + max_chars] for i in range(0, len(text), max_chars)]


def safe_parse(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except Exception:
        # fallback: extract JSON block
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != -1:
            try:
                return json.loads(text[start:end])
            except Exception:
                pass
    return {}


def build_prompt(text: str, schema: Dict[str, Any]) -> str:
    return f"""
    ### ROLE
    You are a high-precision Data Extraction Engine. Your objective is to transform unstructured text into a machine-readable JSON format that adheres strictly to a predefined schema.

    ### EXTRACTION PIPELINE
    1. **Schema Alignment**: Map raw text entities to the keys defined in the schema.
    2. **Type Casting**: 
    - Convert written-out numerals (e.g., "forty-two") into integers/floats.
    - Standardize calendar dates into ISO-8601 or the most logical numeric format.
    3. **Entity Resolution**: Maintain the literal integrity of proper names and locations unless normalization is required for type-consistency.
    4. **Handling Ambiguity**: If a field is not present in the source text, or if the data is logically inconclusive, assign the value `null`.
    5. Rules:
        - Preserve original language unless normalization is required for type consistency.
    ### CONSTRAINTS
    - **No Hallucination**: Do not infer data that does not exist in the text.
    - **Structural Integrity**: Output MUST be a single, valid JSON object. Do not include Markdown code blocks, preamble, or post-extraction commentary.
    - **Zero Schema Drift**: Do not add, remove, or modify the keys provided in the schema.

    ### DOCUMENT TEXT
    {text}

    ### SCHEMA (STRICT)
    {json.dumps(schema, indent=2)}

    ### OUTPUT FORMAT (STRICT JSON SHAPE)
    Return JSON EXACTLY like this structure:
    """


def call_gemini(prompt: str, retries: int = 3, delay: float = 1.5) -> Optional[str]:
    for attempt in range(retries):
        try:
            response = model.generate_content(
                prompt,
                 generation_config=GenerationConfig(
                    temperature=0,
                    top_p=1,
                    max_output_tokens=4096,
                )
            )

            if response and response.text:
                return response.text.strip()

        except Exception as e:
            print(f"[LLM ERROR] Attempt {attempt+1}: {e}")
            time.sleep(delay)

    return None


def extract_with_llm(text: str, schema: Dict[str, Any]) -> Dict[str, Any]:

    text = clean_text(text)
    chunks = split_text(text)

    results = []

    for chunk in chunks:
        prompt = build_prompt(chunk, schema)

        raw_output = call_gemini(prompt)

        if not raw_output:
            results.append({})
            continue

        print("\n[RAW  OUTPUT]\n", raw_output)

        parsed = safe_parse(raw_output)
        results.append(parsed)

    final = {}

    for key in schema.keys():
        value = None
        for r in results:
            if r.get(key) not in [None, "", {}]:
                value = r[key]
                break
        final[key] = value

    return final