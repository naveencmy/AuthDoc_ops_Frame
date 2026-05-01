def group_pages(blocks_per_page):
    records = []
    current = None

    for page in blocks_per_page:
        if is_record_start(page):
            if current:
                records.append(current)

            current = {"pages": [page]}
        else:
            if current:
                current["pages"].append(page)

    if current:
        records.append(current)

    return records
def is_record_start(page_blocks):
    texts = [b["text"].lower() for b in page_blocks]

    has_marriage = any("mariage" in t for t in texts)

    left_margin_names = [
        b for b in page_blocks
        if b["x"] < 300 and len(b["text"].split()) >= 2
    ]

    return has_marriage and len(left_margin_names) >= 2

def split_page_into_records(page_blocks):
    # cluster by vertical separation (y-axis gaps)
    lines = sorted(page_blocks, key=lambda b: b["y"])

    chunks = []
    current = [lines[0]]

    for prev, curr in zip(lines, lines[1:]):
        if curr["y"] - prev["y"] > 120:  # gap threshold
            chunks.append(current)
            current = []
        current.append(curr)

    if current:
        chunks.append(current)

    return chunks