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
                            content: `Génère un objet JSON avec 5 questions techniques spécifiques à cette description : ${description}. 
                            Format exact : 
                            {
                                "question1": "Texte de la première question",
                                "question2": "Texte de la deuxième question",
                                "question3": "Texte de la troisième question",
                                "question4": "Texte de la quatrième question",
                                "question5": "Texte de la cinquième question"
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
}
