---
layout: post
title: "300k Chevaux sous le capot grâce à Vert.x et Redis 1/3"
category: Blog
tags:
  - vert.x
  - websocket
  - sockjs
  - redis
published: false
comments: true
excerpt: |
  <span class="label warning">In Progress // Incubation</span><br/>

---

{{page.excerpt | markdownify }}

Premier pas avec Vert.x
---------------------

Pour l'installation voir: [Vert.x Install](http://vertx.io/install.html)

    $ mkdir vertx101 && cd vertx101
    $ wget http://dl.bintray.com/vertx/downloads/vert.x-2.1RC1.tar.gz
    $ tar -zxf vert.x-2.1RC1.tar.gz
    $ rm vert.x-2.1RC1.tar.gz
    $ ln -s vert.x-2.1RC1/bin/vertx vertx
    $ ./vertx version
    2.1RC1 (built 2014-02-26 13:51:32)

Créer le projet via maven

    $ mvn archetype:generate -Dfilter=io.vertx: -DgroupId=org.technbolts -DartifactId=vertx101 -Dversion=0.1

Supprime tout ce qui n'est pas java

    $ find . -print | egrep '.*((groovy|javascript|python|ruby).*|\.py|\.js|src.*README\.txt)$' | xargs rm -rf
    $ mvn clean integration-test


Commençons par écrire un Verticle très simple qui va écouter le Bus et répondre en générant un nouvel identifiant.

{% highlight java %}
public class BootstrapVerticle extends Verticle {
    
    @Override
    public void start() throws Exception {
        // Application config
        JsonObject appConfig = container.getConfig();
        Config config = new Config(appConfig);
        
       // Platform EventBus
       EventBus eventBus = vertx.getEventBus();

       registerGenerateIdHandler(config, eventBus);
    }

    private void registerGenerateIdHandler(Config config, EventBus eventBus) {
        String address = config.getGenerateIdAdress();
        eventBus.registerHandler(address, new GenerateIdHandler());
    }
}
{% endhighlight %}

`eventBus.registerHandler(address, ...)` enregistre un écouteur sur le "canal" `address`. Il suffiera donc de publier un message sur ce canal pour avoir en retour un nouvel identifiant.

{% highlight java %}
public class GenerateIdHandler implements Handler<Message<String>> {
    private Map<String,AtomicInteger> counterPerPrefix = new HashMap<>();

    @Override
    public void handle(Message<String> msg) {
        String prefix = msg.body;
        msg.reply(prefix + "-" + getCounter(prefix).incrementAndGet());
    }

    // no need to synchronize :)
    private AtomicInteger getCounter(String prefix) {
        AtomicInteger counter = counterPerPrefix.get(prefix);
        if(counter == null) {
            counter = new AtomicInteger();
            counterPerPrefix.put(prefix, counter);
        }
        return counter;
    }
}
{% endhighlight %}

Le `GenerateIdHandler` est quant à lui la classe qui réagira dès qu'un message sera publié sur ce canal; on pourra remarquer que l'on a choisit le format le plus simple pour le message: une chaine de caractère.

Le lecteur avertit aura remarqué qu'il est possible de répondre directement à un message sans avoir à publier sur un canal spécifique. La plateforme supporte en effet un certain nombre de pattern facilitant la communication par ce bus: communication point à point, requête <-> reponse, broacast sur une adresse, etc.

Nous pouvons d'hors et déjà déployé notre Verticle, mais celui-ci ne sera pas d'une grande utilité tout seul. Commençons à préparer le terrain de notre serveur d'Alerting, en utilisant notre Verticle de Bootstrap pour lui faire démarrer plusieurs Verticles pour gérer les requêtes HTTP et les Websockets.

{% highlight java %}

public class BootstrapVerticle extends Verticle {
    
    @Override
    public void start() throws Exception {
        // Application config
        JsonObject appConfig = container.getConfig();
        Config config = new Config(appConfig);

        int nbInstancesHttp = config.getHttpNbInstances();
        startHttpVerticles(appConfig, nbInstancesHttp);

        ...
    } 

    ...

