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
  
  A l'occasion de la release `1.0.7` du plugin eclipse pour [JBehave](http://jbehave.org/), je vais en profiter pour présenter cet outil, à quoi il peux servir et comment le mettre en oeuvre.

  ** BDD quézako!? **

  Tout d'abord un peu d'histoire: Le BDD encore un accronyme du type **xDD**? Et bien oui, encore un! Le BDD (Behavior Driven Development) est présenté comme une évolution du TDD (Test Driven Development). 
  Proposé par Dan North (qui fut aussi l'un des initiateurs du projet JBehave), le BDD consiste à étendre le TDD en écrivant non plus du code compréhensible uniquement par des développeurs, mais sous forme de scénario compréhensible par toutes les personnes impliquées dans le projet.

  Autrement dit, il s'agit d'écrire des tests qui décrivent le comportement attendu du système et que tout le monde peux comprendre. 

  Et le rapport avec le TDD? Eh bien généralement, ces scénarios sont écrits et définis avant que l'implémentation ne commence. Ils servent à la fois à définir le besoin mais vont guider le développement en le focalisant sur la fonctionnalité décrite. Dans l'absolu, on continue à faire du TDD mais on remplace l'expression du besoin en langage naturel.

---

{{ page.excerpt | markdownify }}

<img src="/incubation/jbehave-get-started/bdd-overview.png" alt="BDD apperçu général"/>

Les avantages d'une tel pratique sont multiples (voir figure ci-dessus):

**Point (1):**

* L'écriture des scénarios se fait de manière collective: développeurs, client, équipe support, ...; tout le monde peux participer à l'expression du besoin, puisque celui-ci ce fait en langage naturel. Toutes les questions soulevées, par le client ou par le développeur, peuvent faire l'objet de scénarios dédiés. Les scénarios décrivent alors le fontionement réel de l'application, et le traitement des cas aux limites.
* En illustrant chaque cas d'utilisation par des exemples concrets, les rêgles métiers sont moins abstraites et mieux comprises.
* En ecrivant des tests que tout le monde peut comprendre, les clients s'assurent que les développeurs ont bien compris les besoins métiers, les développeurs sortent de leur “Autisme” ([]()) et se rapprochent du métier. Les deux parties avancent ensemble dans la même direction. Il constitue un véritable outils de communication rapprochant développeurs et personnes du métiers. Cela restaure la confiance du client en rendant le comportement explicite et visible.
* A chaque fois qu'une nouvelle spécification est écrite, son utilisation est illustrée par plusieurs cas de tests, cela force à réflechir sur la fonctionalité et son utilisation. Il est possible de communiquer avec tout le monde et pas seulement les développeurs, il est ainsi plus facile d'inciter les gens à s'impliquer sur ce qui est fait: d'avoir des fonctionnalités mieux décrites et plus challengées. Celapermet aussi de rassurer le développeur sur l'interêt de ce développement.
* En utilisant le contexte métier pour décrire les fonctionnalités souhaitées, il y a moins de disgression et de considération techniques dans l'expression des besoins: a-t-on besoins de savoir qu'un message d'erreur sur une interface Web est un élement HTML avec la classe 'error'? Non, on souhaite seulement s'assurer qu'en cas de saisie erronée, un message d'erreur est présent et ce dans le contexte d'une page web. Le contexte métier sert alors de filtre dans l'expression des besoins, libérant le développeur et les personnes du métiers de détails techniques et d'implémentation.
* Le scenario sert à focaliser les discussions et la réalisation sur les attentes du client. En guidant, l'écriture du code, celui-ci devient plus fonctionnel et plus imprégné du métier.
* La structuration (et formalisation) du scénario permet de formaliser l'expression des besoins avec un langages communs et facilement interprétable. L'utilisation de mots clé et d'expression....

**Point (2):**

* Le besoin fonctionnel guide le développment de l'application: on développe ce dont on a besoin; et on limite les eccueils de cathédrale technologique.
* Les comportements  deviennent documenté: même si la javadoc ou les commentaires permettent de documenter le code, il existe rarement de documentation sur le comportement réel de l'application; on dispose ainsi d'exemples concrets.
* Les tests unitaires sont généralement très riche sur le comportement d'une application, mais ils restent très hermétiques à des non-developpeurs (parfois même aux autres developpeurs et aux nouveaux arrivant), en les rendant plus accessibles et plus lisibles, **ils constituent une réelle une source d'information sur le comportement de l'application**, et sont toujours à jour.

**Point (3):**

* En étant directement executables, les histoires intègrent directement la base de code: elles sont archivées avec le code qui les executent. Les histoires et leurs modifications évoluent donc naturellement en même temps que la base de code. Avec un *astucieux* jeu de tag et de branche, on peux donc facilement documenter les évolutions fonctionnelles du code.

**Point (4):**

* Ce point rejoint très fortement les points précédents: l'environement d'intégration continue teste en permanence les comportements fonctionnels réels et à jour au fil des modifications du code.

Si l'on devait résumer en une phrase: Il s'agit d'une méthodologie de travail, permettant d'écrire des tests compréhensibles à la fois par le client et par le développeur et s'intégrant directement dans la base de code.

On notera que l'on parle bien de tests au sens général! Cette méthodologie peux en effet aussi bien s'appliquer à des tests unitaires, des tests fonctionnels, des tests d'intégrations, des tests de bout en bout, etc. 
Il s'agit d'ailleurs d'un travers que l'on rencontre souvent: associer systématique cette méthodologie avec l'écriture de tests d'intégration. Si l'on évoque JBehave, pour beaucoup le rapprochement est rapidement fait avec [Selenium](http://code.google.com/p/selenium/wiki/GettingStarted) et l'écriture de tests d'intégration d'interface Web.

Eh bien non! Tout type de tests peux s'écrire avec les principes évoqués. **En fait, la plupart des outils de BDD (JBehave, Cucumber, Easyb, ...) ne font "que" la traduction d'un scénario en langage naturel en appel séquentiel de méthodes. Ce que les méthodes pilotent réellement tient uniquement de leur comportement que de l'outil utilisé pour faire le lien. Les outils définissent une grammaire permettant de faire correspondre le scénario avec le code qui sera appellé. Chaque étape est généralement reliée à une fonction ou une méthode particulière qui pilote un changement d'état ou une action.

**De plus, il est tout à fait possible (et même fortement conseillé) d'utiliser ce type de tests même si ceux-ci ne guident pas le développement et sont écrits à posteriori: la source documentaire qu'ils procurent est presque aussi riche que le code qu'ils manipulent**

Avant d'illustrer cela par quelques exemples, voyons le formalisme standard utilisé pour écrire ces scénarios.

Tout d'abord le préambule à un ensemble de scénario, il permet de placer le contexte général et de decrire très brievement les fonctionnalités qui vont être présenté. En général, ce préambule n'est qu'illustratif et ne pilote pas de code.

<table>
    <tr>
        <td>
            As a [role],<br/>
            I want [behavior] <br/>
            In order to [outcome] <br/>
        </td>
        <td>
            En tant que [role ou personne],<br/>
            Je veux [fonctionalité] <br/>
            Afin de [but, bénéfice ou valeur de la fonctionnalité] <br/>
        </td>
    </tr>
</table>

Viens ensuite la description sommaire du scénario qui va être déroulé (le titre):

<table>
    <tr>
        <td>
            Scenario: [scenario]
        </td>
    </tr>
</table>

Enfin le contenu de scenario. Le scenario est une succession d'étape (`Step`) permettant 
* soit de définir et de construire le contexte dans lequel le scénario va se dérouler, 
* soit de provoquer des évènements ou des actions sollicitant le système, 
* soit de vérifier que le comportement attendu a bien eu lieu

<table>
    <tr>
        <td>
            Given [context]
            When [action]
            Then [expected result]
        </td>
        <td>
            Etant donné [un contexte initial (les acquis)]
            Lorsqu'[un événement survient]
            Alors [on s'assure de l'obtention de certains résultats]
          </td>
      </tr>
</table>

## Quelques tweets d'actualités

<blockquote class="twitter-tweet" data-in-reply-to="207170550093709313"><p>. @<a href="https://twitter.com/mgrimes">mgrimes</a> BDD does not mean UI testing!Far from it.Cucumber users have got to get this straight!</p>&mdash; Uncle Bob Martin (@unclebobmartin) <a href="https://twitter.com/unclebobmartin/status/207183252950224896" data-datetime="2012-05-28T18:55:11+00:00">May 28, 2012</a></blockquote>

<blockquote class="twitter-tweet" data-in-reply-to="207184163701399553"><p>. @<a href="https://twitter.com/angelaharms">angelaharms</a> BDD is TDD with good naming conventions. The ideas are good. The name is confusing. It's really just TDD.</p>&mdash; Uncle Bob Martin (@unclebobmartin) <a href="https://twitter.com/unclebobmartin/status/207281653582802944" data-datetime="2012-05-29T01:26:11+00:00">May 29, 2012</a></blockquote>

<blockquote class="twitter-tweet" data-in-reply-to="207283383393464320"><p>@<a href="https://twitter.com/glanotte">glanotte</a> No. BDD _not_ equal acceptance tests. BDD just better worded tests.</p>&mdash; Uncle Bob Martin (@unclebobmartin) <a href="https://twitter.com/unclebobmartin/status/207323686880022528" data-datetime="2012-05-29T04:13:13+00:00">May 29, 2012</a></blockquote>



<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[TODO: figure mapping étape <----> steps]


# Allez on code!

## Mise en place de notre environement

Commençons par créér un nouveau projet Maven dans Eclipse et ajoutons les dépendances nécessaires dans notre descripteur de projet (pom.xml):

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
  <!-- *~~~~~~~~~~~~~~~~REPOSITORIES~~~~~~~~~~~~~~~~~* -->
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


On notera les dépendances à JBehave et à quelques utilitaires dont `jbehave-junit-runner` qui permet une intégration encore plus riche avec eclipse en utilisant un lanceur Junit spécial: `de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner`.
Ce lanceur permet de visualiser chaque étape de chaque scénario comme un test spécifique dans la vue eclipse JUnit. La page du projet correspondant peux être trouvée ici [Code Centric ~ jbehave-junit-runner](https://github.com/codecentric/jbehave-junit-runner)

Comme nous nous baserons uniquement sur les annotations Spring pour les injections de dépendances, nous passerons de fichier de configuration spring, le contexte sera directement initialisé comme suit:

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

Voila pour l'infrastructure, il nous reste à définir la classe qui lancera nos scénarios. Nous nous baserons pour cela sur le framework junit pour lequel jbehave fournit les adaptateurs nécessaires:

Au risque de faire un peu peur au début, nous opterons tout de suite pour une description assez riche de notre environement de tests. JBehave fournit de multiples façons divers et variées pour configurer l'environement d'execution des scénarios, nous choisissons ici la moins "magique" mais plus verbeuse et surtout qui permet un contrôle total de chaque composant.

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
                        TXT, //
                        HTML_TEMPLATE, //
                        XML_TEMPLATE) //
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

* L'annotation `@RunWith(JUnitReportingRunner.class)` indique à Junit le lanceur qui doit utilisé pour executer notre test.
* Le nom de notre classe fini par `Test` afin de suivre les conventions usuelles et étend la classe JBehave: `JUnitStories` afin de faciliter l'intégration JUnit/JBehave.
* Notre constructeur définit l'`Embedder` JBehave (c'est à dire l'environement global d'execution des tests JBehave) qui sera utilisé. Nous verons les options activées au fur et à mesure de notre article. Ce qu'il faut retenir, c'est que ces paramètres permettent de contrôler l'execution des tests (`useStoryTimeoutInSecs`, `useThreads`) et la perception globale des tests (`doVerboseFailures`) : un test en échec arrête-t-il l'execution (`doIgnoreFailureInStories`) ou est-ce lors de la génération du rapport consolidé (`doGenerateViewAfterStories`) que l'on considérera que l'execution est en échec (`doIgnoreFailureInView`)
* Vient ensuite la seconde partie de la configuration de notre environement d'execution. On retiendra pour le moment deux paramètres important: 
  * les type de rapport qui seront générés, avec notament la sortie `CONSOLE` qui nous facilitera la phase de développement dans notre IDE, et la sortie `HTML_TEMPLATE` qui nous verrons plus tard qui permet d'avoir un joli rapport html.
  * L'utilisation d'une classe spéciale `UTF8StoryLoader` qui nous permettra de nous affranchir des problèmatiques d'encoding qui peuvent apparaître dans le cas de développement multi-plateforme. On impose ici l'utilisation systématique de l'UTF8, ce qui correspond au choix que nous avons fait dans notre fichier `pom.xml` de maven.
 * On trouve ensuite la méthode permettant de récupérer la liste des fichiers story à dérouler. Il y (au moins) deux pièges dans cette déclaration:
   * Le premier (qui est aussi directement lié à l'utilisation de notre classe `UTF8StoryLoader`) c'est que les fichiers seront chargés comme resources Java, il convient donc d'indiquer des chemins relatifs à notre classpath. Ce qui nous amène au second piège:
   * La méthode utilisée ici se base sur l'emplacement de notre classe de test, il est donc important de placer nos fichiers *.story dans les resources maven correspondantes: `src/test/resources` (copié dans `target/test-classes`) si notre lanceur est dans un package de `src/test/java`, ou `src/main/resources` (copié dans `target/classes`) si notre lanceur est dans un package de `src/main/java`.

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

La console Eclipse (la sortie console est activée grâce à l'option `CONSOLE` [DRAFT]) affiche alors la sortie suivante:

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

* Notre test JUnit est vert!
* Grâce au lanceur JUnit (`de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner`) la vue JUnit nous affiche l'intégralité des étapes qui ont été jouées: `BeforeStories`, notre scénario et les étapes `AfterStories`
* Toutes les étapes de notre scénario sont marquées `PENDING` et ont été ignorées lors de l'execution du test.
* `PENDING` signifie que les étapes présentes dans notre fichier `story` n'ont pas leurs correspondant dans le code java, où les méthodes qui doivent être invoquées sont annotées avec le texte du step correspondant. C'est ce qui est d'ailleurs proposé par JBehave en suggestion d'implementation dans la console.

Crééons donc une classe `bdd101.calculator.CalculatorSteps` qui contiendra nos premières définitions de steps basé en partie sur les propositions faites par JBehave dans la console:

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

* `@StepsDefinition` est une annotation personnelle qui permet à la fois de marquer cette classe comme contenant des définitions d'étapes (ce qui est purement informatif) et qui permet à Spring de la détecter au moment ou il va parcourir les classes pour la construction de son contexte (`<context:component-scan base-package="bdd101" />` dans le fichier `applicationContext-test.xml`); pour plus d'information voir la documentation de spring sur l'utilisation des annotations ([TODO: add ref.]).

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
* Les variables sont passées en paramètre dans le même ordre qu'elles sont définies dans la phrase. Si cet ordre n'est pas satisfaisant, il est possible d'annoter chaque paramètre, `@Named`, pour indiquer la variable qu'il référence.
* La conversion d'une variable dans le type du paramètre se fait automatiquement à l'aide des converteurs prédéfinis. Il est tout à fait possible d'ajouter de nouveaux converteurs ([TODO: add ref.]).
* Toutes nos étapes génèrent une exception dans notre implémentation initiale.


<img src="/incubation/jbehave-get-started/001-calculator-unsupported-step-def.png" alt="Editeur Eclipse de scenario"/>

<img style="float:left; margin:5px;" width="110px" src="/incubation/jbehave-get-started/plugin-astuce.png" alt="Astuce du plugin JBehave"/> On peux constater qu'une fois ces étapes enregistrées, notre éditeur d'histoire nous indique que toutes nos étapes sont bien définies ainsi que l'emplacement des variables.

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

On constate désormais que notre test est en échec, que seule la première étape à été executée mais qu'elle a échoué `FAILED` en générant une exception. La suite du scénario n'a pas été executée: `NOT PERFORMED`

<img width="400px" src="/incubation/jbehave-get-started/bdd-cycle-around-tdd-cycles.png" alt="Cycle BDD et Cycles TDD"/>

Passons rapidement sur le développement de notre calculatrice (par une approche de type TDD par exemple) pour arriver à une implementation fonctionnelle:

{% highlight java %}
import java.util.HashMap;
import java.util.Map;

public class Calculator {
    private final Map<String, Integer> context = new HashMap<String, Integer>();

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
            throw new IllegalStateException("Variable <" + variable + "> is not defined");
        return existing;
    }
}
{% endhighlight %}

Il est désormais nécessaire de faire le lien entre notre calculateur et la définition de nos étapes.

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

<img src="/incubation/jbehave-get-started/001-junit-runner.png" alt="Vue JUnit Eclipse"/>

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

Avant de faire un petit point avec notre client, enrichissons un peu notre histoire en lui ajoutant de nouveaux scénario.

On commencera par un petit copié/collé pour vérifier qu'on peux utiliser d'autres noms de variable et d'autres valeurs que 2.

{% highlight Gherkin %}
Scenario: 2+2 avec une variable y

Given a variable y with value 2
When I add 2 to y
Then y should equal to 4

Scenario: 37+5 avec une variable UnBienJoli_Nom

Given a variable UnBienJoli_Nom with value 37
When I add 5 to UnBienJoli_Nom
Then UnBienJoli_Nom should equal to 42
{% endhighlight %}

Hummm et si on utilise une variable qui n'existe pas ? Eh bien la réponse est à voir avec le client! Faisons un petit point avec notre client. Qui nous dit que ça serai bien si on pouvait faire plusieurs additions sur la même variable.

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

Humpf! ça c'était pas prévu! Que c'est-il passé? En regardant de plus près, on peux voir qu'on c'est trompé ligne 4, on ajoute 5 à la variable `y` au lieu de la variable `x`...
Ce qui soulève deux problèmes: comment se fait-il que la variable `y` existe et pourquoi n'a-t-on pas eu d'erreur? Ce qui nous permet au passage de voir avec notre client comment souhaite-t-il prendre en compte l'utilisation de variable non définie. Ensemble nous definissons alors un nouveau scénario:

{% highlight Gherkin %}
Scenario: Undefined variable displays error message

When I add 5 to y
Then the calculator should display the message 'Variable <y> is not defined'
{% endhighlight %}

Maintenant, interessons-nous à notre erreur précédente: comment se fait-il que nous n'ayons pas eu d'erreur (`throw new IllegalStateException("Variable <" + variable + "> is not defined");`). Et bien, tout simplement parce que l'un des scénarios précédent a définit cette variable, et que les classes définissant les étapes ne sont pas réinstanciées à chaque test: nous utilisons donc la même instance de `Calculator` pour chaque scénario. 
Cela nous amène à présenter quelques bonnes pratiques: 

* ne pas stocker d'états dans les classes définissant les étapes
* utiliser les annotations `@BeforeStories`, `@BeforeStory`, `@BeforeScenario` pour réinitialiser les états entre chaque scénario. Dans le cas de tests unitaire, on pourra se contenter de réinitialiser uniquement le contexte du test avant chaque scénario `@BeforeScenario`. Tandis que dans le cas des tests d'intégration, on pourra par exemple démarrer le serveur Sélenium au tout début des tests dans une méthode annotée `@BeforeStories`, réinitialiser la base de données avant chaque histoire `@BeforeStory` et réinitializer le contexte du test avant chaque scénatio `@BeforeScenario`. 
* utiliser les annotations `@AfterStories`, `@AfterStory` et `@AfterScenario` pour fermer et nettoyer les ressources correspondantes.

Afin de garder une infrastructure de test simple qui nous permettra de travailler en environement concurrent, nous obterons pour l'utilisation de variable `ThreadLocal` pour maintenir l'état de chaque scénario. Ainsi, deux scénarios s'executant en parallèle (chacun dans leur thread) disposeront chacun de leur propre contexte.

{% highlight java linenos %}
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
    
    private Calculator calculator;
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

Le code complet est disponible ici: [jbehave-get-started](https://github.com/Arnauld/jbehave-get-started).

# Références

* [Dan North - Introduction to BDD](http://dannorth.net/introducing-bdd/) (traduction française par [Philippe Poumaroux](http://philippe.poumaroux.free.fr/index.php?post/2012/02/06/Introduction-au-Behaviour-Driven-Developement))
* [Liz Keogh - Translating TDD to BDD](http://lizkeogh.com/2009/11/06/translating-tdd-to-bdd/)
* [Gojko Adzic - Specification by Example: How successful teams deliver the right software](http://specificationbyexample.com/)

* [JBehave](http://jbehave.org/)
* [Code Centric ~ jbehave-junit-runner](http://github.com/codecentric/jbehave-junit-runner)
* [JBehave Eclipse plugin](http://github.com/Arnauld/jbehave-eclipse-plugin)

* [Selenium](http://code.google.com/p/selenium/wiki/GettingStarted)
* [FluentLenium](https://github.com/FluentLenium/FluentLenium)

