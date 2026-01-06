import os
import shutil

def main():
    # Determine project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    migrations_path = os.path.join(project_root, "Migrations")

    print(f"--- Migration Cleanup ---")

    if os.path.exists(migrations_path):
        print(f"Removing Migrations folder at: {migrations_path}")
        try:
            shutil.rmtree(migrations_path)
            print("Successfully removed Migrations folder.")
        except Exception as e:
            print(f"Failed to remove Migrations folder: {e}")
    else:
        print("Migrations folder does not exist. Nothing to clear.")

if __name__ == "__main__":
    main()
