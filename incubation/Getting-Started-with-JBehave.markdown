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

  Tout d'abord un peu d'histoire, le BDD encore un accronyme du type **xDD**? Et bien oui, encore un! Le BDD (Behavior Driven Development) est présenté comme une évolution du TDD (Test Driven Development). 
  Proposé par Dan North (qui fut aussi l'un des initiateurs du projet JBehave), le BDD consiste étendre le TDD en écrivant non plus du code compréhensible uniquement par des développeurs, mais sous forme de scénario compréhensible par toutes les personnes impliquées dans le projet.

  Autrement dit, il s'agit d'écrire des tests qui décrivent le comportement attendu du système et que tout le monde peux comprendre. 

  Et le rapport avec le TDD? Eh bien généralement, ces scénarios sont écrits et définis avant que l'implémentation ne commence. Ils servent à la fois à définir le besoin mais vont guider le développement en le focalisant sur la fonctionnalité décrite.

---

{{ page.excerpt | markdownify }}

Les avantages d'une tel pratique sont multiples:

* En ecrivant des tests que tous peuvent comprendre, les clients peuvent s'assurer que les développeurs ont bien compris les besoins métiers, et que les deux parties avancent ensemble dans la même direction. Il constitue un véritable outils de communication rapprochant développeurs et personnes du métiers. Cela restaure la confiance du client en rendant le comportement explicite et visible.
* Les tests unitaires sont généralement très riche sur le comportement d'une application, mais ils restent très hermétiques à des non-developpeurs (parfois même aux autres developpeurs et aux nouveaux arrivant), en les rendant plus accessibles et plus lisibles, ils constituent une réelle une source d'information sur le comportement de l'application, et sont généralement toujours à jour.
* En utilisant le contexte métier pour décrire les fonctionnalités souhaitées, il y a moins de disgression et de considération techniques dans l'expression des besoins: a-t-on besoins de savoir qu'un message d'erreur sur une interface Web est un élement HTML avec la classe 'error'? Non, on souhaite seulement s'assurer qu'en cas de saisie erronée, un message d'erreur est présent et ce dans le contexte d'une page web. Le contexte métier sert alors de filtre dans l'expression des besoins, libérant le développeur et les personnes du métiers de détails techniques et d'implémentation.
* Le scenario sert à focaliser les discussions et la réalisation sur les attentes du client. En guidant, l'écriture du code, celui-ci devient plus fonctionnel et plus imprégné du métier.
* La structuration (et formalisation) du scénario permet de formaliser l'expression des besoins avec un langages communs et facilement interprétable. L'utilisation de mots clé et d'expression....

Si l'on devait résumer en une phrase: Il s'agit d'une méthodologie de travail, permettant d'écrire des tests compréhensibles à la fois par le client et par le développeur.

On notera que l'on parle bien de tests au sens général! Cette méthodologie peux en effet aussi bien s'appliquer à des tests unitaires, des tests fonctionnels, des tests d'intégrations, des tests de bout en bout, etc. 
Il s'agit d'ailleurs d'un travers que l'on rencontre souvent: associer systématique cette méthodologie avec l'écriture de tests d'intégration. Si l'on évoque JBehave, pour beaucoup le rapprochement est rapidement fait avec [Selenium]() et l'écriture de tests d'intégration d'interface Web.

Eh bien non! Tout type de tests peux s'écrire avec les principes évoqués. **En fait, la plupart des outils de BDD (JBehave, Cucumber, Easyb, ...) ne font "que" la traduction d'un scénario en langage naturel en appel séquentiel de méthodes. Ce que les méthodes pilotent réellement tient uniquement de leur comportement que de l'outil utilisé pour faire le lien.

Avant d'illustrer cela par quelques exemples, voyons le formalisme standard utilisé pour écrire ces scénarios.

Tout d'abord le préambule à un ensemble de scénario, il permet de placer le contexte général et de decrire très brievement les fonctionnalités qui vont être présenté.

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

# Allez on code!

Commençons par créér un nouveau projet Maven dans Eclipse et ajoutons les dépendances nécessaires dans notre descripteur de projet (pom.xml):

{% highlight xml %}
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

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
		    <version>1.0.0</version>
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
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
			<id>codehaus-releases</id>
			<name>Codehaus Nexus Repository Manager</name>
			<url>https://nexus.codehaus.org/content/repositories/releases/</url>
		</repository>
	</repositories>
</project>
`{% endhighlight %}


On notera les dépendances à JBehave et à quelques utilitaires dont `jbehave-junit-runner` qui permet une intégration encore plus riche avec eclipse en utilisant un lanceur Junit spécial: `de.codecentric.jbehave.junit.monitoring.JUnitReportingRunner`.
Ce lanceur permet de visualiser chaque étape de chaque scénario comme un test spécifique dans la vue eclipse JUnit.

Comme nous nous baserons essentiellement sur les annotations Spring pour les injections de dépendances, notre fichier de description de contexte sera simplement (`src/test/applicationContext-test.xml`):

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans   http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">
  <context:component-scan base-package="bdd101" />
</beans>
{% endhighlight %}

Voila pour l'infrastructure, il nous reste à définir la classe qui lancera nos scénarios. Nous nous baserons pour cela sur le framework junit pour lequel jbehave fournit les adaptateurs nécessaires:

Au risque de faire un peu peur au début, nous opterons tout de suite pour une description assez riche de notre environement de tests. JBehave fournit de multiples façons divers et variées pour configurer l'environement d'execution des scénarios, nous choisissons ici la moins "magique" mais plus verbeuse et surtout qui permet un contrôle total de chaque composant.

{% highlight java linenos %}
...

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
        // configuredEmbedder().useEmbedderControls(new PropertyBasedEmbedderControls());
    }

    @Override
    public Configuration configuration() {
        Class<? extends Embeddable> embeddableClass = this.getClass();
        return new MostUsefulConfiguration()
                .useStoryLoader(new UTF8StoryLoader(embeddableClass))
                .useStoryReporterBuilder(
                        new StoryReporterBuilder()
                                .withCodeLocation(CodeLocations.codeLocationFromClass(embeddableClass))
                                .withDefaultFormats()
                                .withFormats(CONSOLE, TXT, HTML_TEMPLATE, XML_TEMPLATE).withFailureTrace(true)
                                .withFailureTraceCompression(true).withCrossReference(xref))
                .useStepMonitor(xref.getStepMonitor());
    }

    @Override
    protected List<String> storyPaths() {
        return new StoryFinder().findPaths(codeLocationFromClass(this.getClass()), "**/*.story", "");
    }

    @Override
    public InjectableStepsFactory stepsFactory() {
        return new SpringStepsFactory(configuration(), 
                Springs.createContextFromClassPath("spring/applicationContext-test.xml"));
    }
}
{% endhighlight %}

# Références

* [JBehave](http://jbehave.org/)
* [Dan North: Introduction to BDD](http://dannorth.net/introducing-bdd/) (traduction française par [Philippe Poumaroux](http://philippe.poumaroux.free.fr/index.php?post/2012/02/06/Introduction-au-Behaviour-Driven-Developement))
