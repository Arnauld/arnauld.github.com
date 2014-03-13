---
layout: post
title: "300k Chevaux sous le capot grâce à Vert.x et Redis 1/4"
category: Blog
tags:
  - vert.x
  - websocket
  - sockjs
  - redis
  - socket.io
  - nodejs
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

---

{{page.excerpt | markdownify }}

Application web mono-page (Single Page Application)
-----------------------------------------------

Dans une précédente mission, nous avons été confronté à une demande directement liée aux nouvelles manière de faire une application Web: une [Single Page Application](http://en.wikipedia.org/wiki/Single-page_application) au travers de frameworks/librairies tels que Backbone, Ember ou Angular... Autrement dit, une fois la page affichée, celle-ci se met à jour automatiquement, ajuste sa mise en page et son contenu par elle-même. Qu'est ce qui change par rapport à avant: ce n'est pas le serveur qui fournit l'ensemble des données à afficher, mais la page elle-même qui se charge de se mettre à jour. Cela nécessite du coup un developpement plus conséquent de la partie cliente (celle qui s'execute sur le navigateur) mais allège grandement la partie serveur. D'autre part cela pousse aussi l'utilisation intensive d'une approche de type REST, et le serveur n'est plus responsable de l'affichage. Ceci nous a permis d'utiliser le même backoffice quelque soit le média d'affichage: Web, Mobile, Télé connectée...

<p style="text-align: center;">
    <img src="/incubation/alerting/SinglePageApplication.png" alt="Single Page Application" width="400px"/>
</p>

Chaque bloc se met à jour en effectuant une requête sur sur le serveur `Req` qui répond au bloc avec les informations demandées `Rep`. Nous sommes donc dans le cas usuel où le client (le navigateur) est à l'initiative de la communication.

Bon jusque là rien d'extraordinaire... c'est vrai!

Mises à jour en "presque" temps réel
--------------------------------

En revanche, il s'agit d'un site à fort trafic qui nécessite que les données affichées soit le plus à jour possible. Mouais... celle là on me la fait souvent: le "en temps réel"! eh eh c'est à mon tour de vous la faire, et pour etayer mon propos je vais même jusqu'à vous parler du site en question: [Un site de pari hippique](https://www.pmu.fr/turf/). 

<p style="text-align: center;">
    <img src="/incubation/alerting/biker.jpg" alt="PMU biker" width="400px"/>
</p>

Ce qu'il faut savoir, c'est que les gros parieurs attendent généralement le dernier moment pour parier afin que leur impact sur les cotes des chevaux n'ait pas le temps d'être analysées. Tout ça pour dire qu'une des contraintes liées au développement du nouveau site (actuellement en production) était de fournir le plus rapidement possible aux différents clients les dernières informations disponibles: cotes des participants, statut de la course, etc. Il fallait trouver un mécanisme de notification permettant au Backend d'informer le client que les données devaient être mises à jour.

Nous avons opté naturellement pour une approche basée sur les WebSockets. Biensûr compte tenu du parc utilisateur (IE8, IE9, IE10, Chrome, Safari, Firefox...) nous nous sommes basée sur une abstraction des WebSockets gérant automatiquement la dégradation du protocole vers des solutions plus traditionnelles comme le long-polling, xhr-streaming, ...

A noter que la présence de proxy sur le chemin peux nuire à l'utilisation des WebSockets alors que le navigateur les gère.
<blockquote>
  <p>
  Therefore, it is always best to use Web Sockets Secure with TLS encryption to connect to a WebSocket server, unless you're absolutely certain there are no intermediaries.
  </p>
  <small><a href="http://www.infoq.com/articles/Web-Sockets-Proxy-Servers">How HTML5 Web Sockets Interact With Proxy Servers</a></small>
</blockquote>

NodeJs+Socket.io vs Vert.x+SockJS
-------------------------------

Une partie de l'infrastructure tournant alors sur [NodeJs](http://nodejs.org/), nous nous sommes naturellement tourné vers [socket.io](http://socket.io/). Malheureusement nos premiers tests de charges n'ont pas été concluant et ils ne permettaient pas la montée en charge. **C'était la cata!** Un weekend passa, une alternative il nous faudra!

Quelle alternative à [socket.io](http://socket.io/)? [SockJs](http://sockjs.org)! <img src="/incubation/alerting/sockjs-logo.png" alt="SockJS logo" width="100px"/>

Il ne restait alors plus qu'à trouver une implémentation séduisante et scalable... en **java** avec du [netty](http://netty.io/) par exemple... duh! [Vert.x](http://vertx.io/)

<p style="text-align: center;">
    <img src="/incubation/alerting/vertx-logo-white-big.png" alt="Vertx logo" width="400px"/>
</p>

Le prototype fut développé rapidement: 
... et le lundi matin nous n'avions plus qu'à le secouer avec la même hargne que le précédent, et là: pfiouuuu plus de soucis.

Comme les benchmarks sont toujours sujet à controverse, ne prenez pas ces chiffres pour acquis, mais servez-vous éventuellement des essais que nous avons réalisé pour vous faire votre propre décision.

Quelques éléments du benchmark de "developpement"

* les machines utilisées sont des machines virtuelles (OS Redhat) sur des ESX de développement
* les limites de file descriptors (ulimit and co) ont été ajusté comme il faut
* envoi de messages de 290 octets à débit constant de 2 messages/s à l'ensemble des connexions établies
* les connexions sont établies graduellement et linairement en alternant:
  * connexions de 1500 clients en 25s
  * deconnexions de 500 clients en 25s
  * pause pour souffler de 5min

<p style="text-align:center;">
  <img src="/incubation/alerting/RampUpNbConnections.png" alt="Ramp up" width="400px" />
</p>

**Nodejs (0.6.x) + socket.io (0.9.10):**

* La plupart des messages sont reçus en moins de 1s tant que le nombre de connexion est inférieur à 10k
* Au delà de 10k connexions, une dérive croissante s'installe et le temps de reception moyen ne fait qu'augmenter
* On constate aussi qu’après déconnexion, la plupart des sockets restent dans l’état `CLOSE_WAIT` côté client, et `FIN_WAIT2` côté serveur (plus de 6500 sockets en `FIN_WAIT2` à la fin des tirs)

**Vert.x + SockJS**

* La limite est repoussée à 20k connexions avant que cela ne commence à dériver
* On constate aussi que toutes les sockets sont correctement fermées aussi bien côté client que serveur

Ces chiffres datent de plus d'un an, les différents projets ont pu évolué depuis, mais nous avons alors choisi Vert.x. Dans le prochain article nous presenterons Vert.x avant d'expliquer comment nous l'avons intégrer à la plateforme avec en vrac les problématiques suivantes: loadbalancing de websockets, terminaison ssl pour les websockets, sticky sessions liées aux cas des long-pollings, communication des serveurs en DMZ notifiés par la zone sécurisée, et bien d'autre chose encore...


Webographie
-----------

* [How HTML5 Web Sockets Interact With Proxy Servers](http://www.infoq.com/articles/Web-Sockets-Proxy-Servers)

* [Benchmarking for Node.JS / Socket.IO sites](http://blog.sphereinc.com/2012/04/benchmarking-for-node-js-socket-io-sites/)
* [scalability issues relating to socket.io](http://stackoverflow.com/questions/9924822/scalability-issues-relating-to-socket-io)
* [Performance benchmarking Socket.io 0.8.7, 0.7.11 and 0.6.17 and Node's native TCP](http://blog.mixu.net/2011/11/22/performance-benchmarking-socket-io-0-8-7-0-7-11-and-0-6-17-and-nodes-native-tcp/)
  * [siobench - Github](https://github.com/mixu/siobench)
* [Websocket Example: Server, Client and LoadTest](http://webtide.intalio.com/2011/08/websocket-example-server-client-and-loadtest/)
* [Jetty 9 - require jdk7+](http://webtide.intalio.com/2012/10/jetty-9-updated-websocket-api/)
* [socket.io-benchmarking - Github](http://drewww.github.com/socket.io-benchmarking/)
  * [socket.io-benchmarking - Github](https://github.com/drewww/socket.io-benchmarking/blob/master/client/src/main/java/org/websocketbenchmark/client/SocketIOClient.java)
* [Java-WebSocket - Github](https://github.com/TooTallNate/Java-WebSocket)

* [SockJS, multiple channels, and why I dumped socket.io](http://baudehlo.com/2013/05/07/sockjs-multiple-channels-and-why-i-dumped-socket-io/)
* [SockJS vs Socket.IO - Benchmarked](http://blog.pythonanywhere.com/27/)



