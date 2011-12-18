---
layout: post
title: "[T|B|D]DD par la pratique 7.2 - Code generation"
category: tbd-in-practice
tags:
  - nodejs
  - javascript
  - dsl
  - code-gen
  - mda
  - sslac.js
  - underscore.js
published: true
comments: true
excerpt: |
  Après avoir mis en place l'interpretation de notre DSL en un modèle manipulable en javascript. Nous allons nous atteler à exploiter et enrichir ce modèle pour générer le maximum de chose possible pour notre application. Le modèle généré ne sera certainement pas complet mais devrait permettre d'accélerer notre développement.

  Il est évident que les méthodes fonctionnelles complexes ne pourront pas être gérées de cette manière, mais nous aurons tout de même une bonne partie du squelette qui sera généré. Par ailleurs notre approche restera très simple, et nous nous contenterons d'une approche de type _one shot generation_, c'est à dire que nous ne nous interesserons pas à la gestion de la personnalisation du code généré, ce sera à la charge du développeurs de faire ses modifications manuellement.

  Avant de définir les modèles de génération, nous allons en profiter pour nous baser sur une librairie javascript facilitant la définition de classe. Après quelques recherches, j'opte pour [Sslac](https://github.com/jakobo/sslac).

  Comme moteur de template, j'opte pour le moteur fournit (entre autre) par la librarie [underscore](http://documentcloud.github.com/underscore/#template) qui permet de bénéficier de tout l'environement javascript dans le template. Ceci n'est pas conforme à la séparation stricte modèle-vue, comme prônée par [StringTemplate](http://stringtemplate.org/about.html), mais permet une plus grande souplesse dans la rédaction de nos templates.

  `npm install underscore`


  Nous utiliserons aussi la librairie [underscore.string](https://github.com/epeli/underscore.string) pour manipuler les chaînes de caractères (CamelCase, UnderscoreCase ...).

  `npm install underscore.string`

--- 

{{ page.excerpt | markdownify }}

La première version de notre générateur de code (et peut être la seule) sera très simple, il s'appuiera sur les transformations successives suivantes:

* Lecture d'un flux décrivant notre domaine via notre DSL
* Interpretation du flux via le parser définit dans la partie précédente de cet article
* L'objet javascript ainsi généré est passé à travers la chaine de transformation fournie en paramètre
* Certaine transformation applique un template `underscore`, ce qui générera le code correspondant, tandis que d'autre peuvent transformer un objet javascript en un autre, ou tout simplement l'enrichir.

Commençons par écrire notre machine à transformer:

`lib/code-gen.js`

{% highlight javascript linenos %}
var parser = require("./parser").parser;
// set parser's shared scope
parser.yy = require("./models");

var toString = function(input, indent) {
    return JSON.stringify(input, null, indent||"    ");
};

var noop_transformer = function() {
    return { 
        "transform" : function(model, output, chain) {},
        "next"      : null
    }; 
};

var create_transformer = function(transformation, next) {
    return {
        "transform" : require('./transformation/'+transformation).transform,
        "next"      : next
    };
};

var main = exports.main = function (args) {
    var fs  = require("fs");
    if (!args[1]) {
        throw new Error("Usage: " + args[0] + " <cqrs-file> [<transformation>]*");
    }
    var input  = fs.readFileSync(args[1], 'utf8');
    var parsed = parser.parse(input);

    if(args[2]) {
        var _ = require('underscore');
        var output = console.log;
        var first  = _.foldr(args.slice(2), function(next, transformation) {
            return create_transformer(transformation, next);
        }, noop_transformer());

        first.transform(parsed, output, first.next);
    }
    else {
        console.log(toString(parsed));        
    }
};

main(process.argv.slice(1));
{% endhighlight %}

* Les lignes 1 à 8 devraient désormais être familières. On déclare et configure (ligne 3) notre parser. Et on se créé une méthode utilitaire pour convertir un objet Javascript en chaîne de caractère.
* Lignes 9 à 14, nous definissons un maillon, de notre chaine de transformation, qui n'a aucun effet. Il pourra servir de transformation finale dans notre chaine: `transform` definit la transformation à appliquer et `next` fournit la transformation suivante de la chaine.
* Lignes 16 à 21, nous permettons de créer un maillon à partir d'une transformation, et du maillon suivant à invoquer. Le nom de la transformation est utilisé pour charger le fichier correspondant, nous considererons que nos transformations se trouvent dans `lib/transformation/`. 
* Ligne 24 on déclare l'utilisateur du module `fs` qui nous permettra de lire le fichier écrit à l'aide de notre DSL (ligne 28).
* Ligne 29, le contenu du fichier lu est transformé grâce à notre parser en objet javascript.
* Si l'on a specifié au moins un fichier de transformation (ligne 31), la chaîne de transformation est construite en parcourant la liste depuis la fin et reduisant les entrées une à une en les chainant entre elles: lignes 34 à 36 ([reduceRight](http://documentcloud.github.com/underscore/#reduceRight) aka `foldRight`, quelques explications en français ici: [foldleft et foldright](http://www.arolla.fr/blog/2011/10/listes-scala-methodes-foldleft-et-foldright/)). Ligne 36, la réduction est initialisée avec la transformation sans effet. La chaine de transformation est démarée ligne 38.
* Si aucune transformation n'est spécifiée, le contenu du modèle est affiché dans notre console (ligne 41).
* Enfin la ligne 45 sera celle invoquée par la ligne de commande.

Crééons nos premiers fichier de données de test:

`data/sample00.cqrs`

{% highlight javascript %}
aggregateRoot Story {
    def change_complexity(complexity:Integer)
}
{% endhighlight %}

`data/sample01.cqrs`

{% highlight javascript %}
aggregateRoot Story {
    def change_complexity(complexity:Integer)
}
aggregateRoot Project {
    def activate()
}
{% endhighlight %}


Ainsi que nos deux première transformations: la première (`forEach`) prend une liste de modèle et applique pour chaque élément la suite de la transformation, la seconde (`dump`) se contentera d'afficher le contenu du modèle fournit.

`lib/transformation/forEach.js`

{% highlight javascript %}
var asArray = function(model) {
    if(typeof model === 'object' && model instanceof Array) {
        return model;
    }
    else {
        return [model];
    }
};

var transform = exports.transform = function(model, output, next) {
  if(next === null) {
    return;
  }

  asArray(model).forEach(function(item) {
    next.transform(item, output, next.next);
  });
};
{% endhighlight %}

`lib/transformation/dump.js`

{% highlight javascript %}
var toString = function(input, indent) {
    return JSON.stringify(input, null, indent||"    ");
};

var transform = exports.transform = function(model, output, next) {
  output("Dump: " + toString(model));
  output("Remaining transformation(s): " + toString(next));
};
{% endhighlight %}

Invoquons alors notre superbe transformateur de modèle en enchainant nos transformations `forEach` et `dump`:

{% highlight javascript %}
$ node lib/code-gen.js data/sample01.cqrs forEach dump
Dump: {
    "type": "aggregate_root",
    "name": "Story",
    "inherits": [],
    "features": [
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
        }
    ]
}
Dump: {
    "type": "aggregate_root",
    "name": "Project",
    "inherits": [],
    "features": [
        {
            "type": "def",
            "name": "activate",
            "arguments": []
        }
    ]
}
{% endhighlight %}

