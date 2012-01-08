---
layout: post
title: "Architecture Hexagonale"
category: DDD
tags:
  - cqrs
  - hexagonale
  - architecture
published: false
comments: true
excerpt: |
  Que l'on traduira (maladroitement) comme suit:

---

http://matteo.vaccari.name/blog/archives/154
http://devblog.consileon.pl/2011/08/02/Axon-Framework-DDD-EDA-meet-together/
https://github.com/AxonFramework/AxonFramework

[Pyxis - Conception pilotée par le domaine (DDD)](http://pyxis-tech.com/fr/expertise/conception-pilotee-par-le-domaine-ddd)

<blockquote><p>La conception pilotée par le domaine (Domain-driven design, DDD) est une approche de développement logiciel adaptée aux besoins complexes dont l'idée est de connecter fortement l'implémentation d'un modèle aux concepts métiers associés. L'approche est basée sur les principes suivants :

* Mettre l'emphase du projet sur sur le domaine et la logique métier ;
* Baser les conceptions complexes sur un modèle ;
* Initier la collaboration créative entre les experts techniques et du domaine dans le but de s'approcher itérativement du coeur conceptuel du problème.

La conception pilotée par le domaine n'est ni une technologie, ni une méthodologie. DDD fournit une structure de pratiques et une terminologie pour effectuer des choix de conception qui mettent l'accent et accélèrent les projets associés à des domaines complexes.

Les concepts introduits dans le livre Domain-Driven Design de Eric Evan's incluent :

* Langage ubiquitaire (Ubiquitous Language)
* Conception orientée domaine (Model-Driven Design)
** Architecture à Couche (Layered Architecture)
** Entités (Entities)
** Objet valeur (Value Objects)
** Service (Services)
** Modules
** Aggrégats (Aggregates)
** Fabriques (Factories)
** Dépôts (Repositories)
* Remaniement vers un insight plus profond (Refactoring toward deeper insight)
* Préservation de l'intégrité du modèle à travers la conception stratégique (Strategic Design)
** Limite de contexte (Bounded Countext)
** Intégration continue (Continuous Integration)
** Carte de contexte (Context Map)
** Noyau partagé (Shared Kernel)
** Client-fournisseur (Customer-Supplier)
** Conformisme (Conformist)
** Couche d'anti-corruption (Anticorruption Layer)
*** Différents chemins (Separate Ways)
** Service d'hôte ouvert (Open Host Service)
** Distillation

L'architecture héxagonale de Alistair Cockburn est une référence intéressante à consulter lors de l'implémentation de systèmes utilisant l'approche DDD.
</p><small></small></blockquote>

[The Pattern: Ports and Adapters (‘’Object Structural’’)](http://alistair.cockburn.us/Hexagonal+architecture)