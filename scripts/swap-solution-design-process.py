#!/usr/bin/env python3
"""Swap Design Process and Key Solutions sections on case study pages."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FILES = [
    "lawfare.html",
    "lt.html",
    "pic2split.html",
    "uav.html",
    "magnate.html",
    "quickbite.html",
    "unesco.html",
    "whatnow.html",
]


def find_section_end(lines, start_idx):
    depth = 0
    for i in range(start_idx, len(lines)):
        depth += lines[i].count("<section")
        depth -= lines[i].count("</section>")
        if depth == 0 and "</section>" in lines[i]:
            return i
    raise ValueError(f"Unclosed section starting at line {start_idx + 1}")


def find_comment_line(lines, pattern):
    for i, line in enumerate(lines):
        if pattern.search(line):
            return i
    return None


def extract_block(lines, comment_idx):
    section_idx = comment_idx
    while section_idx < len(lines) and "<section" not in lines[section_idx]:
        section_idx += 1
    end_idx = find_section_end(lines, section_idx)
    return comment_idx, end_idx, lines[comment_idx : end_idx + 1]


def strip_alt(block):
    return [
        re.sub(
            r'(<section class="case-section)\s+case-section-alt',
            r"\1",
            line,
            count=1,
        )
        if "<section" in line
        else line
        for line in block
    ]


def add_alt(block):
    return [
        re.sub(
            r'(<section class="case-section)(\s)',
            r"\1 case-section-alt\2",
            line,
            count=1,
        )
        if "<section" in line and "case-section-alt" not in line
        else line
        for line in block
    ]


def update_line_numbers(line, old_num, new_num):
  if re.search(rf"\b{old_num}\s*—", line):
      return re.sub(rf"\b{old_num}(\s*—)", rf"{new_num}\1", line, count=1)
  if re.search(rf"\b{old_num}\s", line) and "<!--" in line:
      return re.sub(rf"\b{old_num}(\s)", rf"{new_num}\1", line, count=1)
  return line


def renumber_block(block, from_num, to_num):
    return [update_line_numbers(line, from_num, to_num) for line in block]


def swap_file(path: Path):
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)

    dp_comment = re.compile(r"Design Process", re.I)
    ks_comment = re.compile(r"Key Solutions", re.I)

    dp_idx = find_comment_line(lines, re.compile(r"<!--.*Design Process", re.I))
    ks_idx = find_comment_line(lines, re.compile(r"<!--.*Key Solutions", re.I))
    if dp_idx is None or ks_idx is None:
        return False, "markers not found"
    if dp_idx > ks_idx:
        return False, "already swapped"

    _, dp_end, dp_block = extract_block(lines, dp_idx)
    _, ks_end, ks_block = extract_block(lines, ks_idx)

    ks_block = renumber_block(ks_block, "04", "03")
    dp_block = renumber_block(dp_block, "03", "04")

    ks_block = strip_alt(ks_block)
    dp_block = add_alt(dp_block)

    new_lines = lines[:dp_idx] + ks_block + dp_block + lines[ks_end + 1 :]
    path.write_text("".join(new_lines), encoding="utf-8")
    return True, "swapped"


def swap_dailymoo(path: Path):
    text = path.read_text(encoding="utf-8")
    dp_start = text.find('<span class="case-section-label">Design Process</span>')
    ks_start = text.find('<span class="case-section-label">Key Solutions</span>')
    if dp_start == -1 or ks_start == -1 or dp_start > ks_start:
        return False, "blocks not found or already swapped"

    dp_section_start = text.rfind('<div class="case-section', 0, dp_start)
    ks_section_start = text.rfind('<div class="case-section', 0, ks_start)

    def find_div_section_end(src, start):
        depth = 0
        i = start
        while i < len(src):
            if src.startswith("<div", i):
                depth += 1
            elif src.startswith("</div>", i):
                depth -= 1
                if depth == 0:
                    return i + len("</div>")
            i += 1
        raise ValueError("unclosed div")

    dp_end = find_div_section_end(text, dp_section_start)
    ks_end = find_div_section_end(text, ks_section_start)

    dp_block = text[dp_section_start:dp_end]
    ks_block = text[ks_section_start:ks_end]
    middle = text[dp_end:ks_section_start]

    ks_block = ks_block.replace(
        '<div class="case-section">',
        '<div class="case-section case-section-alt dm-section">',
        1,
    )

    dp_block = dp_block.replace(
        '<div class="case-section case-section-alt dm-section">',
        '<div class="case-section">',
        1,
    )

    new_text = text[:dp_section_start] + ks_block + middle + dp_block + text[ks_end:]
    path.write_text(new_text, encoding="utf-8")
    return True, "swapped"


def main():
    for name in FILES:
        path = ROOT / name
        ok, msg = swap_file(path) if path.exists() else (False, "missing")
        print(f"{name}: {msg}")

    dm = ROOT / "dailymoo.html"
    if dm.exists():
        ok, msg = swap_dailymoo(dm)
        print(f"dailymoo.html: {msg}")


if __name__ == "__main__":
    main()
