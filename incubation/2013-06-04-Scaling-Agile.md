---
layout: post
title: "Scaling Agile à la Française"
category: Blog
tags:
  - agile
  - scrum
  - distributed-scrum
  - scrum-de-scrum
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

---

{{page.excerpt | markdownify }}

Grandes étapes:

1. Un projet: une équipe Frontend et une équipe Backend; un backlog par équipe.
2. Deux projets: deux équipes mixtes (front/back + cms), une équipe par projet; un backlog par projet.
3. Focus sur un projet: trois équipes mixtes (front/back + cms) un backlog unique.


# Le crétacé


Equipe service: "Et voilà nous on a fini!"
Equipe front: "Ben il n'y a personne qui consomme vos services; vous ne savez même pas s'ils sont utilisables; vous allez avoir du boulot quand on va commencer à les utiliser!"
Equipe service: "Oui comme d'hab. vous n'êtes jamais content, et vous pinaillez toujours pour des petites choses: ton JSON il est pas ci, il serait mieux comme ça... dites nous ce qu'il nous faut tout de suite qu'on en parle plus..."
Equipe front: "Ben on ne sait pas encore ce qu'on va en faire"

> Le crétacé [...] se termine avec la disparition des dinosaures et de nombreuses autres formes de vie. 

L'écart entre le développement du backend et son intégration dans le frontend s'est creusé de plus en plus, si bien que nous sommes presque arrivé à un stade où le backend était fini mais utilisé qu'à 20%. Autrement dit 80% du backend, considérer comme fini, nécessitait encore d'être affiné lorsque qu'il serait utilisé. 
Cette intégration tardive entrainait même parfois une refonte complète de certains services car  - même s'ils répondaient aux demandes fonctionnelles initiales - ils n'étaient pas toujours très exploitable par un vrai consomateur!

Nous avions deux équipes travaillant chacune sur leur propre backlog; deux projets distincts pour un même produit.

Et deux équipes externes (Eogile et Cleverage...)

# Le Paléogène

> Les mammifères évoluent depuis des formes simples en des espèces plus complexes. Certains d'entre eux se spécialisent dans des formes géantes.

Afin de palier aux difficultés rencontrées et notament l'intégration tardive des retours du frontend, les équipes furent réorganisées afin d'intégrer à la fois des développeurs Frontend *ET* des développeurs Backend (au passage furent même rajoutés des compétences CMS). Nos deux équipes de développement sont donc réorganisées en équipes "verticales" avec des compétences mixtes.

Cette réorganisation collait d'ailleurs bien avec la volonté de travailler non plus sur un produit mais sur deux produits. Les équipes avaient donc une organisation "produit" et non plus "couche". 
Chaque équipe ressemble à une équipe "Scrum", avec son Backlog et ses cérémonies. Le Scrum master de chaque équipe joue aussi le rôle de Team Leader et/ou de Tech Lead. Le rôle de Scrum Master est fortement simplifié par la grande autonomie de chaque équipe, et son rôle consiste alors plus à représenter l'équipe et à suivre les projets transverses du département.



Les Sprints de chaque équipe durent deux semaines et sont alignés pour faciliter les livraisons.
A la fin de chaque sprint, la démonstration de ce qui a été accomplie est présentée par chacune des équipes, et la rétrospective est décomposée en deux phases:

* Une retrospective par équipe avec leur P.O. et éventuellement les pilotes (gestion de projet)
+ Une retrospective par communauté de pratique et inter PO/pilotages

Compte tenu de la nature transverse de la couche de service, et le développement de composants front réutilisable, il peux y avoir des dépendances entre les équipes.
Afin de conserver la consistance au sein des différentes couches (Front et Back), des référents pour chaque furent définis et les membres de chaques couches se réunissent une fois par semaine en communautés de pratiques (les "Chapitres" chez Spotify).

> Le chapitre est votre petite famille de personnes qui disposent de compétences similaires et qui
> travaillent dans le même domaine d'expertise au sein de la même tribu.
> Chaque chapitre rencontre régulièrement les autres pour discuter de leur domaine d'expertise et de
> leurs défis spécifiques, par exemple le chapitre des tests, le chapitre des développeurs web ou le
> chapitre du backend.
> Le leader du chapitre est le manager des membres du chapitre, avec toutes les responsabilités
> traditionnelles telles que le développement des personnes, la négociation des salaires, etc. Pourtant,
> le leader du chapitre fait aussi partie d'une brigade et est impliqué dans le travail de tous les jours,
> ce qui lui permet de rester au contact de la réalité.



