---
layout: post
title: "[T|B|D]DD par la pratique 7.1 - DSL et Code generation"
category: tbd-in-practice
tags:
  - nodejs
  - javascript
  - lexer
  - parser
  - jison
  - grammar
  - dsl
  - code-gen
  - mda
published: false
comments: true
excerpt: |
  En lisant la fin de l'article [3.5 - Notre domaine]() ainsi que le début de notre implémentation, on peux se rendre compte d'une certaine répétitivité dans la définition de nos objets, on voit facilement émerger (dans le cas d'une implémentation très simpliste du modèle CQRS) plusieurs motifs tels que:
  
  * A chaque méthode de nos entités (`Entity`) correspond la définition d'un évènement (`Event`) constitué des mêmes attributs que les paramètres de la méthode plus l'identifiant de l'entité
  * A pour chaque type d'évènement il est nécessaire d'avoir un `Eventhandler` associé qui pourra par exemple affecter à chaque champs de nos entités la valeur de l'attributs correspondant. Il pourra aussi vérifier que l'évènement s'applique bien à l'entité propriétaire de l'évènement.
  * A chaque méthode de nos entités correspond la définition d'une commande (`Command`) constitué des mêmes attributs
  * A pour chaque type de `Command` il est nécessaire d'avoir un `Eventhandler` associé qui pourra par exemple affecter à chaque champs de nos entités la valeur de l'attributs correspondant

  Il apparait que quasiment tous nos éléments (`Entity`, `Event`, `EventHandler`, `Command`, `CommandHandler`, `Repository` ...) pourraient être générés automatiquement à partir d'un unique modèle. Ceci simplifierait et accélérerait leurs écritures. Dans cet article, nous allons nous efforcer de définir le [DSL](http://martinfowler.com/bliki/DomainSpecificLanguage.html) qui permettra de définir simplement et intuitivement notre modèle unique.

--- 

{{ page.excerpt | markdownify }}
 
Avant de générer les différents éléments pour notre approche CQRS, nous nous interesserons à définir la syntaxe de notre DSL. Ensuite nous verrons comment, tout en restant sur la plateforme [NodeJS] nous pourrons transformé un modèle décrit par notre DSL en un modèle utilisable pour un générateur de code lui-aussi sur plateforme NodeJS.

Cette approche est très similaire à l'approche pronée par le [MDA](http://fr.wikipedia.org/wiki/Model_driven_architecture) et les différentes phases PIM PAM POUM... (en fait le modèle *CIM* correspond à notre *DSL*, le modèle *PIM* correspondra à l'interpretation de notre DSL en un modèle nous permettant de générer notre *PSM* à partir d'un moteur de template).

## DSL et Convention de génération / transformation

Avant de définir notre DSL, interessons nous à quelques conventions qui nous permettrons de définir un unique modèle permettant la génération des différents éléments "CQRS" lié à une entité: `AggregateRoot`, `Event` ...

Reprenons la description des `Story` que nous avions obtenu à la fin de l'article [3.5 - Notre Domaine]() 

{% highlight scala %}
aggregateRoot Story extends CommentContainer {
  factory def create(story_id:StoryId, project_id:ProjectId, 
                     story_title:String, story_description:String);

  def change_complexity(complexity:Integer)
  def change_business_value(value:Integer)
  def change_title(title:String)
  def change_description(description:String)
}
{% endhighlight %}

<br />

{% highlight scala %}
event StoryCreated(story_id:StoryId, project_id:ProjectId, 
                   story_title:String, story_description:String)
event StoryComplexityChanged(story_id:StoryId, complexity:Integer)
event StoryBusinessValueChanged(story_id:StoryId, value:Integer)
event StoryTitleChanged(story_id:StoryId, title:String)
event StoryDescriptionChanged(story_id:StoryId, description:String)
{% endhighlight %}

Nous simplifierons cela en definissant un unique modèle comme suit:

{% highlight scala %}
aggregateRoot Story extends HasComment {
  factory create(story_id:StoryId, project_id:ProjectId, 
                 story_title:String, story_description:String)

  def change_complexity(complexity:Integer)
  def change_business_value(value:Integer)
  def change_title(title:String)
  def change_description(description:String)
}
{% endhighlight %}

Nous prendrons comme convention de

* écrire les noms des classes en *[CamelCase](http://fr.wikipedia.org/wiki/CamelCase)* par exemple `MaBelleClasse`
* écrire les noms des variables en minuscule avec un `_` comme séparateur de mots `ma_belle_classe`, nous qualifierons cette écriture de *UnderscoreCase*.

En considérant que nos méthodes sont écrites sous la forme `<verb>_<something>`, on peux facilement générer les évènements comme suit:

1. prefixant par le nom de l'entité
2. en mettant le verbe au participe passé et en transformant le tout en [CamelCase](http://fr.wikipedia.org/wiki/CamelCase)
3. en prenant comme convention que le type d'identifiant d'une entité s'écrit `<entity_name>Id`
4. une variable correspondant à l'identifiant d'une `Entity` s'écrit `<entity_name>_id` en UnderscoreCase par exemple `MaBelleClasse` devient `ma_belle_classe_id`
5. en reprenant les mêmes paramètres et en ajoutant l'identifiant de l'entité en premier argument avec la rêgle 4.

du coup:

* `change_complexity` devient `StoryComplexityChanged` en suivant les rêgles *1.* et *2.*.
* et en suivant les rêgles *3.*, *4.* et *5.*, les arguments deviennent: `story_id:StoryId, complexity:Integer`

Avec ces rêgles, on arrive donc bien à générer les différents évènements lié à la `Story`.
Le dernier cas, concerne la méthode `factory`, il suffit de modifier légèrement la rêgle *5.* en vérifiant qu'une variable respectant la rêgle *4.* n'est pas déjà présente.

## Lexer et Parser ou comment lire notre DSL

Avant de générer notre code, il est nécessaire d'interpreter notre DSL en un modèle facilement manipulable pour la génération de code. La méthode tradtionnelle consiste à découper cette phase en deux étapes: l'*analyse lexicale* et l'*analyse syntaxique*.

*L'analyse lexicale* consiste à transformer le flux de caractère constituant notre script en une suite de lexème c'est à dire en unité lexicale ou mot.

Ainsi le flux de caractère:

{% highlight java %}
[ 'a', 'g', 'g', 'r', 'e', 'g', 'a', 't', 'e', 'R', 'o', 
  'o', 't', ' ', 'S', 't', 'o', 'r', 'y', ' ', 'e', 'x', 
  't', 'e', 'n', 'd', 's', ' ', 'H', 'a', 's', 'C', 'o', 
  'm', 'm', 'e', 'n', 't', ' ', '{' ...]
{% endhighlight %}

Pourra être transformé par le lexer en la suite de lexème suivante:

{% highlight java %}
[ T("aggregateRoot"), T(" "), T("Story"), T(" "),
  T("extends"), T(" "), T("HasComment"), T(" ")
  T("{") ...]
{% endhighlight %}

Bien que cette suite de lexème facilite l'interpretation, elle n'en reste pas moins fastidieuse. Afin de faciliter le traitement de ces élèments, le lexer peux aussi associer à chaque élèment un type. 

Ce type permettra ainsi de manipuler l'élèment de manière plus souple et surtout plus intelligente. Ainsi le caractère '{' peut être marqué comme élément de ponctuation. Les espaces peuvent aussi être ignorés car hormis comme séparateur, ils ne présentent plus aucun interêt une fois les lexèmes construits (nous verrons par la suite comment conservé les espaces lorsqu'ils sont dans une chaîne de caractère "..."). Il est aussi possible de définir les mots clés de notre langage, comme: `aggregateRoot` et `extends`, on notera alors leur type respectivement AGGREGATE` et `EXTENDS`.

Profitons en pour définir le format de nos identifiant utilisé pour le nom de nos variable et nom de nos classes:
une suite de caractère peut être considérée comme identifiant si elle est consituté uniquement des caractères 'a' ... 'z', 'A' ... 'Z', '0' ... '9', '_' et '-'.
 
Notre suite de lexème peux alors être réduite en sortie du lexer à:

{% highlight java %}
[ AGGREGATE, IDENTIFIER("Story"), 
  EXTENDS, IDENTIFIER("HasComment"), 
  '{' ...]
{% endhighlight %}

Voici, par exemple, la définition de quelques types de lexème:

{% highlight scala %}
"{"              return '{'
"aggregateRoot"  return 'AGGREGATE'
"extends"        return 'EXTENDS'
[A-Za-z_0-9-]+   return 'IDENTIFIER';
{% endhighlight %}


Une fois ces lexèmes émis, il est temps d'effectuer l'analyse syntaxique. Elle définit les rêgles indiquant comment interpreter chaque suite de lexème. Il s'agit de la partie la plus complexe puisqu'il est nécessaire de s'assurer que chaque enchainement de lexème conduit bien à une unique interpretation.
Ces enchainements sont définis par des rêgles. Chaque rêgle peut être consititué d'une suite de lexème ou d'appel à d'autre rêgles.

Voici, par exemple, le début de la rêgle permettant de définir la déclaration d'un aggrégat:

{% highlight scala %}
aggregate
  : AGGREGATE IDENTIFIER EXTENDS IDENTIFIER {
    ...
  ;
{% endhighlight %}

Notre rêgle s'appelle 'aggregate' et commence à partir du `:`. Pour qu'une suite de lexème obéisse à cette rêgle elle doit commencée par le mot clé de type `AGGREGATE` suivit d'un lexème de type `IDENTIFIER` correspondant au nom de l'aggregat, ce nom sera suivit du mot clé 'extends' et d'un lexème de type `IDENTIFIER` correspondant au nom de la classe parente dont hérite notre aggrégat.

Si l'on souhaite rendre l'héritage optionnel, la rêgle peux alors être modifiée comme suit:

{% highlight scala %}
aggregate
  : AGGREGATE IDENTIFIER (EXTENDS IDENTIFIER)? {
    ...
  ;
{% endhighlight %}

L'écriture du lexer et du parser correspondant à nos rêgles est une étape encore plus fastidieuse que de définir ces rêgles. Heureusement, il existe de nombreuse librairies permettant à partir d'une grammaire (l'ensemble des rêgles du lexer et des rêgles du parser) de générer le lexer et le parser correspondant. Il existe plusieurs syntaxes de grammaire, la plus connue étant la [BNF](http://fr.wikipedia.org/wiki/Backus_Naur_Form).

Afin de continuer sur notre lancée, nous allons tenter de trouver une telle librairie fonctionnant sous NodeJS. Bien que ce ne soit pas gagné d'avance, j'ai eu l'agréable surprise de trouver la librairie [Jison](http://zaach.github.com/jison/docs/#the-concepts-of-jison) qui fournit exactement ce que nous cherchons. Même si la syntaxe de la grammaire peux changer d'une librairie à l'autre, le principe reste généralement le même, et l'apprentissage est facilité lorsqu'on a déjà mis les mains dedans.
Pour les développeurs Java, je vous conseille la librairie [Antlr](http://antlr.org/) qui est très bien documentée.

<blockquote><p>The process of parsing a language involves two phases: lexical analysis (tokenizing) and parsing, which the Lex/Yacc and Flex/Bison combinations are famous for. Jison lets you specify a parser much like you would using Bison/Flex, with separate files for tokenization rules and for the language grammar, or with the tokenization rules embedded in the main grammar.</p><small>[Specifying a Language - Jison](http://zaach.github.com/jison/docs/#the-concepts-of-jison)</small></blockquote>

### Le lexer

Commençons par définir les rêgles de notre lexer.

{% highlight antlr linenos %}
%lex
digit                       [0-9]
esc                         "\\"
int                         "-"?(?:[0-9]|[1-9][0-9]+)
exp                         (?:[eE][-+]?[0-9]+)
frac                        (?:\.[0-9]+)

%%
\s+                                           /* skip whitespace */
\/\/[^\n]*                                    /* skip comment */
":"                                           return ':'
","                                           return ','
"("                                           return '('
")"                                           return ')'
"{"                                           return '{'
"}"                                           return '}'
"["                                           return '['
"]"                                           return ']'
"aggregateRoot"                               return 'AGGREGATE'
"def"                                         return 'DEF'
"extends"                                     return 'EXTENDS'
"factory"                                     return 'FACTORY'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\" return 'STRING_LIT';
{int}{frac}?{exp}?\b                          return 'NUMBER_LIT';
[A-Za-z_0-9-]+                                return 'IDENTIFIER';
<<EOF>>                                       return 'EOF';

/lex

{% endhighlight %}

Il s'agit de rêgles quasiment standards que l'on retrouve très souvent, à l'exception de la définition de nos mots clés `aggregateRoot`, `def`, `extends` et `factory`.

Les premières rêgles `digit`, `esc`, `int`, `exp` et `frac` ne sont par réellement des rêgles mais corresponde à des artifices permettant d'ècrire les rêgles de notre lexer de manière plus _lisible_.
Ainsi la rêgle définissant un nombre litéral `{int}{frac}?{exp}?\b ` est identique à `"-"?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b` ce qui est un peu moins lisible et compréhensible. La première indique qu'un nombre est constitué d'une partie entière (éventuellent un signe `-` suivit de chiffre), optionellement (`?`) une partie décimale (commençant par "." suivit de chiffre), et enfin éventuellement (`?`) un exposant (commençant par `e` ou `E`, le signe `+` ou `-` suivit de chiffre).

La définition la plus compliquée consiste en la définition des chaînes de caractère litérale. La définition indique que tout ce qui est entre `"` fait partie d'une chaine de caractères, ainsi que les caractères spéciaux (`\n`, `\t` ... ) et les caractères unicodes `\u0007`.... Les commentaires unilignes sont aussi gérés lorsque la séquence commence par `//` jusqu'au prochain saut de ligne.

### Le parser

Continuons l'écriture de notre grammaire avec l'écriture de notre première rêgle. Cette rêgle est la rêgle racine qui décrira la structure complète d'un fichier conforme à notre DSL. 

#### Généralité

Une rêgle de parser se définit par son nom &lt;rule_name&gt; suivit de ':' puis plusieurs alternatives possibles séparées par `|` et se termine par `;`.

{% highlight antlr linenos %}
<rule_name>
  : <case_1>
  | <case_2>
  | <case_3>
  ;
{% endhighlight %}

Une alternative de rêgle peut être composé de lexème ou de l'invocation d'autre rêgle, voir de la même rêgle (définition récursive).

Prenons l'exemple de rêgle definissant un tableau (rêgle `array`) d'identifiant. Un tableau est définit par une liste d'éléments (rêgle `elementList`) entourée par les caractères `[` et  `]`, et séparés les uns des autres par un ou plusieurs espaces. Chaque élément est de type `IDENTIFIER` (rêgle `element`). Par exemple: `[ pim pam poum ]`. 
Les rêgles correspondantes s'écrivent alors:

{% highlight antlr linenos %}
array:
  : '[' elementList ']'
  ;

elementList
  : element elementList
  | element
  ;

element:
  IDENTIFIER
  ;
{% endhighlight %}

Une liste d'élément est définit de manière recursive (ligne 6): une liste est consitué d'un élément suivit d'une suite d'éléments: `elementList` permet de réinvoquer la rêgle au sein de celle-ci. Le critère d'arrêt est alors un unique (le dernier) élément (ligne 7).
Appliqué à l'exemple précédent on obtient en remontant la pile de recursion:

{% highlight scala %}
          poum   ~~> element=poum
     pam [poum]  ~~> element=pam  elementList=[poum]
pim [pam  poum]  ~~> element=pim  elementList=[pam poum]
{% endhighlight %}

Interessons-nous maintenant à construire le résultat de notre rêgle dans un format manipulable. Chaque partie d'une rêgle peut être manipulée par l'utilisation de la variable `$i` où `i` correspond à l'index (démarrant à 1) de la partie dans la sous-rêgle. Le résultat d'une rêgle correspond à la variable `$$`.

Réécrivons alors nos rêgles précdentes comme suit:

{% highlight antlr linenos %}
array:
  : '[' elementList ']'
    { $$=$2 }
  ;

elementList
  : element elementList
    {$$ = $2; $2.unshift($1);}
  | element
    {$$ = [$1];}
  ;

element:
  IDENTIFIER
    {$$ = $1;}
  ;
{% endhighlight %}

Ligne 3, le résultat de notre rêgle `array` correspondra au contenu de notre partie `elementList` représenté par la variable `$2`, en d'autres termes on enlève les accolades pour ne garder que le contenu.
Ligne 10, si notre liste est constitué d'un seul élèment (le dernier), alors le résultat de notre rêgle sera un tableau constitué de cet unique élément. Ligne 8, le résultat de notre rêgle sera la liste déjà construite `$2` (`elementList`) à laquelle l'élèment sera ajouté: `$2.unshift($1)`.

#### Les premières rêgles de notre DSL (et sans sautes d'humeur)

Appliquons cela à notre DSL.

Nous commencerons simplement par la possibilité, au sein du même fichier, de pouvoir définir plusieurs `aggregateRoot`, et ce, jusqu'à atteindre la fin du fichier `EOF` (lignes 1 à 3). En reprenant le mécanisme de liste décrit précédement, nous définissons que notre fichier est constitué d'un enchainement de déclaration `aggregateRoot` (lignes 5 à 10).
Finalement les lignes 12 à 15, définisse la déclaration d'un aggrégat, constitué de la séquence mot clé `aggregateRoot` puis d'un lexème de type `IDENTIFIER`.
La déclaration optionelle d'une super classe se fait le biais d'une rêgle dédiée `optional_extends`.
Enfin le corps (`body`) de notre aggregat sera délimité par les lexèmes `{` et `}`.

{% highlight antlr linenos %}
file
  : aggregateDefList EOF
  ;

aggregateDefList
  : aggregateDef aggregateDefList
    {$$ = $2; $2.unshift($1);}
  | aggregateDef
    {$$ = [$1];}
  ;

aggregateDef
  : AGGREGATE IDENTIFIER optional_extends '{' '}'
    {$$ = [$2,$3];}
  ;

optional_extends
  : EXTENDS IDENTIFIER
    {$$ = [$2];}
  | 
    {$$ = [];}
  ;
{% endhighlight %}


### Un peu d'action!

Crééons un nouveau projet dédié à notre DSL

{% highlight bash %}
$ cd ~/Projects
$ mkdir dsl-build
$ cd dsl-build
{% endhighlight %}

`package.json`

{% highlight javascript %}
{
  "author": "Arnauld",
  "name": "cqrs-mda",
  "description": "Code generator for CQRS",
  "version": "0.0.1",
  "repository": {
    "url": ""
  },
  "engines": {
    "node": "*"
  },
  "dependencies": {
    "jison": "0.2.11",
    "nodeunit": "*"
  },
  "devDependencies": {},
  "main": "app.js"
}
{% endhighlight %}

{% highlight bash %}
$ npm install nodeunit
$ npm update
{% endhighlight %}

A cause d'un problème de version, `jison` ne peux être installé avec la version de NodeJS `0.6.2`. Pour le faire, il suffit de l'installer à partir d'une version modifiée

{% highlight bash %}
$ cd ~/Projects/nodejs-modules
$ git clone git://github.com/zaach/jison.git
$ mate package.json
{% endhighlight %}

Et rajouter la version `0.6` dans la liste:

{% highlight bash %}
    ...
    "engines": {
        "node": "0.4 || 0.5 || 0.6"
      },
    ...
{% endhighlight %}

L'installation se fait alors en spécifiant le chemin du module

{% highlight bash %}
$ cd ~/Projects/dsl-build
$ npm install ~/Projects/nodejs-modules/jison/
{% endhighlight %}

Définissons notre grammaire dans le fichier `lib/cqrs.y` en recopiant les rêgles décrites auparavant.
Le contenu peut être obtenu [ici]("/documents/post/tbd-in-practice/cqrs-00.y").

Le lexer et le parser peuvent être alors générés (le fichier généré `cqrs.js` est ensuite déplacé et renomé en `lib/parser.js`):

{% highlight bash %}
$ ./node_modules/.bin/jison lib/cqrs.y
$  mv cqrs.js lib/parser.js
{% endhighlight %}

Commençons par écrire un test très simple:

`test/basic-test.js`

{% highlight javascript %}
var parser = require('../lib/parser').parser;

var toString = function(input, indent) {
    return JSON.stringify(input, null, indent||"    ");
};

exports["Simple input can be parsed"] = function (test) {
  var input  = 'aggregateRoot Story extends HasComment {}';
  var parsed = parser.parse(input);
  console.log("Parsed=" + toString(parsed));

    test.done();
};
{% endhighlight %}

En lançant les tests, on obtient alors:

{% highlight bash %}
$ node_modules/.bin/nodeunit test

basic-test
Parsed=[
    [
        "Story",
        "HasComment"
    ]
]
✔ Simple input can be parsed

OK: 0 assertions (9ms)
{% endhighlight %}

Nous arrivons donc bien à parser et interpréter notre DSL. 

### Et mes structures de données?

Rajoutons maintenant, la possibilité de crééer nos propres structures au sein d'une rêgle au lieu d'un tableau.

<span class="label notice">Note</span> Cette structure nous servira ensuite de modèle alimentant la génération de code.

<blockquote><p>...the parser has a yy property which is exposed to actions as the yy free variable. Any functionality attached to this property is available in both lexical and semantic actions through the yy free variable.
... The scope module contains logic for building data structures, which is used within the semantic actions.</p><small><a href="http://zaach.github.com/jison/docs/#sharing-scope">Sharing scope - Jison</a></small></blockquote>

Créons donc un fichier `lib/models.js` contenant l'ébauche d'une structure pour nos aggrégat:

{% highlight javascript %}
exports.aggregate_root = function(identifier, inherits) {
  this.type = "aggregate_root";
  this.name = identifier;
  this.inherits = inherits;
};
{% endhighlight %}

Et transformons, notre tests afin de prendre en compte cette nouvelle structure en définissant la variable `yy` avec notre modèle:

`test/basic-test.js`

{% highlight javascript %}
var parser = require('../lib/parser').parser;
// set parser's shared scope
parser.yy = require("../lib/models");

...
{% endhighlight %}

Nous pouvons désormais modifier le résultat de la rêgle définissant un aggrégat afin de créer notre propre structure de données:

{% highlight antlr linenos %}
...

aggregateDef
  : AGGREGATE IDENTIFIER optional_extends '{' '}'
    {$$ = new yy.aggregate_root($2,$3);}
  ;
{% endhighlight %}

<span class="label warning">Attention</span> n'oubliez pas de regénérer le parser à chaque changement de grammaire.

{% highlight bash %}
$ ./node_modules/.bin/jison lib/cqrs.y && mv cqrs.js lib/parser.js
$ node_modules/.bin/nodeunit test

basic-test
Parsed=[
    {
        "type": "aggregate_root",
        "name": "Story",
        "inherits": "HasComment"
    }
]
✔ Simple input can be parsed

OK: 0 assertions (10ms)
{% endhighlight %}

Modifions finalement notre test afin de le rendre un peu plus utile. Et rajoutons le cas de plusieurs aggrégats dans le même flux de données.

{% highlight javascript %}
var parser = require('../lib/parser').parser;
var models = require('../lib/models');

// set parser's shared scope
parser.yy = models;

var toString = function(input, indent) {
    return JSON.stringify(input, null, indent||"    ");
};

exports["Simple input can be parsed"] = function (test) {
  var input  = 'aggregateRoot Story extends HasComment {}';
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 1);

  var element = parsed[0];
  test.ok(element instanceof models.aggregate_root);
  test.strictEqual(element.type, "aggregate_root");
  test.strictEqual(element.name, "Story");
  test.ok(element.inherits instanceof Array);
  test.strictEqual(element.inherits.length, 1);
  test.strictEqual(element.inherits[0], "HasComment");
  test.done();
};

exports["Multiple but simple aggregates can be parsed"] = function (test) {
  var input  = ['aggregateRoot Story extends HasComment {}',
                'aggregateRoot StoryWithNoParent {}',
               ].join("\n");
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 2);

  var element1 = parsed[0];
  test.ok(element1 instanceof models.aggregate_root);
  test.strictEqual(element1.type, "aggregate_root");
  test.strictEqual(element1.name, "Story");
  test.ok(element1.inherits instanceof Array);
  test.strictEqual(element1.inherits.length, 1);
  test.strictEqual(element1.inherits[0], "HasComment");

  var element2 = parsed[1];
  test.ok(element2 instanceof models.aggregate_root);
  test.strictEqual(element2.type, "aggregate_root");
  test.strictEqual(element2.name, "StoryWithNoParent");
  test.ok(element2.inherits instanceof Array);
  test.strictEqual(element2.inherits.length, 0);

  test.done();
};
{% endhighlight %}

Relançons les tests, et nous obtenons:

{% highlight bash %}
$ node_modules/.bin/nodeunit test

basic-test
✔ Simple input can be parsed
✔ Multiple but simple aggregates can be parsed

OK: 21 assertions (13ms)

{% endhighlight %}

### Et nos méthodes ?

<span class="label notice">Rappel</span>
{% highlight scala %}
aggregateRoot Story extends HasComment {
  factory create(story_id:StoryId, project_id:ProjectId, 
                 story_title:String, story_description:String)

  def change_complexity(complexity:Integer)
  def change_business_value(value:Integer)
  def change_title(title:String)
  def change_description(description:String)
}
{% endhighlight %}

Enrichissons maintenant notre grammaire afin de pouvoir définir les caractérisques comportementales (_behavioral feature_; typiquement les méthodes fonctionnelles) de chaque aggrégat. Nous ajouterons ensuite les caractéristiques structurelles (_structural feature_; les champs ou propriétés de la classe sous-jacente).

Ajoutons les rêgles suivantes:

{% highlight antlr linenos %}
featureList
  : feature featureList
    {$$ = $2; $2.unshift($1);}
  | feature
    {$$ = [$1];}
  | 
    {$$ = [];}
  ;

feature
  : behavioralFeature
    {$$=$1;}
  ;

behavioralFeature
  : DEF      identifier '(' argumentList ')'
    {$$ = new yy.def($2, $4);}
  | FACTORY  identifier '(' argumentList ')'
    {$$ = new yy.factory($2, $4);}
  ;

argumentList
  : argument ',' argumentList
    {$$ = $3; $3.unshift($1);}
  | argument
    {$$ = [$1];}
  | 
    {$$ = [];}
  ;

argument
  : identifier ':' identifier
    {$$ = new yy.argument($1, $3);}
  ;

identifier
  : IDENTIFIER
    {$$ = yytext;}
  ;
{% endhighlight %}

On retrouve encore une fois le motif de construction d'une suite d'élément (lignes 1 à 8). Cette suite est constituée uniquement d'élément de type `behavioralFeature` (lignes 10 à 13). On distingue alors deux types de méthodes selon le mot clé présent en première position et l'on créé la structure correspondante `new yy.def` ou `new yy.factory`. Les arguments de ces méthodes suivent eux aussi le motif de construction d'une suite (ligne 22 à 29), le cas particulier de l'absence de paramètre est géré (lignes 27 et 28) afin d'avoir toujours un tableau même vide d'élément. 

puis modifions la rêgle `aggregateRoot` afin de prendre en compte ces nouvelles rêgles:

{% highlight antlr linenos %}
aggregateDef
  : AGGREGATE IDENTIFIER optional_extends '{' 
      featureList
    '}'
    {$$ = new yy.aggregate_root($2,$3,$5);}
  ;
{% endhighlight %}

La liste des `features` est ajoutée entre les accolades de notre aggrégat. Et cette liste (éventuellement vide) est fournit au constructeur de notre structure (`$5`). Finalement, modifions notre structure de données et ajoutons les trois nouvelles structures.

`lib/models.js`

{% highlight javascript %}
exports.aggregate_root = function(identifier, inherits, features) {
  this.type = "aggregate_root";
  this.name = identifier;
  this.inherits = inherits;
  this.features = features;
};

exports.def = function(name, arguments) {
  this.type = "def";
  this.name = identifier;
  this.arguments = arguments;
};

exports.factory = function(name, arguments) {
  this.type = "factory";
  this.name = identifier;
  this.arguments = arguments;
};

exports.argument = function(argument_name, argument_type) {
  this.type = "argument";
  this.argument_name = argument_name;
  this.argument_type = argument_type;
};
{% endhighlight %}

Re-générons notre parser avec notre nouvelle grammaire:

{% highlight bash %}
$ ./node_modules/.bin/jison lib/cqrs.y && mv cqrs.js lib/parser.js

Conflict in grammar: multiple actions possible when lookahead token is } in state 14
- reduce by rule: featureList -> 
- reduce by rule: featureList -> feature