On vérifie alors que notre transformation `dump` est appellée deux fois: pour chacun des modèles lus (le fichier de test `sample01.cqrs` contient en effet la déclaration de deux modèles) comme prévu par la transformation `forEach`.

Nous utiliserons le script suivant afin de simplifier le chargement et l'application de nos template:

`lib/transformation/template.js`

{% highlight javascript linenos %}
var _  = require('underscore'),
    fs = require('fs');

exports.apply_template = function(template_path, model) {
  /*
   * Allow underscore.string to be available through underscore
   * within template
   */

  // Import Underscore.string to separate object, because
  // there are conflict functions (include, reverse, contains)
  _.str = require('underscore.string');
  // Mix in non-conflict functions to Underscore namespace if you want
  _.mixin(_.str.exports());

    var template = fs.readFileSync(template_path, 'utf8');
    var compiled = _.template(template);
    return compiled(model);
};
{% endhighlight %}

Les lignes 5 à 15 permettent d'intégrer `underscore.string` et de rendre ses fonctions accessibles depuis le template. Ensuite, le template est lu depuis un fichier (ligne 16) et est compilé en template `underscore` (ligne 17).
Le modèle est passé en paramètre à notre template compilé (ligne 18): il sert alors de racine à toutes les fonctions et propriétés qui seront invoquées à travers le template. Par exemple:

