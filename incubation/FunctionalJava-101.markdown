---
layout: post
title: "Functional Java"
category: Blog
tags:
  - java
  - functional-programming
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

  L'une des difficultés principale lorsque l'on aborde la programmation par évènement est qu'il faut changer sa manière de penser: l'appel d'une méthode ne renvoie pas de résultat. Lorsque le résultat est disponible celui-ci est à son tour publié sur un bus ou fournit à une fonction de rappel passée en paramètre lors de l'appel. C'est cette dernière option que nous allons aborder dans cet article: la programmation par continuation.

---

{{ page.excerpt | markdownify }}

<blockquote><p>En programmation fonctionnelle, la programmation par continuation désigne une technique de programmation consistant à n'utiliser que de simples appels de fonction qui prennent pour argument leur propre continuation, au lieu d'appeler séquentiellement des fonctions, ou d'exécuter une fonction sur le résultat de la précédente. Ces fonctions se retrouvent en quelque sorte maîtresses de leur destin, et ne se contentent plus de subir le contexte.</p><small><a href="http://fr.wikipedia.org/wiki/Continuation">Continuation</a> ~ Wikipedia</small></blockquote>

Le schéma de pensée doit alors s'orienter vers une méthode de programmation plus fonctionnelle<sup><a href="#func1">1</a></sup> que procédurale. 
Bien que cela paraisse plus compliqué à mettre en place au départ, cela permet une souplesse et une modularisation beaucoup plus grande et une testabilité facilitée. 

<a name="func1">[1]</a> <small>Nous parlons ici de programmation fonctionelle au sens de fonction uniquement et non son paradigme standard qui prone l'immutabilité des données. Une fonction devient un citoyen de premier ordre au même titre qu'une classe. Java n'ayant pas cette dimension, nous ferons une utilisation intensive des classes anonymes pour compenser cela</small>.

<blockquote><h2>Des fonctions passées en paramètre</h2><p>
(...) Un mécanisme puissant des langages fonctionnels est l'usage des fonctions d'ordre supérieur. Une fonction est dite d'ordre supérieur lorsqu'elle peut prendre des fonctions comme argument (aussi appelées callback) et/ou renvoyer une fonction comme résultat. On dit aussi que les fonctions sont des objets de première classe, ce qui signifie qu'elles sont manipulables aussi simplement que les types de base.</p><small><a href="http://fr.wikipedia.org/wiki/Programmation_fonctionnelle">Programmation fonctionnelle</a> ~ Wikipedia</small></blockquote>

Nous allons voir plusieurs techniques permettant de facilité l'intégration d'une approche fonctionnelle à un code orienté objet. Le but n'est pas de tout écrire dans un paradigme ou un autre, mais simplement de voir comment une approche peux compléter et enrichir l'autre.
Après avoir définit nos techniques de bases, nous les appliquerons plus concrètement à différents cas d'utilisations.

Prenons comme base de travail une application qui gère des questionnaires (Quiz).

## "Sans technique, la puissance n'est rien" &mdash; <small>Aurait aussi pu dire le pneu</small>

