---
layout: post
title: "BDD"
category: blog
tags:
  - bdd
published: false
comments: false
---

Venn diagrams

Context specification
http://stevenharman.net/toward-a-better-use-of-context-specification
http://ericfarr.net/lightweight-contextspecification-bdd-in-c/

Feature injection
Deliberate discovery


A simple way of saying:
* Pre-conditions, Event, Post-conditions
* Context, Action, Outcome
* Build, Operate, Check (Robert C. Martin)


imperative or declarative?
http://qainsight.blogspot.fr/2012/06/bdd-user-stories-and-scenarios.html


Accept that our brains are **good at some things** and bad at others:

* we are good at
  * associating
  * understanding
* we are bad at describing what we like and why we do things

En parlant aux autres, des connexions s'établissent dans notre tête, et nous aident à mieux comprendre, à mettre au clair nos idées, 


> Business Analyst: "I'll go talk to the stakeholders to find out their requirements... in the meantime, you guys start coding."

http://www.softwaretestingclass.com/what-is-exploratory-testing/


Articles:

* Three Amigos: seulement 3?
* 

> C'est une perte de temps de réfléchir quand on ne sait pas penser.
> -- Haruki Murakami



> la mise en commun de toutes nos réflexions personnelles a
> fait naître des regroupements d’idées, des cheminements de
> pensée, que l’on n’aurait sûrement pas abordé en travaillant seul.




> I recommend having a conversation with the people who are interested 
> in this (your security experts, or whatever), ask them for a couple of 
> examples of how it should work, and write down the scenario as close 
> to the language they use as possible. BDD is all about the  conversations. 
> -- Liz Keogh

>


# 

> Read Kent Beck's definition of TDD, in Extreme Programming Explained. The book is showing its age, but it's still a great read. Its ideas had far greater impact than the adoption of XP. It's a seminal book.
>
> Read all of Dan North's early writing on BDD. It has evolved quite a bit during its 10 year life. Dan got bored of BDD and is now doing DD instead (different Ds though). For more recent writing I'd recommend Liz Keogh's talks and blog posts. And Gojko Adzic.
>
> I think of BDD as TDD from a higher level. The same red green refactor cycle, but tests are called scenarios, or examples. They are based on conversations with users and BAs, product owners, testers and developers. Anyone with a say. These scenarios as plain text. And they are executable.
> 
> BDD is similar to ATDD. BDD is British and ATDD is American. That's how much they differ. Britain has a lot of immigrants, and so does BDD. BDD is magic sauce based on Neuro-Linguistic Programming, the Sapir-Whorf theory, Black-Scholes, Options Theory, Queue Theory, Religion and Lean.
> 
> Some science and some humbug. I'd say it's not quite as good as Scientology, but it's pretty damn close! Welcome to our temple.
> 
> Nowadays I prefer to talk about Specification by Example rather than BDD. It explains much clearer the most important aspect about BDD.
> 
> Many people think of RSpec and its dozens of clones as BDD. It kind of is, but it kind of ain't. It doesn't describe the system from the perspective of the end user, so it fails to bridge the communication gap between technical and non-technical people. Bridging this gap is another problem that BDD/SbE tries to address. Writing unit tests with sentences is great and all that (I do it all the time), but you're really just talking to yourself when you're doing that. It's important to talk to yourself (or your pair) when you code, but it's even more important to have a conversation with the people who are going to use your software.


-- https://groups.google.com/forum/#!topic/behaviordrivendevelopment/arRDZxnvWts


# Don't you trust me? (a technical approach to building trust and consensus)

by Seb Rose

[Don't you trust me? (a technical approach to building trust and consensus)](http://skillsmatter.com/podcast/agile-testing/dont-you-trust-me-a-technical-approach-to-building-trust-and-consensus)

In many legacy organisations there's a tension between the desires of the three amigos

- business stakeholders can't validate assumptions unless they're written in business domain terms
- testers would ideally test everything end to end (vertically)
- developers respond that the testing pyramid encourages us to have more unit tests than integration or end-to-end tests

It is often recommended that some tests that start off as scenarios get pushed 'down' into unit tests to keep the execution time under control and constrain the maintenance burden of the feature suite. The trouble with this is that even if the business folk and the testers trusted the developer's unit tests implicitly (which they often don't ;-) there's still the issue of visibility. We no longer have one complete, generally consumable, source living documentation.

Additionally, we don't want to pollute our scenarios with details about our step definition implementation (such as whether we're exercising an isolated component or entire system end-2-end). Which is exactly what we'd like to do in some circumstances to minimise the runtime of our feature suite.

An approach that I have been experimenting with uses Cucumber's tagged hooks to control the amount of application stack that a scenario exercises. This lets us tailor our execution context depending on the runtime of the feature suite and the amount of trust the team has to spare. In the limit, this allows us (where it makes sense) to expose some of our unit tests as scenarios - keeping our living documentation complete. 

# Prez

TDD et après?

1. Intro TDD
  * c'est quoi
  * 1ère chose que l'on fait: on démarre son IDE et on code
  * Un test d'abord, rouge, puis une 1ère impl. naïve, verte, un peu de refactoring et on recommence
  * Techniquement c'est bien, code de qualité, testé et testable
  * que peut-on faire de mieux?
2. Passons au BDD
  * qu'entend-on par là...
  * *silence...*, les transparents défilent - genre bulles de BD - à quoi pense-t-il? Il reflechit à toute l'application, un design emergent, les connexions s'établissent, les relations se connectent et se déconnectent, les diagrammes se dessinent, zoom et dezoom une conception complète de l'infiniment grand à l'infiniment petit, des couches et des couches, on tranche, on découpe, des Managers, des Services, des Repositories, des Entities, on adapte, on isole, ah tiens!?! et si on traitait tout par un système évènementiel, de l'event sourcing, ah c'est bien ça... c'est rejouable, c'est répétable, et si nos instances héritaient de SourceHandler, ... **"Technologic"** YAK shaving...
