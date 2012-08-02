---
layout: post
title: Les Barriques ~ Le Projet
category: Blog
tags:
  - Devoxx
  - DevoxxFR
  - Java
published: true
comments: true
---


Chaque dév. devra être accompagné de références d'articles/explications
Le maximum de détails devra être disponible
Le developpement/Recherche/documentation/POC sera découpé en Sprint.

Sprint 0:

* Sélection et définition du domaine


Sprint 1:

* Découverte et choix technologiques


# Généralité

* TDD / BDD / DDD
* Integration Continue (e.g Jenkins: Travis / Cloudbees )
* HTTP/REST
* Documentation

Invariants

* GIT / GITHUB
* Patternity
* Findbugs / Cobertura / Sonar...
* JSLint...
* 100% de couverture de tests sinon build en erreur

Build

* Maven / Ant / Gradle / Buildr

## Architecture

* Elastic 

### Front

* Html5
  * SVG vs Canvas
* CSS3
* Javascript / Coffeescript
  * RIA? (http://codebrief.com/2012/01/the-top-10-javascript-mvc-frameworks-reviewed/)
    * Backbone
    * EmberJS
  * JQuery
  * JSON/HTTP


* Nginx (phase 2)

* Serveur NodeJS
  * Websocket
    * socket.io

### Back

* CQRS
  * 1 application
  * 1 application commande + 1 application query

http://vadimcomanescu.wordpress.com/2012/06/26/cqrs-domain-events-and-ddd-review/
http://blog.zilverline.com/2012/07/04/simple-event-sourcing-introduction-part-1/
http://prezi.com/hi2dmhfej9zu/ddd-cqrs-sample/
http://cirw.in/blog/time-to-move-on

* EventSource

http://www.infoq.com/presentations/Event-Sourced-Architectures-for-High-Availability

* Java: 
  * SpringMVC
  * Spring IOC | Guice
  * Hibernate (Postgres, MySQL, h2)
  * NoSQL: MongoDB, Cassandra, CouchDB, Neo4j


http://www.infoq.com/articles/warner-couchdb
http://horicky.blogspot.fr/2012/07/couchbase-architecture.html
http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis


* Scala
  * Spray / Unfiltered

http://www.cakesolutions.net/teamblogs/2012/06/14/composing-akka-spray-application/


* Scala / Clojure / Groovy
* Ruby
* Erlang



### Cache distribué / Cluster

* Memcached / Couchbase
* Terracotta

### Bus

* RabbitMQ / 0MQ
* ActiveMQ
* Redis

http://java.dzone.com/articles/rabbitmq-and-short-intro-amqp




