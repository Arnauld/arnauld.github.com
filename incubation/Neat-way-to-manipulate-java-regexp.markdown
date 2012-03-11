---
layout: post
title: "Neat way to manipulate java regexp"
category: blog
tags:
  - java
  - hamcrest
  - regex
published: false
comments: true
---

Even if `hamcrest` is mainly used through test, the provided matchers can be used anywhere outside the test context.

Suppose one wants to verify a string is a valid uuid, i.e. similar to `eb880ab6-2b7a-46c0-8a12-71120da869b8`
Corresponding java regex can be written:

`"[a-hA-H0-9]{8}\\-[a-hA-H0-9]{4}\\-[a-hA-H0-9]{4}\\-[a-hA-H0-9]{4}\\-[a-hA-H0-9]{12}"`

With `HEXA=[a-hA-H0-9]` it becomes:

`HEXA + "{8}\\-" + HEXA + "{4}\\-" + HEXA + "{4}" + "\\-" + HEXA + "{4}" + "\\-" + HEXA + "{12}"`

With capturing groups it becomes:

`"([a-hA-H0-9]{8})\\-([a-hA-H0-9]{4})\\-([a-hA-H0-9]{4})\\-([a-hA-H0-9]{4})\\-([a-hA-H0-9]{12})"`

Let's write it now using the [hamcrest-text-patterns](http://code.google.com/p/hamcrest-text-patterns/)

> A library for writing readable, composable regular expression matchers that integrates cleanly with Hamcrest.
>
> * Easier to read (although more long-winded) than regular expressions
> * Named capture groups: captured text is identified by name, not by the index of the group.
> * Composable: patterns can be easily combined into more complex patterns without worrying about breaking regex syntax or changing group identifiers.
> * Refactoring friendly: patterns can be refactored with your favourite IDE.


```java
import static org.hamcrest.text.pattern.Patterns.anyCharacterInCategory;
import static org.hamcrest.text.pattern.Patterns.capture;
import static org.hamcrest.text.pattern.Patterns.exactly;
import static org.hamcrest.text.pattern.Patterns.separatedBy;

import org.hamcrest.text.pattern.PatternComponent;
import org.hamcrest.text.pattern.PatternMatcher;

public class StringMatchers {

	public static PatternMatcher uuidMatcher() {
        PatternComponent hexa = anyCharacterInCategory("XDigit");
        return new PatternMatcher(separatedBy("-", //
                capture("block1", exactly(8, hexa)), //
                capture("block2", exactly(4, hexa)), //
                capture("block3", exactly(4, hexa)), //
                capture("block4", exactly(4, hexa)), //
                capture("block5", exactly(12, hexa))));
    }
}
```

Within test to assert input is a valid uuid:

```java
    @Test
    public void uuidMatcher_matches_validEntries() {
        PatternMatcher validUUID = uuidMatcher();
        assertThat("eb880ab6-2b7a-46c0-8a12-71120da869b8", is(validUUID));
    }

    @Test(dataProvider = "invalidUUIDs")
    public void uuidMatcher_doesntMatch_invalidEntry(String input) {
        PatternMatcher validUUID = uuidMatcher();
        assertThat("gb880ab6-2b7a-46c0-8a12-71120da869b8", is(not(validUUID)));
    }

    @DataProvider(name = "invalidUUIDs")
    public Object[][] invalidUUIDs() {
        return new Object[][] { //
        { "gb880ab6-2b7a-46c0-8a12-71120da869b8" }, //
                { "0" }, //
                { "a-a-a-a" }, //
                { "ab880ab6-2b7a-46c0-8a12" } };
    }
```

Retrieve the captures using theirs names:

```java
    @Test
    public void uuidMatcher_namedCapture() throws PatternMatchException {
        Parse parse = uuidMatcher().parse("eb880ab6-2b7a-46c0-8a12-71120da869b8");
        assertThat(parse.get("block1"), equalTo("eb880ab6"));
        assertThat(parse.get("block2"), equalTo("2b7a"));
        assertThat(parse.get("block3"), equalTo("46c0"));
        assertThat(parse.get("block4"), equalTo("8a12"));
        assertThat(parse.get("block5"), equalTo("71120da869b8"));
    }
```

Suppose now you want to mix literal with regex, how many times did you forget to escape special characters... or quote the content using `Pattern.quote(String)`

```java
    private static PatternMatcher testTitleMatcher() {
        PatternComponent digit = anyCharacterInCategory("Digit");
        return new PatternMatcher(sequence("Test Quizz #", oneOrMore(digit)));
    }
```

## What's wrong with the library

Well... nothing except that... it is still in snapshot since 2008 and not available through standard Maven Repository.