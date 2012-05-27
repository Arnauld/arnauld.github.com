
DDD

* polution du domaine avec les objets/mapping hibernate
* pb du lazy load...
* mapping/dozer à tout va: dto <-> domaine <-> hibernate <-> rdbms...
* Allier TDD et DDD? TDD guide un design qui n'est pas forcément celui qui aurait été pensé lors d'une phase de conception "DDD" ?...



# DAO vs Repository

## http://stackoverflow.com/questions/8550124/what-is-the-difference-between-dao-and-repository-patterns

> DAO is an abstraction of data persistence. Repository is an abstraction of a collection of objects.
>DAO would be considered closer to the database, often table-centric. Repository would be considered closer to the Domain, dealing only in Aggregate Roots. A Repository could be implemented using DAO's, but you wouldn't do the opposite.
>Also, a Repository is generally a narrower interface. It should be simply a collection of objects, with a Get(id), Find(ISpecification), Add(Entity). A method like Update is appropriate on a DAO, but not a Repository - when using a Repository, changes to entities would usually be tracked by separate UnitOfWork.
>It does seem common to see implementations called a Repository that are really more of a DAO, and hence I think there is some confusion about the difference between them.

>Repository is more abstract domain oriented term that is part of Domain Driven Design, it is part of your domain design and a common language, DAO is a technical abstraction for data access technology, repository is concerns only with managing existing data and factories for creation of data.
>check these links:
>http://warren.mayocchi.com/2006/07/27/repository-or-dao/ 
>http://fabiomaulo.blogspot.com/2009/09/repository-or-dao-repository.html

## http://stackoverflow.com/questions/804751/what-is-the-difference-between-the-data-mapper-table-data-gateway-gateway-da

> our example terms; DataMapper, DAO, DataTableGateway and Repository, all have a similar purpose (when I use one, I expect to get back a Customer object), but different intent/meaning and resulting implementation.
> A Respository "acts like a collection, except with more elaborate querying capability" [Evans, Domain Driven Design] and may be considered as an "objects in memory facade" ([Repository discussion](http://geekswithblogs.net/gyoung/archive/2006/05/03/77171.aspx))
> A DataMapper "moves data between objects and a database while keeping them independent of each other and the mapper itself" ([Fowler, PoEAA, Mapper](http://martinfowler.com/eaaCatalog/dataMapper.html))
> A TableDataGateway is "a Gateway (object that encapsulates access to an external system or resource) to a database table. One instance handles all the rows in the table" ([Fowler, PoEAA, TableDataGateway](http://martinfowler.com/eaaCatalog/tableDataGateway.html))
> A DAO "separates a data resource's client interface from its data access mechanisms / adapts a specific data resource's access API to a generic client interface" allowing "data access mechanisms to change independently of the code that uses the data" ([Sun Blueprints](http://www.oracle.com/technetwork/java/dao-138818.html))
> Repository seems very generic, exposing no notion of database interaction. A DAO provides an interface enabling different underlying database implementations to be used. A TableDataGateway is specifically a thin wrapper around a single table. A DataMapper acts as an intermediary enabling the Model object to evolve independently of the database representation (over time).


> There is a tendention in software design world (at least, I feel so) to invent new names for well-known old things and patterns. And when we have a new paradygm (which perhaps slightly differs from already existing things), it usually comes with the whole set of new names for each tier. So "Business Logic" becomes "Services Layer" just because we say we do SOA, and DAO becomes Repository just because we say we do DDD (and each of those isn't actually something new and unique at all, but again: new names for already known concepts gathered in the same book). So I am not saying that all these modern paradygms and acronyms meen EXACTLY the same thing, but you really shouldn't be too paranoid about it. Mostly these are the same patterns, just from different families.

## http://www.infoq.com/news/2007/09/jpa-dao

## http://forum.springsource.org/archive/index.php/t-40888.html

A good explanation of the repository pattern by Martin Fowler :
http://www.martinfowler.com/eaaCatalog/repository.html

> A Repository is a domain level artifact and mostly corresponds to an Aggregate Root. One repository can be implemented in terms of multiple DAOs. One DAO roughly corresponds to a single table. Hence you can say that a Repository is at a higher level of abstraction than the DAO.

> http://debasishg.blogspot.com/2007/02/domain-driven-design-use-orm-backed.html

## http://in.relation.to/Bloggers/RepositoryPatternVsTransparentPersistence

