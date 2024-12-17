# import requests
# from moviepy import VideoFileClip
# import speech_recognition as sr
# import os
# import sys
# import time
#
# import logging
#
#
# # Désactiver les logs de MoviePy
# logging.getLogger("moviepy").setLevel(logging.WARNING)
#
# def download_video(video_uri, output_path="video.mp4"):
# #     """Télécharge la vidéo depuis Cloudinary."""
#     try:
#         response = requests.get(video_uri, stream=True)
#         response.raise_for_status()
#         with open(output_path, 'wb') as f:
#             f.write(response.content)
# #         print(f"Vidéo téléchargée : {output_path}")
#         return output_path
#     except requests.exceptions.RequestException as e:
#         raise Exception(f"Erreur lors du téléchargement de la vidéo : {e}")
#
#
# def extract_audio(video_path, audio_path="audio.wav"):
# #     """Extrait l'audio depuis une vidéo et le convertit en MP3."""
#     try:
#         clip = VideoFileClip(video_path)
#         # Extraction de l'audio en WAV
#         clip.audio.write_audiofile(audio_path, codec="pcm_s16le")
#
#         # Vérifier si un fichier MP3 existe déjà et le supprimer
#         mp3_path = audio_path.replace(".wav", ".mp3")
#         if os.path.exists(mp3_path):
#             os.remove(mp3_path)
#
#         # Convertir l'audio extrait en MP3
#         os.rename(audio_path, mp3_path)
# #         print(f"Audio converti en MP3 : {mp3_path}")
#
#         clip.close()  # Fermer explicitement le fichier vidéo après l'extraction de l'audio
#         return mp3_path  # Retourner le chemin du fichier MP3
#     except Exception as e:
#         raise Exception(f"Erreur lors de l'extraction ou de la conversion de l'audio : {e}")
#
#
# def transcribe_audio(audio_path):
# #     """Transcrit l'audio en texte."""
#     recognizer = sr.Recognizer()
#     try:
#         with sr.AudioFile(audio_path) as source:
#             audio_data = recognizer.record(source)
#             # Langue modifiée en anglais (en-US)
#             text = recognizer.recognize_google(audio_data, language="fr-FR")
# #             print("Texte extrait :")
# #             print(text)
#             return text
#     except sr.UnknownValueError:
#         raise Exception("Google Speech Recognition n'a pas pu comprendre l'audio.")
#     except sr.RequestError as e:
#         raise Exception(f"Erreur de la requête à l'API de Google Speech Recognition : {e}")
#     except Exception as e:
#         raise Exception(f"Erreur lors de la transcription de l'audio : {e}")
#
#
# if __name__ == "__main__":
#     video_uri = sys.argv[1]
#     try:
#         # Téléchargement de la vidéo
#         video_path = download_video(video_uri)
#         # Extraction et conversion de l'audio en MP3
#         audio_mp3_path = extract_audio(video_path)
#         # Transcription de l'audio
#         text = transcribe_audio(audio_mp3_path)
#         print(text)
#
#         # Attendre un instant avant la suppression des fichiers
#         time.sleep(1)
#
#         # Nettoyage des fichiers temporaires
#         os.remove(video_path)
#         os.remove(audio_mp3_path)
#     except Exception as e:
#         print(f"Une erreur s'est produite : {e}")

import requests
from moviepy import VideoFileClip
import speech_recognition as sr
import os
import sys
import time
import subprocess
import logging

# Désactiver les logs de moviepy en redirigeant la sortie
import sys
class suppress_stdout_stderr(object):
    def __enter__(self):
        self._stdout = sys.stdout
        self._stderr = sys.stderr
        sys.stdout = sys.stderr = open(os.devnull, 'w')

    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout = self._stdout
        sys.stderr = self._stderr

def download_video(video_uri, output_path="video.mp4"):
    """Télécharge la vidéo depuis Cloudinary."""
    try:
        response = requests.get(video_uri, stream=True)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(response.content)
        return output_path
    except requests.exceptions.RequestException as e:
        raise Exception(f"Erreur lors du téléchargement de la vidéo : {e}")

def extract_audio(video_path, audio_path="audio.wav"):
    """Extrait l'audio depuis une vidéo et le convertit en MP3."""
    try:
        with suppress_stdout_stderr():
            clip = VideoFileClip(video_path)
            # Extraction de l'audio en WAV
            clip.audio.write_audiofile(audio_path, codec="pcm_s16le")

        # Vérifier si un fichier MP3 existe déjà et le supprimer
        mp3_path = audio_path.replace(".wav", ".mp3")
        if os.path.exists(mp3_path):
            os.remove(mp3_path)

        # Convertir l'audio extrait en MP3
        os.rename(audio_path, mp3_path)

        clip.close()  # Fermer explicitement le fichier vidéo après l'extraction de l'audio
        return mp3_path  # Retourner le chemin du fichier MP3
    except Exception as e:
        raise Exception(f"Erreur lors de l'extraction ou de la conversion de l'audio : {e}")

def transcribe_audio(audio_path):
    """Transcrit l'audio en texte."""
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language="fr-FR")
            return text
    except sr.UnknownValueError:
        raise Exception("Google Speech Recognition n'a pas pu comprendre l'audio.")
    except sr.RequestError as e:
        raise Exception(f"Erreur de la requête à l'API de Google Speech Recognition : {e}")
    except Exception as e:
        raise Exception(f"Erreur lors de la transcription de l'audio : {e}")

if __name__ == "__main__":
    video_uri = sys.argv[1]
    try:
        # Téléchargement de la vidéo
        video_path = download_video(video_uri)
        # Extraction et conversion de l'audio en MP3
        audio_mp3_path = extract_audio(video_path)
        # Transcription de l'audio
        text = transcribe_audio(audio_mp3_path)
        print(text)

        # Attendre un instant avant la suppression des fichiers
        time.sleep(1)

        # Nettoyage des fichiers temporaires
        os.remove(video_path)
        os.remove(audio_mp3_path)
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