{% highlight javascript linenos %}
var model = {
  hello: function() {
    return "Salut";
  },
  world: "le monde!"
};

var compiled = _.template("<%=hello()%> <%=world%>");
console.log(compiled(model));
{% endhighlight %}

affichera: `Salut le monde!`

## Notre premier template!

Notre premier template va consister à crééer les classes (en utilisant le module [Sslac](https://github.com/jakobo/sslac)) correspondant aux identités de chaque entité.

`lib/transformation/entity_id.template`

{% highlight javascript linenos %}
/**
 * <%=namespace%>.<%=id.type%>
 */
Sslac.Class("<%=namespace%>.<%=id.type%>")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;
{% endhighlight %}

* Ligne 4, nous déclarons une classe nommée à partir des propriéts `namespace` et `id` disponibles dans le contexte courant d'éxecution du script. La propriété `type` est alors lue depuis la propriété `id`.
* Ligne 5, nous faisons étendre notre classe de la classe `nscrum.Id` que nous définierons plus tard, comme faisant partie de notre librairie.
* Enfin, lignes 6 à 8, nous définissons le constructeur de notre classe prenant en paramètre un `uuid` qui se contentera d'appeller le constructeur correspondant sur la classe parente (ligne 7).

La transformation permettant d'appliquer ce template peux alors être définie par:

`lib/transformation/entity_id.js`

{% highlight javascript linenos %}
var template = require('./template');

var transform = exports.transform = function(model, output, next) {
  var template_path = __dirname + "/entity_id.template";
  var generated = template.apply_template(template_path, model);
  output(generated);
};
{% endhighlight %}

En écrivant cette transformation, je me rend compte que cela fait beaucoup de ligne qui seront dupliquée à chaque transformation impliquant un template. De plus si l'on regarde de plus près le template de génération des classes d'identifiant, on peux se rendre compte que certaines variables (comme `namespace` et `id`) ne sont pas disponibles dans le contexte du template (définit par `model`, ligne 7 de `entity_id.template`).

Nous allons en effet ajouter une transformation supplémentaire afin d'enrichir le modèle lu depuis notre DSL: de nouvelles informations précalculée viendront enrichir notre modèle afin de faciliter sa manipulation. Cet enrichissement permettra une écriture plus simple de nos template en limitant les manipulations à faire pour construire certaine valeur (comme le nom d'une variable ou d'un type qui sont dérivés du nom du modèle correspondant).

`lib/transformation/enhance.js`

{% highlight javascript linenos %}
var _  = require("underscore"),
    _s = require("underscore.string"),
    t  = require("./template");

var enhance = function(model) {
  if(model.type === "aggregate_root") {
    model.namespace = "nscrum";
    model.variable_name = _s.underscored(model.name);
    model.id = {
      type: model.name + "Id",
      variable_name: _s.underscored(model.name + "Id")
    };
  }

  t.declare_apply_template(model);
};
{% endhighlight %}

Cette transformation permet d'ajouter plusieurs propriétés sur chacune de nos entités:

* un espace de nommage (ligne 7) `nscrum` (`namespace` ou `package` en java) est définit (nous enrichirons certainement notre DSL pour intégrer cette notion directement sur notre modèle plus tard)
* une variable contenant une instance de notre entité sera nommée par défaut comme l'entité en _UnderscoreCase_ (ligne 8), par exemple `backlog_item` pour le type `BacklogItem`.
* la classe correspondant à l'identifiant d'une entité est par convention le nom de l'entité suffixé de `Id` (ligne 10) par exemple `StoryId` pour `Story`.
* une variable désignant l'identifiant d'une entité sera, comme pour l'entité, son nom en _UnderscoreCase_ (ligne 11) par exemple `backlog_item_id` pour `BacklogItemId`.
* lignes 14, nous déclarons sur le modèle lui-même une méthode permettant de lui appliquer un template. Cette méthode est ajoutée dans le module `template.js`.

`lib/transformation/template.js`

{% highlight javascript %}
...
exports.declare_apply_template = function(model) {
  model.apply_template = function(template_path) {
    var generated = apply_template(template_path, model);
    return generated;
  };
};
{% endhighlight %}


Le code correspondant au contrat de notre moteur de transformation s'écrit alors:

`lib/transformation/enhance.js`

{% highlight javascript linenos %}
var asArray = function(model) {
    if(_.isArray(model)) {
        return model;
    }
    else {
        return [model];
    }
};

var transform = exports.transform = function(models, output, next) {
  asArray(models).forEach(function(model) {
    enhance(model);
  });
  next.transform(models, output, next.next);
};
{% endhighlight %}

Modifions alors notre transformation `entity_id.js` en appellant directement la méthode `apply_template` que nous avons ajoutée sur le modèle.

{% highlight javascript linenos %}
var transform = exports.transform = function(model, output, next) {
  var generated = model.apply_template(__dirname + "/entity_id.template");
  output(generated);
};
{% endhighlight %}

Et maintenant, le résultat !?! Lançons notre chaine de transformation:

{% highlight bash %}
$ node lib/code-gen.js data/sample01.cqrs forEach enhance entity_id

/**
 * nscrum.StoryId
 */
Sslac.Class("nscrum.StoryId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;
/**
 * nscrum.ProjectId
 */
Sslac.Class("nscrum.ProjectId")
     .Extends("nscrum.Id")
     .Constructor(function (uuid) {
        this.Parent(uuid);
     })
     ;
{% endhighlight %}

Cool! nous avons réussit à générer nos deux classes d'identifiants.

## Au gré des évènements 

Interessons-nous désormais à la génération des évènements liés à chacune des méthodes de nos aggrégats. Il s'agit sans doute de l'un des templates les plus compliqués que nous aurons à écrire.

Commençons par quelques exemples de ce que nous voudrions à partir du modèle suivant:

{% highlight scala linenos %}
aggregateRoot Story extends HasComment {
  title:String
  description:String

  factory create(story_id:StoryId, 
                 story_title:String, story_description:String)

  def change_title(title:String)
  def activate()
  def affect_to_project(project_id:ProjectId)
}
{% endhighlight %}

<table>
<thead><tr><th>Méthode</th><th>Evènement</th></thead>
<tbody>
  <tr>
    <td><code>create</code></td>
    <td>
{% highlight javascript %}
nscrum.StoryCreatedEvent(story_id, story_title, 
                         story_description) {
  this.Parent("nscrum.StoryCreatedEvent", story_id);
  this.data = {
    story_title:story_title,
    story_description:story_description
  };
}
{% endhighlight %}
    </td>
  </tr>
  <tr>
    <td><code>change_title</code></td>
    <td>
{% highlight javascript %}
nscrum.StoryTitleChangedEvent(story_id, title) {
  this.Parent("nscrum.StoryTitleChangedEvent", story_id);
  this.data = {
    title:title
  };
}
{% endhighlight %}
    </td>
  </tr>
  <tr>
    <td><code>activate</code></td>
    <td>
{% highlight javascript %}
nscrum.StoryActivatedEvent(story_id) {
  this.Parent("nscrum.StoryActivatedEvent");
  this.data = {};
}
{% endhighlight %}
    </td>
  </tr>
  <tr>
    <td><code>affect_to_project</code></td>
    <td>
{% highlight javascript %}
nscrum.StoryAffectedToProjectEvent(story_id, project_id) {
  this.Parent("nscrum.StoryAffectedToEvent", story_id);
  this.data = {
    project_id:project_id
  };
}
{% endhighlight %}
    </td>
  </tr>
</tbody>
</table>

### “Un nom doit-il toujours signifier quelque chose ?” <small>&mdash; Lewis Carroll</small>

Procédons de manière empirique:

Prenons comme convention que le premier mot de la méthode est le verbe indiquant l'intention de celle-ci. Nous commençons donc par isoler le verbe du reste du nom de la méthode: `change` `complexity`. Puis, nous concatenons le nom de l'entité, la partie restante du nom de la méthode, le verbe mis au participe passé et enfin `Event` et tout ça en CamelCase: `Story` + `Complexity` + `Changed` + `Event`. 

Gérons le cas où le verbe est suivit de `to` ou de `from` en le laissant à sa position initiale mais au passé: `Story` + `Affected` + `ToProject` + `Event`.

Commençons par définir quelques utilitaires afin de générer le nom de l'évènement.

`lib/transformation/enhance.js`

{% highlight javascript linenos %}
...
var generate_event_name = 
    exports.generate_event_name = function(feature_name, model_name) {
    var parts = _s.words(feature_name.toLowerCase(), /[ \\-_]+/g);
    var verb = parts[0];
    verb = past_tense(verb);

    var remaining_index = 1;
    var in_order_mode = (parts.length>1) &&
                        (parts[1]==="to" || parts[1]==="from");
    var remaining = parts.slice(remaining_index).join("-");
    var event_name;
    if(in_order_mode) {
        event_name = model_name + "-" + verb + "-" + remaining + "-Event";
    } else {
        event_name = model_name + "-" + remaining + "-" + verb + "-Event";
    }
    return _s.camelize(_s.dasherize(event_name));
};

var past_tense = exports.past_tense = function(verb) {
  var lowered = verb.toLowerCase();
    if(_s.endsWith(lowered, "y")) {
        return verb.substring(0,verb.length-1) + "ied";
    }
    else if(_s.endsWith(lowered, "e")) {
        return verb + "d";
    }
    else if(_s.endsWith(lowered, "get")) {
        return verb.substring(0,verb.length-3) + "got";
    }
    else if(_s.endsWith(lowered, "do")) {
        return verb + "ne";
    }
    else {
        return verb + "ed";
    }
};
{% endhighlight %}

Les tests minimaux correspondant:

{% highlight javascript %}
var enhance = require('../../lib/transformation/enhance');

exports["past_tense works for simple verb"] = function(test) {
  test.strictEqual(enhance.past_tense("Modify"), "Modified");
  test.strictEqual(enhance.past_tense("Change"), "Changed");
  test.strictEqual(enhance.past_tense("Alter"),  "Altered");
  test.strictEqual(enhance.past_tense("Do"),     "Done");
  test.strictEqual(enhance.past_tense("get"),    "got");
  test.done();
};

var generate_event_name_verifier = function(test, model_name) {
  return function(feature_name, event_name) {
    var generated = enhance.generate_event_name(feature_name, model_name);
    test.strictEqual(generated, event_name);
  };
};

exports["generate_event_name: basic case"] = function(test) {
  var verify = generate_event_name_verifier(test, "Story");
  verify("change_complexity", "StoryComplexityChangedEvent");
  test.done();
}

exports["generate_event_name: verb only"] = function(test) {
  var verify = generate_event_name_verifier(test, "Story");
  verify("activate", "StoryActivatedEvent");
  verify("publish",  "StoryPublishedEvent");
  verify("rename",   "StoryRenamedEvent");
  test.done();
}

exports["generate_event_name: 'to' and 'from' case"] = function(test) {
  var verify = generate_event_name_verifier(test, "Story");
  verify("assign_to_project", "StoryAssignedToProjectEvent");
  verify("load_from_history", "StoryLoadedFromHistoryEvent");
  test.done();
}
{% endhighlight %}

Lançons les tests contenu dans le dossier `test` et le sous-dossier `test/transformation`:

{% highlight bash %}
$ node_modules/.bin/nodeunit test test/transformation

...
enhance-test
✔ past_tense works for simple verb
✔ generate_event_name: basic case
✔ generate_event_name: verb only
✔ generate_event_name: 'to' and 'from' case
...
{% endhighlight %}

### “Il est l'or, mon seignor, l'or de se réveiller...” <small>&mdash; La Folie des grandeurs</small>

Enrichissons notre modèle en ajoutant la description de l'évènement correspondant à chaque méthode.

Notre transformation d'enrichissement est modifiée pour permettre d'enrichir tous nos types de modèle: 

* les `aggregate_root`
* les “features” `def`, `factory` et `field`. 

Le code précédent est déplacé dans la fonction `enhance_aggregate_root`, nous obtenons:

`lib/transformation/enhance.js`

{% highlight javascript %}
...
var enhance = exports.enhance = function(model, enhanced_parent) {
  if(model.type === "aggregate_root") {
    enhance_aggregate_root(model);
  }
  else if(model.type === "def") {
    enhance_def(model, enhanced_parent);  
  }
  else if(model.type === "factory") {
    enhance_factory(model, enhanced_parent);
  }
  else if(model.type === "field") {
    enhance_field(model, enhanced_parent);
  }

  t.declare_apply_template(model);
};

var enhance_aggregate_root = function(model) {
  model.enhanced  = true; // flag it
  model.namespace = "nscrum";
  model.id = {
    type: model.name + "Id",
    variable_name: _s.underscored(model.name + "Id")
  };
  model.variable_name = _s.underscored(model.name);

  enhance_array(model.features).forEach(function(feature) {
    enhance(feature, model);
  });
};
{% endhighlight %}

Définissions alors nos méthodes d'enrichissement pour chaque type de “feature”.

{% highlight javascript linenos %}
var enhance_def = function(model, enhanced_parent) {
  enhance_with_event(model, enhanced_parent);
};

var enhance_factory = function(model, enhanced_parent) {
  enhance_with_event(model, enhanced_parent);
};

var enhance_field = function(model, enhanced_parent) {
};
{% endhighlight %}

A chaque “features” de type `def` et `factory` correspond un type d'évènement, nous definissons aussi la méthode `enhance_with_event`:

{% highlight javascript linenos %}
/**
 * Enhance a feature with its corresponding event counterpart.
 */
var enhance_with_event = function(feature, enhanced_parent) {
  if(_.isUndefined(feature.arguments)) {
    throw new Error("No argument on feature <" + feature.name + ">");
  }
  var event_name = generate_event_name(feature.name, enhanced_parent.name);
  var event_arguments = generate_event_arguments(feature, enhanced_parent);
  feature.event = {
    namespace : enhanced_parent.namespace,
    name      : event_name,
    arguments : enhance_array(event_arguments),
    argument_names : event_arguments.map(function(arg) {return arg.name;})
  };
  t.declare_apply_template(feature.event);
};
{% endhighlight %}

Chaque évènement est constitué d'un nom et d'un ensemble de paramètres. Le nom c'est désormais chose faite, interessons-nous aux paramètres. Nous prendrons comme convention que le premier argument correspond à l'identifiant de l'entité. Ce paramètre est déjà présent pour les méthodes de type `factory` en revanche il est nécessaire de le rajouter pour les méthodes de type `def` s'appliquant directement à une entité.

`lib/transformation/enhance.js`

{% highlight javascript linenos %}
var generate_event_arguments = exports.generate_event_arguments = function(feature, enhanced_parent) {
  if(enhanced_parent.enhanced === false) {
    throw new Error("Provided parent is not enhanced");
  }

  // define a factory function for event argument
  var event_arg_factory = function(name,type) {
    return { name : name, 
           type : type,
           is_identifier : (_s.endsWith(name, "_id") || _s.endsWith(type, "Id"))
    };  
  };

  var id_variable = enhanced_parent.id.variable_name;
  var id_variable_used = false;
  var event_arguments = feature.arguments.map(function(argument) {
    // be sure variable is in UnderscoreCase
    var var_name = _s.underscored(argument.argument_name);
    if(var_name === model_id_present) {
      id_variable_used = true;
    }
    return event_arg_factory(
        var_name,
        argument.argument_type);
    }
  );

  var must_insert_id = true;
  if(event_arguments.length>0) {
    var first = event_arguments[0];
    // insert id at first position if not already there
    if(first.name === id_variable) {
      must_insert_id = false;
    }
    else if(id_variable_used) { // sanity check
      throw new Error("Convention not satisfied: model_id is not on first position, " +
                        "you should probably rename the argument or set it first");
    }
  }

  if(must_insert_id) {
    event_arguments.unshift(
      event_arg_factory(enhanced_parent.id.variable_name, enhanced_parent.id.type));
  }
  return event_arguments;
};
...
{% endhighlight %}

Rajoutons quelques indicateurs sur les tableaux afin de faciliter utilisation dans les templates. Il est ainsi possible de savoir si un élément est le premier ou le dernier du tableau. Ceci est notament utile pour savoir s'il faut positionner un séparateur comme `,` ou `;` par exemple.

`lib/transformation/enhance.js`

{% highlight javascript linenos %}
/**
 * Utility to mark first and last value in an array
 */
var enhance_array = exports.enhance_array = function(array) {
  if(array.length>0) {
        var first_key = "_first";
        var last_key  = "_last";
        array.forEach(function(item) {
            item[first_key] = false;
            item[last_key]  = false;
        });
        array[0][first_key] = true;
        array[array.length-1][last_key] = true;
    }
    return array;
};
{% endhighlight %}

Le template de transformation d'un évèment peux alors s'écrire:

`lib/transformation/event.template`

{% highlight javascript linenos %}
Sslac.Class("<%=namespace%>.<%=name%>")
     .Extends("nscrum.Event")
     .Constructor(function (<%=arguments[0].name%>/*owner aggregate*/, data) {
        <% if(arguments.length>1) {
        %> if(typeof data === "undefined") {
             throw nscrum.MissingEventData();
         } else {
            <% var iter = arguments.slice(1);
               var padding = _.max(iter, function(arg) { 
                                return arg.name.length; 
                              }).name.length;
               var has_id  = _.some(iter, function(arg) { 
                                return arg.is_identifier;
                              });
               if(has_id) { 
            %> /* uuids are unwrapped for serialization*/
            <% }
            %> this.Parent("<%=namespace%>.<%=name%>", 
                          <%=arguments[0].name%>, { // event data
            <% iter.forEach(function (argument) { 
            %>              <%=_.rpad(argument.name, padding, " ")%> :<% 
                        if(argument.is_identifier) { 
                    %> data.<%=argument.name%>.uuid() <% 
                        } else { 
                    %> data.<%=argument.name%><% 
                        } %><% if(!argument._last) { %>,<% } %>
            <% }); 
            %> });
         }<% 
          } else { 
        %> this.Parent("<%=namespace%>.<%=name%>", 
                       <%=arguments[0].name%>);<% } %>
     })<%
      arguments.slice(1).forEach(function (argument) { %>
     .Method("<%=argument.name%>", function () {
        <% if(argument.is_identifier) { 
        %> /*rewrap uuid*/
         var uuid = this.data.<%=argument.name%>;
         return new <%=namespace%>.<%=argument.type%>(uuid); <% 
        }  else { 
        %> return this.data.<%=argument.name%>; <% } %>
     })<% }); %>
     .Static("validate_event_data", function(data) {
       <% if(arguments.length>1) {
            var iter = arguments.slice(1);
            iter.forEach(function (argument) { 
              %>  if(typeof data.<%=argument.name%> === "undefined") {
             throw nscrum.MissingEventProperty("<%=argument.name%>");
         }
       <%  });
    } %>
     });
{% endhighlight %}

* lignes 3 à 33: le constructeur. Il est invoqué avec deux paramètes: l'identifiant de l'aggrégat et les données propres à l'évènement. Les paramètres de l'évènement sont regroupés dans un unique objet, nous avons ainsi un mécanisme similaire aux [paramètres nommés](http://fr.wikipedia.org/wiki/Param%C3%A8tre#Param.C3.A8tre_nomm.C3.A9). Les paramètres sont alors recopiés dans un nouvel objet. Un traitement spécial est fait pour les identifiants où l'on ne conserve que l'uuid afin de simplifier la serialization de nos évènements.
* lignes 33 à 42: on génère pour chaque arguments le _getter_ correspondant
* lignes 43 à 51: on génère une méthode statique permettant de verifier qu'un objet dispose bien de toutes les propriétés d'un évènements. Cette méthode pourra par exemple être utilisée pour valider les données fournies au constructeur.

Comme notre template s'applique sur les évènements directement, la transformation associée est légèrement différente des précédentes et itère sur chaque évènements d'une entité. Elle peux s'écrire:

{% highlight javascript linenos %}
var transform = exports.transform = function(model, output, next) {
  model.features.forEach(function(feature) {
    var generated = feature.event.apply_template(__dirname + "/event.template");
    output(generated);    
  });
};
{% endhighlight %}

Voyons le résultat à partir d'un nouveau fichier de test `data/sample02.cqrs`:

{% highlight scala %}
aggregateRoot Story {
  factory create(story_id:StoryId, title:String)
  def activate()
    def change_complexity(on_behalf_of:UserId, complexity:Integer)
    def change_status(new_status:Status)
    def assign_to_project(project_id:ProjectId)
}
{% endhighlight %}

Attention, prêt? partez!

{% highlight bash %}
$ node lib/code-gen.js data/sample02.cqrs forEach enhance event

Sslac.Class("nscrum.StoryCreatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id/*owner aggregate*/, data) {
         if(typeof data === "undefined") {
             throw nscrum.MissingEventData();
         } else {
             this.Parent("nscrum.StoryCreatedEvent", 
                          story_id, { // event data
                          title : data.title
             });
         }
     })
     .Method("title", function () {
         return this.data.title; 
     })
     .Static("validate_event_data", function(data) {
         if(typeof data.title === "undefined") {
             throw nscrum.MissingEventProperty("title");
         }
       
     });
Sslac.Class("nscrum.StoryActivatedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id/*owner aggregate*/, data) {
         this.Parent("nscrum.StoryActivatedEvent", 
                       story_id);
     })
     .Static("validate_event_data", function(data) {
       
     });
Sslac.Class("nscrum.StoryComplexityChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id/*owner aggregate*/, data) {
         if(typeof data === "undefined") {
             throw nscrum.MissingEventData();
         } else {
             /* uuids are unwrapped for serialization*/
             this.Parent("nscrum.StoryComplexityChangedEvent", 
                          story_id, { // event data
                          on_behalf_of : data.on_behalf_of.uuid() ,
                          complexity   : data.complexity
             });
         }
     })
     .Method("on_behalf_of", function () {
         /*rewrap uuid*/
         var uuid = this.data.on_behalf_of;
         return new nscrum.UserId(uuid); 
     })
     .Method("complexity", function () {
         return this.data.complexity; 
     })
     .Static("validate_event_data", function(data) {
         if(typeof data.on_behalf_of === "undefined") {
             throw nscrum.MissingEventProperty("on_behalf_of");
         }
         if(typeof data.complexity === "undefined") {
             throw nscrum.MissingEventProperty("complexity");
         }
       
     });
Sslac.Class("nscrum.StoryStatusChangedEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id/*owner aggregate*/, data) {
         if(typeof data === "undefined") {
             throw nscrum.MissingEventData();
         } else {
             this.Parent("nscrum.StoryStatusChangedEvent", 
                          story_id, { // event data
                          new_status : data.new_status
             });
         }
     })
     .Method("new_status", function () {
         return this.data.new_status; 
     })
     .Static("validate_event_data", function(data) {
         if(typeof data.new_status === "undefined") {
             throw nscrum.MissingEventProperty("new_status");
         }
       
     });
Sslac.Class("nscrum.StoryAssignedToProjectEvent")
     .Extends("nscrum.Event")
     .Constructor(function (story_id/*owner aggregate*/, data) {
         if(typeof data === "undefined") {
             throw nscrum.MissingEventData();
         } else {
             /* uuids are unwrapped for serialization*/
             this.Parent("nscrum.StoryAssignedToProjectEvent", 
                          story_id, { // event data
                          project_id : data.project_id.uuid() 
             });
         }
     })
     .Method("project_id", function () {
         /*rewrap uuid*/
         var uuid = this.data.project_id;
         return new nscrum.ProjectId(uuid); 
     })
     .Static("validate_event_data", function(data) {
         if(typeof data.project_id === "undefined") {
             throw nscrum.MissingEventProperty("project_id");
         }
       
     });
{% endhighlight %}
