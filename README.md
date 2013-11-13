TruthMachine
==========================================================
####    Browser-based Sentential Logic Calculator     ####

>  "What is the case - a fact - is the existence of states of affairs."
>
>  -- Ludwig Wittgenstein, Tractatus Logico-Philosophicus p.2

[Use TruthMachine on-line](http://truthmachine.arr.gr/).

TruthMachine is a pure JavaScript browser based calculator for
[Sentential Logic](http://www.iep.utm.edu/prop-log/) (AKA Propositional Logic
or Propositional Calculus). I've created it for fun and because I wanted to
play around with writing parsers instead of doing my Introduction to Formal
Logic course homework.

Initially the goal is to allow users to easily type in a Well-Formed Formula
(WFF), parse it & validate it syntactically and generate a truth-table for
it. Additional related features may be added in the future. There is great
emphasis on ease of use.

It is intended to be educational and will hopefully help other students and
teachers.


Supported Operators
-------------------
Currently the following logical operators are supported, with their respective
symbols (yes, you may be used to different ones):

 - ~ Negation
 - • Conjunction
 - ∨ Disjunction
 - ≡ Equivalence
 - ⊃ Implication

The lexer/parser is based on [Jison](http://zaach.github.io/jison/) so it
should be relatively easy to add support for additional logical operators, as
long as they are describable as a finite series of boolean arithmetic operations :P


CONTRIBUTE
----------
Want to help out? See the list of [tasks and bugs](https://github.com/shevron/truthmachine/issues).
If you're a programmer, fork the project and fix some of them. If you're one of those
people who like to tell other people what to do or give them helpful advice (that's
not necessarily a bad thing), you can create some feature requests as well.


LICENSE
-------
TruthMachine is distributed under the terms of the New BSD License. That means
it's free software - you are welcome to use it for any purpose with (almost) no
strings attached. You are more than encouraged to contribute. See
[LICENSE.md](https://github.com/shevron/truthmachine/blob/master/LICENSE.md)
for licensing details.

 (c) 2013 Shahar Evron, all rights reserved

