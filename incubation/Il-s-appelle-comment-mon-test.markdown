---
layout: post
title: "Il s'appelle comment mon test?"
category: Blog
tags:
  - tdd
  - bdd
  - atdd
  - unit-test
  - integration-test
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

  <blockquote><p>Il n'y a rien de plus irritant que les choses dont on ne peut saisir la nature. Elles mettent au défi notre manie de tout nommer, de tout ranger par catégories précises.</p><small>Irène de Buisseret - L'homme périphérique</small></blockquote>

  Pourquoi fait-on des tests? Et que doit-on tester et comment? Avant même de se poser ces questions là, la nature humaine et cartésienne nous impose un pré-requis:

  <a style="display:block;" href="http://www.ina.fr/pub/culture-et-loisirs/video/PUB3784047072/qui-est-ce-mb-milton-bradley-jeu-de-societe.fr.html"><img style="display:block;margin: 5px auto;" src="/incubation/le-test-s-appelle/plateau-du-jeu-qui-est-ce-1.jpg"/></a>

  * "Eh! ton test, c'est quoi?"
  * **"Ben... un test quoi!"**
  * "Ah mon brave gars, un test ça n'existe pas!"
  * **"..."**
  * "C'est un test manuel ou automatisé? Unitaire? d'acceptation? d'intégration? de Bout en bout?..."
  * **"Ben je pensais écrire un test JUnit pour tester mon service"**
  * "Hum, ton service il fait quoi?"
  * **"Ben il enregistre des objets, fait quelques vérifications, gènère des évènements dans un Bus et enregistre l'objet dans la base"**
  * "Tu vas faire un test d'intégration alors?"
  * **"Ben non c'est un test unitaire que je voudrais faire"**
  * "Tu as pourtant besoin d'une base de données et d'un Bus"
  * **"Ben je pensais mettre des bouchons"**
  * "Ah oué... mais c'est pas un test unitaire non plus, vu que ton service a besoin qu'on lui injecte des rêgles de vérification"
  * **"Ok! mais je veux quand même tester ça!"**
  * "C'est pas possible!!"
  * **"..."**
  * "C'est une demande métier de tester ça?"
  * **"Oui... en quelque sorte, enfin je veux juste tester que mon service marche bien avec les rêgles qu'on a déjà écrit, et vérifier avec de nouvelles"**
  * "A la limite, tu peux considérer que c'est un test d'acceptation, c'est pour quelle Story?"
  * **"Aucune, c'est juste pour être sûr que tout marche"**
  * "Ah ben c'est un test de non-regression alors"
  * **"..."**
  * "Et tu vas l'écrire comment ton test?"
  * **"Je pensais voir avec le référent métier, pour que l'on voit ensemble les rêgles que l'on veux intégrer. J'ai vu qu'on pouvait écrire des tests en langage naturel, ça me plait bien ça"**
  * "Ah ça s'appelle comment ça?"
  * **"BDD il me semble"**
  * "Ah ben là c'est pour faire des tests d'intégration, tu vas avoir besoin de Selenium pour piloter ton interface web"
  * **"Euh non... je veux juste tester mon service, y a pas d'interface"**
  * "C'est pas possible! Dis donc il va falloir que tu me dises comment il s'appelle ton test avant de commencer!!!"
  * **"Ecoute je te laisse lire cet article si tu tiens absolument à me dire comment il s'appelle, pendant ce temps moi je vais écrire quelques tests"**

---

{{ page.excerpt | markdownify }}

Commençons par énumérer les différents types de tests que nous sommes amenés à rencontrer au cours de nos aventures (n'oubliez pas qu'un test est vivant)

* Le **Test Unitaire**: c'est certainement le plus malmené de tous
* Le **Test d'intégration** c'est le plus coriace de la bande
* Le **Test d'acceptation**: c'est un peu le fourre-tout; on y retrouve les **tests fonctionnels**, les **tests **

On trouve aussi les espèces suivantes:

