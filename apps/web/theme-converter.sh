#!/bin/bash

# Theme Conversion Script: Dark to Light Grey

find src/app src/components -name "*.tsx" -type f | while read file; do
  # Background colors
  sed -i '' 's/bg-black/bg-[#ebebeb]/g' "$file"
  sed -i '' 's/bg-dark-light/bg-white/g' "$file"
  sed -i '' 's/bg-dark"/bg-[#ebebeb]"/g' "$file"
  sed -i '' 's/bg-dark /bg-[#ebebeb] /g' "$file"
  sed -i '' 's/bg-zinc-900/bg-white/g' "$file"
  sed -i '' 's/bg-zinc-800/bg-white/g' "$file"
  sed -i '' 's/bg-gray-700/bg-white/g' "$file"
  
  # Text colors  
  sed -i '' 's/text-white"/text-gray-900"/g' "$file"
  sed -i '' 's/text-white /text-gray-900 /g' "$file"
  sed -i '' 's/text-white}/text-gray-900}/g' "$file"
  sed -i '' 's/text-zinc-400/text-gray-600/g' "$file"
  sed -i '' 's/text-gray-400/text-gray-600/g' "$file"
  sed -i '' 's/text-gray-300/text-gray-700/g' "$file"
  sed -i '' 's/text-gray-500/text-gray-600/g' "$file"
  
  # Border colors
  sed -i '' 's/border-zinc-700/border-gray-300/g' "$file"
  sed -i '' 's/border-gold\/20/border-gray-300/g' "$file"
  sed -i '' 's/border-gold\/40/border-gold/g' "$file"
  
  # Hover states for backgrounds
  sed -i '' 's/hover:bg-zinc-700/hover:bg-gray-100/g' "$file"
  sed -i '' 's/hover:bg-zinc-600/hover:bg-gray-200/g' "$file"
  sed -i '' 's/hover:bg-gray-600/hover:bg-gray-200/g' "$file"
  
done

echo "Theme conversion complete!"
