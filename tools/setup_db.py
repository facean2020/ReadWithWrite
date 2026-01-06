import subprocess
import os
import shutil
import sys

def run_command(command, description):
    print(f"{description}...")
    try:
        # Use shell=True for convenience with dotnet commands in this environment
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error during: {description}")
        print(e.stdout)
        print(e.stderr)
        sys.exit(1)

def main():
    # Determine project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)

    print("--- Database Migration Setup (Python) ---")

    # 1. Clean up old migrations folder if it exists
    migrations_path = os.path.join(project_root, "Migrations")
    if os.path.exists(migrations_path):
        print(f"Removing existing Migrations folder at {migrations_path}")
        shutil.rmtree(migrations_path)

    # 2. Add Migrations for AppDbContext
    run_command(
        "dotnet ef migrations add InitialCreate --context AppDbContext",
        "Adding initial migration for AppDbContext"
    )

    # 3. Add Migrations for WritingDbContext
    run_command(
        "dotnet ef migrations add InitialCreate --context WritingDbContext --output-dir Migrations/WritingDb",
        "Adding initial migration for WritingDbContext"
    )

    # 4. Update Databases
    run_command(
        "dotnet ef database update --context AppDbContext",
        "Updating AppDbContext database"
    )
    run_command(
        "dotnet ef database update --context WritingDbContext",
        "Updating WritingDbContext database"
    )

    print("Database setup complete!")

if __name__ == "__main__":
    main()