States with conflicts:
State 14
  featureList -> feature .featureList #lookaheads= }
  featureList -> feature . #lookaheads= }
  featureList -> .feature featureList
  featureList -> .feature
  featureList -> . #lookaheads= }
  feature -> .behavioralFeature
  behavioralFeature -> .DEF identifier ( argumentList )
  behavioralFeature -> .FACTORY identifier ( argumentList )
{% endhighlight %}

Oooops... nous voila donc face à un petit soucis. Le soucis semble provenir de la possibilité de n'avoir aucun élément dans notre liste `featureList`. Si l'on supprime cette alternative, il n'y a plus de conflit, mais nos tests précédents ne passent plus puisqu'il est nécessaire d'avoir au moins une déclaration de comportement. Même si fonctionnellement une entité aura toujours au moins une déclaration de comportement, cette solution n'est pas intellectuellement acceptable.
Modifions légèrement les rêgles afin de permettre les deux situations:

{% highlight antlr linenos %}
aggregateDef
  : AGGREGATE identifier optional_extends '{' '}'
    {$$ = new yy.aggregate_root($2,$3,[]);}
  | AGGREGATE identifier optional_extends '{' 
      featureList
    '}'
    {$$ = new yy.aggregate_root($2,$3,$5);}
  ;

...

featureList
  : feature featureList
    {$$ = $2; $2.unshift($1);}
  | feature
    {$$ = [$1];}
  ;
{% endhighlight %}

