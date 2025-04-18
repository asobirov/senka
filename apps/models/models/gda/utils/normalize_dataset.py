def normalize_harpo(row: dict):
    print("==== HARPO column names", row.keys())
    return {
        "domain": row["domain"],
        "label": "DGA" if row["class"] == 1 else "Benign",
    }


def normalize_yang(row: dict):
    print("==== YANG column names", row.keys())
    return {
        "domain": row["domain"],
        "label": "DGA" if row["label"] == 1 else "Benign",
    }
