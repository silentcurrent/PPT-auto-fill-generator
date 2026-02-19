# Backend Setup

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoint

**POST /generate**
- Accepts FormData with:
  - `template`: PPTX file with `{{PLACEHOLDER}}` tags
  - `excel`: XLSX file with data
  - `row_index` (optional): Row number to use (default: 0)

- Returns: Generated PPTX file

## How it works

1. Upload a PPTX template with placeholders like `{{Name}}`, `{{Email}}`, etc.
2. Upload an Excel file with columns matching the placeholder names
3. The backend automatically detects placeholders and matches them with Excel columns
4. Returns a filled PPTX file
