# Renaming argument
file_source=$1;
file_name=$2;

# Your CS version
version="CC 2014";

# Adobe After Effects folder location
base_path="Applications";

# Full path
full_path="/${base_path}/Adobe After Effects ${version}/Scripts";

# Copying built file to script folder
cp $file_source "${full_path}/${file_name%.*}.jsx";

# Printing happy feedback in the console
echo "Successfully compiled ${file_name} to ${full_path}/${file_name%.*}.jsx";