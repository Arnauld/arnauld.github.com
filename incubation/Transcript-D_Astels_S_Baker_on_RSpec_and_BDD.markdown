# Dave Astels and Steven Baker on RSpec and Behavior-Driven Development

** 1.Ok, so it's my pleasure to be here with Dave Astels and Steven Baker and they've been talking to us about TDD and RSpec and BDD (behavior-driven development). Let's talk a little bit about where you are from and why you are talking about these particular topics?**

I got into Agile back in '99, and gradually got into testing. Most recently I wrote a book on Test Driven Development that actually won a Jolt award, which is nice, and moved into Ruby and behavior driven development.

** 2.Steven?**

Well, I started getting into the test-driven development and Agile when Dave's book came out and he was talking to me about the new way to write software. I got involved in that and at the same time I was looking into getting involved in Ruby, around the time when Dave was talking about behavior driven development and I used that time to work on Ars spec.

** 3.What is TDD? In case some of out viewers are scratching their heads right now and wondering what we are talking about...**

Dave: Test Driven Development is a way of writing software that makes you work in small pieces. You write a small test, a specification on behavior, as small as possible, and then you go and write the code to make that pass. So you are working with very small pieces, a little test, a little code that lets you work incrementally. It gives you a fail-safe, in that you have all these tests as you go, so if you break something you know immediately and you point to exactly where the problem is.

** 4.Is it not working backwards though, if you write your tests first?**

If you think of them as tests then it can seem that way. And that's part of the emphasis behind behavior-driven development.

** 5.Steven, you just gave a talk on TDD. Can you give us some of the main bullet points and why you are presenting this at Canada on Rails? What is the connection?**

Steven: The reason I wanted to provide the presentation was because Rails comes with a great framework for test writing applications and everything you need to write your tests for Rails application. I'm finding that in most of the applications that I'm using or seeing written, people are just ignoring that the testing facilities that are there. So, I wanted to provide a talk that introduced people to the testing facilities, introduce them to how to write tests, and to put that knowledge to use in the Rails development.

** 6.The scaffolding in Rails produces tests. In your experience, does that help people get into TDD?**

Steven: The tests produced by the scaffolding are just placeholders. They are starting points where you can put your tests but they don't actually generate tests that are useful, they just generate the place to put your tests. So, by themselves they are not useful, but with knowledge of TDD and how to write tests it makes it easier to get started.


** 7.Is scaffolding evil from a TDD prospective?**

Dave: I'm going to say "yes", and Steve brought up this point in his talk. There's one real danger that generating these test does, a test generates a model class and then it generates a test class for that model class, and that's the first step down a slippery slope: marrying test classes and model classes in a one-to-one relationship. The problem is that the structure of your test code is directly coupled to the structure of your model code. And if you change your model then the question is: What do you do with your test code? Do you change your test code to reflect that? Or do you not worry about that? This whole idea of one to one correspondence between test and production code is a fallacy.

** 8.What are the benefits of doing TDD?**

Steven: You are writing more robust code, you know that you have a safety net because you have a full test suite to fall back on.

** 9.Define robust.**

Steven: Everything that you are writing is well specified, you're writing exactly what you intend to write, nothing more and nothing less. I'll have a go with that.

** 10.Definitely, you're the expert.**

Dave: By robust I will say very low defect as one thing, as well as what you have you know it works, to the best of your knowledge and depending on the quality of your test suite. But if your tests are good, then you now your code works.

** 11.Why is TDD and Unit testing so important in Ruby? Versus other kind of languages?**

Dave: Because you have the complier there to catch a lot of the problems that esthetically typed language gives you.

** 12.Of particular concern for those who are evangelizing Ruby is that in the debate over static typing versus dynamic typing there's a lot of concern about runtime errors. How do you see TDD and thorough unit testing addressing the ultimate adoption and success of Ruby in the marketplace?**

Dave: With a statically typed language the compiler does a lot of work in catching errors.

** 13.That's sort of a test isn't it?**

