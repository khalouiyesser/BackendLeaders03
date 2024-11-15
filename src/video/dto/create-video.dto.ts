

export class CreateVideoDto {
  title: string;         // Titre ou nom de la vidéo
  description?: string;  // Description facultative
  tags?: string[];       // Tags associés (facultatif)
  // filename n'est plus nécessaire ici puisque nous allons l'obtenir à partir de Cloudinary
}




