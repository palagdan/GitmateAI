#!/bin/bash

# Check if at least 3 arguments are provided (source, destination, and at least one extension)
if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <source_directory> <destination_directory> <extension1> [<extension2> ...]"
    echo "Example: $0 ./src ./backup .ts .js .txt"
    exit 1
fi

# Assign source and destination directories
SOURCE_DIR="$1"
DEST_DIR="$2"

# Shift the first two arguments, leaving the extensions in $@
shift 2

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory '$SOURCE_DIR' does not exist."
    exit 1
fi

# Check if destination directory exists, create it if it doesn’t
if [ ! -d "$DEST_DIR" ]; then
    echo "Destination directory '$DEST_DIR' does not exist. Creating it..."
    mkdir -p "$DEST_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create destination directory '$DEST_DIR'."
        exit 1
    fi
fi

# Flag to track if any files were found
FILES_FOUND=0
TOTAL_FILES_COPIED=0

# Loop through each provided extension
for EXT in "$@"; do
    # Remove leading dot from extension if provided (e.g., .ts -> ts)
    EXT="${EXT#.}"

    # Count files with the current extension in the source directory
    FILE_COUNT=$(find "$SOURCE_DIR" -maxdepth 1 -type f -name "*.$EXT" | wc -l)

    if [ "$FILE_COUNT" -eq 0 ]; then
        echo "No files with extension '.$EXT' found in '$SOURCE_DIR'."
    else
        FILES_FOUND=1
        echo "Copying files with extension '.$EXT' from '$SOURCE_DIR' to '$DEST_DIR'..."
        find "$SOURCE_DIR" -maxdepth 1 -type f -name "*.$EXT" -exec cp "{}" "$DEST_DIR" \;

        # Check if the copy operation was successful
        if [ $? -eq 0 ]; then
            echo "Successfully copied $FILE_COUNT file(s) with extension '.$EXT' to '$DEST_DIR'."
            TOTAL_FILES_COPIED=$((TOTAL_FILES_COPIED + FILE_COUNT))
        else
            echo "Error: Failed to copy files with extension '.$EXT'."
        fi
    fi
done

# Summary
if [ "$FILES_FOUND" -eq 0 ]; then
    echo "No files with the specified extensions were found in '$SOURCE_DIR'."
else
    echo "Total files copied: $TOTAL_FILES_COPIED"
fi

exit 0