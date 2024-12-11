import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface QuestionSet {
    [key: string]: string;
}

@Injectable()
export class ClaudeApi {
    private readonly CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
    private readonly API_KEY = process.env.ANTHROPIC_API_KEY;

    async generateQuestions(description: string): Promise<QuestionSet> {
        try {
            const response = await axios.post(
                this.CLAUDE_API_URL,
                {
                    model: 'claude-3-opus-20240229',
                    max_tokens: 3000,
                    messages: [
                        {
                            role: 'user',
                            content: `Génère un objet JSON avec 10 questions techniques spécifiques à cette description : ${description}. 
                            Format exact : 
                            {
                                "question1": "Texte de la première question",
                                "question2": "Texte de la deuxième question",
                                "question3": "Texte de la troisième question",
                                "question4": "Texte de la quatrième question",
                                .
                                .
                                "question10": "Texte de la cinquième question"
                            }
                            Les questions doivent être techniques, détaillées et directement liées au contexte de la description.`
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.API_KEY,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            // Extraction du texte de la réponse
            const responseText = response.data.content[0].text;

            // Extraction et parsing du JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]);
                } catch (parseError) {
                    throw new Error('Impossible de parser le JSON');
                }
            } else {
                throw new Error('Format JSON invalide');
            }
        } catch (error) {
            console.error('Erreur lors de la génération des questions:', error);
            throw new Error(`Erreur: ${error.message}`);
        }
    }
    async analyseProfile(description: string, userProfile: string): Promise<number> {
        try {
            const response = await axios.post(
                this.CLAUDE_API_URL,
                {
                    model: 'claude-3-opus-20240229',
                    max_tokens: 3000,
                    messages: [
                        {
                            role: 'user',
                            content: 'Tu es un expert RH en évaluation de candidatures. Ta mission est de calculer précisément le pourcentage de compatibilité entre un profil et un poste.\n' +
                                '\n' +
                                `Description du profil : [${userProfile}]\n` +
                                `Description du poste : [${description}]\n` +
                                'Calcule un pourcentage de compatibilité technique basé sur :\n' +
                                '- Adéquation des compétences techniques\n' +
                                '- Correspondance de l\'expérience professionnelle\n' +
                                '- Niveau de formation\n' +
                                '- Alignement avec les exigences du poste\n' +
                                '\n' +
                                'Critères de calcul :\n' +
                                '- Utilise une échelle de 0 à 100%\n' +
                                '- Sois très précis et objectif\n' +
                                '- Prends en compte les compétences directes et transversales\n' +
                                '- Pondère l\'importance de chaque critère\n' +
                                '\n' +
                                'Retourne UNIQUEMENT le pourcentage de compatibilité, sous forme de nombre entier entre 0 et 100, sans aucun texte supplémentaire.'
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.API_KEY,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            // Extraire le texte de la réponse
            const responseText = response.data.content[0].text.trim();

            // Convertir directement en nombre
            const compatibilityScore = parseInt(responseText, 10);

            // Vérifier que le score est un nombre valide entre 0 et 100
            if (isNaN(compatibilityScore) || compatibilityScore < 0 || compatibilityScore > 100) {
                throw new Error('Score de compatibilité invalide');
            }

            return compatibilityScore;

        } catch (error) {
            console.error('Erreur lors du calcul de compatibilité:', error);
            throw new Error(`Erreur de calcul de compatibilité: ${error.message}`);
        }
    }
}
