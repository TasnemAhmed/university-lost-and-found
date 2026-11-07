import re
from datetime import date
from typing import Optional

EMAIL_REGEX = re.compile(r"^[\w\.\+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$")


def is_valid_email(email: str) -> bool:
    if not email or len(email) > 255:
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def is_not_future_date(d: date) -> bool:
    return d <= date.today()


def sanitize_string(val: Optional[str]) -> Optional[str]:
    if val is None:
        return None
    cleaned = val.strip()
    return cleaned if cleaned else None
