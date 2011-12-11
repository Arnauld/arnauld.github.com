---
layout: post
title: "[T|B|D]DD par la pratique 7 - DSL et Code generation"
category: tbd-in-practice
tags:
  - ddd
  - cqrs
  - event-sourcing
  - dsl
  - code-gen
  - mda
published: false
comments: true
excerpt: |
  En lisant la fin de l'article "3.5 - Notre domaine" ainsi que le début de notre implémentation, on peux se rendre compte de répétitivité dans la définition de nos objets, on voit émerger (dans le cas d'une implémentation très simpliste du modèle CQRS) plusieurs motifs facilement tels que:
  
  * A chaque méthode de nos entités (`Entity`) correspond la définition d'un évènement (`Event`) constitué des mêmes attributs que les paramètres de la méthode plus l'identifiant de l'entité
  * A pour chaque type d'évènement il est nécessaire d'avoir un `Eventhandler` associé qui pourra par exemple affecter à chaque champs de nos entités la valeur de l'attributs correspondant. Il pourra aussi vérifier que l'évènement s'applique bien à l'entité propriétaire de l'évènement.
  * A chaque méthode de nos entités correspond la définition d'une commande (`Command`) constitué des mêmes attributs
  * A pour chaque type de `Command` il est nécessaire d'avoir un `Eventhandler` associé qui pourra par exemple affecter à chaque champs de nos entités la valeur de l'attributs correspondant

  Il apparait que quasiment tous nos éléments (`Entity`, `Event`, `EventHandler`, `Command`, `CommandHandler`, `Repository` ...) pourraient être générer à partir d'un unique modèle simplifiant et accélérant leurs écritures. Dans cet article, nous allons nous efforcer de définir le [DSL](http://martinfowler.com/bliki/DomainSpecificLanguage.html) qui permettra de définir simplement et intuitivement notre modèle unique.

--- 

{{page.excerpt | markdownify }}
 

Avant de générer les différents éléments pour notre approche CQRS, nous nous interesserons à définir la syntaxe de notre DSL. Ensuite nous verrons comment, tout en restant sur la plateforme NodeJS nous pourrons transformé un modèle décrit par notre DSL en un modèle utilisable pour un générateur de code lui-aussi sur plateforme NodeJS.

Cette approche est très similaire à l'approche pronée par le [MDA](http://fr.wikipedia.org/wiki/Model_driven_architecture) et les différentes phases PIM PAM POUM... (en fait le modèle *CIM* correspond à notre *DSL*, le modèle *PIM* correspondra à l'interpretation de notre DSL en un modèle nous permettant de générer notre *PSM* à partir d'un moteur de template).

