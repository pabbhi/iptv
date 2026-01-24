import tkinter as tk
from tkinter import messagebox
import threading
import cv2
import numpy as np
import mss
import time

recording = False

def start_recording():
    global recording
    recording = True
    threading.Thread(target=record_screen, daemon=True).start()

def stop_recording():
    global recording
    recording = False
    messagebox.showinfo("Screen Recorder", "Recording stopped!")

def record_screen():
    global recording

    with mss.mss() as sct:
        monitor = sct.monitors[1]  # Full screen
        width = monitor["width"]
        height = monitor["height"]

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(
            f"screen_recording_{int(time.time())}.mp4",
            fourcc,
            20.0,
            (width, height)
        )

        while recording:
            img = np.array(sct.grab(monitor))
            frame = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
            out.write(frame)

        out.release()

# GUI
root = tk.Tk()
root.title("Screen Recorder")
root.geometry("300x150")

start_btn = tk.Button(root, text="Start Recording", command=start_recording, bg="green", fg="white", height=2)
start_btn.pack(pady=10)

stop_btn = tk.Button(root, text="Stop Recording", command=stop_recording, bg="red", fg="white", height=2)
stop_btn.pack(pady=10)

root.mainloop()