Dave: It is, it's testing that you are passing the right types around, and then things are hanging together that way, you're passing the right number arguments you have the method spelled properly, it's doing all those checks. Something that Ruby is dynamically typed you don't have those checks ahead of time. That happens at runtime, you call a method and if you misspell a method name you get a "no method defined". And that's where your tests come in; they nail down all that behavior.

** 14.It's human nature to engage in risky behavior. When you encounter people that are not testing, what do you do about it? How do you deal with it on a project basis or a corporate basis to encourage them to adopt TDD.**

That's a hard one for me to answer because I'm usually brought in because someone has decided to have to adopt TDD.

** 15.How do you convince someone about the benefits of TDD? How do you show them that TDD is superior?**

You can't. The best way to do it and the way I approach it is making an experiment, and say "Ok, let's take 2 weeks or a month and learn to do TDD and do TDD and then you judge how you feel about it. Let's give it a try, let's see the results and then judge based on them".

** 16.How do you analyze the results of TDD?**

Dave: The thing is with program you're sort of opposite of insurance because everyone has already hit the problems, everyone has run into the issue and when you don't do testing...

** 17.That part was hit by hurricane over and over again**

Dave: People still live there and they pay exorbitant insurance I'm sure. So you pay for it one way or another. If you know you're going to hit that then you pay the up front cost of the insurance. TDD is like that, we know that if we don't, there are going to be problems. That's proven in the industry that there are problems, bug rates are high. And we're getting more and more data actually from projects to show that this is a way to get lower defects and higher quality. But it's pretty demonstrable, if you take a team and you measure what they're doing in terms of how productive they are, how many defects they log in, if it's a living system and you're getting testing feeding back defect reports and so forth. You can look in that, you can get an idea of where things are.

** 18.And you have seen results that way on your own projects?**

Dave: I have. And you see all the problems and then you go and you do TDD and you analyze the results after a while, "are we finding more bugs up front and getting less fed back to us". You can do code quality metrics to look into the design and see what the health of the design is, and I've done this on some projects and I'm talking to another potential employer about introducing TDD and strategies they might take and that's exactly the approach we are talking about. Documenting the matrix ahead of time, trying TDD and the trick is getting people to try it. And anyone interested in truly improving what they are doing, and learning something.

It's convincing them to give it a try, making an experiment, creating a pilot project, try doing TDD for some period of time, and a lot of it it's subjective, how you feel about what you're doing, we're getting less bugs that makes us feel better, we fell more productive. A lot of it comes down to confidence, Steve talked about this in his talk, you're doing it this way, you have these small steps have these tests, and it creates a safety net. So to your question, that people like to engage in risky behavior it gives you a little more freedom to take risks and be a little more aggressive with your coding because you have that safety net. So if you do mess up and create problems you know right away.

** 19.That's a good way to turn the problem on its head. So have you had luck working with teams to transition them over to doing TDD?**

Steven: Yes, on the current team that I'm working on, when I started, nobody have heard of TDD, and XP and Agile were considered bad words. So when I brought TDD to the table, I was doing it, there was no question for me. I was already doing it, and some of my coworkers decided that if it was working for me, then they should probably give it a shot or at least give it a fair shake, because it seamed to be working for me. And I found that after coaching through it a little bit, to help them write better tests, in a few months everybody was writing tests first; we have better code as a result. We have larger code bases relatively speaking, larger than one developer can keep the design in his head.

** 20.How many developers do you work with?**

 Steven: Currently 6. So we have projects where when we get to the point where it is larger than one person knows everything, at least I know that the software does what the test says it will do, because that's provided in the test, because they passed.


** 21.You both mentioned the notion of specification or test specification. So, at what point do we drop the test lingo and refer to them as specifications?**

Today.

** 22.Today? That's ambitious. Can you tell us a little bit about what the behavior driven design aspect of it is?**

Dave: Behavior driven development is design, code, is creating a software system. Development is a bad word in general but that's the status quo so we stick with that.

** 23.How long has this terminology changed? When did that start making sense, whose light ball was that?**

Dave: That was Dan North of ThoughtWorks UK who coined the term behavior-driven development, a year and a half ago now.

