def format_instructions(row):
    return {
        "instruction": f"Classify whether this domain is algorithmically generated (DGA): {row['domain']}",
        "input": "",
        "output": "Yes" if row["label"] == "DGA" else "No",
    }
