import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreatePostulerDto } from './dto/create-postuler.dto';
import { UpdatePostulerDto } from './dto/update-postuler.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Postuler} from "./entities/postuler.entity";
import {User} from "../auth/schemas/user.schema";
import {Post} from "../post/entities/post.entity";
import {ClaudeApi} from "../services/Claude.service";
import {PostService} from "../post/post.service";
import {exec} from "child_process";
import {promisify} from "util";
import {UploadFileService} from "../services/uploadFile.service";
import * as fs from "node:fs";
import * as path from "node:path";
import { Interview } from '../interview/entities/interview.entity';
import { log } from 'node:console';
// import {PostService} from "../post/post.service";

@Injectable()
export class PostulerService {

  constructor( @InjectModel(Postuler.name) private readonly postulerModel: Model<Postuler>,
               @InjectModel(User.name) private readonly userModel: Model<User>,
               @InjectModel(Post.name) private readonly postModel: Model<Post>,
               @InjectModel(Interview.name) private readonly interviewModel: Model<Interview>,
               private readonly claudeService: ClaudeApi,
               private readonly postService: PostService,
               private readonly uploadFileService: UploadFileService,
               ) {
  }


  async create(createPostulerDto: CreatePostulerDto) {
    try {
      // Recherche du post et de l'utilisateur
      const post = await this.postModel.findById(createPostulerDto.post);
      const user = await this.userModel.findById(createPostulerDto.user);

      console.log("11111111111111111111111111"+post.title + user.lastname)
      // Vérification de l'existence du post et de l'utilisateur
      if (!post || !user) {
        throw new NotFoundException('Post or User not found');
      }


      // Analyse du profil via le service Claude
      const score = await this.claudeService.analyseProfile(
          post.content,
          user.profileDescription
      );

      console.log("2222222222222222222222"+score)
      createPostulerDto.score = score


      return this.postulerModel.create(createPostulerDto)
    } catch (error) {
      throw new InternalServerErrorException('Impossible de traiter la postulation');
    }
  }

  findAll() {
    return `This action returns all postuler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postuler`;
  }

  update(id: number, updatePostulerDto: UpdatePostulerDto) {
    return `This action updates a #${id} postuler`;
  }

  remove(id: number) {
    return `This action removes a #${id} postuler`;
  }

  /*async findCandidatByPost(postId: string) {
    // Trouver toutes les postulations liées à l'ID de la publication
    const postulations = await this.postulerModel.find({ post: postId });

    // Préparer une liste pour stocker les résultats
    const candidats = [];

    // Boucler sur chaque postulation
    for (const postulation of postulations) {
      // Trouver l'utilisateur lié à cette postulation
      const user = await this.userModel.findById(postulation.user);


      console.log(user.name + user.lastname)
      if (user) {
        // Ajouter les données utilisateur au tableau
        candidats.push({
          id: user.id,
          photoUrl: user.photoUrl,
          score: postulation.score,
          fullName: user.name + ' ' + user.lastname,

        });
      }
    }
    // Retourner la liste triée des candidats
    return candidats;
    }
*/
  async findCandidatByPost(postId: string) {
    // Trouver toutes les postulations liées à l'ID de la publication
    const postulations = await this.postulerModel.find({ post: postId });

    // Préparer une liste pour stocker les résultats
    const candidats = [];

    // Boucler sur chaque postulation
    for (const postulation of postulations) {
      // Trouver l'utilisateur lié à cette postulation
      const user = await this.userModel.findById(postulation.user);

      if (user) {
        // Ajouter les données utilisateur au tableau
        candidats.push({
          id: user.id,
          photoUrl: user.photoUrl,
          score: postulation.score,
          fullName: `${user.name} ${user.lastname}`,
        });
      }
    }

    // Trier les candidats par score (du plus haut au plus bas)
    candidats.sort((a, b) => b.score - a.score);

    // Retourner la liste triée des candidats
    return candidats;
  }



  async stats(userId: string) {
    // Récupérer les posts de l'utilisateur
    const posts = await this.postService.findByUser(userId);

    const allScores = []; // Liste pour collecter tous les scores globalement
    // Préparer la réponse
    const response = [];

    // Boucle sur chaque post
    for (const post of posts) {
      const postId = post['id'];

      // Récupérer toutes les postulations pour ce post
      const postulers = await this.postulerModel.find({ post: postId }).exec();

      // Nombre de postulations pour ce post
      const count = postulers.length;

      // Extraire les scores de chaque postulation
      const scores = postulers.map((postulation) => postulation.score);

      allScores.push(...scores);
      // Ajouter le résultat à la réponse
      response.push({
        postName: post.title, // Assure-toi que "title" est le champ du titre du post
        postulations: count,
        scores, // Tableau des scores
      });
    }

    // Retourner la réponse
    return {response,
        allScores};
     // Liste de tous les scores pour tous les posts
  }