** 24.So it's a relatively new development but is it a new concept? Because you can say that the way we developed along the years is specification-driven in the sense that we code to requirements, or is this different?**

Dave: This is codifying the requirements, and TDD does that. My take on it is that doing BDD is the same as doing TDD well. The problem that I've seen with TDD is people tend to think of it as testing, as verification but it's specification not verification, for several years now. But that's a hard sell when you're constantly talking about tests, about assertions, you're extending something called TestCase, and writing methods that start with "test". Now, we don't have to do that anymore in most cases because we just put an annotation on that says "test". So, it's hard to get away from that baggage. It's hard to stop thinking about them as being tests when we are constantly talking about them as tests. And that's where BDD comes in to make a break from that and start talking in a specification-centric nomenclature, verification-centric vocabulary rather than testing-centric.

** 25.In the course of deciding on the vocabulary that you would use for specification, I believe you came up essentially with a DSL (domain-specific language) correct? That means a specific language for doing a specification that drop the test references right?**

Steven: Just before Agile '05 when you wrote the article on your website, meaning Dave wrote an article, I believe it was called "Beyond Test-Driven Development" or something similar, referencing the evolution of TDD that talked about if you do test-driven well, then you're talking about behavior, you're specifying behavior. And he made some points that it would be really nice if we could drop the word test and this is how it might look in a dynamic language and he pointed out a little bit how it might work with this theoretically systems. As a result of reading that there was a little bit of buzz surrounding it, and then more after Agile 0.5, and immediately after reading that I implemented it in Ruby, because Dave suggested Smalltalk and Ruby is my Smalltalk.

** 26.What did these concepts of specifications as a DSL end up looking like in Ruby?**

Steven: It was after Ruby conference in October when we decided to start looking at changing Rspec, and in its early days arse spec very closely mirrored Test::Unit.

** 27.What is Rspec?**

Steven: Rspec is the BDD framework for Ruby that I started as a result of Dave's article that we've been working on since then. When I first started, it looked very much like Test::Unit, what would have been a test case is now a specification context, and what would have been a specification method is now a specification, and what would have been an assertion is now an expectation, but there is a one to one parallel and after Ruby conference [2005] Aslak and you [Obie] and several others talked about turning this into a DSL or writing specifications that looked more like English because we were getting closer and closer to using English language, we're heading in that direction so the move to a DSL was natural for Rspec and it was around Christmas when the first one came out, when you and Dave Chelimsky changed the expectation syntax.

** 28.What would the specifications for a Rails model look like?**

Steven: If you are writing a model, it depends on the model obviously. The one that I use in my talk would be a bank account that needs to accept a deposit; if you create a new account with a zero balance make a deposit of 10, and you will say "account balance should be ten", if you make a deposit of ten into a zero account.

** 29.Does this specification cross boundaries models, and controllers and different aspects of the App?**

Steven: It could, to some extent. It shouldn't cross too many boundaries or you're dealing with too large chunks of functionality and it should be more focused. That's something that testing is doing because we talked about unit tests and functional tests, integration tests and acceptance tests, and people think that these 4 things are all the same. So when they hear that we are using test unit for functional and unit tests, and integration test now on Rails, so when people hear that Rspec replaces unit tests, they think "ok maybe I can use this for acceptance testing, maybe I can use this for functional testing".

** 30.And you can use some of the syntax sugar for acceptance test?**

Steven: You can, absolutely.

** 31.But instead of saying "assert" by saying a property of something sould be something else makes it read more like English. Are you finding that a lot of people are doing that?**

Steven: It's kind of early to say what people are doing with it.

** 32.What's been the main feedback you got on Rspec?**

Steven: Finish it , and do a Rails plugin, which I'm currently working on.

** 33.Do you think you can get to the point where you can have some of the Rspec stubs or some amount of Rspec code generated?**

Steven: I'm not a big fan of generating code at all because when I'm practicing TDD or BDD I'm writing code in small increments, anything I need a generator for is generating more code than I can write by hand. So if you're generating code then it's more code then it should be produced at one time.

