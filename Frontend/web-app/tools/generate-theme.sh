#!/bin/bash

#############################################
# Theme Generator Script
# Single source of truth: tools/theme-config.py + tools/generate-theme.py
# Usage: ./generate-theme.sh
#############################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python3 "$SCRIPT_DIR/generate-theme.py"
