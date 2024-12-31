# # # from gtts import gTTS
# # # import os
# # # import time
# # # import sys
# # #
# # #
# # # def text_to_speech(text, output_file="output.mp3"):
# # #     """
# # #     Convertit du texte en français en fichier audio MP3.
# # #
# # #     Args:
# # #         text (str): Le texte à convertir en audio
# # #         output_file (str): Le nom du fichier de sortie (par défaut: output.mp3)
# # #     """
# # #     try:
# # #         # Création de l'objet gTTS avec le texte en français
# # #         tts = gTTS(text=text, lang='fr', slow=False)
# # #
# # #         # Sauvegarde le fichier audio
# # #         tts.save(output_file)
# # #
# # #         print(f"Le fichier audio a été créé avec succès: {output_file}")
# # #
# # #         # Lecture du fichier audio (sous Windows)
# # #         if os.name == 'nt':
# # #             os.system(f"start {output_file}")
# # #         # Lecture du fichier audio (sous MacOS/Linux)
# # #         else:
# # #             os.system(f"afplay {output_file}" if os.uname().sysname == "Darwin" else f"xdg-open {output_file}")
# # #
# # #     except Exception as e:
# # #         print(f"Une erreur s'est produite: {str(e)}")
# # #
# # # # Exemple d'utilisation
# # # if __name__ == "__main__":
# # #     video_uri = sys.argv[1]
# # #     texte = """
# # #     Bonjour! Ceci est un test de conversion de texte en parole en français.
# # #     La synthèse vocale est très utile pour de nombreuses applications.
# # #     """
# # #
# # #     text_to_speech(video_uri)
# #
# # import sys
# # from gtts import gTTS
# # import os
# # from pathlib import Path
# # import argparse
# # import unicodedata
# # import re
# #
# # def sanitize_filename(filename):
# #     """
# #     Convertit une question en nom de fichier valide
# #     """
# #     # Supprimer les accents
# #     filename = unicodedata.normalize('NFKD', filename).encode('ASCII', 'ignore').decode('ASCII')
# #     # Remplacer les caractères spéciaux par des underscores
# #     filename = re.sub(r'[^\w\s-]', '_', filename)
# #     # Remplacer les espaces par des underscores
# #     filename = re.sub(r'\s+', '_', filename)
# #     return filename[:50]  # Limiter la longueur du nom de fichier
# #
# # def text_to_speech(text, output_dir):
# #     """
# #     Convertit le texte en audio et sauvegarde dans le dossier spécifié
# #
# #     Args:
# #         text (str): Le texte à convertir
# #         output_dir (str): Le chemin du dossier de sortie
# #
# #     Returns:
# #         str: Le chemin du fichier audio créé
# #     """
# #     try:
# #         # Créer le dossier de sortie s'il n'existe pas
# #         Path(output_dir).mkdir(parents=True, exist_ok=True)
# #
# #         # Générer un nom de fichier unique basé sur le contenu de la question
# #         base_filename = sanitize_filename(text)
# #         output_file = os.path.join(output_dir, f"{base_filename}.mp3")
# #
# #         # Créer et sauvegarder l'audio
# #         tts = gTTS(text=text, lang='fr', slow=False)
# #         tts.save(output_file)
# #
# #         print(f"Audio créé avec succès: {output_file}")
# #         return output_file
# #
# #     except Exception as e:
# #         print(f"Erreur lors de la conversion: {str(e)}", file=sys.stderr)
# #         sys.exit(1)
# #
# # if __name__ == "__main__":
# #     parser = argparse.ArgumentParser(description='Convertit une question en audio')
# #     parser.add_argument('question', help='La question à convertir en audio')
# #     parser.add_argument('--output-dir', default='C:\\Users\\Yesser\\WebstormProjects\\BackendLeaders03\\uploads',
# #                       help='Le dossier où sauvegarder les fichiers audio')
# #
# #     args = parser.parse_args()
# #     text_to_speech(args.question, args.output_dir)
#
#
# import sys
# from gtts import gTTS
# import os
# from pathlib import Path
# import argparse
# import unicodedata
# import re
#
# def sanitize_filename(filename):
#     """
#     Convertit une question en nom de fichier valide
#     """
#     filename = unicodedata.normalize('NFKD', filename).encode('ASCII', 'ignore').decode('ASCII')
#     filename = re.sub(r'[^\w\s-]', '_', filename)
#     filename = re.sub(r'\s+', '_', filename)
#     return filename[:50]
#
# def text_to_speech(text, output_dir):
#     """
#     Convertit le texte en audio et retourne le nom du fichier
#     """
#     try:
#         Path(output_dir).mkdir(parents=True, exist_ok=True)
#
#         base_filename = sanitize_filename(text)
#         filename = f"{base_filename}.mp3"
#         output_file = os.path.join(output_dir, filename)
#
#         tts = gTTS(text=text, lang='fr', slow=False)
#         tts.save(output_file)
#
#         # Retourne uniquement le nom du fichier
#         print(filename)
#         return filename
#
#     except Exception as e:
#         print(f"Erreur: {str(e)}", file=sys.stderr)
#         sys.exit(1)
#
# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description='Convertit une question en audio')
#     parser.add_argument('question', help='La question à convertir en audio')
#     parser.add_argument('--output-dir', default='C:\\Users\\Yesser\\WebstormProjects\\BackendLeaders03\\uploads',
#                       help='Le dossier où sauvegarder les fichiers audio')
#
#     args = parser.parse_args()
#     text_to_speech(args.question, args.output_dir)

import sys
from gtts import gTTS
import os
from pathlib import Path
import argparse
import unicodedata
import re

def sanitize_filename(filename):
    """
    Convertit une question en nom de fichier valide
    """
    filename = unicodedata.normalize('NFKD', filename).encode('ASCII', 'ignore').decode('ASCII')
    filename = re.sub(r'[^\w\s-]', '_', filename)
    filename = re.sub(r'\s+', '_', filename)
    return filename[:50]

def text_to_speech(text, output_dir):
    """
    Convertit le texte en audio et sauvegarde le fichier
    """
    try:
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        base_filename = sanitize_filename(text)
        filename = f"{base_filename}.mp3"
        output_file = os.path.abspath(os.path.join(output_dir, filename))  # Chemin absolu

        tts = gTTS(text=text, lang='fr', slow=False)
        tts.save(output_file)

        # Vérifier que le fichier a bien été créé
        if os.path.exists(output_file):
            print(output_file)  # Retourne le chemin absolu
            return output_file
        else:
            print(f"Erreur: Le fichier n'a pas été créé: {output_file}", file=sys.stderr)
            sys.exit(1)

    except Exception as e:
        print(f"Erreur: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convertit une question en audio')
    parser.add_argument('question', help='La question à convertir en audio')
    parser.add_argument('--output-dir', required=True, help='Le dossier où sauvegarder les fichiers audio')

    args = parser.parse_args()
    text_to_speech(args.question, args.output_dir)