Dave: I would agree with that, because you should be working in very small increments so generators are going to generate more than you need. I can see a couple of cases when generators could be useful: if you're in a situation where you write a lot of specs at once, you can analyze those and generate these skeleton codes based on that.

** 34.You have to consider use of this thing in a greater context, right? Because if you're going to write a specification that says "account balance should be ten" that means that you already have decided that there is an account class in your system that has some sort of balance properties.**

Steven: Well, you decided there's something called "an account" and that's most likely an object but I don't know if translating it from English to code automatically is going to be a good idea. You have to really decide how much time you are saving yourself by doing it first of all

** 35.So an Rspec specification is a file and you can theoretically before you jump into the implementation of your system go through a requirements analysis phase where you generate a bunch of Rspec specifications? Or am I perverting your vision of where you want to take this?**

Dave: Well, theoretically you could, but I don't think that would be appropriate. Rspec is working at a very fine level of detail, fine level of technical detail whereas requirements generate a higher functional level of abstraction. For example, I've worked with clients were we've done requirements analysis and elicitation directly into FIT working at that level.

** 36.What is FIT?**

Dave: FIT is an integrational functional testing framework which is very high level of abstraction. That's good. Rspec is for driving the technical detail of the system.

** 37.Does it replace unit tests?**

Yes.

** 38.Does it also replace functional tests in the Rails application?**

Steven: In Rails it will. There's a little bit more complexity to the functional testing framework in Rails, the loading of fixtures. There's a whole framework of the test request and test response classes which mimic the web server and the browser, you also have the getting close methods for interacting, providing the mimicked interact, the fake interaction of the browser and server.

** 39.You could say it's mocking the server?**

Steven: You could if you wanted to say "mock". I think we should probably say faking because mocking it's a reserved word and we don't want to step on more reserved words than we already are. So the functional tests have far more complexity than the unit tests. So there's infrastructure that needs to be replaced into the ars spec.

** 40.A year ago when we found out about Rails, we started doing it, maybe longer for you Steven I'm not exactly sure, but one of the great things about Rails from an Agile perspective is that it encourage testing, TDD to some degree. I guess now we have the question: so if you have your way how would you revamp the whole Rails testing or to be more accurate the Rails specifications?**

Steven: What we're doing isn't technically different, what we've been evangelizing all along still applies, but with a slightly different spin. I think mostly to newcomers the transition from TDD into BDD is more appropriate for newcomers than people who are already doing TDD well.

** 41.Is this BDD stuff maybe ahead of its time?**

Dave: No, I don't think so. TDD has got a fairly good adoption and people are starting to understand the value of it. The problem is that more and more people are adopting it and making the same mistakes and our hypothesis is that it's partially at least because of the testing background, testing baggage that comes with it. So there are lots of misconceptions, because people are thinking about them as being verification. So, I think the time is fairly good to step away from that and say "Ok, let's do the same thing but let's put it in a better framework, in a better vocabulary, to actually talk about what we are actually doing".

Steven: And especially where we run an increase adoption of TDD is a good time because this is when people are starting to pick it up and it's starting to get more popular and more mainstream to use the word that we've been throwing around here at the conference. People are going to call it into questions, it's going to be more intense scrutiny than before, so we need to make sure that the people who are the same way test to something as opposed condition, test is something that you do afterwards. "Testing is something you can't do until the software exists", we need to attack that now.

** 42.If it gets adoption outside of people who have exposure to the Agile community there are going to be issues.**

Dave: There are issues, even within Agile. I spent a lot of time doing TDD training and you see the same problems time and again. There's one-to-one correspondence between test and production classes.

** 43.Let's talk a little bit about with your specifications, if it really is like a unit test. You are using mocks and stubs then to actually define internal behavior of the class? Is it exactly the same as it would be just with a different language or are there changes that come about from the different vocabulary?**

Dave: On a technical level it's the same thing as if you're doing TDD well. The change comes in where we are now talking of specification as opposed to verification so it's a point of view shift.

** 44.I would think that would lead to altered behavior on the part of the developers?**

