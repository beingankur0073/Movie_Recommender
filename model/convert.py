import nbformat
from nbconvert import PythonExporter

# Load the .ipynb file
with open("movie_recommender_system (1).ipynb", "r", encoding="utf-8") as f:
    notebook = nbformat.read(f, as_version=4)

# Convert to Python script
exporter = PythonExporter()
script, _ = exporter.from_notebook_node(notebook)

# Save to .py file
with open("your_script.py", "w", encoding="utf-8") as f:
    f.write(script)

print("Conversion complete! Check your_script.py")


