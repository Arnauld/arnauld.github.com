---
layout: post
title: "Functional Java"
category: Blog
tags:
  - java
  - functional-programming
  - javascript
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

  Cet article reprend en partie l'article précédent [Programmation par continuation]() à travers l'utilisation de javascript. Nous verons ensuite d'autres techniques afin de rendre notre code plus lisible et plus compréhensible.

---

{{page.excerpt | markdownify }}


# Preambule: Javascript ça `function-ne` pas mal!

L'une des richesses de Javascript par rapport à d'autres langages (comme "Java") est que la `function` est un objet de première classe: <b>Une fonction est un objet et il est possible de l'affecter à une variable</b>.

{% highlight javascript linenos %}
var add = function(a,b) { return a + b; }
{% endhighlight %}

Il est même possible de définir des fonctions qui renvoient d'autres fonctions, on parle alors de fonction d'ordre supérieur:

{% highlight javascript linenos %}
var adder = function(a) {
  return function(b) {
    return add(a, b);
  }
};

var add7 = adder(7);
assert(add7(0) === 7);
assert(add2(35) === 42);
{% endhighlight %}

Enfin, on peux même définir des fonctions qui prenent d'autres fonctions en paramètres et renvoient des fonctions:

{% highlight javascript linenos %}
var curry = function(func, a) {
  return function(b) {
    return func(a,b);
  }
}

var add7 = curry(add, 7);
assert(add7(0) === 7);
assert(add2(35) === 42);
{% endhighlight %}

Un autre exemple en `jquery` que l'on rencontre sans doute plus fréquement:

{% highlight javascript linenos %}
$("#login").on('click', function (event) {
    $("#login-pane").show();
});
{% endhighlight %}

Une fonction de rappel est invoquée lorsqu'un clic est détecté sur l'élément `login`; elle affiche alors l'élément `login-pane`.

