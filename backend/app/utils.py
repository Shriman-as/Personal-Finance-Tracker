import re
from typing import Optional

CATEGORY_MAP = {
    "uber": "Transport",
    "ola": "Transport",
    "taxi": "Transport",
    "mcdonald": "Food",
    "mcdonald's": "Food",
    "starbucks": "Food",
    "salary": "Salary",
    "payroll": "Salary",
    "rent": "Rent",
    "apartment": "Rent",
    "grocer": "Groceries",
    "grocery": "Groceries",
    "flipkart": "Shopping",
    "amazon": "Shopping",
    "netflix": "Entertainment",
    "spotify": "Entertainment",
}

def auto_categorize(description: str) -> Optional[str]:
    """Return category if a keyword matches in description."""
    if not description:
        return None
    desc = description.lower()
    for key, cat in CATEGORY_MAP.items():
        if key in desc:
            return cat
    words = re.findall(r"[a-zA-Z']+", desc)
    for w in words:
        if w in CATEGORY_MAP:
            return CATEGORY_MAP[w]
    return None