Steven: Well, we hope so and it is going in the right direction if it's happening. But one thing that you have forgot to mention in your talk, my favorite point, the first line in Dave's book says "this isn't a book about testing" and that's always right to point to people when I'm introducing them to TDD, because test carries a lot of baggage with it. It's a four letter word.

** 45.Let's say that we managed to get a shift in attitude so that this is no longer considered as verification. Where does testing go? Does this mean you don't test your application anymore?**

Dave: No, testing doesn't belong afterwards, testing belongs all through the process but doing TDD is different, it's a design activity, it's moving your design forward in a controlled incremental manner. Testing is verification, is making sure that the system actually fulfills the functional requirements. So, if you're doing BDD you're not doing "unit" testing anymore, you're doing behavioral specification at a fine level. Now, where traditional testing comes in, it's the same thing, it should be distributed to the process, but that's sort of a different issue. You are looking at higher level abstractions, you're looking at integration between your components or your subsystems, you're looking at high level functionality, you're looking at a domain point of view, from the user point of view as opposed to the technical point of view.

You don't want to do technical level testing you want to make sure you know what it should do, you code that and you make sure it does that, it meets your behavioral specifications at the low level. Your testing starts talking about integration and higher level functionality, performance, higher level concepts. And that can be all specified ahead of time too, where your performance criteria are and the visible user behavior is.

** 46.Where do you see this going? We have a lot of mass behind TDD and test unit and X-unit style testing. How long does it take to get this ship going? Where do you see Rspec going in terms of provoking that?**

Dave: I don't really know. It's sort of "oh well, this seams like a god idea, I think it's a good idea, some other people think it's a good idea, let's make it concrete and see what happens". And something else just occurred to me in terms of the choice of Ruby as the starting point. Ruby is still fairly early in the adoption curve so trying to move along the adoption of BDD in the Java world is probably going to be a lot more challenging than it is in the Ruby world. Because in Ruby we are earlier on the adoption curve so there's a lot more that is new.

** 47.Did you get a sense of how many people in the audience during your talk were actually familiar with the concepts you were talking about and may have actually been doing TDD? You know what they are up to, you've seen their faces right?**

Dave: It's kind of hard to say, I asked for a show of hand who was doing TDD and probably a quarter to a third of the audience put up their hands. And when you refined the question of who is doing it well I think there were 5 or 6 people that hesitated to admit it. So, I don't really have a sense for that. There seemed to be a lot of buzz after the talks. I heard one person's comment that I really got people talking. And that's good, that means they are thinking about it and let's see where it goes.

** 48.So what are your next stops? We talked a lot about things that maybe you're not quite there yet.**

Steven: Well Rails plug in now that it's committed to film!

** 49.So what would the Rails plug in do? I mean you've obviously given this some thought. What will it do to your Rails development?**

Steven: For me, it wouldn't change anything except for how the expectations are written.

** 50.I guess you don't use the Rails code generation then.**

Steven: No, not at all. I use TDD to generate code manually.

** 51.So you don't even do model generation with Rails?**

Steven: Not at all. Especially when I'm pairing with somebody who's never used Rails before or who has never done TDD before I find it especially important not to rely on the generator to give me test stubs, to give me things that I should know or that I should be providing for myself. When the failings specifications tell me that I need it, because that would be contradicting what I'm trying to teach.

** 52.You mentioned being influenced by Dave quite a bit and you guys seem to spend a lot of time together. Are you going to continue working on this project together or what can we expect in the near future?**

Dave: For Rspec, again the Rails plugin, filling in some gaps, there's some corners of Rspec that aren't very well-defined or have a few missing pieces, so fleshing out there. There's a text-based runner that comes with it, we just got working a Cocoa-based GUI runner and some more work along those lines. We'll be looking at supporting it in IDE's so getting an Eclipse runner for running Rspec. They just fixed the test runners in RadRails so this will be a good time to put back to Rspec as well. And that will help with adoption too, if it's easy for people to use then that's going to make it easy for them to adopt it.

** 53.Thank you guys. We look forward to lots of good stuff from you.**

Thank you!
