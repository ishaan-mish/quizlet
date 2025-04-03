import os
import subprocess
import webbrowser
import time

# Set your desired path
path = r"C:\Users\ishaa\OneDrive\Desktop\quizLet"

# Open a terminal and start the server
if os.name == "nt":  # Windows
    command = f'start cmd /k "cd /d {path} && node server.js"'
else:  # macOS/Linux
    command = f'gnome-terminal -- bash -c "cd {path} && node server.js; exec bash"'

subprocess.Popen(command, shell=True)

# Wait a few seconds for the server to start
time.sleep(5)

# Open the URL in the default browser
webbrowser.open("http://localhost:3000/")