Le cas de l'absence de comportement est géré au niveau de l'aggrégat par l'alternative lignes 2 et 3.

{% highlight bash %}
$ ./node_modules/.bin/jison lib/cqrs.y && mv cqrs.js lib/parser.js
$ node_modules/.bin/nodeunit test

basic-test
✔ Simple input can be parsed
✔ Multiple but simple aggregates can be parsed
{
    "type": "aggregate_root",
    "name": "Story",
    "inherits": [
        "HasComment"
    ],
    "features": [
        {
            "type": "factory",
            "name": "create",
            "arguments": [
                {
                    "type": "argument",
                    "argument_name": "story_id",
                    "argument_type": "StoryId"
                },
                {
                    "type": "argument",
                    "argument_name": "story_title",
                    "argument_type": "String"
                }
            ]
        },
        {
            "type": "def",
            "name": "change_complexity",
            "arguments": [
                {
                    "type": "argument",
                    "argument_name": "complexity",
                    "argument_type": "Integer"
                }
            ]
        },
        {
            "type": "def",
            "name": "change_business_value",
            "arguments": [
                {
                    "type": "argument",
                    "argument_name": "value",
                    "argument_type": "Integer"
                }
            ]
        }
    ]
}
✔ Aggregate with defs and factory can be parsed

OK: 29 assertions (13ms)
{% endhighlight %}

*Et voila!*

Pour finir ajoutons de quoi stocker des informations au niveau de nos aggrégats en permettant la définition de champs (_structural behavior_). 

{% highlight scala %}
aggregateRoot Story extends HasComment {
  title:String
  description:String

  factory create(story_id:StoryId, project_id:ProjectId, 
                 story_title:String, story_description:String)

  def change_title(title:String)
  def change_description(description:String)
}
{% endhighlight %}

Ajoutons l'alternative correspondante dans la rêgle `feature`:

{% highlight antlr linenos %}

...

feature
  : behavioralFeature
    {$$=$1;}
  | structuralFeature
    {$$=$1;}
  ;

structuralFeature
  : identifier ':' identifier
    {$$ = new yy.field($1, $3);}
  ;
{% endhighlight %}


