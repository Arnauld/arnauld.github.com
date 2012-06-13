---
layout: post
title: "Démarrer avec JBehave"
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

  ** BDD quézako!? **

  Tout d'abord un peu d'histoire: Le BDD encore un accronyme du type **xDD**? Et bien oui, encore un! Le BDD (Behavior Driven Development) est présenté comme une évolution du TDD (Test Driven Development). 
  Proposé par Dan North (qui fut aussi l'un des initiateurs du projet JBehave), le BDD consiste à étendre le TDD en écrivant non plus du code compréhensible uniquement par des développeurs, mais sous forme de scénario compréhensible par toutes les personnes impliquées dans le projet.

  Autrement dit, il s'agit d'écrire des tests qui décrivent le comportement attendu du système et que tout le monde peux comprendre. 

  Et le rapport avec le TDD? Eh bien généralement, ces scénarios sont écrits et définis avant que l'implémentation ne commence. Ils servent à la fois à définir le besoin mais vont guider le développement en le focalisant sur la fonctionnalité décrite. Dans l'absolu, on continue à faire du TDD mais on ajoute en plus l'expression du besoin en langage naturel. Alors que le TDD garantit d'une certaine façon la qualité technique d'une implémentation, il ne garantit pas la qualité fonctionnelle. Plusieurs éléments peuvent ainsi être techniquement valides mais une fois mis ensemble ne répondent pas du tout au besoin réellement exprimé par le client. De manière un peu caricatural, le BDD va guider le développement d'une fonctionalité, tandis que le TDD guidera son implementation.

---

{{ page.excerpt | markdownify }}


Les avantages d'une tel pratique sont multiples (Les différents "points" réfèrent à la figure ci-après):

**Point (1): Un dialogue restauré**

* **L'écriture des scénarios se fait de manière collective**: développeurs, client, équipe support, ...; tout le monde peux participer à **l'expression du besoin**, puisque celui-ci ce fait **en langage naturel**. Toutes les questions soulevées, par le client ou par le développeur, peuvent faire l'objet de scénarios dédiés. **Les scénarios décrivent alors le fontionement réel de l'application**, et le traitement des cas aux limites.

<img src="/incubation/jbehave-get-started/bdd-dialogue.png" alt="BDD un dialogue"/>

* En illustrant chaque cas d'utilisation par **des exemples concrets**, **les rêgles métiers sont moins abstraites et mieux comprises**.
* En ecrivant des tests que tout le monde peut comprendre, les clients s'assurent que les développeurs ont bien compris les besoins métiers, les développeurs sortent de leur “Autisme” ([Herding Code #42 ~ Scott Bellware on BDD](http://herdingcode.com/?p=176)) et se rapprochent du métier. Les deux parties avancent ensemble dans la même direction. Il constitue un véritable **outils de communication** rapprochant développeurs et personnes du métiers. Cela restaure la confiance du client en rendant le comportement explicite et visible.
* A chaque fois qu'une nouvelle spécification est écrite, son utilisation est illustrée par plusieurs exemples et cas de tests: cela force à réflechir sur la fonctionalité et son utilisation. Il est possible de communiquer avec tout le monde et pas seulement les développeurs, il est ainsi **plus facile d'inciter les gens à s'impliquer** sur ce qui est fait: d'avoir des fonctionnalités mieux décrites et plus challengées. Cela permet aussi de rassurer le développeur sur l'interêt de ce développement.
* **En utilisant le contexte métier pour décrire les fonctionnalités** souhaitées, il y a moins de disgressions et de considérations techniques dans l'expression des besoins: a-t-on besoins de savoir qu'un message d'erreur sur une interface Web est un élement HTML avec la classe 'error'? Non, on souhaite seulement s'assurer qu'en cas de saisie erronée, un message d'erreur est présent et ce dans le contexte d'une page web. **Le contexte métier sert alors de filtre dans l'expression des besoins**, libérant le développeur et les personnes du métiers de détails techniques et d'implémentation.
* Le scenario sert à focaliser les discussions et la réalisation sur les attentes du client. En guidant, l'écriture du code, celui-ci devient plus fonctionnel et plus imprégné du métier.
* La **structuration du scénario permet de formaliser l'expression des besoins avec un langages communs et facilement interprétable**. Ces mots clés (`Given`, `When`, `Then`, `As a`, `In order to` ...) permettent de définir une grammaire commune qui sert à la fois à structurer le scénario en langage naturel, et sert aux outils comme [JBehave](http://jbehave.org) à faire la correspondance avec le code.

<img src="/incubation/jbehave-get-started/bdd-overview.png" alt="BDD apperçu général"/>

**Point (2): Un développement guidé et documenté**

* **Le besoin fonctionnel guide le développment de l'application**: on développe ce dont on a besoin; et on limite les eccueils de cathédrale technologique.
* **Les comportements  deviennent documenté**: même si la `javadoc` ou les commentaires permettent de documenter le code, il existe rarement de **documentation sur le comportement réel de l'application**; on dispose ainsi d'exemples concrets.
* Les tests unitaires sont généralement très riche sur le comportement d'une application, mais ils restent très hermétiques à des non-developpeurs (parfois même aux autres developpeurs et aux nouveaux arrivant), en les rendant plus accessibles et plus lisibles, **ils constituent une réelle une source d'information sur le comportement de l'application**, et sont toujours à jour.

**Point (3): Une documentation à jour et toujours disponible**

* En étant directement executables, les histoires intègrent directement la base de code: **elles sont archivées avec le code qui les executent**. Les histoires et leurs modifications évoluent donc naturellement en même temps que la base de code. Avec un *astucieux* jeu de tag et de branche, on peux donc facilement documenter les évolutions fonctionnelles du code.

**Point (4): Des tests en continue sur les fonctionalités**

* Ce point rejoint très fortement les points précédents: **l'environement d'intégration continue teste en permanence les comportements fonctionnels réels** et à jour au fil des modifications du code, et non plus seulement l'implémentation technique.


Si l'on devait résumer en une phrase: 

***Il s'agit d'une méthodologie de travail, permettant d'écrire des tests compréhensibles à la fois par le client et par le développeur et s'intégrant directement dans la base de code.***

On notera que l'on parle bien **de tests au sens général**! Cette méthodologie peux en effet aussi bien s'appliquer à des tests unitaires, des tests fonctionnels, des tests d'intégrations, des tests de bout en bout, etc. Quelque soit la taxonomie utilisée, **tout type de test pourrait s'exprimer à l'aide de scénario**.

Il s'agit d'ailleurs d'un travers que l'on rencontre souvent: associer systématique cette méthodologie avec l'écriture de tests d'intégration. Si l'on évoque [JBehave](http://jbehave.org), pour beaucoup l'association est rapidement faite avec [Selenium](http://code.google.com/p/selenium/wiki/GettingStarted) et l'écriture de tests d'intégration d'interface Web.

<img style="float:left; margin:5px;" width="150px" src="/incubation/jbehave-get-started/C-est-dit.png" alt="Démystification"/> *Eh bien non! Tout type de tests peux s'écrire avec les principes évoqués. En fait, la plupart des outils de BDD (JBehave, Cucumber, Easyb, ...) ne font **"que"** la traduction d'un scénario en langage naturel en appels de méthodes*. Ce que les méthodes pilotent réellement tient uniquement de leur contenu et non de l'outil utilisé pour les appellées. Les outils définissent une grammaire permettant de faire correspondre le scénario avec le code qui sera appellé. Chaque étape est généralement reliée à une fonction ou une méthode particulière qui pilote un changement d'état ou une action.

<img src="/incubation/jbehave-get-started/bdd-fmk-traduction.png" alt="BDD la traduction d'une story en appel de code"/>

**De plus, il est tout à fait possible (et même fortement conseillé) d'utiliser ce type de tests même si ceux-ci ne guident pas le développement et sont écrits à posteriori: la source documentaire qu'ils procurent est presque aussi riche que le code qu'ils manipulent**

## Formalisme et structure des histoires

<img style="float:left; width:150px; margin-right:5px; margin-bottom:5px" src="/incubation/jbehave-get-started/bdd-structureStory.png" alt="Structure d'une histoire" />

Avant d'illustrer cela par quelques exemples, voyons le formalisme standard utilisé pour écrire ces scénarios.

Tout d'abord **le préambule** ou **Narrative**.
Il s'agit de l'entête d'une histoire et est commun à un ensemble de scénario. Il permet de placer le contexte général et de décrire très brievement les fonctionnalités qui vont être présentées. En général, ce préambule n'est qu'illustratif et ne pilote pas de code.

<table>
    <tr>
        <td><b style="color: #008080;">As a</b> [role],</td><td><b style="color: #008080;">En tant que</b> [role ou personne],</td>
    </tr>
    <tr>
        <td><b style="color: #008080;">I want</b> [behavior]</td><td><b style="color: #008080;">Je veux</b> [fonctionalité]</td>
    </tr>
    <tr>
        <td><b style="color: #008080;">In order to</b> [outcome]</td><td><b style="color: #008080;">Afin de</b> [but, bénéfice ou valeur de la fonctionnalité]</td>
    </tr>
</table>

Une histoire étant constituée d'un ou plusieurs scénarios, viens ensuite la **description sommaire du scénario** qui va être déroulé, son titre:

<table>
    <tr>
        <td><b style="color: #008080;">Scenario:</b> [scenario]</td>
        <td><b style="color: #008080;">Scénario:</b> [description]</td>
    </tr>
</table>

Enfin **le contenu de scenario**. Le scenario est une succession d'étapes (`Step`) permettant:

* soit de définir et de construire le contexte dans lequel le scénario va se dérouler `Given`, 
* soit de provoquer des évènements ou des actions sollicitant le système `When`, 
* soit de vérifier que le comportement attendu a bien eu lieu `Then`; c'est généralement à ces étapes que l'on retrouvera les assertions.

<table>
    <tr>
        <td><b style="color: #008080;">Given</b> [an initial context]</td><td><b style="color: #008080;">Etant donné</b> [un contexte initial (les acquis)]</td>
    </tr>
    <tr>
        <td><b style="color: #008080;">When</b> [action]</td><td><b style="color: #008080;">Quand</b> [un événement survient]</td>
    </tr>
    <tr>
        <td><b style="color: #008080;">Then</b> [expected result]</td><td><b style="color: #008080;">Alors</b> [on s'assure de l'obtention de certains résultats]</td>
    </tr>
</table>

Cette grammaire (à base de mots clés en début de phrase) permet de définir le langage de nos scénario. Il est de plus en plus souvent appellé **langage Gherkin**, nom donné et popularisé par le framework [Cucumber]() (voir [Cucumber-jvm]() pour un *"portage disutable"* en Java).

## Flash info!

Excusez-nous pour cette interruption de programme, voici quelques actualités:

<blockquote class="twitter-tweet" data-in-reply-to="207170550093709313"><p>. @<a href="https://twitter.com/mgrimes">mgrimes</a> BDD does not mean UI testing!Far from it.Cucumber users have got to get this straight!</p>&mdash; Uncle Bob Martin (@unclebobmartin) <a href="https://twitter.com/unclebobmartin/status/207183252950224896" data-datetime="2012-05-28T18:55:11+00:00">May 28, 2012</a></blockquote>

<blockquote class="twitter-tweet" data-in-reply-to="207184163701399553"><p>. @<a href="https://twitter.com/angelaharms">angelaharms</a> BDD is TDD with good naming conventions. The ideas are good. The name is confusing. It's really just TDD.</p>&mdash; Uncle Bob Martin (@unclebobmartin) <a href="https://twitter.com/unclebobmartin/status/207281653582802944" data-datetime="2012-05-29T01:26:11+00:00">May 29, 2012</a></blockquote>

<blockquote class="twitter-tweet" data-in-reply-to="207283383393464320"><p>@<a href="https://twitter.com/glanotte">glanotte</a> No. BDD _not_ equal acceptance tests. BDD just better worded tests.</p>&mdash; Uncle Bob Martin (@unclebobmartin) <a href="https://twitter.com/unclebobmartin/status/207323686880022528" data-datetime="2012-05-29T04:13:13+00:00">May 29, 2012</a></blockquote>

<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Et la réponse de Dan North: [BDD is like TDD if...](http://dannorth.net/2012/05/31/bdd-is-like-tdd-if/).

# Allez on code!

## Mise en place de notre environement

Commençons par créér un nouveau projet Maven et ajoutons les dépendances nécessaires dans notre descripteur de projet (pom.xml):

{% highlight xml %}
<project xmlns="http://maven.apache.org/POM/4.0.0" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                      http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>jbehave-get-started</groupId>
  <artifactId>bdd101</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <!-- ************************************************ -->
  <!-- *~~~~~~~~~~~~~~~~~PROPERTIES~~~~~~~~~~~~~~~~~~~* -->
  <!-- ************************************************ -->
  <properties>
    <maven.compiler.source>1.6</maven.compiler.source>
    <maven.compiler.target>1.6</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

    <!-- lib versions -->
    <hamcrest.version>1.2</hamcrest.version>
    <spring.version>3.1.1.RELEASE</spring.version>
    <slf4j.version>1.6.4</slf4j.version>
    <jbehave.version>3.6.6</jbehave.version>
  </properties>

  <!-- ************************************************ -->
  <!-- *~~~~~~~~~~~~~~~~DEPENDENCIES~~~~~~~~~~~~~~~~~~* -->
  <!-- ************************************************ -->
  <dependencies>
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~Commons~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <dependency>
      <groupId>org.apache.commons</groupId>
      <artifactId>commons-lang3</artifactId>
      <version>3.1</version>
    </dependency>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~Spring~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
    </dependency>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~~Log~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>log4j-over-slf4j</artifactId>
      <version>${slf4j.version}</version>
    </dependency>

    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-classic</artifactId>
      <version>1.0.0</version>
    </dependency>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~JBehave~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <dependency>
      <groupId>org.jbehave</groupId>
      <artifactId>jbehave-core</artifactId>
      <version>${jbehave.version}</version>
    </dependency>

    <dependency>
      <groupId>org.jbehave</groupId>
      <artifactId>jbehave-spring</artifactId>
      <version>${jbehave.version}</version>
    </dependency>

    <dependency>
      <groupId>de.codecentric</groupId>
      <artifactId>jbehave-junit-runner</artifactId>
      <version>1.0.1-SNAPSHOT</version>
    </dependency>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~Test~~~~~~~~~~~~~~~~ -->
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit-dep</artifactId>
    </dependency>
    <dependency>
      <groupId>org.hamcrest</groupId>
      <artifactId>hamcrest-library</artifactId>
    </dependency>
    <dependency>
      <groupId>org.hamcrest</groupId>
      <artifactId>hamcrest-core</artifactId>
    </dependency>
  </dependencies>

  <!-- ************************************************ -->
  <!-- *~~~~~~~~~~~DEPENDENCY MANAGEMENT~~~~~~~~~~~~~~* -->
  <!-- ************************************************ -->
  <dependencyManagement>
    <dependencies>
      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <!-- ~~~~~~~~~~~~~~Spring~~~~~~~~~~~~~~~ -->
      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
      </dependency>

      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <!-- ~~~~~~~~~~~~~~~Test~~~~~~~~~~~~~~~~ -->
      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit-dep</artifactId>
        <version>4.10</version>
      </dependency>
      <dependency>
        <groupId>org.hamcrest</groupId>
        <artifactId>hamcrest-library</artifactId>
        <version>${hamcrest.version}</version>
      </dependency>
      <dependency>
        <groupId>org.hamcrest</groupId>
        <artifactId>hamcrest-core</artifactId>
        <version>${hamcrest.version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <!-- ************************************************ -->
  <!-- *~~~~~~~~~~~~~~~~~REPOSITORIES~~~~~~~~~~~~~~~~~* -->
  <!-- ************************************************ -->
  <repositories>
    <repository>
      <id>codehaus-releases</id>
      <name>Codehaus Nexus Repository Manager</name>
      <url>https://nexus.codehaus.org/content/repositories/releases/</url>
    </repository>
    <repository>
      <id>sonatype-snapshots</id>
      <name>Sonatype Snapshots</name>
      <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
    </repository>
  </repositories>

</project>
{% endhighlight %}


On notera les dépendances à `JBehave`, quelques utilitaires pour simplifier l'écriture de nos tests,et `Spring` pour l'injection de dépendance.

On retiendra aussi la dépendance à `jbehave-junit-runner` qui permet une intégration encore plus riche avec Junit en utilisant un lanceur spécial: `de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner`. **Ce lanceur permet de visualiser chaque étape de chaque scénario comme un test spécifique, il est ainsi beaucoup plus facile d'identifier à quelle étape notre scénario a échoué.** De plus, cela s'intègre parfaitement avec la vue Eclipse JUnit permettant un retour immédiat lorsque les tests sont executés directement depuis l'IDE. La page du projet correspondant peux être trouvée ici [Code Centric ~ jbehave-junit-runner](https://github.com/codecentric/jbehave-junit-runner)

Comme nous nous baserons uniquement sur les annotations *Spring* pour l'injection de dépendances et la définition de nos étapes, nous nous passerons de fichier de configuration *Spring*. Le contexte sera directement initialisé par la méthode suivante:

{% highlight java %}
public static AnnotationConfigApplicationContext 
            createContextFromBasePackages(String... basePackages) {
        AnnotationConfigApplicationContext applicationContext = 
            new AnnotationConfigApplicationContext();
        applicationContext.scan(basePackages);
        applicationContext.refresh();
        return applicationContext;
}
{% endhighlight %}

Voila pour l'infrastructure, il nous reste à définir la classe qui lancera nos scénarios. Nous nous baserons pour cela sur le framework *JUnit* pour lequel jbehave fournit les adaptateurs nécessaires:

Au risque de faire un peu peur au début, nous opterons tout de suite pour une description assez riche de notre environement de tests. *JBehave* fournit de multiples façons divers et variées pour configurer l'environement d'execution des scénarios, nous choisissons ici la moins "magique" mais plus verbeuse et surtout qui permet un contrôle total de chaque composant.

{% highlight java linenos %}
...

import bdd101.util.Springs;
import bdd101.util.UTF8StoryLoader;
import de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner;

@RunWith(JUnitReportingRunner.class)
public class AllStoriesTest extends JUnitStories {

    private final CrossReference xref = new CrossReference();

    public AllStoriesTest() {
        configuredEmbedder()//
                .embedderControls()//
                .doGenerateViewAfterStories(true)//
                .doIgnoreFailureInStories(false)//
                .doIgnoreFailureInView(true)//
                .doVerboseFailures(true)//
                .useThreads(2)//
                .useStoryTimeoutInSecs(60);
    }

    @Override
    public Configuration configuration() {
        Class<? extends Embeddable> embeddableClass = this.getClass();
        URL codeLocation = codeLocationFromClass(embeddableClass);
        StoryReporterBuilder storyReporter = //
        new StoryReporterBuilder() //
                .withCodeLocation(codeLocation) //
                .withDefaultFormats() //
                .withFormats(CONSOLE, //
                        HTML_TEMPLATE) //
                .withFailureTrace(true) //
                .withFailureTraceCompression(true) //
                .withCrossReference(xref)
                ;
        return new MostUsefulConfiguration() //
                .useStoryLoader(new UTF8StoryLoader(embeddableClass)) //
                .useStoryReporterBuilder(storyReporter) //
                .useStepMonitor(xref.getStepMonitor())//
                ;
    }

    @Override
    protected List<String> storyPaths() {
        URL searchInURL = codeLocationFromClass(this.getClass());
        return new StoryFinder().findPaths(searchInURL, "**/*.story", "");
    }

    @Override
    public InjectableStepsFactory stepsFactory() {
        return new SpringStepsFactory(configuration(),
                Springs.createAnnotatedContextFromBasePackages("bdd101"));
    }
}
{% endhighlight %}

Quelques explications:

* L'annotation `@RunWith(JUnitReportingRunner.class)` indique à *JUnit* le lanceur qui doit utilisé pour executer notre test.
* Le nom de notre classe fini par `Test` afin de suivre les conventions usuelles et étend la classe JBehave: `JUnitStories` afin de faciliter l'intégration JUnit/JBehave.
* Notre constructeur définit l'`Embedder` JBehave (c'est à dire l'environement global d'execution des tests JBehave) qui sera utilisé. Nous verrons les options activées au fur et à mesure de notre article. Ce qu'il faut retenir, c'est que **ces paramètres permettent de contrôler l'execution des tests** (`useStoryTimeoutInSecs`, `useThreads`) et la perception globale des tests (`doVerboseFailures`) : un test en échec arrête-t-il l'execution (`doIgnoreFailureInStories`) ou est-ce lors de la génération du rapport consolidé (`doGenerateViewAfterStories`) que l'on considérera que l'execution est en échec (`doIgnoreFailureInView`). <br/> Chaque test *JBehave* étant lancé de manière indépendante: à la fin de chaque test, *JBehave* consolide les résultats dans un unique rapport. 
* Vient ensuite la seconde partie de la configuration de notre environement d'execution. On retiendra pour le moment deux paramètres important: 
  * les type de rapport qui seront générés, avec notament la sortie `CONSOLE` qui facilitera la phase de développement dans notre IDE, et la sortie `HTML_TEMPLATE` qui nous verrons plus tard qui permet d'avoir un joli rapport html.
  * L'utilisation d'une classe spéciale `UTF8StoryLoader` qui nous permettra de nous affranchir des problèmatiques d'encodage qui peuvent apparaître dans le cas de développement multi-plateforme. On impose ici l'utilisation systématique de l'UTF8, ce qui correspond au choix que nous avons fait dans notre fichier `pom.xml` de maven.
 * On trouve ensuite la méthode permettant de récupérer la liste des fichiers `*.story` à éxecuter. Il y (au moins) deux pièges dans cette déclaration:
   * Le premier (qui est aussi directement lié à l'utilisation de notre classe `UTF8StoryLoader`) c'est que les fichiers seront chargés comme resources Java, il convient donc d'indiquer des chemins relatifs à notre classpath. Ce qui nous amène au second piège:
   * La méthode utilisée ici se base sur l'emplacement de notre classe de test, il est donc important de placer nos fichiers `*.story` dans les resources maven correspondantes: `src/test/resources` (copiées dans `target/test-classes`) si notre lanceur est dans un package de `src/test/java`, ou `src/main/resources` (copiées dans `target/classes`) si notre lanceur est dans un package de `src/main/java`.

## Notre premier scénario

Commençons simplement par le développement d'une petite calculatrice.

Ecrivons notre premier scénario `src/test/resources/stories/calculator.story`:

{% highlight Gherkin %}
Scenario: 2+2

Given a variable x with value 2
When I add 2 to x
Then x should equal to 4
{% endhighlight %}

<img src="/incubation/jbehave-get-started/000-calculator-no-step-def.png" alt="Editeur Eclipse de scenario"/>

<img style="float:left; margin:5px;" width="110px" src="/incubation/jbehave-get-started/plugin-astuce.png" alt="Astuce du plugin JBehave"/> On peux constater que toutes nos étapes sont soulignées en rouge pour indiquer que notre éditeur n'est pas parvenu à les associer au code java correspondant.

Executons notre lanceur de scénario: `Run as / JUnit Test` sur la classe `AllStoriesTest`.

<img src="/incubation/jbehave-get-started/000-junit-runner.png" alt="Vue JUnit Eclipse"/>

La console Eclipse (Rappel: la sortie console est activée grâce à l'option `CONSOLE`) affiche alors la sortie suivante:

{% highlight bash %}
(stories/calculator.story)
Scenario: 2+2
Given a variable x with value 2 (PENDING)
When I add 2 to x (PENDING)
Then x should equal to 4 (PENDING)

@Given("a variable x with value 2")
@Pending
public void givenAVariableXWithValue2() {
  // PENDING
}

@When("I add 2 to x")
@Pending
public void whenIAdd2ToX() {
  // PENDING
}

@Then("x should equal to 4")
@Pending
public void thenXShouldEqual4() {
  // PENDING
}
{% endhighlight %}

Faisons un petit point du résultat obtenu et qui peut être confus au premier abord:

* Notre test *JUnit* est vert! Ce qui est déroutant!
* Grâce au lanceur *JUnit* (`de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner`) la vue *JUnit* nous affiche l'intégralité des étapes qui ont été jouées: `BeforeStories`, notre scénario et les étapes `AfterStories`
* Toutes les étapes de notre scénario sont marquées `PENDING` et ont été ignorées lors de l'execution du test.
* `PENDING` signifie que les étapes présentes dans notre fichier `story` n'ont pas leurs correspondant dans le code *Java*, où les méthodes qui doivent être invoquées sont annotées avec le texte du step correspondant. C'est ce qui est d'ailleurs proposé par *JBehave* en suggestion d'implementation dans la console. Pour mettre en échec les étapes `PENDING` et donc que notre test ne soit plus vert, il suffit de changer la stratégie par défaut dans la classe `AllStoriesTest` par `FailingUponPendingStep`:

{% highlight java %}
  ...
  return new MostUsefulConfiguration() //
                .useStoryLoader(new UTF8StoryLoader(embeddableClass)) //
                .useStoryReporterBuilder(storyReporter) //
                .usePendingStepStrategy(new FailingUponPendingStep())
                .useStepMonitor(xref.getStepMonitor())//
                ;
{% endhighlight %}

Créons donc une classe `bdd101.calculator.CalculatorSteps` qui contiendra nos premières définitions d'étapes (Steps) basées en partie sur les propositions faites par *JBehave* dans la console:

{% highlight java linenos %}
import org.jbehave.core.annotations.Given;
import org.jbehave.core.annotations.Named;
import org.jbehave.core.annotations.Then;
import org.jbehave.core.annotations.When;

import bdd101.util.StepsDefinition;

@StepsDefinition
public class CalculatorSteps {

    @Given("a variable $variable with value $value")
    public void defineNamedVariableWithValue(String variable, int value) {
        throw new UnsupportedOperationException();
    }

    @When("I add $value to $variable")
    public void addValueToVariable(@Named("variable") String variable, 
                                   @Named("value")int value) {
        throw new UnsupportedOperationException();
    }

    @Then("$variable should equal to $expected")
    public void assertVariableEqualTo(String variable, int expectedValue) {
        throw new UnsupportedOperationException();
    }
}
{% endhighlight %}

Relisons cette classe ligne par ligne:

* `@StepsDefinition` est une annotation personnelle qui permet à la fois de marquer cette classe comme contenant des définitions d'étapes (ce qui est purement informatif) et qui **permet à *Spring* de la détecter au moment ou il va parcourir les classes pour la construction de son contexte**; pour plus d'information voir la documentation de *Spring* sur l'utilisation des annotations ([Spring - Using filters to customize scanning](http://static.springsource.org/spring/docs/3.0.0.M3/spring-framework-reference/html/ch04s12.html#beans-scanning-filters)).

{% highlight java %}
import java.lang.annotation.Documented;
import org.springframework.stereotype.Component;

@Documented
@Component
public @interface StepsDefinition {}
{% endhighlight %}

* Les étapes sont définies grâce à des annotations spécifiques: `@Given`, `@When` et `@Then`.
* La valeur de chaque annotation correspond à la phrase dans le scénario. Nous avons garder la configuration par défaut qui spécifie que dans ces phrases, les mots commençant par `$` désigne les variables. Ainsi la première annotation permet de supporter les phrases suivantes:
  * `Given a variable x with value 2`
  * `Given a variable y with value 17`
  * ...
* Les variables sont passées en paramètre dans le même ordre qu'elles apparaissent dans la phrase. Si cet ordre n'est pas satisfaisant, il est possible d'annoter chaque paramètre, `@Named`, pour indiquer la variable qu'il référence (Lignes 17 et 18).
* La conversion d'une variable dans le type du paramètre se fait automatiquement à l'aide des converteurs prédéfinis. Il est possible d'ajouter de nouveaux converteurs.
* Toutes nos étapes génèrent une exception dans notre implémentation initiale.


<img src="/incubation/jbehave-get-started/001-calculator-unsupported-step-def.png" alt="Editeur Eclipse de scenario"/>

<img style="float:left; margin:5px;" width="110px" src="/incubation/jbehave-get-started/plugin-astuce.png" alt="Astuce du plugin JBehave"/> On peux constater qu'une fois ces étapes enregistrées, notre éditeur de scénario nous indique que toutes nos étapes sont bien définies. Les variables apparaissent avec une couleur différente mettant en évidence leurs emplacements.

Executons à nouveau notre test:

<img src="/incubation/jbehave-get-started/001-junit-runner.png" alt="Vue JUnit Eclipse"/>

{% highlight bash %}
(stories/calculator.story)
Scenario: 2+2
Given a variable x with value 2 (FAILED)
(java.lang.UnsupportedOperationException)
When I add 2 to x (NOT PERFORMED)
Then x should equal to 4 (NOT PERFORMED)

java.lang.UnsupportedOperationException
    at bdd101.calculator.CalculatorSteps.defineNamedVariableWithValue(CalculatorSteps.java:14)
    (reflection-invoke)
{% endhighlight %}

On constate désormais que notre test est en échec, que seule la première étape à été executée mais qu'elle a échoué `FAILED` en générant une exception, ce qui correspond bien à notre implémentation. La suite du scénario n'a pas été executée: `NOT PERFORMED`

<img width="400px" src="/incubation/jbehave-get-started/bdd-cycle-around-tdd-cycles.png" alt="Cycle BDD et Cycles TDD"/>

Passons rapidement sur le développement de notre calculatrice (par une approche de type TDD par exemple) pour arriver à une implementation fonctionnelle (au sens "qui fonctionne"...). Nous obtenons alors la classe `Calculator` suivante:

{% highlight java %}
import java.util.HashMap;
import java.util.Map;

public class Calculator {
    private final Map<String, Integer> context;

    public Calculator () {
      context = new HashMap<String, Integer>();
    }

    public void defineVariable(String variable, int value) {
        context.put(variable, value);
    }
    
    public void addToVariable(String variable, int value) {
        int existing = getVariableValueOrFail(variable);
        context.put(variable, value + existing);
    }
    
    public int getVariableValue(String variable) {
        return getVariableValueOrFail(variable);
    }

    protected int getVariableValueOrFail(String variable) {
        Integer existing = context.get(variable);
        if(existing==null)
            throw new IllegalStateException(
              "Variable <" + variable + "> is not defined");
        return existing;
    }
}
{% endhighlight %}

Il est désormais nécessaire de faire le lien entre notre calculateur (`Calculator`) et la définition de nos étapes (`CalculatorSteps`).

<img style="float:left; margin:5px;" width="110px" src="/incubation/jbehave-get-started/plugin-astuce.png" alt="Astuce du plugin JBehave"/> Dans notre éditeur de scénario, il est possible d'accéder directement à la méthode correspondante soit par Ctrl+Clic sur l'étape concernée soit en ayant le curseur sur la ligne correspondante et en appuyant sur Ctrl+G (GO!).

{% highlight java %}
public class CalculatorSteps {
    private Calculator calculator = new Calculator ();

    @Given("a variable $variable with value $value")
    public void defineNamedVariableWithValue(String variable, int value) {
        calculator.defineVariable(variable, value);
    }

    ...
}
{% endhighlight %}

En relançant notre test nous obtenons cette fois:

<img src="/incubation/jbehave-get-started/002-junit-runner.png" alt="Vue JUnit Eclipse"/>

Bon! à ce stade vous devriez avoir un bon aperçu du fonctionement, faisons un petit saut dans le temps pour arriver à l'implémentation finale de nos étapes:

{% highlight java %}
...

@When("I add $value to $variable")
public void addValueToVariable(@Named("variable") String variable, 
                               @Named("value")int value) {
    calculator.addToVariable(variable, value);
}

@Then("$variable should equal to $expected")
public void assertVariableEqualTo(String variable, int expectedValue) {
    assertThat(calculator.getVariableValue(variable), equalTo(expectedValue));
}
{% endhighlight %}

Avant de faire un petit point avec notre client, enrichissons un peu notre histoire en lui ajoutant de nouveaux scénarios.

On commencera par un petit copié/collé (et oui, on a le droit!) pour vérifier que l'on peux utiliser d'autres noms de variable et d'autres valeurs que 2. Et même que l'on peux mixer l'utilisation de plusieurs variables.

{% highlight Gherkin %}
Scenario: 2+2 avec une variable y

Given a variable y with value 2
When I add 2 to y
Then y should equal to 4

Scenario: 37+5 avec une variable UnBienJoli_Nom

Given a variable UnBienJoli_Nom with value 37
When I add 5 to UnBienJoli_Nom
Then UnBienJoli_Nom should equal to 42

Scenario: 7+2 et 9+4 avec une variable y et une variable x

Given a variable y with value 7
Given a variable x with value 9
When I add 2 to y
When I add 4 to x
Then x should equal to 13
Then y should equal to 9
{% endhighlight %}

Hummm et si on utilise une variable qui n'existe pas ? Eh bien la réponse est à voir avec le client! Faisons un petit point avec notre client. Il nous dit que ça serai bien si on pouvait faire plusieurs additions sur la même variable.

{% highlight Gherkin linenos %}
Scenario: 37+5+6+17 

Given a variable x with value 37
When I add 5 to y
And I add 6 to x
And I add 17 to x
Then x should equal to 65
{% endhighlight %}

<img style="float:left; margin:5px;" width="110px" src="/incubation/jbehave-get-started/plugin-astuce.png" alt="Astuce du plugin JBehave"/> Dans notre éditeur de scénario, il est possible d'obtenir une complétion automatique parmi les étapes disponibles par `Ctrl+Espace`. Il est aussi possible de faire une recherche parmis toutes les étapes disponible en pressant `Ctrl+J`

<img src="/incubation/jbehave-get-started/plugin-quick-search-001.png" alt="Plugin JBehave recherche rapide"/>

<img src="/incubation/jbehave-get-started/plugin-quick-search-002-filter.png" alt="Plugin JBehave recherche rapide avec filtre"/>

Relançons notre test:

{% highlight bash %}
Scenario: 37+5+6+17
Given a variable x with value 37
When I add 5 to y
And I add 6 to x
And I add 17 to x
Then x should equal to 65 (FAILED)
(java.lang.AssertionError: 
Expected: <65>
     got: <60>
)
{% endhighlight %}

Humpf! ça c'était pas prévu! Que c'est-il passé? En regardant de plus près, on peux voir que l'on s'est trompé ligne 4, on ajoute 5 à la variable `y` au lieu de la variable `x`...
Ce qui soulève deux problèmes: comment se fait-il que la variable `y` existe et pourquoi n'a-t-on pas eu d'erreur? Ce qui nous permet au passage de voir avec notre client comment souhaite-t-il prendre en compte l'utilisation de variable non définie. Ensemble nous definissons alors un nouveau scénario:

{% highlight Gherkin %}
Scenario: Undefined variable displays error message

When I add 5 to y
Then the calculator should display the message 'Variable <y> is not defined'
{% endhighlight %}

Maintenant, interessons-nous à notre erreur précédente: comment se fait-il que nous n'ayons pas eu d'erreur (`IllegalStateException`). Et bien, tout simplement parce que l'un des scénarios précédent a définit cette variable, et que les classes définissant les étapes ne sont pas réinstanciées à chaque test: nous utilisons donc la même instance de `Calculator` pour tous les scénarios.

**Les classes définissant les étapes ne sont instanciées qu'une seule fois pour tous les fichiers `*.story` et pour tous les scénarios d'un fichier `story`**. Et même de manière concurrente si l'on spécifie que les scénarios peuvent être executés à travers plusieurs `Thread`.

Cela nous amène à présenter **quelques bonnes pratiques**: 

* **ne pas stocker d'états dans les classes définissant les étapes**
* utiliser les annotations `@BeforeStories`, `@BeforeStory`, `@BeforeScenario` pour réinitialiser les états entre chaque scénario. Dans le cas de tests unitaire, on pourra se contenter de réinitialiser uniquement le contexte du test avant chaque scénario `@BeforeScenario`. Tandis que dans le cas des tests d'intégration, on pourra par exemple démarrer le serveur Sélenium, ou le serveur d'application, au tout début des tests dans une méthode annotée `@BeforeStories`, réinitialiser la base de données avant chaque histoire `@BeforeStory` et réinitializer le contexte du test avant chaque scénatio `@BeforeScenario`. 
* utiliser les annotations `@AfterStories`, `@AfterStory` et `@AfterScenario` pour fermer et nettoyer les ressources correspondantes.

Afin de garder une infrastructure de test simple qui nous permettra de travailler en environement concurrent, nous opterons pour l'utilisation de variable `ThreadLocal` pour maintenir l'état de chaque scénario. Ainsi, deux scénarios s'executant en parallèle (chacun dans leur thread) disposeront chacun de leur propre contexte.

{% highlight java %}
public class CalculatorContext {

    private static ThreadLocal<CalculatorContext> threadContext = 
            new ThreadLocal<CalculatorContext>();
    
    public static CalculatorContext context() {
        return threadContext.get();
    }
    
    public static Calculator calculator() {
        return context().getCalculator();
    }
    
    public static void initialize() {
        // one does not rely on ThreadLocal#initialValue()
        // so that one is sure only initialize create a new
        // instance
        threadContext.set(new CalculatorContext());
    }
    public static void dispose () {
        threadContext.remove();
    }
    
    private final Calculator calculator;
    private Exception lastError;
    
    public CalculatorContext() {
        calculator = new Calculator();
    }
    
    public Calculator getCalculator() {
        return calculator;
    }
    
    public void setLastError(Exception lastError) {
        this.lastError = lastError;
    }
    
    public Exception getLastError() {
        return lastError;
    }
}
{% endhighlight %}

Modifions enfin notre classe `CalculatorSteps`:

{% highlight java %}
package bdd101.calculator;

import static bdd101.calculator.CalculatorContext.calculator;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

import org.jbehave.core.annotations.AfterScenario;
import org.jbehave.core.annotations.BeforeScenario;
import org.jbehave.core.annotations.Given;
import org.jbehave.core.annotations.Named;
import org.jbehave.core.annotations.Then;
import org.jbehave.core.annotations.When;

import bdd101.util.StepsDefinition;

@StepsDefinition
public class CalculatorSteps {
    
    @BeforeScenario
    public void inializeScenario() {
        CalculatorContext.initialize();
    }

    @AfterScenario
    public void disposeScenario() {
        CalculatorContext.dispose();
    }
    
    @Given("a variable $variable with value $value")
    public void defineNamedVariableWithValue(String variable, int value) {
        calculator().defineVariable(variable, value);
    }

    @When("I add $value to $variable")
    public void addValueToVariable(@Named("variable") String variable, 
                                   @Named("value")int value) {
        calculator().addToVariable(variable, value);
    }
}
{% endhighlight %}

Relançons les tests, et cette fois nous obtenons bien l'exception souhaitée:

{% highlight bash %}
...

Scenario: Undefined variable displays error message
When I add 5 to y (FAILED)
(java.lang.IllegalStateException: Variable <y> is not defined)
Then the calculator should display the message 'Variable y is not defined' (PENDING)
@Then("the calculator should display the message 'Variable y is not defined'")
@Pending
public void thenTheCalculatorShouldDisplayTheMessageVariableYIsNotDefined() {
  // PENDING
}
{% endhighlight %}

Modifions légèrement notre classe de définitions d'étapes pour gérer l'exception:

{% highlight java %}
...
    @When("I add $value to $variable")
    public void addValueToVariable(@Named("variable") String variable, 
                                   @Named("value")int value) {
        try {
            calculator().addToVariable(variable, value);
        } catch (Exception e) {
            context().setLastError(e);
        }
    }
...
{% endhighlight %}

L'erreur pouvant être de nature "métier" (le code est ici simplifié), ce n'est généralement pas à une étape de type `Given` ou `When` de la traiter. Les assertions devraient autant que possible se situer dans les méthodes `Then`.

Puis enfin, ajoutons l'étape de vérification:

{% highlight java %}
...

@Then("the calculator should display the message '$errorMessage'")
public void assertErrorMessageIsDisplayed(String errorMessage) {
  Exception lastError = context().getLastError();
  assertThat("Not in error situtation", lastError, notNullValue());
  assertThat("Wrong error message", lastError.getMessage(), equalTo(errorMessage));
}

{% endhighlight %}

Afin de s'assurer que tous nos scénarios précédent restent cohérent, nous ajoutons aussi l'étape suivante `the calculator should not be in error` à la fin de chaque scénario. 

{% highlight Gherkin %}
Scenario: 2+2

Given a variable x with value 2
When I add 2 to x
Then x should equal to 4
And the calculator should not be in error

Scenario: 2+2 avec une variable y

Given a variable y with value 2
When I add 2 to y
Then y should equal to 4
And the calculator should not be in error

...
{% endhighlight %}

La méthode correspondante à l'étape:

{% highlight java %}
...
@Then("the calculator should not be in error")
public void assertNoErrorMessageIsDisplayed() {
  Exception lastError = context().getLastError();
  assertThat(lastError, nullValue());
}

{% endhighlight %}


# Conclusion

Un schéma vaut mieux qu'un long discours:

<a href="http://www.modernanalyst.com/Resources/BusinessAnalystHumor/tabid/218/articleType/ArticleView/articleId/1231/Theres_an_app_for_that.aspx"><img src="/incubation/jbehave-get-started/Fin50s.jpg" alt="There's an app for that!"/></a>

En attendant le "Specs Creator", le BDD est une bonne alternative!

# Références et Liens

Le code complet est disponible ici: [jbehave-get-started](https://github.com/Arnauld/jbehave-get-started).

Articles

* [Dan North - Introduction to BDD](http://dannorth.net/introducing-bdd/) (traduction française par [Philippe Poumaroux](http://philippe.poumaroux.free.fr/index.php?post/2012/02/06/Introduction-au-Behaviour-Driven-Developement))
* [Dan North - BDD is like TDD if...](http://dannorth.net/2012/05/31/bdd-is-like-tdd-if/)
* [Herding Code #42 ~ Scott Bellware on BDD](http://herdingcode.com/?p=176)
* [Liz Keogh - Translating TDD to BDD](http://lizkeogh.com/2009/11/06/translating-tdd-to-bdd/)
* [Gojko Adzic - Specification by Example: How successful teams deliver the right software](http://specificationbyexample.com/)

Outils

* [JBehave](http://jbehave.org/)
* [Code Centric ~ jbehave-junit-runner](http://github.com/codecentric/jbehave-junit-runner)
* [JBehave Eclipse plugin](http://github.com/Arnauld/jbehave-eclipse-plugin)
