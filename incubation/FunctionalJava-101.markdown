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
  
---

{{ page.excerpt | markdownify }}

<span class="label warning">In Progress // Incubation</span><br/>

L'une des difficultés principale lorsque l'on aborde la programmation par évènement est qu'il faut changer sa manière de penser: Le résultat n'est pas obtenu en retour de l'appel d'une méthode. Généralement une fonction de rappel est passée aussi en paramètre lors de l'appel, et c'est cette fonction qui sera appellée avec le resultat du calcul souhaité. Le schéma de pensée doit alors s'orienter vers une méthode de programmation plus fonctionnelle[1] que procédurale. 
Bien que cela paraisse plus compliqué à mettre en place au départ, cela permet une souplesse et une modularisation beaucoup plus grande et une testabilité facilitée. Trève de blabla et illustrons cela par un peu de code, pour nous autre les barbus.

[1]:Nous parlons ici de programmation fonctionelle au sens que une fonction est un citoyen de premier ordre au même titre qu'une classe. Java n'ayant pas cette dimension, nous ferons une utilisation intensive des classes anonymes pour compenser cela.

Prenons comme base de travail une application qui gère des questionnaires (Quiz) (ce choix n'est pas annodin, et nous permettra de comparer notre approche avec son équivalent javascript NodeJs par ... [Link blog Tapestry]...)

Notre application doit tout d'abord permettre de créer un questionnaire. Definissons une interface générique qui permettra à l'appellant de récupérer le questionnaire créé:

{% highlight java linenos %}
public interface Effect<T> {
  void e(T value);  
}
{% endhighlight %}

La première version de notre service peut alors s'écrire:

{% highlight java linenos %}
public class QuizService {
  public void create(String quizContent, Effect<Quiz> effect) {
    Quiz quiz = QuizFactory.create(nextId(), quizContent);
    effect.e(quiz);
  }  
}
{% endhighlight %}

La fonction de rappel `effect` passée en paramètre est invoquée avec l'instance nouvellement créée. 

*Nous venons de voir notre premier motif: une fonction de rappel invoquée avec le résultat du calcul souhaité.*

Imaginons maintenant que la construction d'une nouvelle instance de quiz nécessite plusieurs vérifications: imposons qu'un `quiz` doit être unique. Rajoutons donc un appel afin de verifier cet invariant:

{% highlight java linenos %}
public class QuizService {
  public void create(String quizContent, Effect<Quiz> effect) {
    if(quizIsUnique(quizContent)) {
        Quiz quiz = QuizFactory.create(nextId(), quizContent);
        effect.e(quiz);
      }
    }  
}
{% endhighlight %}

Bon rien de plus fantastique, si ce n'est un nouveau soucis: que se passe-t-il si notre quiz n'est pas unique !?
Nous allons pour cela voir notre second motif. 
Auparavant definissons une nouvelle interface générique permettant de stocker une alternative entre deux types de valeurs (toute ressemblance avec un context politique est purement fortuit mais) il est de coutume d'appeller les différentes alternative "Left" et "Right":

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
public final class Left<L,R> extends Either<L,R> {
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
public final class Right<L,R> extends Either<L,R> {
  private final R value;
  public Right(R value)   { this.value = value; }
  public boolean isLeft() { return false; }
  public L left()         { throw new IllegalStateException("Sorry only right is allowed!"); }
  public boolean isRight(){ return true;  }
  public R right()        { return value; }
}
{% endhighlight %}


Revenons à la création de notre `quiz`: soit il est unique et tout va bien soit il ne l'est pas et ça va pas... ça ressemble fort à notre alternative. Modifions alors la signature de notre fonction de rappel afin de prendre comme résultat une alternative `Effect<Quiz>` devient alors `Effect<Either<Quiz,Failure>>`.

{% highlight java linenos %}
public class QuizService {
  public void create(String quizContent, Effect<Either<Quiz,Failure>> effect) {
    if(quizIsUnique(quizContent)) {
        Quiz quiz = QuizFactory.create(nextId(), quizContent);
        effect.e(Eithers.left(quiz));
      }
      else {
        // Failure is a Pojo but could also be an NonUniqueException
        Failure failure = new Failure(Code.NonUniqueQuiz);
        effect.e(Eithers.right(failure));
      }
    }  
}
{% endhighlight %}

*Et voila notre second motif: une fonction de rappel invoquée avec le résultat alternatif du calcul souhaité.*

Un petit apperçu de code appellant:

{% highlight java %}
quizService.create("<question4aChampion>...", new Effect<Either<Quiz,Failure>>() {
  public void e(Either<Quiz,Failure> res) {
    if(res.isLeft())
      displayQuizPage(res.left());
    else
      displayErrorPage(res.right());
  }
});
{% endhighlight %}

Ok et le troisième motif alors? Nous y sommes presque!
Notre Quiz étant désormais créé, il faut le persister, il nous faut donc une méthode pour sauvegarder notre quiz:

{% highlight java %}
public class QuizService {
  public void save(Quiz quiz) {
    repository.save(quiz);
  }
}
{% endhighlight %}

Hummmm... une méthode sans retour, difficile de définir une fonction de rappel. Compliquons un peu les choses: la sauvegarde peux lancée une exception.

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

Nous nous retrouvons dans le cas précédent d'une alternative mais qui n'a qu'une seule possibilité, autrement dit une erreur optionnelle. En s'inspirant de notre interface `Either` nous definissons une nouvelle interface générique qui contient (ou pas!) quelque chose:

{% highlight java %}
public interface Option<E> {
  boolean isSome();
  boolean isNone();
  E get();
}
public class Options {
  public static <E> Option<E> some(E value) {
    return new Some(value);
  }
  public static <E> Option<E> none() {
    return new None();
  }
}
{% endhighlight %}

L'implémentation "Some" correspondante peux alors s'écrire: 

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

Et maintenant modifions notre service pour prendre en compte notre nouveau motif:

{% highlight java %}
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

Un petit apperçu de code appellant:

{% highlight java %}
quizService.save(quiz, new Effect<Option<Failure>>() {
  public void e(Option<Failure> res) {
    if(res.isNone())
      displayFlashFeedback(Code.QuizSaved);
    else
      displayErrorPage(res.some());
  }
});
{% endhighlight %}








Bon d'accord, c'est pas forcément le code le plus démonstratif de l'interêt de cette pratique, et nous allons rendre cela un peu plus utile.

La création d'un `quiz` est une chose relativement complexe (si! si!) et peux prendre beaucoup de temps. L'appelant de notre méthode est donc en attente d'un retour, et son traitement a été d'une certaine façon mis en suspend. Conservons notre service et rendons l'appel asynchrone:

{% highlight java linenos %}
public class QuizService {
    java.util.concurrent.Executor executor = ...
  public void create(final String quizContent, final Effect<Quiz> effect) {
    executor.execute(new Runnable() {
      public void run() {
        Quiz quiz = QuizFactory.create(nextId(), quizContent);
        effect.e(quiz);
      }
    });
    }  
}
{% endhighlight %}

La méthode génére donc un fragment executable (`new Runnable() { ... }`) qu'elle demande très gentiment à son executeur de traiter (`executor.execute(...)`). Même si ce traitement n'est pas encore effectué, la méthode se termine, et l'appelant peux continuer son traitement. La fonction de rappel qu'il a fournit sera alors invoquée lorsque le résultat sera disponible, et il pourra alors continuer la partie de traitement qui requiert le `quiz` créé.

Exemple de code appelant:

{% highlight java linenos %}
quizService.create("<question4aChampion>...", new Effect<Quiz>() {
  public void e(Quiz quiz) {
    displayQuizPage(quiz);
    }
});
displayWaitingPage();
{% endhighlight %}

Afin d'alléger un peu l'écriture de notre code, considérons que nous avons à notre disposition (voir annexe A pour la définition d'un tel aspect) une annotation permettant de transformer l'appel d'une méthode en son équivalent asynchrone:

{% highlight java linenos %}
@Async
public void create(String quizContent, Effect<Quiz> effect) }{ /* create code */ }
{% endhighlight %}

sera alors rigoureusement équivalent lors de l'éxecution à:

{% highlight java linenos %}
public void create(final String quizContent, final Effect<Quiz> effect) }{
  executor.execute(new Runnable() {
    public void run() {
      doCreate(quizContent, effect);
      }
  });
}
private void doCreate(String quizContent, Effect<Quiz> effect) }{ /* create code */ }
{% endhighlight %}