Notre application doit tout d'abord permettre de créer un questionnaire. 
Afin de permettre la récupération du questionnaire créé, il est nécessaire de définir une fonction de rappel. Optons pour une approche générique et réutilisable (les noms des interfaces que nous définirons reprennent les noms standards que l'on retrouve en [Haskell](http://www.haskell.org/haskellwiki/Haskell), [Scala](http://www.scala-lang.org/) ou encore la librairie [FunctionalJava](http://functionaljava.org)).

{% highlight java %}
public interface Effect< T> {
  void e(T value);  
}
{% endhighlight %}

Cette interface décrit une méthode abstraite prenant un unique paramètre. Notre service pourra alors appeller cette fonction<sup><a href="#func2">2</a></sup> avec le `quiz` qu'il aura tout juste créé.

<a name="func2">[2]</a> <small> Nous utiliserons le mot "fonction" bien qu'elle ne renvoie aucun résultat et au risque d'en choquer certain nous n'utiliserons pas le mot procédure car il nous détournerait de notre vision: la lourdeur des procédure n'a d'interêt que pour les <b>fonction</b>aires.</small>

La première version de notre service peut s'écrire:

{% highlight java linenos %}
public class QuizService {
  ...
  public void create(String quizContent, Effect<Quiz> effect) {
    Quiz quiz = quizFactory.create(nextId(), quizContent);
    effect.e(quiz);
  }  
}
{% endhighlight %}

Notre service délègue la création du `quiz` à la fabrique (ligne 4). La fonction de rappel `effect` passée en paramètre est ensuite invoquée avec l'instance nouvellement créée (ligne 5). 

Nous venons de voir notre première technique: 

<span class="label notice">Première technique</span> :
**Ajouter une fonction supplémentaire comme paramètre lors de l'appel d'une méthode. Cette fonction pourra alors être appellée avec le résultat du calcul lorsque celui sera disponible.**

Imaginons maintenant que la construction d'une nouvelle instance de quiz nécessite plusieurs vérifications: il est impératif qu'un `quiz` soit unique (sinon il devient trop facile de tricher). Rajoutons pour cela un appel afin de verifier cet invariant:

{% highlight java %}
public class QuizService {
  public void create(String quizContent, Effect<Quiz> effect) {
    if(quizIsUnique(quizContent)) {
        Quiz quiz = quizFactory.create(nextId(), quizContent);
        effect.e(quiz);
      }
    }  
}
{% endhighlight %}

Bon rien de très fantastique, si ce n'est un nouveau soucis: que se passe-t-il si notre quiz n'est pas unique !?

C'est là que notre deuxième technique intervient!

Auparavant definissons une nouvelle interface générique permettant de décrire une alternative entre deux types de valeurs `L` et `R`. Il est de coutume d'appeller les différentes alternative "Left" et "Right" (toute ressemblance avec un context politique est purement fortuit). Une instance de cette interface peux donc soit contenir une instance de type `L` soit une instance de type `R`.

{% highlight java %}
public interface Either<L,R> {
  boolean isLeft();
  L left();
  boolean isRight();
  R right();
}
public class Eithers {
  public static <L,R> Either<L,R> left(L value) {
    return new Left(value);
  }
  public static <L,R> Either<L,R> right(L value) {
    return new Right(value);
  }
}
{% endhighlight %}

L'implémentation "Left" correspondante peux alors s'écrire: 

{% highlight java %}
public final class Left<L,R> implements Either<L,R> {
  private final L value;
  public Left(L value)    { this.value = value; }
  public boolean isLeft() { return true;  }
  public L left()         { return value; }
  public boolean isRight(){ return false; }
  public R right()        { throw new IllegalStateException("Sorry only left is allowed!"); }
}
{% endhighlight %}

On peux aisément en déduite l'implémentation "Right":

{% highlight java %}
public final class Right<L,R> implements Either<L,R> {
  private final R value;
  public Right(R value)   { this.value = value; }
  public boolean isLeft() { return false; }
  public L left()         { throw new IllegalStateException("Sorry only right is allowed!"); }
  public boolean isRight(){ return true;  }
  public R right()        { return value; }
}
{% endhighlight %}

Et un petit exemple avec une methode qui divise un entier par un autre: 

* soit le dénominateur est différent de zéro et tout va bien, la fonction renvoie le résultat
* soit le dénominateur est égale à zéro, la fonction renvoie alors un message indiquant que ça va pas

{% highlight java %}
public static Either<Float,String> div(int numerator, int denominator) {
  if(denominator!=0) {
    float res = (float)numerator / (float)denominator;
    return Eithers.left(res);
  }
  else {
    return Eithers.right("Divide by zero error");
  }  
}
{% endhighlight %}

Revenons à la création de notre `quiz`: soit il est unique et tout va bien soit il ne l'est pas et ça va pas... ça ressemble fort à notre alternative. Modifions alors la signature de notre fonction de rappel afin de prendre comme résultat une alternative: notre fonction de rappel `Effect<Quiz>` devient alors `Effect<Either<Quiz,Failure>>`.

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

Soit le `quiz` est unique (ligne 3) dans ce cas l'alternative est construite avec le `quiz` - alternative `left` - (ligne 5) puis passée à la fonction de rappel (ligne 6). Dans le cas contraire, l'alternative est construite autour d'un code d'erreur - alternative `right` - (ligne 11) puis passée à la fonction de rappel (ligne 12).

Et voila notre deuxième technique: 

<span class="label notice">Deuxième technique</span> :
**La fonction de rappel est définie comme prenant un résultat dont le type peut varier en fonction du déroulement du calcul...**

Un petit apperçu de code appellant:

{% highlight java linenos %}
quizService.create("<question4aChampion>...", new Effect<Either<Quiz,Failure>>() {
  public void e(Either<Quiz,Failure> res) {
    if(res.isLeft()) {
      Quiz quiz = res.left();
      displayFlashFeedback(quiz);
    }
    else {
      Failure failure = res.right();
      displayErrorFeedback(failure);
    }
  }
});
{% endhighlight %}

Lorsque la fonction de rappel est invoquée, soit l'alternative passée en paramètre contient un `quiz` (ligne 4) dans ce cas on affiche un beau message de retour avec de `quiz` créé. Sinon on affiche une notification d'erreur (ligne 9).

Ah, quelqu'un au fond de la salle, a une remarque: "Comme il s'agit d'une erreur pourquoi ne pas lancer une exception au lieu de faire une alternative, soit on a le résultat soit on lance une exception?"

Hummmm... eh bien sans trop anticiper sur la suite de l'article, il faut envisager que l'execution du code de la méthode puisse être asynchrone. 
Le contenu de la méthode s'execute alors dans un autre fil d'execution que le code qui l'a invoqué. Le code qui l'a invoqué continue à vivre son petit bonhomme de chemin et peux même réinvoquer la même méthode, avant que la première execution soit terminée. Si la méthode génère une exception celle-ci sera dans le fil qui execute le contenu de la méthode, l'appelant originel ne sera donc jamais informé, sauf si ajoute un mécanisme du type `UncaughtExceptionHandler` qui se trouve n'être rien d'autre qu'une fonction de rappel appellée dans le cas d'erreur. En centralisant, les appels valides et invalides dans une unique fonction de rappel, le code est simplifié, ainsi que la vérification que notre fonction de rappel est appellée systématiquement.

Ok et la troisième technique alors? Nous y sommes presque!
Notre Quiz étant désormais créé, il faut le persister, et pour cela il nous faut une méthode pour le sauvegarder:

{% highlight java %}
public class QuizService {
  public void save(Quiz quiz) {
    repository.save(quiz);
  }
}
{% endhighlight %}

Hummmm... une méthode sans retour, difficile de définir une fonction de rappel. Compliquons un peu les choses: la sauvegarde peux échouer et lancer une exception.

{% highlight java %}
public class QuizService {
  public void save(Quiz quiz) {
    try {
        repository.save(quiz);
    }
    catch(RepositoryException re) {
        Failure failure = new Failure(re);
        ...
    }
  }
}
{% endhighlight %}

Nous nous retrouvons dans le cas précédent d'une alternative mais qui n'a qu'une seule possibilité, autrement dit un résultat optionnel: on a une erreur ou pas! Si tout se passe bien, on a pas de résultat, sinon on a une erreur. En s'inspirant de notre interface `Either` nous pouvons définir une nouvelle interface générique qui contient (ou pas!) quelque chose:

{% highlight java %}
public interface Option<E> {
  boolean isSome();
  boolean isNone();
  E get();
}
{% endhighlight %}

{% highlight java %}
public class Options {
  public static <E> Option<E> some(E value) {
    return new Some(value);
  }
  public static <E> Option<E> none() {
    return new None();
  }
}
{% endhighlight %}

Cette interface n'a que deux implémentations: une qui contient rien `None` et une qui contient quelque-chose `Some`.

L'implémentation "Some" peux alors s'écrire: 

{% highlight java %}
public final class Some<E> extends Option<E> {
  private final E value;
  public Some(E value)    { this.value = value; }
  public boolean isSome() { return true;  }
  public boolean isNone() { return false; }
  public E get()          { return value; }
}
{% endhighlight %}

L'implémentation "None":

{% highlight java %}
public final class None<E> extends Option<E> {
  public None() {}
  public boolean isSome() { return false;  }
  public boolean isNone() { return true; }
  public E get()          { throw new IllegalStateException("Sorry nothing to retrieve!"); }
}
{% endhighlight %}

Illustrons cela avec notre méthode de sauvegarde:

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

Si la sauvegarde se passe bien (pas d'exception) la fonction de rappel est appellée avec "rien": `Options.none()` (ligne 5). Dans le cas contraire, l'exception est transformée en un objet plus adapté `Failure` et la fonction de rappel est appellée avec "quelque-chose": `Options.some(failure)` (ligne 9).

Un petit apperçu de code appellant:

{% highlight java linenos %}
quizService.save(quiz, new Effect<Option<Failure>>() {
  public void e(Option<Failure> res) {
    if(res.isNone()) {
      displayFlashFeedback(Code.QuizSaved);
    }
    else {
      displayErrorFeedback(res.some());
    }
  }
});
{% endhighlight %}

Soit la fonction de rappel est appellée avec "rien" (ligne 3) dans ce cas on affiche un beau message indiquant que la sauvegarde s'est bien passée. Dans le cas contraire (ligne 6), l'objet `Failure` est récupérée et un message d'erreur est affiché.

<span class="label notice">Troisième technique</span> :
**La fonction de rappel est définie comme prenant un résultat dont le contenu est optionnel**

Avant d'exploiter tout cela, faisons un petit retour en arrière... Et si nous étions sûr que la sauvegarde se deroule toujours correctement, et que nous souhaitions juste être notifié lorsque celle-ci à été réalisée, nous n'avons pas de technique pour cela! Effectivement, il n'y en a pas, mais l'on pourrait en ajouter une très simple: la fonction de rappel est définie comme ne prenant aucun argument et est invoquée lorsque l'action est arrivée au stade adéquat.
L'interface `Runnable` peut alors tout à fait correspondre à ce cas d'utilisation.

{% highlight java %}
public class QuizService {
  public void save(Quiz quiz, Runnable onceSaved) {
    repository.save(quiz);
    onceSaved.run();
  }
}
{% endhighlight %}

<span class="label notice">Quatrième technique</span> :
**La fonction de rappel est définit comme une fonction ne prenant aucun paramètre, elle est invoquée pour signaler que l'action désirée est effectuée**

Pourquoi ne pas avoir parler de cette technique auparavant: et bien tout simplement parce qu'il n'est généralement pas souhaitable de l'utiliser. En effet cette technique créée une ambiguité: **pourquoi notre fonction de rappel n'est pas appelée?** la méthode a-t-elle oublié d'appeller la fonction de rappel, une erreur a modifié le fil d'execution et le code n'appelle plus la fonction de rappel. **En l'absence de retour, il n'est pas possible de réagir**.

* `Either`
  * [Either ~ Haskell](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Data-Either.html)
  * [Either ~ FunctionalJava](http://functionaljava.googlecode.com/svn/artifacts/3.0/javadoc/fj/data/Either.html)
  * [Either ~ Scala](http://www.scala-lang.org/api/current/scala/Either.html)
  * [Choice ~ F#](http://msdn.microsoft.com/en-us/library/ee353439.aspx)
* `Option`
  * [Maybe ~ Haskell](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Data-Maybe.html)
  * [Option ~ FunctionalJava](http://functionaljava.googlecode.com/svn/artifacts/3.0/javadoc/fj/data/Option.html)
  * [Option ~ Scala](http://www.scala-lang.org/api/current/scala/Option.html)
  * [Option ~ F#](http://msdn.microsoft.com/en-us/library/ee353806.aspx)

## "The amateur software engineer is always in search of magic." &mdash; <small>Grady Booch</small>

Continuons par une petite disgression qui illustrera très simplement l'interêt d'une approche par continuation plutôt que l'approche plus traditionnelle d'une méthode avec retour.

La création d'un `quiz` est une chose relativement complexe (si! si!) et peux prendre beaucoup de temps. Dans le cas d'une approche traditionnelle, l'appelant de notre méthode est donc en attente d'un retour, et son traitement est suspendu. Grâce à notre approche par continuation, il devient très facile de modifier le comportement de notre service afin de rendre ses traitements asynchrones, l'appelant peux alors continuer à effectuer ses propres tâches pendant ce temps.

Voyons comment rendre très simplement un service asynchrone avec [Java Proxy](http://docs.oracle.com/javase/1.5.0/docs/api/java/lang/reflect/Proxy.html). La méthode que nous allons voir repose sur les API du jdk, la seule limitation est que cela nous oblige à définir une interface pour notre service.

{% highlight java %}
public interface QuizService {
  void create(final String quizContent, final Effect<Quiz> effect);
  void save(Quiz quiz, Effect<Option<Failure>> effect);
}
{% endhighlight %}

Notre service peux devenir asynchrone grâce à l'appel suivant:

{% highlight java %}
QuizService serviceImpl = new QuizServiceImpl();
QuizService asynService = Async.asyncProxy(QuizService.class, 
                                           serviceImpl, executor);
{% endhighlight %}

Avec comme code pour notre classe utilitaire `Async`:

{% highlight java linenos %}
import java.lang.reflect.*;
import java.util.Arrays;
import java.util.concurrent.*;

public class Async {

  public static <T> T asyncProxy(Class<T> type, T impl, 
                                 ExecutorService executor) {
    return new Async(executor).asyncProxy(type, impl);
  }

  private final ExecutorService executor;
  public Async(ExecutorService executor) {
    this.executor = executor;
  }

  @SuppressWarnings("unchecked")
  public <T> T asyncProxy(Class<T> type, T impl) {
    return (T)Proxy.newProxyInstance(getClassLoader(), 
                                     asArray(type), 
                                     asyncHandler(impl));
  }

  private static <T> Class< ?>[] asArray(Class<T> type) {
    return new Class< ?>[]{type};
  }

  protected ClassLoader getClassLoader () {
    return getClass().getClassLoader();
  }

  protected <T> InvocationHandler asyncHandler(T impl) {
    return new AsyncHandler<T>(impl, executor);
  }

  private static class AsyncHandler<T> implements InvocationHandler {
    private final T impl;
    private final ExecutorService executor;
    
    public AsyncHandler(T impl, ExecutorService executor) {
      this.impl = impl;
      this.executor = executor;
    }

    @Override
    public Object invoke(Object proxy, 
                         final Method method, 
                         final Object[] args) throws Throwable {
      Future<Object> future = executor.submit(new Callable<Object>() {
        @Override
        public Object call() throws Exception {
          return method.invoke(impl, args);
        }
      });
      Class< ?> returnType = method.getReturnType();
      if(returnType==null || returnType==Void.class)
        return null;
      else
        return future.get();
    }
  }
}
{% endhighlight %}

Quelques explications: un proxy est créé et implémente l'interface de notre service passée en paramètre `type` (ligne 18). Tous les appels effectués sur le proxy sont redirigés sur le `InvocationHandler` qui lui a été associé (ligne 21), et c'est là que les choses deviennent interessantes: lignes 49 à 60. 

L'appel de la méthode est transformée en un fragment executable (`new Callable<Object>() {...}`) qui est soumis à l'`Executor` correspondant. La méthode est alors invoquée de manière asynchrone (par rapport à l'appelant) sur l'instance de service qui a été transformé: `impl` (passée en paramètre ligne 18): l'appel effectif est déclaré ligne 52. Et là, soyons malin: 

* soit la méthode invoquée ne renvoie rien `void`, dans ce cas le code appelant n'attend aucune valeur en retour, et il n'est pas nécessaire de rendre cet appel bloquant. On sort donc de la méthode (ligne 57) même si notre `Callable` n'a pas encore été executé ou s'il est en cours d'execution.
* soit la méthode invoquée renvoie quelque chose, dans ce cas le code appelant s'attend à un retour... il faut lui renvoyé quelque chose: le code appelant va donc être suspendu (`future.get()`) jusqu'à ce que le resultat soit disponible (ligne 59).

Bien entendu, nous nous arrangerons pour être toujours dans le premier cas si nous voulons que les appels soient toujours asynchrone.


Exemple de code appelant:

{% highlight java %}
quizService.create("<question4aChampion>...", new Effect<Quiz>() {
  public void e(Quiz quiz) {
    displayFlashFeedback(quiz);
  }
});
// Quiz is being created...
// ... in the meanwhile let's display some waiting feedback
displayWaitingFeedback();
{% endhighlight %}

**Nous voyons que sans modifier le code appelant, notre méthode par continuation à permis de brancher une implementation asynchrone de notre service.**

(On peux alors regarder le gars du fond de la salle, et lui faire un petit hochement de tête complice!)

# A voir aussi

* [Error handling with Scala's Try](http://blog.richdougherty.com/2012/06/error-handling-with-scalas-try.html)
* [Article de Nouhoum Traore]()


·················8<-------------------------------

# "Pas à pas on va loin" &mdash; <small>Proverbe italien</small>

Maintenant que nous avons décrit nos techniques de base, voyons comment les exploiter. Reprenons notre service de création de questionnaire et fabriquons un service web json autour. Le but est de transposer en java l'exemple écrit en [NodeJS][nodejs] par Howard Lewis Ship: [NodeJS and Callbacks](http://tapestryjava.blogspot.com/2012/03/nodejs-and-callbacks.html).

Nous allons pour cela utiliser la librarie [Swoop][swoop] qui fournit une sur-couche de type [Sinatra][sinatra] au serveur web [Webbit][webbit]. Une phrase et trois librairies... cela mérite quelques explications:

* [Sinatra][sinatra] est un framework Ruby qui permet d'écrire très simplemement une application web. Compte-tenu de sa simplicité, ce framework a servit de modèle dans de nombreux langages (Scala: [Scalatra](http://www.scalatra.org/), Groovy: [Graffiti](https://github.com/webdevwilson/graffiti), Erlang: [spooky](http://owns.ch/yet-another-web-framework-spooky.html), Java: [Spark](http://www.sparkjava.com/), ...)

`Hello world` en sinatra

{% highlight ruby %}
require 'sinatra'
get '/hi' do
  "Hello World!"
end
{% endhighlight %}

* [Webbit][webbit] est un serveur HTTP de type évènementiel et non-bloquant basé sur [Netty][netty]. Contrairement à [Spark][spark] qui se base sur les API java Servlet et assigne un Thread par requête HTTP, [Webbit][webbit] est basé sur un thread unique (comme [NodeJS][nodejs]) et une boucle d'évènement. La citation ci-dessous reste rigoureusement exacte en remplaçant simplement `NodeJS` par `Webbit`

<blockquote><p>Prenons l'exemple du serveur Apache. Chaque requête HTTP entrante se voit allouer un thread. Celui-ci est utilisé pendant toute la durée du traitement de la requête (...) Node et plus globalement les serveurs dits non bloquants (comme <a href="http://www.jboss.org/netty">Netty</a> ou <a href="https://github.com/rschildmeijer/deft">Deft</a> pour ceux qui tournent sur JVM) adoptent une autre approche. <b>Node n'utilise qu'un seul thread pour gérer les requêtes entrantes</b>. De plus, Node ne propose pas, dans ses API, de fonctions bloquantes. Ainsi, tout notre code est asynchrone. (...) <b>Concrètement, toutes les fonctions fournies par Node prennent en paramètre une fonction de rappel (callback). Une fois que la fonction aura terminé son traitement, elle sera appelée avec le résultat en paramètre et une éventuelle erreur</b>. Ainsi, pendant toute la durée du traitement, le thread sera relâché et pourra être donné à une autre requête pour effectuer un autre traitement. Nous sommes donc face à un système événementiel.
</p><small><a href="http://www.web-tambouille.fr/2011/02/15/node-js-partie-1-tout-ce-que-vous-devez-savoir-sur-node-js.html">Débuter avec Node.js</a> ~ Romain Maton </small></blockquote>

[swoop]:   https://github.com/Arnauld/swoop "Swoop"
[sinatra]: http://www.sinatrarb.com/ "Sinatra"
[webbit]:  https://github.com/webbit/webbit "Webbit"
[netty]:   http://www.jboss.org/netty "Netty"
[spark]:   http://www.sparkjava.com/ "Spark"
[nodejs]:  http://nodejs.org/ "NodeJs"

* Enfin `Swoop` est une petite librarie (expérimentale) qui ajoute une partie de la simplicité de [Sinatra][sinatra] à [Webbit][webbit] en modifiant légèrement les API. [Swoop][swoop] permet de définir les routes de manière analogue à Sinatra et s'assure que chaque invocation du chainon<sup><a href="#invokeNext">3</a></sup> suivant s'effectue dans le Thread Web (bien que la nécessité systématique de le faire reste discutable, mais ce n'est pas le sujet de notre article...):

<blockquote><p>It's mandatory that anything that interacts with the request or response should execute on the main executor (<code>HttpControl.execute()</code>).</p><small><a href="https://groups.google.com/d/msg/webbit/Jy5wG7K80RQ/ozh9gejWlWYJ">Webbit Google Group</a> ~ Joe Walnes</small></blockquote>

<a name="invokeNext">[3]</a> <small><a href="https://github.com/Arnauld/swoop">Swoop</a> est principalement basé sur l'utilisation du pattern intercepteur (Core J2EE Patterns [Intercepting Filter](http://www.corej2eepatterns.com/Patterns2ndEd/InterceptingFilter.htm)). Toutes les routes satisfaisant l'URI invoquée sont chainées jusqu'à ce que le dernier maillon de la chaine envoie la réponse au client. Chaque maillon s'execute dans le thread Web mais peut décider d'executer ses propres calculs de manières asynchrones. L'utilisation judicieuse des fonctions de rappels avec les techniques évoquées précédement permet alors d'invoquer le chainon suivant de la chaine d'intercepteurs.</small>

Trève de blabla, illustrons cela par un peu de code pour nous autre les barbus. Commençons par définir le squelette de notre application: une méthode `main`, un service rendu asynchrone et une première route permettant de traiter un appel de type REST sur la méthode HTTP `get` et le chemin `api/quizzes`

{% highlight java linenos %}
import java.util.concurrent.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import samples.quiz.domain.QuizCollection;
import samples.quiz.infra.Async;
import samples.quiz.service.*;
import swoop.pipeline.*;

public class QuizApp extends Swoop2Builder {
  private static Logger console = LoggerFactory.getLogger(QuizApp.class);

  public static void main(String[] args) {
    QuizApp app = new QuizApp();
    app.asyncPolicy(Executors.newFixedThreadPool(4));
    app.initRoutes();
  }

  private QuizServiceInMemory memoryService;
  private QuizService service;

  public void asyncPolicy(ExecutorService executor) {
    memoryService = new QuizServiceInMemory();
    service = makeItAsync(memoryService, executor);
  }

  public void directPolicy() {
    memoryService = new QuizServiceInMemory();
    service = memoryService;
  }
  
  public QuizServiceInMemory getInMemoryService() {
    return memoryService;
  }

  public void initRoutes() {
    /*
          app.get "/api/quizzes",
            (req, res) ->
              Quiz.find {}, (err, docs) ->
                throw err if err
                sendJSON res, docs
     */
    get("/api/quizzes", new PipelineTargetHandler() {
      @Override
      public void handleTarget(final Pipeline pipeline) {
        console.info("get: /api/quizzes");
        service.find(QuizSpecification.all(), //
                sendError(pipeline)
                  .orContinueWith(sendOkTo(pipeline, QuizCollection.class)));
      }
    });
  }
  
  private static QuizService makeItAsync(QuizService service, 
                                         ExecutorService executor) {
    return Async.asyncProxy(QuizService.class, service, executor);
  }
}
{% endhighlight %}

La méthode `main` servira à lancer notre application. Nous instancions donc celle-ci en lui indiquant d'utiliser une implémentation asynchrone de notre service (basé sur notre technique précédente) ligne 16. Les routes supportées par notre serveur HTTP sont ensuites définies par la méthode `initRoutes` lignes 37 à 55. Notre première route consiste à répondre aux requêtes `Get` sur la portion d'uri `/api/quizzes` en recherchant à travers notre service tous les quizzes. Le code `NodeJS` en commentaire est le code correspondant dans l'article [NodeJS and Callbacks](http://tapestryjava.blogspot.com/2012/03/nodejs-and-callbacks.html).

La signature de la méthode `find` de notre service est définit comme suit:

{% highlight java linenos %}
public interface QuizService {
  void find(Specification< ? super Quiz> spec, 
            Effect< Either< Throwable, QuizCollection>> callback);
  ...
}
{% endhighlight %}

Le premier argument correspond en fait aux critères de sélection de nos quizzes. Dans notre cas, on prend tout: `QuizSpecification.all()`. Notre interface `Specification` s'inpire très largement du pattern décrit par Fowler et Evans ([Specification](http://www.martinfowler.com/apsupp/spec.pdf)) est définie très simplement par:

{% highlight java %}
public interface Specification<T> {
    boolean isSatisfiedBy(T elem);
}
{% endhighlight %}

Le second argument est l'application directe de notre deuxième technique: le résultat sera soit une erreur soit une collection de quizzes. C'est sur la construction de cet argument que nous allons désormais passer un peu de temps.

{% highlight java %}
Effect<Either<Throwable, QuizCollection>> callback = 
    sendError(pipeline)
        .orContinueWith(sendOkTo(pipeline, QuizCollection.class))
{% endhighlight %}


Tout d'abord qu'est-ce que l'on a voulu exprimer:

* soit on envoie une erreur par le biais de notre `pipeline`: `sendError(pipeline)` - alternative `Left` de l'objet passé à notre fonction de rappel.
* soit on continue notre traitement `orContinueWith(...)` en envoyant notre résultat de type `QuizCollection` - alternative `Right` (le rappel du type est essentiellement pour facilité l'utilisation des générique)

Nous avons délibérement opté pour une construction de type `fluent` (voir [FluentInterface](http://martinfowler.com/bliki/FluentInterface.html) et [An Approach to Internal Domain-Specific Languages in Java](http://www.infoq.com/articles/internal-dsls-java) principalement la section **1.2 Returning an intermediate object**) afin de rendre le code plus lisible (une appréciation subjective laissée à chacun) par un chaînage d'objets intermédiaires.

Nous allons utilisé une autre propriété des fonctions: la **composition**.

Commençons par le dernier maillon `sendOkTo`:

{% highlight java linenos %}
public static <T> Effect<T> sendOkTo(final Pipeline pipeline, Class<T> type) {
  return new Effect<T>() {
    @Override
    public void e(T value) {
        Result ok = Result.ok(null, value);
        sendJsonAndInvokeNext(pipeline, ok);
    }
  };
}
{% endhighlight %}

Cette méthode définit une fonction de rappel qui récupère la valeur passée en paramètre, construit un objet `Result` avec la valeur comme contenu (ligne 5). L'objet `Result` sert uniquement d'enveloppe afin de permettre au receveur d'identifier aisément si l'appel s'est effectué correctement ou si une erreur s'est produit. Cet objet `Result` est ensuite transformé en json et envoyé comme réponse à l'appel HTTP (méthode `sendJson`).

De manière analogue, on définit la méthode `sendErrTo`:

{% highlight java linenos %}
public static Effect<Throwable> sendErrTo(final Pipeline pipeline) {
  return new Effect<Throwable>() {
    @Override
    public void e(Throwable thr) {
      pipeline.get(HttpResponse.class).status(500); // internal server error
      Result err = Result.err(thr);
      sendJsonAndInvokeNext(pipeline, err);
    }
  };
}
{% endhighlight %}

Voyons maintenant comment composer les deux fonctions que nous venons de définir:

{% highlight java linenos %}
public static <R, L> Effect<Either<L, R>> eitherEffect(
                                            final Effect<L> onLeft, 
                                            final Effect<R> onRight) {
  return new Effect<Either<L, R>>() {
    @Override
    public void e(Either<L, R> a) {
      if (a.isLeft())
        onLeft.e(a.left().value());
      else
        onRight.e(a.right().value());
    }
  };
}
{% endhighlight %}

Une fonction de rappel est créé autour de l'alternative à partir des deux fonctions `onLeft` et `onRight`. Selon le contenu de l'alternative passée en paramètre (ligne 6), la fonction correspondante est appellée avec le contenu disponible. Soit l'alternative contient une valeur de type `L` (`left`) (ligne 7) dans ce cas la fonction de rappel `onLeft` est appellée (ligne 8), soit l'alternative contient une valeur de type `R` (`right`) et dans ce cas la fonction de rappel `onRight` est appellée (ligne 10).

Voyons maintenant l'objet intermédiaire qui sert à composer les deux fonctions que nous venons de définir de manière `fluent`: 

{% highlight java linenos %}
protected static ErrorOrContinueChain sendError(Pipeline pipeline) {
  return new ErrorOrContinueChain(sendErrTo(pipeline));
}

public static class ErrorOrContinueChain {
  private final Effect<Throwable> onError;

  public ErrorOrContinueChain(Effect<Throwable> onError) {
    this.onError = onError;
  }

  public <T> Effect<Either<Throwable, T>> orContinueWith(final Effect<T> onSuccess) {
    return eitherEffect(onError, onSuccess);
  }
}
{% endhighlight %}

Cet objet se contente de stocker nos deux fonctions de rappels (`onError` et `onSuccess`) et de les composer avec la méthode `eitherEffect` que nous avons définit précédement.

Continuons par ajouter la gestion de la seconde uri:

{% highlight java %}
/*
  app.delete "/api/quizzes/:id",
    (req, res) ->
      console.log "Deleting quiz #{req.params.id}"
      # very dangerous! Need to add some permissions checking
      Quiz.remove { _id: req.params.id }, (err) ->
        throw err if err
        sendJSON res, { result: "ok" }
*/
delete("/api/quizzes/:id", new PipelineTargetHandler() {
  @Override
  public void handleTarget(final Pipeline pipeline) {
    String quizId = pipeline.get(RouteParameters.class).routeParam("id");
    console.info("Deleting quiz {}", quizId);
    // very dangerous! Need to add some permissions checking
    // e.g. through a filter declaration that applyOn 'delete'
    service.remove(QuizSpecification.byId(quizId), //
            sendError(pipeline).orContinueWith(sendOkTo(pipeline)));
  }
});
{% endhighlight %}

Le code ressemble très fortement à la gestion de l'uri précédente, la seule différence réside dans la récupération de l'identifiant à supprimer depuis l'uri.

Interessons-nous enfin à la création du jeu de données (il s'agit en fait du coeur de l'article de Howard Lewis Ship: [NodeJS and Callbacks](http://tapestryjava.blogspot.com/2012/03/nodejs-and-callbacks.html)).

{% highlight java linenos %}
/*
  app.get "/api/create-test-data",
      (req, res) ->
  
        flow = new Flow
        for i in [1..100]
          quiz = new Quiz
            title: "Test Quiz \# #{i}"
            location: "Undisclosed"
  
          quiz.save flow.add (err) ->
            throw err if err
  
        flow.join ->
          Quiz.find {}, (err, docs) ->
            throw err if err
            sendJSON res, docs

*/
post("/api/create-flow-data", new PipelineTargetHandler() {
  @Override
  public void handleTarget(final Pipeline pipeline) {
    console.info("post: /api/create-flow-data");

    Flow flow = new Flow();
    final int COUNT = 100;
    for (int i = 0; i < COUNT; i++) {
      // save, and on error send err to response
      Effect<Quiz> save = 
        saveE(service, 
              flow.addCallbackButOnError(sendErrTo(pipeline)));
      service.create("Test Quizz #" + i, 
        sendError(pipeline).orContinueWith(save));
    }

    flow.join(new Runnable() {
      @Override
      public void run() {
        service.find(QuizSpecification.all(), //
                sendError(pipeline)
                  .orContinueWith(sendOkTo(pipeline, QuizCollection.class)));
      }
    });
  }
});
{% endhighlight %}

Quelques explications: l'idée est de créer 100 quizzes à partir d'un seul appel. Les quizze sont créés un par un. Chaque création étant asynchrone, il est nécessaire de mettre en place un mécanisme qui enverra la réponse lorsque les 100 quizzes auront été effectivement créés: l'appel à `create` déclenche la création mais le retour de la méthode n'implique pas que le quiz ait été créé, la fonction de rappel sera invoquée lorsque ce sera fait.
La boucle `for` génére (ligne ) donc les 100 











{% highlight java linenos %}
public class Flow {

  private volatile boolean frozen;
  private AtomicInteger spawned;
  private Runnable joinCallback;
  
  public Flow() {
    this.spawned = new AtomicInteger();
    this.frozen = false;
  }
  
  public synchronized Effect<Option<Throwable>> addCallbackButOnError(
                                   final Effect<Throwable> errorCallback) {
    if(frozen)
      throw new IllegalStateException(
        "Flow is frozen: cannot add once join has been invoked");
    spawned.incrementAndGet();
    return new Effect<Option<Throwable>>() {
      @Override
      public void e(Option<Throwable> opt) {
        if(opt.isSome())
          errorCallback.e(opt.some());
        else
          taskDone();
      }
    };
  }
  
  public synchronized void join(Runnable joinCallback) {
    this.frozen = true;
    this.joinCallback = joinCallback;
    if(spawned.get()==0)
      joinCallback.run();
  }

  protected synchronized void taskDone() {
    if(spawned.decrementAndGet()==0) {
      // make sure the callback has been defined...
      if(joinCallback!=null)
        joinCallback.run();
    }
  }
    
}
{% endhighlight %}


Pb: StackOverflow