>Responsabilités de la communauté :
>
>    Garantir la qualité et la cohérence du code
>    Garantir la couverture de tests adaptée
>    Garantir la qualité et l'actualité de la documentation des services (fiches ID et API)
>
>Objectif de la séance:
>
>    Partage des bonnes pratiques
>    Identifier les codes reviews à effectuer par la communauté par rapport aux stories des sprints le nécessitant de l'avis de la communauté
>    Restitution des résultats des codes reviews: erreurs corrigées etc.
>    Conception commune pour certaines stories
>    Identifier des actions d'améliorations et définir un plan d'action (par rapport à chaque action, un porteur d'action et une date cible de réalisation)

De nouvelles cérémonies vinrent compléter les cérémonies Scrum déjà présentes:

* Communauté de pratiques: multi équipes internes/externes...
* Release Committee: Les pilotes, Les product owners des différentes équipes et les représentant de chaque équipe se réunissent et collaborent ensemble pour maintenir une feuille de route cohérente. Chaque produit indique ses besoins et comment priorisé les évolutions entre les équipes pour bénéficier du développement des fonctionnalités communes.

## Release Commitee

> Scrum a une pratique qui s'appelle le "scrum de scrums", une réunion de synchronisation où une personne de chaque équipe rencontre les autres pour discuter des dépendances


Au démarrage de cette nouvelle organisation, chaque équipe se lança dans une vaste campagne de chiffrage en prenant désormais en compte le développement d'une fonctionnalité de bout en bout (séance de wall specs et chiffrage en extreme quotation).



[](http://blog.octo.com/extreme-quotation-planning-agile-sous-steroides/)


# Un petit tour dans le Néogène

Deux sprints et plusieurs séances d'extreme quotation plus tard, la vision des dates d'atterissage de chaque projet se fit de plus en plus précise, mais malheureusement pas compatible avec le calendrier prévu par la direction. A cela se rajoutèrent plusieurs besoins connexes tirés par la couche transverse qu'est le backend sur d'autres produits que les deux pris en charge par nos deux équipes.

> A la fin du Néogène, les continents occupaient approximativement leurs emplacements actuels, le changement le plus notable étant la jonction de l'Amérique du Nord et de l'Amérique du Sud.

# Le Quaternaire


Les changements de priorités et l'ajout de plus en plus de besoins connexes et transverses, nous ont fait rebasculer vers un backlog unique; 

Des fonctionalités identifiées, des besoins priorisés et un périmètre figé:

> Cette période se caractérise par le retour des glaciations, l'apparition du genre Homo et l'Extinction de l'Holocène.

Ajout d'une troisième équipe, et réorganisation du Backlog...

Difficultés rencontrées:

* Un unique backlog
* chiffrages différents unifiés 



[Agilité à grande échelle @ Spotify](http://www.fabrice-aimetti.fr/dotclear/public/traductions/SpotifyScaling_fr.pdf)
[Equipe Feature](http://www.fabrice-aimetti.fr/dotclear/public/traductions/feature_team_primer_fr.pdf)

Nous n'avons pas:

* Les Guildes...

> Techniquement, tout le monde peut accéder à n'importe quel système. Puisque les brigades sont
> effectivement des équipes features13, elles ont normalement besoin de mettre à jour plusieurs
> systèmes pour mettre une nouvelle feature en production.
> Le risque de ce modèle est que l'architecture d'un système soit compromise si personne ne s'intérese
> à la cohérence globale du système.
> Pour pallier ce risque, nous avons un rôle qui s'appelle le « System Owner ». Tous les systèmes ont
> un system owner, ou un binôme de system owners (nous encourageons le binômage). Pour les
> systèmes opérationnels critiques, le System Owner est un binôme Dev-Ops, c'est-à-dire une
> personne ayant la perspective développeur et une autre personne ayant la perspective opérations.
> Le system owner est la personne qu'il faut « aller voir » pour les problèmes techniques ou
> d'achitecture concernant le système. C'est un coordinateur qui guide les personnes qui codent dans
> le système et qui leur garantit qu'elles ne vont pas se marcher dessus. Il se concentre sur des choses
> comme la qualité, la documentation, la dette technique, la stabilité, la scalabilité et le processus de
> livraison.
> Le System Owner n'est pas un goulet d'étranglement ou un architecte dans une tour d'ivoire. Il ne
> doit personnellement pas prendre toutes les décisions, ou écrire tout le code, ou faire toutes les
> livraisons. C'est typiquement un membre d'une brigade ou un leader de chapitre qui a d'autres
> responsabilités quotidiennes en plus de celles de system owner. Pour autant, il prendra de temps en
> temps une journée « system owner » pour faire le ménage sur le système. Normalement, nous
> essayons d'avoir une charge de system owner représentant 10% d'un équivalent temps plein, mais
> cela varie beaucoup entre les systèmes bien entendu.
> Nous avons également un rôle d'architecte en chef, une personne qui coordonne les problèmes
> d'architecture à un haut niveau tous systèmes confondus. Il mène des revues sur les développements
> de nouveaux systèmes pour se prémunir des erreurs classiques, et que tout le monde soit bien aligné
> sur notre vision de l'architecture. Le feedback consiste toujours en de simples suggestions, la
> décision de la conception finale du système relevant toujours de la brigade qui le construit.

