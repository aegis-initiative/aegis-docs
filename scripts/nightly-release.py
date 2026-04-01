#!/usr/bin/env python3
"""Nightly release rollup — runs after the day's work is done.

1. Reads today's daily dev log
2. Generates a release summary via Claude API
3. Prepends release recap to the top of the daily log
4. Adds/updates entry in the monthly release file
5. Adds/updates entry in the release index

Environment variables:
  ANTHROPIC_API_KEY — for generating summaries (optional, falls back
                      to first commit)
"""

import os
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone


def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    return result.stdout.strip()


def get_yesterday():
    """Get yesterday's date (runs at 5 AM UTC, we want previous day)."""
    return datetime.now(timezone.utc) - timedelta(hours=6)


def get_tags_for_date(year, month, day):
    """Find all CalVer tags for a specific date."""
    prefix = f"v{year}.{month}.{day}"
    all_tags = run("git tag --list 'v*'").split("\n")
    tags = [
        t
        for t in all_tags
        if t.strip() and (t == prefix or t.startswith(prefix + "."))
    ]
    return sorted(tags)


def get_builds_range(tags):
    """Get first and last commit hashes for the day's tags."""
    if not tags:
        return "", ""
    first_hash = run(f"git rev-list -1 {tags[0]}")[:7]
    last_hash = run(f"git rev-list -1 {tags[-1]}")[:7]
    return first_hash, last_hash


def generate_summary(dev_log_content):
    """Generate release summary from dev log using Claude API."""
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")

    entries = [
        line.strip()
        for line in dev_log_content.split("\n")
        if line.strip().startswith("- ")
    ]
    if not entries:
        return ["- Updates and improvements"]

    if not api_key:
        return entries[:10]

    import json
    import urllib.request

    raw_entries = "\n".join(entries)

    payload = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": (
                    "You are writing release notes for the AEGIS™ "
                    "Documentation site (aegis-docs.com). Convert these "
                    "development log entries into clear, concise release "
                    "note bullet points. Group related changes. Remove "
                    "commit hashes and PR numbers. Return ONLY a markdown "
                    "bulleted list, nothing else.\n\n"
                    "Dev log entries:\n" + raw_entries
                ),
            }
        ],
    }

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            text = data["content"][0]["text"].strip()
            return [
                line.strip()
                for line in text.split("\n")
                if line.strip().startswith("- ")
            ]
    except Exception as e:
        print(
            f"Warning: Claude API call failed ({e}), using raw entries",
            file=sys.stderr,
        )
        return entries[:10]


def generate_index_summary(release_entries):
    """Generate a one-line summary for the release index."""
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")

    raw = "\n".join(release_entries)

    if not api_key:
        return (
            release_entries[0].lstrip("- ")[:80]
            if release_entries
            else "Updates"
        )

    import json
    import urllib.request

    payload = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 100,
        "messages": [
            {
                "role": "user",
                "content": (
                    "Summarize these release notes into a single concise "
                    "phrase (under 80 chars) for a release index. No period "
                    "at the end. Return ONLY the phrase.\n\n" + raw
                ),
            }
        ],
    }

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["content"][0]["text"].strip()
    except Exception:
        return (
            release_entries[0].lstrip("- ")[:80]
            if release_entries
            else "Updates"
        )


def update_daily_log(file_path, tag, builds_str, release_entries):
    """Prepend release recap to the daily log."""
    if not os.path.exists(file_path):
        print(f"No daily log found at {file_path}")
        return False

    with open(file_path, "r") as f:
        content = f.read()

    if f"## Release / {tag}" in content:
        print(f"Release recap already exists in {file_path}")
        return False

    recap_lines = [
        f"## Release / {tag}",
        "",
        f"*Builds: {builds_str}*",
        "",
    ]
    recap_lines.extend(release_entries)
    recap_lines.append("")
    recap_lines.append("---")
    recap_lines.append("")
    recap = "\n".join(recap_lines)

    parts = content.split("---", 2)
    if len(parts) >= 3:
        content = (
            parts[0]
            + "---"
            + parts[1]
            + "---\n\n"
            + recap
            + parts[2].lstrip("\n")
        )
    else:
        content = content + "\n\n" + recap

    with open(file_path, "w") as f:
        f.write(content)

    print(f"Added release recap to {file_path}")
    return True


