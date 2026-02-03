#!/bin/bash

# Layout Compacting Script: Reduce font sizes, padding, and margins

find src/app src/components -name "*.tsx" -type f | while read file; do
  # Font sizes
  sed -i '' 's/text-5xl/text-3xl/g' "$file"
  sed -i '' 's/text-4xl/text-2xl/g' "$file"
  sed -i '' 's/text-3xl/text-xl/g' "$file"
  sed -i '' 's/text-2xl/text-lg/g' "$file"

  # Padding
  sed -i '' 's/p-12/p-6/g' "$file"
  sed -i '' 's/p-10/p-5/g' "$file"
  sed -i '' 's/p-8/p-4/g' "$file"
  sed -i '' 's/p-6/p-3/g' "$file"

  # Padding X/Y
  sed -i '' 's/px-12/px-6/g' "$file"
  sed -i '' 's/px-10/px-5/g' "$file"
  sed -i '' 's/px-8/px-4/g' "$file"
  sed -i '' 's/px-6/px-3/g' "$file"
  sed -i '' 's/py-12/py-6/g' "$file"
  sed -i '' 's/py-10/py-5/g' "$file"
  sed -i '' 's/py-8/py-4/g' "$file"
  sed -i '' 's/py-6/py-3/g' "$file"

  # Margins
  sed -i '' 's/m-12/m-6/g' "$file"
  sed -i '' 's/m-10/m-5/g' "$file"
  sed -i '' 's/m-8/m-4/g' "$file"
  sed -i '' 's/m-6/m-3/g' "$file"

  # Margin Y/X
  sed -i '' 's/my-12/my-6/g' "$file"
  sed -i '' 's/my-10/my-5/g' "$file"
  sed -i '' 's/my-8/my-4/g' "$file"
  sed -i '' 's/my-6/my-3/g' "$file"
  sed -i '' 's/mx-12/mx-6/g' "$file"
  sed -i '' 's/mx-10/mx-5/g' "$file"
  sed -i '' 's/mx-8/mx-4/g' "$file"
  sed -i '' 's/mx-6/mx-3/g' "$file"

  # Margin bottom/top
  sed -i '' 's/mb-12/mb-6/g' "$file"
  sed -i '' 's/mb-10/mb-5/g' "$file"
  sed -i '' 's/mb-8/mb-4/g' "$file"
  sed -i '' 's/mb-6/mb-3/g' "$file"
  sed -i '' 's/mt-12/mt-6/g' "$file"
  sed -i '' 's/mt-10/mt-5/g' "$file"
  sed -i '' 's/mt-8/mt-4/g' "$file"
  sed -i '' 's/mt-6/mt-3/g' "$file"

  # Gap
  sed -i '' 's/gap-12/gap-6/g' "$file"
  sed -i '' 's/gap-10/gap-5/g' "$file"
  sed -i '' 's/gap-8/gap-4/g' "$file"
  sed -i '' 's/gap-6/gap-3/g' "$file"

  # Space between items
  sed -i '' 's/space-y-8/space-y-4/g' "$file"
  sed -i '' 's/space-y-6/space-y-3/g' "$file"
  sed -i '' 's/space-x-8/space-x-4/g' "$file"
  sed -i '' 's/space-x-6/space-x-3/g' "$file"

done

echo "Layout compacting complete!"