Notes:
* [Fonction d'ordre supérieur](http://fr.wikipedia.org/wiki/Fonction_d%27ordre_sup%C3%A9rieur)
* [Curryfication](http://fr.wikipedia.org/wiki/Curryfication)

# Les techniques vu précédemment

Reprenons le code Java de notre première technique et transposons le en <b>un</b> équivalent javascript:

{% highlight java linenos %}
public class QuizService {
  ...
  public void create(String quizContent, Effect<Quiz> effect) {
    Quiz quiz = quizFactory.create(nextId(), quizContent);
    effect.e(quiz);
  }  
}
{% endhighlight %}

devient:

{% highlight javascript linenos %}
QuizService.prototype.create = function(quizContent, callback) {
	var quiz = this.quizFactory.create(this.nextId(), quizContent);
	callback(quiz);
}
{% endhighlight %}

La transposition est relativement clair. Illustrons cela par un exemple d'appel:

{% highlight javascript %}
quizService.create("<question4aChampion>...", function(quiz) {
	displayQuiz(quiz);
});
{% endhighlight %}

Une fois le quiz créé, il est passé en paramètre à notre fonction qui se contente de demander son affichage. Comme les arguments sont identiques cela peux même se réduire à (n'oubliez pas qu'une fonction est un objet de première classe):

{% highlight javascript %}
quizService.create("<question4aChampion>...", displayQuiz);
{% endhighlight %}


Passons rapidement à la deuxième technique:

{% highlight java linenos %}
public class QuizService {
  public void create(String quizContent, Effect<Either<Quiz,Failure>> effect) {
    if(quizIsUnique(quizContent)) {
      Quiz quiz = quizFactory.create(nextId(), quizContent);
      Either<Quiz,Failure> left = Eithers.left(quiz);
      effect.e(left);
    }
    else {
      // Failure is a Pojo but could also be an UniqueConstraintException
      Failure failure = new Failure(Code.NonUniqueQuiz);
      Either<Quiz,Failure> right = Eithers.right(failure);
      effect.e(right);
    }
  }  
}
{% endhighlight %}

Là les choses vont commencer à se simplifier:

{% highlight javascript linenos %}
QuizService.prototype.create = function(quizContent, callback) {
  if(this.quizIsUnique(quizContent)) {
    var quiz = this.quizFactory.create(this.nextId(), quizContent);
    callback(null, quiz);
    // or callback.apply(null, [null, quiz]);
  }
  else {
    var failure = new Failure(Code.NonUniqueQuiz);
    callback(failure);
    // or callback.apply(null, [failure]);
  }
}
{% endhighlight %}

<p class="sidenote">
  <h4>Rituel d'invocation: du direct, un peu d'`apply`, un zeste de `call` et une pincée de `this`</h4>
  Il existe plusieurs façon d'invoquer une fonction lorsque l'on dispose d'une reference sur celle-ci.
  Il est possible de l'invoquer directement lorsque l'on connait les arguments exactes auxquels elles s'attend: `callback(null, quiz)`.
  Dans ce cas tout se passe bien tant que l'on ne se soucis guère de la notion de `this`. L'instance référencée par `this` au momement de l'execution du callback est alors non maitrisé, ce qui dans la plupart des cas ne pose pas de réel problème tant qu'on ne l'utilise pas.
  En revanche quand on est amené à utilisé le `this` il devient alors indispensable de connaitre ce qu'il référence. Ce qui est typiquement le cas en JQuery:
  {% highlight javascript linenos %}
  $(".button").click(function() {
    var buttonId = $(this).attr("id");
    console.log("Button clicked: " + buttonId);
  });
  {% endhighlight %}
  Ligne 2 le `this` référence l'élément qui a été cliqué. C'est JQuery qui se charge d'invoquer la fonction de rappel en lui associant en `this` l'élément qui vient d'être cliqué. Cette association ce fait par l'intermédiaire des fonctions `apply` et `call` (Eh oui une fonction est un objet à part entière et dispose elle-même de fonctions!).
  Il existe enfin une petite subtilité, en définissant le `this` on ne définit pas seulement la valeur d'une variable, mais aussi l'objet sur lequel la fonction est invoquée, cela sort du cadre de cet article, les plus curieux pourront donc consulter les articles "8.7.3 The call() and apply() Methods - Javascript: The Definitive Guide" et [Function.prototype.apply method](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/apply)  pour plus d'informations sur les subtilités de ces fonctions. On pourra aussi consulter (8.3.2 Variable-Length Argument Lists: The Arguments Object - Javascript: The Definitive Guide) sur leur usages conjointement avec la variable spéciale `arguments`, ce qui permet de traiter efficacement les fonctions dont le nombre de paramètres peux varier d'une invocation à l'autre.
</p>

Qu'avons nous fait? Eh bien notre fonction de rappel peux prendre deux paramètres: le premier, s'il est non `null` (voir aussi [Falsy values in javascript](http://oreilly.com/javascript/excerpts/javascript-good-parts/awful-parts.html#the_many_falsy_values_of_javascript)) désigne une erreur, tandis que le second désigne le résultat en cas de succès. Il s'agit d'une convention de généralement placer l'erreur comme premier paramètre.

Voyons alors le code appellant:

{% highlight javascript linenos %}
quizService("<question4aChampion>...", function(err, quiz) {
  if(err) {
    displayErrorFeedback(err);
  }
  else {
    displyFlashFeedback(quiz);
  }
})
{% endhighlight %}


Allez hop, on enchaine avec la troisième technique:

Avant:

{% highlight java linenos %}
public class QuizService {
  public void save(Quiz quiz, Effect<Option<Failure>> effect) {
    try {
      repository.save(quiz);
      effect.e(Options.none());
    }
    catch(RepositoryException re) {
      Failure failure = new Failure(re);
      effect.e(Options.some(failure));
    }
  }
}
{% endhighlight %}

Après:

{% highlight javascript linenos %}
QuizService.prototype.save = function(quiz, callback) {
  try {
    this.repository.save(quiz);
    callback();
  }
  catch(e) {
    callback(e);
  }
}
{% endhighlight %}

Bon... en pratique on verra très rarement du code comme ça! mais plutôt:

{% highlight javascript linenos %}
QuizService.prototype.save = function(quiz, callback) {
  this.repository.save(quiz, function(err,res) {
    callback(err);
  });
}
{% endhighlight %}

ou même beaucoup plus simplement:

{% highlight javascript linenos %}
QuizService.prototype.save = function(quiz, callback) {
  this.repository.save(quiz, callback);
}
{% endhighlight %}

# Et pourquoi parler de Javascript maintenant?


Eh bien parce qu'il devient difficile de ne pas voir que son utilisation devient de plus en plus présente avec des interfaces utilisateur de plus en plus riche. Il suffit de voir l'approche RIA et son nombre croissant de framework: Backbone.js, AngularJS, Ember.js, KnockoutJS, ... et même Batman.js! (voir [Todo MVC](http://addyosmani.github.com/todomvc/) pour la comparaison d'une TODO liste réalisée avec les différents frameworks).
Et malgré ce que peuvent en dire certain, sa présence côté serveur - populariser par la plateforme NodeJs - à de quoi nous interpeller. D'ailleurs une grande partie du succès de NodeJs réside dans son approche non bloquante, et toute son API est tournée autour des techniques que nous venons de voir: des appels asynchrones auxquels on passe des fonctions de rappel.


# Reveille le Numérobis qui sommeille en toi!

Voyons à quoi ressemblerait une application javascript prenant en compte à chaque appel cette notion de fonction de rappel:

{% highlight javascript linenos %}
checkUniqueness(data, function(err) {
  if(err)
    displayError(err);
  else
    createQuiz(data, function(err, quiz) {
      if(err)
        displayError(err);
      else
        saveQuiz(quiz, function(err, quizId) {
          if(err)
            displayError(err);
          else
            lookupQuiz(quizId, function(err, quiz) {
              if(err)
                displayError(err);
              else
                sendQuiz(quiz)
            })
        })
    })
})
{% endhighlight %}

Mouais... c'est un bien bel escalier qui se dessine; certain parle même de pyramide funeste:

<blockquote><p>As we all know, asynchronous I/O leads to callback API’s, which lead to nested lambdas, which lead to... the pyramid of doom</p><small><a href="http://calculist.org/blog/2011/12/14/why-coroutines-wont-work-on-the-web/">Why coroutines won't work on the web</a></small></blockquote>

Le code devient difficile à lire, à comprendre et par conséquent à maintenir et à faire évoluer! 

Pour la petite histoire, c'est justement en arrivant à ce constat en écrivant le code implémentant les différents motifs vu dans <a href="http://www.arolla.fr/blog/2012/11/amqp-101-part-1/">AMQP 101 - Part 1</a> que j'ai cherché une alternative plus élégante pour écrire la même fonctionalité. Il me fallait trouver une manière plus lisible d'écrire et donc de comprendre les exemples, tout ça pour toi cher lecteur! (On vous bichone bien non?)


# Des promesses, des promesses et encore des promesses

Que ce cache sous ce titre? Et bien une nouvelle technique: les `Promises`

Voyons tout d'abord le résultat auquel on souhaite arriver en reprenant l'example précédent:

{% highlight javascript linenos %}
checkUniqueness(data)
  .then(displayError, function() {
    return createQuiz(data);
  })
  .then(displayError, function(quiz) {
    return saveQuiz(quiz);
  })
  .then(displayError, function(quizId) {
    return lookupQuiz(quizId);
  })
  .then(displayError, sendQuiz);
{% endhighlight %}

On retrouve alors notre enchainement d'appel, mais cette fois chaque appel est lié au précédent via la méthode `then`. Cette methode enregistre alors deux fonctions de rappel: une pour le traitement d'erreur et une pour le traitement du résultat.
Ces fonctions de rappel seront alors appellées lorsque l'appel précédent sera terminé en fonction de son échec ou de son résultat.

Il s'agit là du principe des `Promises` en gros: tu m'invoques, je te renvoie un accusé de reception sur lequel tu peux t'enregistrer, quand j'aurai fini mon traitement je te promets que je te passe son résultat. 

Dit de manière plus technique: une fonction basée sur les `Promises` est une fonction qui renvoie une `promise` à son appel. Cette `promise` fournira le résultat dans le futur (plus tard ou tout de suite). L'interêt est alors de pouvoir chainer ces `promises`  et ainsi de décrire tout l'enchainement du traitement qui devra être effectué à mesure que les résultats passent d'une étape à l'autre.

Afin de faire apparaitre les `promises`, le code précédent pourrait être réécrit de la manière suivante (il s'agit strictement du même code, la seule différence est de faire apparaitre explicitement les variables intermédiaires au lieu de chainer les appels directement):

{% highlight javascript linenos %}
var promise0 = checkUniqueness(data);
var promise1 = promise0.then(displayError, function() {
                  return createQuiz(data);
                });
var promise2 = promise1.then(displayError, function(quiz) {
                  return saveQuiz(quiz);
                });
var promise3 = promise2.then(displayError, function(quizId) {
                  return lookupQuiz(quizId);
                });
promise3.then(displayError, sendQuiz);
{% endhighlight %}

A quoi pourrait ressembler une implémentation très <b>simpliste</b> ne permettant pas le chainage (voir le code plus complet de []() pour une implémentation plus complète et beaucoup plus robuste):

{% highlight javascript linenos %}
var Promise = function () {
  this.resolved = false;
  this.callbacks = [];
};

Promise.prototype.resolve = function(error, data) {
	this.data = data;
  this.error = error;
	this.callbacks.forEach(function(cb) { 
    if(error)
      cb[0](error);
    else
      cb[1](data);
  });
	this.callbacks = [];
	this.resolved = true;
}

Promise.prototype.then = function(errorCallback, resultCallback) {
	if(this.resolved) {
        if(this.error)
          errorCallback(this.error);
        else
          resultCallback(this.data);
    }
    else {
    	this.callbacks.push([errorCallback, resultCallback]);
	}
}
{% endhighlight %}

Ok... et comment on transforme nos méthodes précédentes pour intégrer cela? Et bien cela nécessite d'adapter légèrement nos API afin qu'elles intègrent directement les `Promises`:

{% highlight javascript linenos %}
var checkUniqueness = function(data) {
  var promise = new Promise();
  db.checkUniqueness(function(error) {
    promise.resolve(error);
  });
  return promise;
}

var createQuiz = function(data) {
  var promise = new Promise();
  service.createQuiz(data, function(error, quiz) {
    promise.resolve(error, quiz);
  });
  return promise;
}

...
{% endhighlight %}

Biensûr tout cela a encore plus d'interêt lorsque les appels `db.checkUniqueness(...)` et `service.createQuiz(...)` sont asynchrones:
les deux méthodes précédentes sont invoquées et avant même que le résultat ne soit disponible la `promise` correspondante est retournée afin de continuer à définir le traitement à effectuer. La chaine de traitement est définit en même temps que la base de données ou notre service travaille.

Quelques explications?

`checkUniqueness` est invoquée avec les données à vérifier `data`. Une `promise` est instancié spécialement pour l'occasion afin d'être notifié lorsque le traitement sera terminé. La vérification d'unicité est alors déléguée à la base de donnée (fallait bien trouver un responsable!) et en attendant son verdict, la `promise`est retournée telle quelle.
Il est alors possible d'enregistrer plusieurs `callback` dessus en utilisant la méthode `then(cbErr,cbOut)` (exemple: `.then(displayError, function() { return createQuiz(data); })`).
Les `callback` ainsi enregistrés seront alors notifiés dès que le résultat sera disponible, c'est à dire lorsque la méthode `promise.resolve(err,out)` est invoquée avec le résultat du traitement.


Suis-je concerné? Je pensais que le Javascript était executé par un seul fil d'execution et là on me parle de traitement asynchrone ?

<blockquote><p><b>One of the fundamental features of client-side JavaScript is that it is single-threaded</b>: a browser will never run two event handlers at the same time, and it will never trigger a timer while an event handler is running, for example. <b>Concurrent updates to application state or to the document are simply not possible, and client-side programmers do not need to think about, or even understand, concurrent programming</b>.</p><small>Javascript The Definitive Guide 6th Ed - 22.4 WebWorkers</small></blockquote>

Et en quoi cela nous concerne-t-il si l'on développe sur le navigateur?

Eh bien parce qu'il n'est pas toujours question de traitement effectué sur le navigateur, mais il peux aussi s'agir d'interaction avec des systèmes tierces comme une requête AJAX:

<blockquote><p>A corollary is that client-side JavaScript functions must not run too long: otherwise they will tie up the event loop and the web browser will become unresponsive to user input. <b>This is the reason that Ajax APIs are always asynchronous and the reason that client-side JavaScript cannot have a simple, synchronous load() or require() function for loading JavaScript libraries.</b></p><small>Javascript The Definitive Guide 6th Ed - 22.4 WebWorkers</small></blockquote>

<blockquote><p><b>Everything</b> except network operations happens in a single thread</p><small>
<a href="https://speakerdeck.com/dmosher/so-you-want-to-be-a-front-end-engineer">So, You Want to Be a Front-End Engineer?</a></small></blockquote>

Les bibliothèques JQuery et Dojo fournissent d'ailleurs des API selon le modèle des `promises` appellé chez eux `deferred` ([Dojo ~ Deferreds](http://dojotoolkit.org/reference-guide/1.7/dojo/Deferred.html) et [JQuery ~ Deferreds](http://api.jquery.com/category/deferred-object/)).

De plus, comme l'auront noté les petits malins, HTML5 définit la notion des `WebWorkers` qui permet d'effectuer des traitements en dehors du fil d'execution Javascript. Il est donc tout à fait possible d'effectuer des traitements asynchrones même sur un navigateur en les déléguant à des WebWorkers (Nous reviendrons sans doute sur eux dans un prochain article).

Quand à la plateforme NodeJs, et bien, elle intègre par construction la nature asynchrone de chaque appel IO (Input/Output). Les spécifications sur lesquelles s'appuient la plateforme prévoit même une API unifiée et standard pour les promises ([CommonJS ~ Promises/A](http://wiki.commonjs.org/wiki/Promises/A)).

# Webographie

Une très belle présentation
http://news.humancoders.com/t/prog-fonctionnelle/items/2584-futures-et-promesses-en-scala-2-10

* [Fonction d'ordre supérieur](http://fr.wikipedia.org/wiki/Fonction_d%27ordre_sup%C3%A9rieur)
* [Curryfication](http://fr.wikipedia.org/wiki/Curryfication)

* [kriskowal / q](https://github.com/kriskowal/q) : A tool for making and composing asynchronous promises in JavaScript 

* ["How to Survive Asynchronous Programming in JavaScript" on InfoQ](http://www.infoq.com/articles/surviving-asynchronous-programming-in-javascript)

* [CommonJS ~ Promises/A](http://wiki.commonjs.org/wiki/Promises/A)
* [Dojo ~ Deferreds](http://dojotoolkit.org/reference-guide/1.7/dojo/Deferred.html)
* [JQuery ~ Deferreds](http://api.jquery.com/category/deferred-object/)
* [Understanding JQuery.Deferred and Promise](http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/)
* [Node.js and Asynchronous Programming with Promises](http://spin.atomicobject.com/2012/03/14/nodejs-and-asynchronous-programming-with-promises/)

* [Todo MVC](http://addyosmani.github.com/todomvc/)

Livres

* [JavaScript: The Definitive Guide](http://shop.oreilly.com/product/9780596805531.do)
* [JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)