* Le **Test de non regression**
* Le **Test de performance** bon j'admet là on s'égare un peu, on le garde dans la liste mais on n'en reparlera pas ici
* **[Monkey Testing](http://en.wikipedia.org/wiki/Monkey_test)**: pareil on l'évoquera juste; il consiste à donner le clavier à un singe (c'est une image bien sûr! quoique que au sens figuré...) et il fait n'importe quoi avec l'application

Et les accronymes:

* **TDD** (Test Driven Developpment): contrairement à beaucoup d'idées reçues, le TDD ne désigne pas uniquement la pratique d'écrire les tests avant de coder, mais consiste plus en une méthode de conception: comment écrire une application testable et minimale.
* **BDD**
* **ATDD** Acceptance Test Driven Development (ATDD)
* **TDR** (Test Driven Requirements)


BDD vs TDD:

* BDD parle un langage du métier, écrit en texte
* TDD parle un langage technique, écrit en code

BDD vs ATDD

* BDD permet d'automatiser les tests, en mettant l'accent sur la communication
* ATDD est un paradigme générique d'automatisation des tests, pas toujours communicative

Revenons maintenant sur notre **typage**: pourquoi un test ne peux pas appartenir à plusieurs catégories? Rappellez-vous les dangers de tous catégoriser:

<a style="display:block;" href="http://nealford.com/downloads/conferences/Abstraction_Distractions(Neal_Ford).pdf"><img style="display:block; margin:5px auto;" width="400px" src="/incubation/le-test-s-appelle/AbstractionDistraction-neal4d-Ornithorynque.png"/></a>

<blockquote><p>The act of writing a unit test is more an act of design than of verification. It is also more an act of documentation than of verification. The act of writing a unit test closes a remarkable number of feedback loops, the least of which is the one pertaining to verification of function</p><small></small></blockquote>
 “The act of writing a unit test is more an act of design than of verification. It is also more an act of documentation than of verification. The act of writing a unit test closes a remarkable number of feedback loops, the least of which is the one pertaining to verification of function”



Les dernières recommendations:

Dans tous les cas, on essaiera le plus possible d'automatiser les tests quels qu'ils soient. Ma préférence va vers les tests unitaires qui, indépendant des problèmes d'infrastructures, devraient toujours passer. Les tests à plus large échelle nécessite très souvent la mise en place de deploiement automatique de plusieurs composants ce qui ajoute autant de niveau d'inceritude supplémentaire: mon test ne passe plus parce que

* ma base de données n'a pas été restauré
* mon composant d'authentification n'est pas encore démarré
* mon compte twitter a atteint son quota horaire d'appel API
* mon serveur XMPP a changé de port
* le load balancer de mon cluster NoSQL n'utilise pas la bonne plage d'adresses IP
* l'annuaire LDAP est en maintenance
* ...
* une regression a fait son apparition dans le code

Le coup de maintenance et de diagnostic est exponentiellement proportionnel à la granularité de nos tests.




http://www.erlang.org/doc/apps/eunit/chapter.html#Terminology
http://www.guru99.com/types-of-software-testing.html

"don’t worry too much about what you call a test, as long as you are clear on what it does and it does a single thing." &mdash; [The false dichotomy of tests](http://gojko.net/2011/01/12/the-false-dichotomy-of-tests/)



Liens

* [Dan North: How to sell bdd to the business](http://skillsmatter.com/podcast/java-jee/how-to-sell-bdd-to-the-business)
* [Dan North: Introducing BDD](http://dannorth.net/introducing-bdd/) (Traduction [Française](http://philippe.poumaroux.free.fr/index.php?post/2012/02/06/Introduction-au-Behaviour-Driven-Developement))
* [Interview de Mauro Talevi, speaker MIX-IT sur Behavior Driven Development (BDD) et JBehave](http://jduchess.org/duchess-france/blog/interview-de-mauro-talevi-speaker-mix-it-sur-behavior-driven-development-bdd-et-jbehave/)
* [Growing Object-Oriented Software, Guided by Tests](http://www.amazon.fr/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627/ref=sr_1_1?ie=UTF8&qid=1335880259&sr=8-1)
* [Mock Roles Not Object States](http://www.infoq.com/presentations/Mock-Objects-Nat-Pryce-Steve-Freeman)

et surtout

* [Qui est-ce?](http://www.ina.fr/pub/culture-et-loisirs/video/PUB3784047072/qui-est-ce-mb-milton-bradley-jeu-de-societe.fr.html)
* [eighties.fr](http://www.eighties.fr/culture-eighties/jeux-et-jouets/348-qui-est-ce.html)


http://www.infoq.com/news/2011/02/BDD-ATDD
