---
layout: post
title: "300k Chevaux sous le capot grâce à Vert.x et Redis 2/4"
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

<img src="/incubation/alerting/vertx-logo-white-big.png" alt="Vertx logo" width="100px" style="float: right;"/>

Maintenant que le choix a été fait voyons de plus près [Vert.x](http://vertx.io/)

[Vert.x](http://vertx.io/) est une plateforme polyglote, non-bloquante, orientée évènement et tournant sur la JVM. Euh...?
Ok, reformulons ça un peu plus précisement:

* **Polyglote**: les composants qui peuvent être deployée dans la plateforme peuvent aussi bien être écrit en Java, en Scala, en Python, en Ruby, en Javascript ou en Groovy.
* **non-bloquante** et **orientée évènement**: [Vert.x](http://vertx.io/) a un modèle similaire à NodeJs, chaque composant déployé tourne dans un Thread unique (pouvant être partagé entre plusieurs composants) géré par la plateforme. Chaque composant est notifié par un évènement auquel il s'est enregistré, effectue le traitement adéquat et retourne sa réponse sous forme d'un nouvel évènement.

Avant d'entrer plus en détail sur [Vert.x](http://vertx.io/) il est nécessaire de voir un concept au coeur de son fonctionement: l'**Event Loop**.

Looper 
------

<p style="text-align:center;">
  <img src="/incubation/alerting/EventLoop-Queue-n-Handlers.png" width="530px"/>
</p>

Le principe de l'**Event Loop** est relativement simple. Un thread unique et dédié consomme les évènements (**Event**) qui s'empilent dans une file (**Event Queue**). A chaque évènement, les consomateurs intéressés sont récupérés et l'évènement leur est propagé. Ces consomateurs sont généralement des fonctions de rappels enregistrés sur des types d'évènements particuliers (voir fonction de rappel dans la webographie en fin d'article)
La file, quant à elle, peut être alimentée par différents thread et de manière concurrente.

Une implementation naïve pourrait se traduire par:

{% highlight java %}
class EventLoop {
  public void start() {
    new Thread(new Runnable() {
      public void run() {
        while(!thread.isInterrupted())
          loop();
      }
    }).start();
  }
  protected void loop() {
    Event event = queue.poll(timeout);
    EventHandler handler = lookupHandler(event);
    handler.handle(event);
  }
}
{% endhighlight %}

Ce qu'il est important de retenir c'est que les évènements sont consommés par un unique Thread, les problématiques d'accès concurrent sont donc complétement écartés. Ceci implique aussi qu'il faut que le traitement de l'évènement soit le plus rapide possible et non bloquant, pour ne pas bloquer les autres traitement en attente.

De plus, il s'avère que cela réduit de manière considérable le **context switch** (voir [wikipedia](http://en.wikipedia.org/wiki/Context_switch)) qui se traduit par de meilleure performance puisque la mémoire n'a pas à être réalignée avec de nouvelles données d'execution. On retrouve ce modèle dans la gestion de l'affichage de la plupart des librairies (AWT/Swing, SWT, ...) et même dans des applications comme NodeJs, Redis, Nginx et le moteur d'éxecution Javascript de votre navigateur.
Ce mécanisme est même à la base des acteurs en Scala et des processes en Erlang.

<blockquote>
  <p>The performance of a concurrent language is predicated by three things: the <b>context switching time</b>, the <b> message passing time</b>, and the <b>time to create a process</b>.</p>
  <small>Mike Williams -- Co-inventor of Erlang</small>
</blockquote>

Dis Verticle!
-----------

Maintenant que nous avons définit notre EventLoop voyons le rapport avec [Vert.x](http://vertx.io/). Et bien, le rapport est assez direct: [Vert.x](http://vertx.io/) est entièrement basé sur l'utilisation d'EventLoop. Voyons comment:

Les composants déployés dans [Vert.x](http://vertx.io/) s'appelle des Verticles. Et chaque Verticle "s'execute" par l'intermédiaire d'un EventLoop associé. Autrement dit, les composants deployés (sous forme de Verticle) ne font que réagir à une serie d'évènements dont l'orchestration se fait par l'EventLoop.

<p style="text-align:center;">
  <img src="/incubation/alerting/Verticle-Classloader-isolation.png" width="400px">
</p>

Un autre aspect fondamental des Verticles est qu'ils sont complètement isolés les uns des autres. Ils ne peuvent pas communiquer directement les uns avec les autres. En fait chaque Verticle est déployé dans son propre `ClassLoader` et dispose donc de ses propres versions de classes et de ses propres valeurs statiques.

En fait, on peux voir la plateforme [Vert.x](http://vertx.io/) comme un serveur web (e.g. Tomcat) dans lequel les applications (e.g. war) sont remplacés par les Verticles. Une différence notable est que [Vert.x](http://vertx.io/) n'est pas uniquement dédié à des applications Web mais à tout type d'application. Une autre différence notable est que même si un Verticle ne peux accéder à un autre Verticle directement, la plateforme fournit un moyen de communication au travers d'un EventBus. Il est possible pour un Verticle de publier un évènement dans le Bus de la plateforme et qu'un autre Verticle puisse écouter et être informé de cet évènement. Ceci est notament possible car les évènements doivent être construits à partir de structure prédéfinies tel que les String, du Json ou encore tableau de bytes.

<p style="text-align:center;">
  <img src="/incubation/alerting/EventLoop-with-EventBus.png" width="530px">
</p>

Chaque Verticle réagit donc à différents évènements et publie à son tour des évènements dans le Bus.
Une particularité de ce bus d'évènement est qu'il est même possible qu'il soit distribué entre plusieurs plateforme Vert.x. Le comportement vu d'un Verticle est rigoureusement le même que le destinataire du message soit dans la même JVM ou dans une autre JVM, le bus faisant l'abastraction nécessaire pour masquer cela.

<p style="text-align:center;">
  <img src="/incubation/alerting/DistributedEventBus.png" width="530px">
</p>

Et on fait quoi avec tout ça?

Un des modèles poussés par la plateforme consiste à déployer des Verticles qui auront chacun un but bien précis, et de les faire communiquer entre eux par le bus. Il existe un certain nombre de Verticle déjà disponible permettant par exemple d'interagir de manière asynchrone avec une base NoSQL comme Redis. Le verticle est configuré pour indiquer l'instance Redis avec laquelle il souhaite intéragir, et réçoit sur un canal de communication du Bus les requêtes attendues. Lorsque le résultat sera disponible, il se charge ensuite de republier les données sur un canal de réponse éventuellement fournit dans la requête.

Comme tout est basé sur la notion d'évènements et de gestion asynchrone, il est nécessaire de disposer de librairies compatibles avec ce modèle. La plateforme fournit un ensemble de fonctionnalité de base comme:

* démarrer, écouter et réagir sur un serveur HTTP (basé sur [Netty](http://netty.io))
* démarrer, écouter et réagir sur un serveur TCP (basé sur [Netty](http://netty.io))
* deployer des Verticles permettant de faire des requêtes SQL de manière asynchrone


Webographie
-----------

<h3>Fonctions de rappels / Callback</h3>

* http://www.arolla.fr/blog/2012/12/option-maybe-continuation/
* http://www.arolla.fr/blog/2013/03/callbacks-strike-back/


* [Reactor Pattern](http://en.wikipedia.org/wiki/Reactor_pattern)
* [Architecture of a Highly Scalable NIO-Based Server (2007)](https://today.java.net/article/2007/02/08/architecture-highly-scalable-nio-based-server)

