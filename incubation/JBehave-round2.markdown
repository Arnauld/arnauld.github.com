---
layout: post
title: "JBehave round 2"
category: Blog
tags:
  - java
  - jbehave
  - bdd
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>
  
  A l'occasion de la release [`1.0.7` du plugin Eclipse](http://github.com/Arnauld/jbehave-eclipse-plugin) pour [JBehave](http://jbehave.org/), je vais en profiter pour présenter cet outil, à quoi il peux servir et comment le mettre en oeuvre.

  [JBehave](http://jbehave.org/) est un framework BDD pour Java et Groovy.

  Story en FR
  Steps avec Variant...
  Converteurs

  Selenium (WebDriver) + Fluentlenium

---

{{ page.excerpt | markdownify }}


{% highlight gherkin linenos %}
Given Pacman a mangé une pacgomme
And un fantome qui se promène
And il s'est écoulé 30s
When Pacman rencontre le fantôme
Then Pacman meurt lamentablement 
{% endhighlight %}


# Références et Liens


* [Selenium](http://code.google.com/p/selenium/wiki/GettingStarted)
* [FluentLenium](https://github.com/FluentLenium/FluentLenium)
