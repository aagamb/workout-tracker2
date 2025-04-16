#!/bin/bash

echo "🔍 Searching for 'uuid' usage in the project..."

# Find all .ts and .tsx files, then grep for uuid import/require
find . -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  if grep -qE "from ['\"]uuid['\"]|require\(['\"]uuid['\"]\)" "$file"; then
    echo "✅ uuid found in: $file"
  fi
done

echo "✅ Search complete."