~~~> Permet de brancher une implementation asynchrone sans avoir à changer le code appelant...

Ceci est d'autant plus vrai que la fonction appellé execute le code correspondant de manière asynchrone. Essayons d'illustrer cela par un exemple concret:


Afin de mieux appréhender cette approche nous allons voir quelques motifs génériques (je n'aurai pas la prétention de les considérer comme des patterns - avec tout ce que cela pourrait impliquer - mais plutot comme des cas d'utilisation standards) et facilement applicables:

Either ~ LeftRight
Option

Effect ~ Callback
Runnable

Pb: StackOverflow

Fluent Interface and method chaining

Continuation

<blockquote><p>A function written in continuation-passing style takes as an extra argument: an explicit "continuation" i.e. a function of one argument. When the CPS function has computed its result value, it "returns" it by calling the continuation function with this value as the argument. That means that when invoking a CPS function, the calling function is required to supply a procedure to be invoked with the subroutine's "return" value.</p>
<small><a href="http://en.wikipedia.org/wiki/Continuation-passing_style">Continuation-passing style</a> Wikipedia</small></blockquote>


<blockquote><p>En programmation fonctionnelle, la programmation par continuation désigne une technique de programmation consistant à n'utiliser que de simples appels de fonction qui prennent pour argument leur propre continuation, au lieu d'appeler séquentiellement des fonctions, ou d'exécuter une fonction sur le résultat de la précédente. Ces fonctions se retrouvent en quelque sorte maîtresses de leur destin, et ne se contentent plus de subir le contexte.
</p><small><a href="http://fr.wikipedia.org/wiki/Continuation">Continuation</a> Wikipedia</small></blockquote>


[Either ~ Haskell](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Data-Either.html)
[Either ~ FunctionalJava](http://functionaljava.googlecode.com/svn/artifacts/3.0/javadoc/fj/data/Either.html)
[Either ~ Scala](http://www.scala-lang.org/api/current/scala/Either.html)

[Maybe ~ Haskell](http://www.haskell.org/ghc/docs/latest/html/libraries/base/Data-Maybe.html)
[Option ~ FunctionalJava](http://functionaljava.googlecode.com/svn/artifacts/3.0/javadoc/fj/data/Option.html)
[Option ~ Scala](http://www.scala-lang.org/api/current/scala/Option.html)










