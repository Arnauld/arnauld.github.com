---
layout: post
title: "[TBDM]DD..."
category: ddd
tags:
  - tdd
  - bdd
  - ddd
  - mdd
published: false
comments: true
excerpt: |
  En prenant un peu de recul sur cette série d'article, je me rends compte que j'ai très vite survollé le domaine pour m'interesser à l'implémentation de l'application. Même si le domaine est relativement clair dans ma tête, il est important que je passe un peu de temps à le mettre à plat: c'est d'ailleurs le but de cette série d'articles.
  
  Ordinairement, quand on pense modèle on arrive rapidement à dessiner une sorte de diagramme de classe. Je ne vais pas y échapper afin d'avoir une base de discussion.

---

{{page.excerpt | markdownify }}


Devant le florilège des acronymes en *DD;

L'une des difficultés majeures pour comprendre le DDD pour un developpeur est sans doute le nombre limité d'exemples concrets disponible. S'agissant plus d'un état d'esprit que d'une pratique clairement définie, il n'existe en effet pas d'application "type". Chaque domaine d'application consistitue un nouveau champs d'exploration et de mise en pratique. Il existe bien quelques bonne pratiques ou "pattern" qui sont définit pour faciliter l'implementation. Mais aucun de ces patrons n'est réellement décrit d'un point de vue de son implémentation.
Cette série d'article à pour but la mise en place de plusieurs pratique *DD sur un domaine concret et bien connu de la plupart des agilistes. Si ce n'est pas votre cas, je vous conseille la lecture préalable de [Scrum from the trenches](...) afin d'avoir un aperçu du glossaire.

Nous allons donc construire une application facilitant la gestion d'un projet agile. Une particularité de notre projet sera qu'il nous permettra de suivre son propre avancement: l'outils que nous développerons sera directement utilisé pour suivre, orienter et organiser son propre développement.

Commençons par décrire les fonctionnalités principales que nous souhaitons dans un premier temps.

## Notre domaine

Dans l'esprit BDD, nous définirons directement les fonctionalités souhaités sous formes de test d'acceptance. Afin de formaliser leur description nous adopterons le schéma courament utilisé:

En tant que membre d'une équipe agile
Afin de permettre ...

Etant donné un membre d'une équipe agile
Quand je me connecte à l'application
Alors je peux déclarer une nouvelle Story


...

L'application devra fournir une interface utilisateur pour naviguer dans le projet, créer des Cards, visualiser le Board, et faire glisser les Card d'une colonne à l'autre.

Dark view                 | Light view
                          |
                          ...

##



[Agile Zen](http://www.agilezen.com/)
* [Backlog] -> Board -> [Archive]
* Board: 
* Cumulative flow ++
* Query language: `color(not:red) and tag:feature`

> Each piece of work (called a story) in your project is represented by a card that can be hung on the board. Stories start out in the backlog, which is just a collection of stories that you're planning to work on someday. When you're ready to start working on a story, you hang its card on the left-most side of your board.