    private void startHttpVerticles(JsonObject appConfig, int nbInstanceHttp) {
      container.deployVerticle(HttpVerticle.class.getName(), appConfig, nbInstancesHttp);
    }
}
{% endhighlight %}

{% highlight java %}
public class HttpVerticle extends Verticle {

    private String verticleId;
    private Logger log;
    private Config config;

    @Override
    public void start() throws Exception {
        // Application config
        JsonObject appConfig = container.getConfig();
        config = new Config(appConfig);

        queryForIdToStart();
    }

    private void queryForIdToStart() {
       // Platform EventBus
       EventBus eventBus = vertx.getEventBus();

       String generateIdAddress = config.getGenerateIdAdress();
       String message = "http";
       eventBus.send(generateIdAdress, message, new Handler<Message<String>> () {
            @Override
            public void handle(Message<String> msg) {
                start(msg.body);
            }
       });
    }

    private void start(String verticleId) {
       this.verticleId = verticleId;
       log = container.getLogger();
        
       HttpServer server = initializeHttpServer();
       
       int port = config.getHttpPort();
       server.listen(port);
       log.info("[" + verticleId + "] Starting HTTP server on port " + port);
    }

    private HttpServer initializeHttpServer() {
      RouteMatcher routes = new HttpRouteMatcherFactory().create(config);
      
      HttpServer server = vertx.createHttpServer();
      server.requestHandler(routes);
      return server;
    }


}
{% endhighlight %}

{% highlight java %}
public class HttpRouteMatcherFactory {
  public RouteMatcher create(Config config) {
    RouteMatcher routes = new RouteMatcher();
    registerRoutesForHacker(routes);
    registerRoutesForAssets(routes);
    registerRoutesNoMatch(routes);
    return routes;
  }

  private void registerRoutesForAssets(RouteMatcher routes) {
     routes.getWithRegEx(".*\\.(js|css|png)$", new Handler<HttpServerRequest>() {
            public void handle(HttpServerRequest req) {
                if (allowAssetsAccess) {
                    String extension = req.params().get("param0");
                    req.response.putHeader(CONTENT_TYPE, contentTypeForExtension(extension));
                    writeResource(req.response, "/assets" + req.path, false);
                } else {
                    forbiddenAccess(req);
                }
            }
        });
      }

    private void registerRoutesNoMatch(RouteMatcher routes) {
        routes.noMatch(new Handler<HttpServerRequest>() {
            public void handle(HttpServerRequest req) {
                log.error("[" + verticleId + "] Unhandled request '" + req.path + "'");
                req.response.statusCode = 404;
                req.response.putHeader(CONTENT_TYPE, contentTypeForExtension("json"));
                req.response.end(newJson("status", "Unhandled request '" + req.path + "'").encode());
            }
        });
    }

    private void registerRoutesForHacker(RouteMatcher routes) {
        // should act as : req.path.contains("..")
        routes.allWithRegEx(".*\\.\\..*", new Handler<HttpServerRequest>() {
            public void handle(HttpServerRequest req) {
                // This is an attempt to escape the directory jail. Deny it.
                forbiddenAccess(req);
            }
        });
    }

    private void writeResource(HttpServerResponse response, String resourcePath, boolean resolveVariable) {
        log.info("Sending resource '" + resourcePath + "'");

        byte[] bytes = resources.getResource(resourcePath, resolveVariable);
        if (bytes == null) {
            response.statusCode = 404;
            response.putHeader(CONTENT_TYPE, contentTypeForExtension("json"));
            response.end(newJson("status", "Resource '" + resourcePath + "' node found").encode());
        } else {
            response.statusCode = 200;
            response.end(new Buffer(bytes));
        }
    }s

    private void forbiddenAccess(HttpServerRequest req) {
        req.response.statusCode = 403;
        req.response.putHeader(CONTENT_TYPE, contentTypeForExtension("json"));
        req.response.end(newJson("status", "Access Forbidden '" + req.path + "'").encode());
    }

    private static JsonObject newJson(String fieldName, String fieldValue) {
        return new JsonObject().putString(fieldName, fieldValue);
    }
}
{% endhighlight %}





