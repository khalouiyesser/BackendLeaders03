import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GptDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Vous êtes passionné(e) par le développement web et souhaitez vous immerger dans un projet professionnel ambitieux ? Nous recherchons un(e) stagiaire PHP/Symfony pour rejoindre notre équipe et participer activement à la création et à l’amélioration de nos solutions.\n' +
      '\n' +
      'Vos missions :\n' +
      '\n' +
      'Développement et maintenance de fonctionnalités backend avec PHP et Symfony.\n' +
      'Participation à la conception et à l\'architecture des projets.\n' +
      'Collaboration avec l’équipe technique pour optimiser les performances et la sécurité.\n' +
      'Mise en œuvre des bonnes pratiques de développement (tests, CI/CD, documentation)\n' +
      'Pourquoi nous rejoindre ?\n' +
      '\n' +
      'Une expérience enrichissante dans une équipe dynamique et bienveillante.\n' +
      'Des projets à la pointe de la technologie, avec de réelles responsabilités.\n' +
      'Une forte opportunité d’apprentissage et de développement personnel.\n' +
      ' \n' +
      '\n' +
      'Exigences de l\'emploi\n' +
      ' \n' +
      '\n' +
      'Connaissance de PHP et du framework Symfony.\n' +
      'Maîtrise des bases des bases de données relationnelles (MySQL, …).\n' +
      'Esprit d\'équipe, autonomie et curiosité pour apprendre.\n' +
      'Une première expérience (stage ou PFE) en développement PHP/Symfony est un plus.',
    description: 'Description d\'une offre' })
  offer:string;

}

