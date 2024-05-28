#!/bin/bash

# Base directory of the script
base_dir=$(dirname "$(readlink -f "$0")")

# Prints text in bold green color
green_bold() {
  echo -e "$(tput bold)$(tput setaf 2)$(echo "$1")$(tput sgr0)"
}

yellow_bold() {
  echo -e "$(tput bold)$(tput setaf 3)$(echo "$1")$(tput sgr0)"
}

# Reading module name
echo $(yellow_bold "Parent module name :") 
read -r parent_name

# Reading module name
echo $(yellow_bold "Module name :") 
read -r module_name

# Path to the parent router folder
parent_router_folder="src/routers/$parent_name"

# Check if the folder already exists
if [ -d "$parent_router_folder" ]; then
  echo -e "$(tput bold)$(tput setaf 3)Folder already exists:$(tput sgr0)
  $(green_bold "$parent_router_folder")"
else
    # Creating route folder
    mkdir -p src/routers/"$parent_name"
    echo "Created folder:
    $(green_bold "src/routers/$parent_name")
    "
fi

# Creating route files
cd src/routers/"$parent_name" || exit
touch "$module_name".route.ts
echo -e "Created:
  $(green_bold "$module_name.route.ts")
"

# Path to the example file
example_file_path="$base_dir/example_files/router/example.route.ts"

# Copying content from the example file to the created file
if [ -f "$example_file_path" ]; then
  cp "$example_file_path" "$module_name".route.ts
  echo -e "Copied content from example file to:
  $(green_bold "$module_name.route.ts")
"
else
  echo -e "$(tput bold)$(tput setaf 1)Error: Example file not found at $example_file_path$(tput sgr0)"
fi
