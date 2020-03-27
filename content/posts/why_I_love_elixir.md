---
title: "Why I Love Elixir"
date: 2020-03-26
draft: false
type: post
tags:
- elixir
---

I often talk about the [Elixir](https://elixirlang.org) programming language to friends, families, and colleagues.

While there are TONS of features in elixir that I think are fantastic... off the top of my head:
- OTP integration
- Concurrency model
- Runtime configuration
- CI/CD deployments
- Phoenix and Phoenix's websocket model

**Note: maybe I'll revisit each of these in a follow up post if there's enough interest**

While some of the features above make Elixir a more compelling sell to upper management and clients - one feature not listed stands out to me as one of the most _fun_ to use.

That feature is function head pattern matching.

## Function Head Pattern Matching
This feature is simply outstanding.

The beauty of this feature comes out more in examples than it does in explanations.

Here's a brief explanation though before we get started:
{{<keypoint>}}
For a language to have function head pattern matching it must allow users to define multiple function bodies for a single function.
Each of these function bodies is gated behind a [pattern](https://elixir-lang.org/getting-started/pattern-matching.html) and a set of [guard clauses](https://hexdocs.pm/elixir/guards.html).
When the function is called the function definitions are tried one at a time in order of definition until one matches.
Once a match is found the code in that function body is run with the given parameter set.
{{</keypoint>}}

Still not clear?  Let's look at examples.

### First examples
Function head pattern matching is based on the concept that multiple function definitions can represent a single function.

Consider the absolute value function

```
abs(x) = {
  x > 0, x
  x < 0, -x
  0, 0
}
```

In Elixir code this looks like this:
```elixir
def abs(n) when n > 0 do n end
def abs(n) do -n end

abs(1)
> 1

abs(-1)
> 1
```

The `when n > 0` statement represents a `guard` and the `n` in the parenthesis represents the pattern.
The pattern here does not have any restrictions other than an [arity](https://elixir-lang.org/getting-started/modules-and-functions.html) of one.
**Note: Having an arity of one simply means the function accepts one parameter**

The `when` clause limits the `domain` of each function clause.  
In the example above `when n > 0` limits the domain of the first function body to positive numbers.

Function head pattern matching allows the parameters provided in a function declaration to act not only as a set of variable declarations, but also as a `pattern` restricting the domain of a function.

Here's an example of that.

The following function has a domain of [1, 2] and returns either the atom `:one` or the atom `:two`.

**Note: you can think of atoms like strings for now**

```elixir
def one_or_two(1), do: :one
def one_or_two(2), do: :two
```

This function definition consists of two bodies - each of which having a pattern specified by a single integer.

When the function is called the function will attempt to match the given parameters to each function definition clause in order.

```elixir
one_or_two(1)
```
{{<output>}}
```elixir
> "one"
```
{{</output>}}

```elixir
one_or_two(3)
```
{{<output>}}
```elixir
> ** (FunctionClauseError) no function clause matching in one_or_two/1
The following arguments were given to Test.one_or_two/1:

    # 1
    3
```
{{</output>}}


If no clause matches Elixir will raise a `FunctionClauseError`.

### Fibonacci
Ah Fibonacci, a very common example function used in programming.
Let's just use the naive approach to keep things simple and about the code.

Let's examine the mathematical definition:
```
fib(x) = {
  0: 1,
  1: 1,
  x: fib(x-1) + fib(x-2)
}
```

Not too ugly, now let's look at a Javascript implementation:

_Javascript_
```javascript
function fib(x) {
  if (x == 0) {
    return 1;
  } else if (x == 1) {
    return 1;
  } else {
    return fib(x-1) + fib(x-2);
  }
}
```

Not too bad either, mainly due to the fact that the function itself is quite trivial.

Let's look at Elixir's

_Elixir_
```elixir
def fib(0), do: 1
def fib(1), do: 1
def fib(n), do: fib(n-1) + fib(n-1)
```

Between Javascript and Elixir - which function do you find more readable?
I myself find Elixir's quite elegant because...
{{<keypoint>}}
Through function head pattern matching Elixir makes it *exceptionally* clear which clauses operate on which values.  This reduces cognitive load when attempting to decipher functions.
{{</keypoint>}}

Let's look at another example.

Heres an example function that determines if a number is single digit.

_Java_
```java
public static boolean isSingleDigit(int x) {
    if (x > -10 && x < 10) {
        return true;
    } else {
        return false;
    }
}
```

_Elixir_
```elixir
def is_single_digit(x), when: x in [-10..10], do: true
def is_single_digit(_),                       do: false
```

Which function do you have an easier time deciphering?  For the same reason referenced above I find the Elixir version here easier to trace.

Let's consider a real world example.

## Find the first item matching a set of conditions
This is an example I personally face all the time in the real world.

Imagine we have a type, User.
```
User {
  banned: boolean,
  name: String,
  // etc...
}
```
These users are granted "access" to some sort of thing based on many criteria.
The first of which is if the user is banned.

To start - we will have two criteria:
- the user is not explicitly banned
- the user is not named "Zack"

Let's check out a java implementation.

_Java_
```java
@AutoValue
class User {
  abstract boolean banned();
  abstract String name();
  // ... imagine some other values
}

class AccessAllower {
  private boolean accessAllowed(User user) {
      if (user.banned()) {
        return false;
      }
      if (user.name().equals("Zack")) {
        return false;
      }
      return true;
  }
}
```

This type of function extremely common in most industrial code bases.
Let's examine how Elixir handles these sorts of functions.
Elixir maps are represented by `%{}`.  Elixir keys and values can be matched on in function head.

_Elixir_
```elixir
defmodule User do
  defstruct [:banned, :name]
end

defmodule AccessAllower
  defp access_allowed?(%{banned: true}), do: false
  defp access_allowed?(%{name: "Zack"}), do: false
  defp access_allowed?(_),               do: true
end
```

This is already much clearer than the java version - but let's imagine requirements keep getting *MORE* complex (as the case is).

As requirements evolve our code scales extremely well.

Let's imagine we now want to reject users named AnnMarie.  In Elixir this is as easy as:

_Elixir_
```elixir
defmodule AccessAllower
  defp access_allowed?(%{banned: true}),     do: false
  defp access_allowed?(%{name: "Zack"}),     do: false
  defp access_allowed?(%{name: "AnnMarie"}), do: false
  defp access_allowed?(_),                   do: true
end
```

or what if we want to ban users whose names are longer than 33 characters?

_Elixir_
```elixir
defmodule AccessAllower
  defp access_allowed?(%{banned: true}),                     do: false
  defp access_allowed?(%{name: "Zack"}),                     do: false
  defp access_allowed?(%{name: "AnnMarie"}),                 do: false
  defp access_allowed?(%{name: name}), when: len(name) > 33, do: false
  defp access_allowed?(_),                                   do: true
end
```

It's trivial to add new criteria - what if we want to whitelist banned users if they are named "Luke" and make them ban proof?

_Elixir_
```elixir
defmodule AccessAllower
  # Whitelist
  defp access_allowed?(%{name: "Luke"}),                     do: true
  # False cases
  defp access_allowed?(%{banned: true}),                     do: false
  defp access_allowed?(%{name: "Zack"}),                     do: false
  defp access_allowed?(%{name: "AnnMarie"}),                 do: false
  defp access_allowed?(%{name: name}), when: len(name) > 33, do: false
  # Fallthrough
  defp access_allowed?(_),                                   do: true
end
```

As you can see - adding these cases is really easy.
The code is still super easy to trace and reason about.

Let's check in over in Java land.

_Java_
```java
class AccessAllower {
  private boolean accessAllowed(User user) {
    if(user.name().equals("Luke")) {
      return true;
    }

    if (user.banned()) {
      return false;
    }
    if (user.name().equals("Zack")) {
      return false;
    }
    if (user.name().equals("AnnMarie")) {
      return false;
    }
    if (user.name().length() > 33) {
      return false;
    }

    return true;
  }
}
```

To me - this is much harder to follow.

{{<keypoint>}}
In enterprise software, requirements change constantly.
Function head pattern matching allows code to remain readable as the number of special cases handled grows.
{{</keypoint>}}

## Summary
I love function head pattern matching.

It allows us to write code that is:
- easier to trace mentally
- more closely represent mathematical function definitions
- remain readable when requirements grow

{{<keypoint>}}
While function head pattern matching isn't a compelling argument to make to upper management on picking Elixir as a primary language - it is a nice bonus to using Elixir and is my personal favorite language feature.
{{</keypoint>}}

I find writing code this way fun and it's a refreshing take on things.