def update_monthly(year, month, tag, builds_str, release_entries, day):
    """Add release entry to monthly file."""
    file_path = f"src/content/docs/releases/{year}/{month}.md"

    month_name = datetime.now(timezone.utc).strftime("%B")
    year_full = datetime.now(timezone.utc).strftime("%Y")

    entries_text = "\n".join(release_entries)
    new_section = f"""## Release / {tag}

*Builds: {builds_str}* — [Development Log →]\
(/releases/{year}/{month}/{day}/)

{entries_text}

---

"""

    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        content = f"""---
title: "{month_name} {year_full}"
description: "Release notes for {month_name} {year_full}"
template: doc
sidebar:
  hidden: true
---

{new_section}"""
        with open(file_path, "w") as f:
            f.write(content)
        print(f"Created {file_path}")
    else:
        with open(file_path, "r") as f:
            content = f.read()

        if f"## Release / {tag}" in content:
            print(f"Release already exists in {file_path}")
            return

        parts = content.split("---", 2)
        if len(parts) >= 3:
            content = (
                parts[0]
                + "---"
                + parts[1]
                + "---\n\n"
                + new_section
                + parts[2].lstrip("\n")
            )
        else:
            content = content + "\n\n" + new_section

        with open(file_path, "w") as f:
            f.write(content)
        print(f"Updated {file_path}")


def update_index(year, month, tag, summary):
    """Add/update entry in release index."""
    index_path = "src/content/docs/releases/index.md"

    if not os.path.exists(index_path):
        print(f"Error: {index_path} not found", file=sys.stderr)
        return

    with open(index_path, "r") as f:
        content = f.read()

    base_tag = (
        tag.split(".")[0]
        + "."
        + tag.split(".")[1]
        + "."
        + tag.split(".")[2]
    )
    anchor_tag = base_tag.replace(".", "").replace("v", "v")
    entry_line = (
        f"- [{base_tag}](/releases/{year}/{month}/"
        f"#release--{anchor_tag}) — {summary}"
    )

    entry_pattern = re.compile(rf"- \[{re.escape(base_tag)}\].*")
    if entry_pattern.search(content):
        content = entry_pattern.sub(entry_line, content)
        print(f"Updated index entry for {base_tag}")
    else:
        year_full = datetime.now(timezone.utc).strftime("%Y")
        month_name = datetime.now(timezone.utc).strftime("%B")
        month_header = f"### [{month_name}](/releases/{year}/{month}/)"
        year_header = f"## {year_full}"

        if month_header in content:
            pos = content.index(month_header) + len(month_header)
            next_nl = content.index("\n", pos)
            insert_pos = next_nl + 1
            if insert_pos < len(content) and content[insert_pos] == "\n":
                insert_pos += 1
            content = (
                content[:insert_pos] + entry_line + "\n" + content[insert_pos:]
            )
        elif year_header in content:
            pos = content.index(year_header) + len(year_header)
            next_nl = content.index("\n", pos)
            insert = f"\n\n{month_header}\n\n{entry_line}\n"
            content = (
                content[: next_nl + 1] + insert + content[next_nl + 1 :]
            )
        else:
            fm_end = content.index("---", content.index("---") + 3) + 3
            insert = (
                f"\n\n{year_header}\n\n{month_header}\n\n{entry_line}\n"
            )
            content = content[:fm_end] + insert + content[fm_end:]

        print(f"Added index entry for {base_tag}")

    with open(index_path, "w") as f:
        f.write(content)


def main():
    dt = get_yesterday()
    year = dt.strftime("%y")
    month = str(dt.month)
    day = str(dt.day)

    print(
        f"Processing releases for {dt.strftime('%Y-%m-%d')} "
        f"({year}.{month}.{day})"
    )

    tags = get_tags_for_date(year, month, day)
    if not tags:
        print("No tags found for this date. Nothing to do.")
        sys.exit(0)

    print(f"Found {len(tags)} tag(s): {', '.join(tags)}")

    base_tag = f"v{year}.{month}.{day}"

    first_hash, last_hash = get_builds_range(tags)
    if first_hash == last_hash:
        builds_str = first_hash
    else:
        builds_str = f"{first_hash} – {last_hash}"

    daily_path = f"src/content/docs/releases/{year}/{month}/{day}.md"
    if os.path.exists(daily_path):
        with open(daily_path, "r") as f:
            dev_log_content = f.read()
    else:
        print(f"No daily log at {daily_path}")
        dev_log_content = ""

    release_entries = generate_summary(dev_log_content)
    print(f"Generated {len(release_entries)} release entries")

    index_summary = generate_index_summary(release_entries)
    print(f"Index summary: {index_summary}")

    update_daily_log(daily_path, base_tag, builds_str, release_entries)
    update_monthly(
        year, month, base_tag, builds_str, release_entries, day
    )
    update_index(year, month, base_tag, index_summary)

    print("\nDone.")


if __name__ == "__main__":
    main()
