

http://nirajrules.wordpress.com/2009/07/18/mvc-vs-mvp-vs-mvvm/
http://narayan-guttal.blogspot.in/2012/05/presentation-patterns-difference.html


MVP have been replaced with Passive View and Supervising Controller. It would be interesting if you compared those two with MVC instead.
http://martinfowler.com/eaaDev/ModelViewPresenter.html



# [Is there any difference between MVC and N-Tiered architecture.](http://www.linkedin.com/groups/Is-there-any-difference-between-145246.S.122990520?view=&srchtype=discussedNews&gid=145246&item=122990520&type=member&trk=eml-anet_dig-b_pd-ttl-cn&ut=16LjEvbox7HBg1)

## Gene Hughson

MVC is a presentation-oriented pattern. n-Tier and layered architectures (which is what many people seem to be referring to when use the term "n-Tier") deal with the physical deployment and logical structure of an application. Layered architectures need not be deployed on separate tiers. Likewise, MVC can be used for the presentation layer of a layered (and possibly tiered) architecture or it can be used for a monolithic app. For more on layered apps: http://genehughson.wordpress.com/2012/01/09/layered-architectures-sculpting-the-big-ball-of-mud/

## Jaime Chavarriaga 

MVC, MVP and MVVM are patterns to separate the concerns related to user interface and business domain. MVC defines a way to organize elements of user interface and the business services without adding undesirables dependencies and improving the overall product maintainability.

== MVC and software layers

Martin Fowler defines a "Layered Application" pattern as a way to organize a software application into a set of logical layers for the purpose of managing dependencies and creating pluggable components. He states (a minimum of) three layers: Presentation, Business Domain and Data Access.

The MVC pattern defines an approach for the interaction between presentation and business domain components. Thus, It is only a way to create the "glue" to connect two of all these software layers (MVC is not equivalent to the three-layers). In addition, MVC is not related with other application concerns like persistence, security or scaleability.

== MVC and n-tier

Fowler and Trowbridge consider "n-tier" as a deployment pattern: a way to organize the infrastructure for running the developed applications. According to them, a web application can be deployed into three tiers: client, web application and data. Basically, they states that some components of the application can be deployed into a set of client machines, other components into a set of web application hosts and other components into a set of data server hosts. For solutions with more stringent security and operational requirements, you may want to consider moving some components to other additional tiers.

Considering these three tiers, MVC (possibly) defines an approach to connect presentation components in the client tier (e.g. a cell phone or internet application) with some service components in the web application tier. MVC doesn´t define anything about the interaction between the web application tier and the data tier (MVC is not equivalent to the three-tiers).

The MVC pattern can be applied in applications using just a tier. For instance, desktop development enviroments such as Eclipse and Netbeans apply the MVC pattern and they run in only one tier.

== some links

There is a web page with a summary of the patterns of the Fowler's book: " Patterns of Enterprise Application Architecture (P of EAA)" 
* http://martinfowler.com/eaaCatalog/

There are also some updates to the catalog. You can review specially the patterns related with "GUI Architectures" (including MVC, MVP and MVVM) 
* http://martinfowler.com/eaaDev/

* http://martinfowler.com/eaaDev/uiArchs.html

Trowbridge et al. also published an updated catalog in the Microsoft's book: "Enterprise Solution Patterns Using Microsoft .NET" 
* http://msdn.microsoft.com/en-us/library/ff647095.aspx

You can dowload a PDF copy of this book from the Microsoft's website 
- http://www.microsoft.com/downloads/details.aspx?FamilyId=3C81C38E-ABFC-484F-A076-CF99B3485754&displaylang=en&displaylang=en