---
layout: post
title: "300k Chevaux sous le capot grâce à Vert.x et Redis 1/3"
category: Blog
tags:
  - vert.x
  - websocket
  - sockjs
  - redis
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

---

{{page.excerpt | markdownify }}

Dans une précédente mission, nous avons été confronté à une demande directement liée aux nouvelles manière de faire une application Web: une Single Page Application. Autrement dit, une fois la page affichée, celle-ci se met à jour automatiquement, ajuste sa mise en page et son contenu par elle-même. Qu'est ce qui change par rapport à avant: ce n'est pas le serveur qui fournit l'ensemble des données à afficher, mais la page elle-même qui se charge de se mettre à jour. Cela nécessite du coup un developpement plus conséquent de la partie cliente (celle qui s'execute sur le navigateur) mais allège grandement la partie serveur. D'autre part cela pousse aussi l'utilisation intensive d'une approche de type REST, et le serveur n'est plus responsable de l'affichage. Ceci nous a permis d'utiliser le même backoffice quelque soit le média d'affichage: Web, Mobile, Télé connectée...

Bon jusque là rien d'extraordinaire... c'est vrai! En revanche, il s'agit d'un site à fort trafic qui nécessite que les données affichées soit le plus à jour possible. Mouais... celle là on me la fait souvent: le "en temps réel"! eh eh c'est à mon tour de vous la faire, et pour etayer mon propos je vais même jusqu'à vous parler du site en question: [Un site de pari hippique](pmu.fr). Ce qu'il faut savoir, c'est que les gros parieurs attendent généralement le dernier moment pour parier afin que leur impact sur les cotes des chevaux n'ait pas le temps d'être analysées. Tout ça pour dire qu'une des contraintes liées au développement du nouveau site (actuellement en production) était de fournir le plus rapidement possible aux différents clients les dernières informations disponibles: cotes des participants, statut de la course, etc.
Nous avons opté naturellement pour une approche basée sur les WebSockets. Biensûr compte tenu du parc utilisateur nous nous sommes basée sur une abstraction des WebSockets gérant automatiquement la dégradation du protocole vers des solutions plus traditionnelle comme le long-polling.

Une partie de l'infrastructure tournant alors sur NodeJs, nous nous sommes naturellement tourné vers socket.io. Malheureusement nos premiers tests de charges ont été catastrophique et ne permettaient pas la montée en échelle horizontale. C'était la cata! Un weekend passa, un proto émergea! A la recherche d'une solution alternative à socket.io, nous avons trouvé SockJs! il me restait alors à trouver une implémentation séduisante et scalable... en java avec du netty par exemple... duh! Vert.x
Le prototype fut développé rapidement pendant le weekend, et lundi matin nous le secouâmes avec la même hargne que le précédent, et là: pfiouuuu plus de soucis.

Comme les benchmarks sont toujours sujet à controverse, ne prenez pas ces chiffres pour acquis, mais servez-vous éventuellement des essais que nous avons réalisé pour vous faire votre propre décision.

Quelques éléments du benchmark de "developpement"

* les machines utilisées sont des machines virtuelles (OS Redhat) sur des ESX de développement
* les limites de file descriptors (ulimit and co) ont été ajusté comme il faut
* envoi de messages de 290 octets à débit constant de 2 messages/s à l'ensemble des connexions établies
* les connexions sont établies graduellement et linairement en alternant:
  * connexions de 1500 clients en 25s
  * deconnexions de 500 clients en 25s
  * pause pour souffler de 5min

Nodejs + socket.io:

* La plupart des messages sont reçus en moins de 1s tant que le nombre de connexion est inférieur à 10k
* Au delà de 10k connexions, une dérive croissante s'installe et le temps de reception moyen ne fait qu'augmenter
* On constate aussi qu’après déconnexion, la plupart des sockets restent dans l’état `CLOSE_WAIT` côté client, et `FIN_WAIT2` côté serveur (plus de 6500 sockets en `FIN_WAIT2` à la fin des tirs)

Vert.x + SockJS

* La limite est repoussée à 20k connexions avant que cela ne commence à dériver
* On constate aussi que toutes les sockets sont correctement fermées aussi bien côté client que serveur

Ces chiffres datent de plus d'un an, les différents projets ont pu évolué depuis, mais nous avons alors choisi Vert.x. Dans le prochain article nous presenterons Vert.x avant d'expliquer comment nous l'avons intégrer à la plateforme avec en vrac les problématiques suivantes: loadbalancing de websockets, terminaison ssl pour les websockets, sticky sessions liées aux cas des long-pollings, communication des serveurs en DMZ notifiés par la zone sécurisée, et bien d'autre chose encore...





