#!/usr/bin/env python3
"""
Defensive Data Ingestion Script
Syncs literary translated Markdown files from rezero-vi/text/arc/ into src/content/chapters/rezero/
Injects Zod-compliant frontmatter, validates title patterns, and normalizes headings.
"""

import os
import re
import sys
import argparse

SRC_BASE = "/root/project02/rezero-vi/text/arc"
DEST_BASE = "/root/ln.sakayori.studio/src/content/chapters/rezero"

HEADING_REGEX = re.compile(r"^#\s*Chương\s+(\d+):\s*(.+)$", re.MULTILINE)

def sync_arc(arc_num, dry_run=False):
    src_dir = os.path.join(SRC_BASE, str(arc_num))
    dest_dir = os.path.join(DEST_BASE, f"arc-{arc_num}")
    
    if not os.path.exists(src_dir):
        print(f"[-] Source directory not found: {src_dir}")
        return 0

    if not dry_run:
        os.makedirs(dest_dir, exist_ok=True)

    files = sorted([f for f in os.listdir(src_dir) if f.startswith("chapter-") and f.endswith(".md")],
                   key=lambda x: int(re.search(r"\d+", x).group()) if re.search(r"\d+", x) else 0)

    count = 0
    errors = 0

    for filename in files:
        src_path = os.path.join(src_dir, filename)
        ch_num = int(re.search(r"\d+", filename).group())
        
        with open(src_path, "r", encoding="utf-8") as f:
            content = f.read()

        match = HEADING_REGEX.search(content)
        if match:
            parsed_ch = int(match.group(1))
            title = match.group(2).strip()
            # Remove the first heading line to prevent duplicate title in Reader view
            body = HEADING_REGEX.sub("", content, count=1).strip()
        else:
            parsed_ch = ch_num
            title = f"Chương {ch_num}"
            body = content.strip()
            print(f"[!] Warning: Heading regex did not match in {src_path}. Fallback title: {title}")
            errors += 1

        # Build clean frontmatter
        clean_title = title.replace('"', '\\"')
        frontmatter = (
            f"---\n"
            f"novel: rezero\n"
            f"arc: {arc_num}\n"
            f"chapter: {parsed_ch}\n"
            f'title: "{clean_title}"\n'
            f"---\n\n"
        )

        full_output = frontmatter + body + "\n"
        dest_path = os.path.join(dest_dir, f"chapter-{parsed_ch}.md")

        if not dry_run:
            with open(dest_path, "w", encoding="utf-8") as f:
                f.write(full_output)

        count += 1

    status = "[DRY-RUN]" if dry_run else "[SYNCED]"
    print(f"{status} Arc {arc_num}: {count} chapters processed (warnings: {errors})")
    return count

def main():
    parser = argparse.ArgumentParser(description="Sync Re:Zero Markdown chapters to Astro content collection")
    parser.add_argument("--arc", type=int, help="Specific Arc number to sync (e.g. 7, 8, 9, 10)")
    parser.add_argument("--all", action="store_true", help="Sync all available Arcs (7, 8, 9, 10)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate run without writing files")
    args = parser.parse_args()

    if not args.arc and not args.all:
        parser.print_help()
        sys.exit(1)

    arcs_to_sync = [7, 8, 9, 10] if args.all else [args.arc]
    total = 0

    for a in arcs_to_sync:
        total += sync_arc(a, dry_run=args.dry_run)

    print(f"==> Total chapters processed: {total}")

if __name__ == "__main__":
    main()