  async interview(id: string) {
    try {
      const post = await this.postService.findOne(id);
      if (!post || !post.survey || !Array.isArray(post.survey)) {
        throw new Error("Aucun sondage trouvé pour cet identifiant de post");
      }

      const scriptPath = 'C:\\Users\\Yesser\\WebstormProjects\\BackendLeaders03\\src\\services\\textToSpeech.py';
      const outputDir = 'C:\\Users\\Yesser\\WebstormProjects\\BackendLeaders03\\uploads';
      const execAsync = promisify(exec);
      const audioFiles: string[] = [];

      for (const question of post.survey) {
        try {
          // Échapper les guillemets pour éviter les erreurs de commande
          const escapedQuestion = question.replace(/"/g, '\\"');
          const command = `python "${scriptPath}" "${escapedQuestion}" --output-dir "${outputDir}"`;

          // Exécuter le script Python
          const { stdout, stderr } = await execAsync(command);

          if (stderr) {
            console.error(`Erreur pour la question "${question}": ${stderr}`);
            continue;
          }

          // Récupérer le chemin du fichier généré par le script Python
          const audioFilePath = stdout.toString().trim();
          console.log(`Chemin du fichier généré: ${audioFilePath}`);

          // Vérifier si le fichier existe
          if (!fs.existsSync(audioFilePath)) {
            console.error(`Le fichier audio n'existe pas: ${audioFilePath}`);
            continue;
          }

          // Lire le fichier audio
          const fileBuffer = fs.readFileSync(audioFilePath);
          const fileName = path.basename(audioFilePath);

          // Créer un objet compatible avec Express.Multer.File
          const fileObject = {
            buffer: fileBuffer,
            originalname: fileName,
            mimetype: 'audio/mp3' // Vérifie le format de sortie de ton script Python
          } as Express.Multer.File;

          // Upload du fichier audio vers Cloudinary
          try {
            const cloudUrl = await this.uploadFileService.uploadAudio(fileObject);
            if (cloudUrl) {
              audioFiles.push(cloudUrl);
            }

            // Supprimer le fichier local après un upload réussi
            fs.unlinkSync(audioFilePath);
          } catch (uploadError) {
            console.error(`Erreur lors de l'upload vers Cloudinary:`, uploadError);
          }
        } catch (questionError) {
          console.error(`Erreur lors du traitement de la question "${question}":`, questionError);
        }
      }

      const postulations = await this.postulerModel.find({post : id})

      for (const postulation of postulations) {
        const createInterview = {
          post: id,
          user: postulation.user, // Pas besoin d'attendre ici si postulation est déjà une entité.
          questions: audioFiles,
        };

        // Création d'une interview
        await this.interviewModel.create(createInterview);

        // Mise à jour de la valeur de `interview` à `true`
        const updatedPostulation = await this.postulerModel.findByIdAndUpdate(
            postulation.id,
            { interview: true },
            { new: true } // Retourne le document mis à jour
        );

        const updatedPost = await this.postModel.findByIdAndUpdate(id,{cloture : true},{new : true});

        if (!updatedPost) {
          throw new Error(`Failed to update postulation with id: ${postulation.id}`);
        }
        if (!updatedPostulation) {
          throw new Error(`Failed to update postulation with id: ${postulation.id}`);
        }
      }

      return {
        success: true,
        message: postulations.length,
        files: audioFiles,
        total: audioFiles.length
      };
    } catch (error) {
      console.error('Erreur lors du traitement de l\'interview:', error);
      throw error;
    }
  }

  async postulerByUser(id: string) {
    // Récupérer toutes les postulations de l'utilisateur
    const postulations = await this.postulerModel.find({ user: id });

    // Préparer la réponse
    const response = await Promise.all(
        postulations.map(async (postulation) => {
          // Récupérer les détails de la post
          const postDetails = await this.postService.findOne(postulation.post);

          // Construire l'objet de réponse
          return {
            id: postulation._id, // ID de la postulation
            post : postulation.post,
            interview: postulation.interview, // Champ interview
            title: postDetails.title, // Titre de la post
            content: postDetails.content, // Contenu de la post
          };
        })
    );
    log(response)

    // Retourner la réponse complète
    return response;
  }



  async questions(id: string) {
    // Récupérer une seule postulation liée à la post
    const postulation = await this.interviewModel.findOne({ post: id });

    // Retourner l'objet postulation trouvé
    return postulation.questions;
  }

  async ajoutResponses(idUser: string, idPost: string, listResponse: string[]) {
    // Trouver l'interview correspondante
    const interview = await this.interviewModel.findOne({ post: idPost, user: idUser });

    if (!interview) {
      throw new Error("Interview introuvable pour cet utilisateur et ce post.");
    }

    // Ajouter les réponses à l'attribut 'responses'
    interview.reponses = interview.reponses || []; // Assurer que 'responses' est un tableau
    interview.reponses.push(...listResponse);

    // Mettre à jour l'interview dans la base de données
    return await this.interviewModel.findByIdAndUpdate(
      interview._id,
      { responses: interview.reponses },
      { new: true } // Retourne l'interview mise à jour
    );
  }



}
