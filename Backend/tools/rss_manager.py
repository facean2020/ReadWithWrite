import argparse
import json
import uuid
import os

# Determine the absolute path to the data file
# Assuming the script is in /workspaces/ReadWithWrite/tools/
# and the data is in /workspaces/ReadWithWrite/Data/rss-sources.json
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_FILE_PATH = os.path.join(PROJECT_ROOT, "Data", "rss-sources.json")

def load_sources():
    if not os.path.exists(DATA_FILE_PATH):
        return []
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            if not content.strip():
                return []
            return json.loads(content)
    except json.JSONDecodeError:
        print(f"Error: Failed to parse {DATA_FILE_PATH}. Returning empty list.")
        return []

def save_sources(sources):
    # Ensure directory exists
    os.makedirs(os.path.dirname(DATA_FILE_PATH), exist_ok=True)
    with open(DATA_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(sources, f, indent=2, ensure_ascii=False)

def add_source(url, name, description=None):
    sources = load_sources()
    
    # Check for duplicates by URL
    for source in sources:
        if source.get('Url') == url:
            print(f"Error: Source with URL '{url}' already exists (Name: {source.get('Name')}).")
            return

    new_source = {
        "Id": str(uuid.uuid4()),
        "Url": url,
        "Name": name,
        "Description": description
    }
    
    sources.append(new_source)
    save_sources(sources)
    print(f"Successfully added RSS source: {name} ({url})")

def list_sources():
    sources = load_sources()
    if not sources:
        print("No RSS sources found.")
        return

    print(f"{'Name':<30} {'URL':<50} {'Description'}")
    print("-" * 100)
    for s in sources:
        desc = s.get('Description') or ""
        print(f"{s.get('Name'):<30} {s.get('Url'):<50} {desc[:20] + '...' if len(desc) > 20 else desc}")

def main():
    parser = argparse.ArgumentParser(description="Manage RSS sources for ReadWithWrite.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add command
    parser_add = subparsers.add_parser("add", help="Add a new RSS source")
    parser_add.add_argument("url", help="The URL of the RSS feed")
    parser_add.add_argument("name", help="The name of the RSS source")
    parser_add.add_argument("--desc", help="Optional description", default=None)

    # List command
    parser_list = subparsers.add_parser("list", help="List all RSS sources")

    args = parser.parse_args()

    if args.command == "add":
        add_source(args.url, args.name, args.desc)
    elif args.command == "list":
        list_sources()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
