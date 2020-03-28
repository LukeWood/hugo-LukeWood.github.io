---
title: "Hacking a Quiz Website's Highscores"
date: "2020-03-27"
draft: fale
type: post
---

## Backstory

Today my friend sent out a link:

{{< progressive-image class="bordered-figure" src="img/posts/quiz_highscores/IMG_1486.jpg" >}}

Unfortunately after my first attempt I only got one question right... putting me at the bottom of the highscores 😢.

{{< progressive-image class="bordered-figure short-figure" src="img/posts/quiz_highscores/highscores-before.png" >}}

This couldn't stand so I got to work.

# Getting Started!

Instead of just going back through the quiz and inputting the right answers I decided to look at how the quiz was setup.

I immediately hopped to the chrome inspector tab and checked out the sources in the page.

{{< progressive-image class="bordered-figure short-figure" src="img/posts/quiz_highscores/sources.png" >}}

The first thing to stand out to me was that under `> www.gstatic.com` a link to
`firebasejs/4.10.1` was present.

This indicated to me that all these results were likely written to a firebase database somewhere.

## Investigating Their Firebase Setup
When used properly [firebase](https://firebase.google.com/) is super secure.

But... this website also had a ton of onclick attributes set in the raw html - so it seemed likely that the creator may have made a mistake.

First I decided to investigate which firebase modules were loaded into the page.

{{< progressive-image class="bordered-figure short-figure" src="img/posts/quiz_highscores/firebase-modules.png" >}}

Cool, so it looks like they just use the [auth](https://firebase.google.com/docs/auth) module and the [Realtime Database](https://firebase.google.com/docs/database).

I did some more poking around but didn't find any other useful information.

## The page source

The page source consisted mainly of a ton of html elements used to construct the quiz, code for google analytics, facebook analytics,  bootstrap, jquery, and a few other third party libraries.

I pretty much instantly stumbled upon what I assumed to be the source code:
{{< progressive-image class="bordered-figure" src="img/posts/quiz_highscores/obfuscated.png" >}}

This looks like obfuscated source code if I've ever seen it.

# Reverse Engineering

I dumped it into a file on my desktop and formatted it with [js-beautify](https://www.npmjs.com/package/js-beautify) for further inspection.

The first few lines were like this:
```
var _0xb463 = ["\x41\x49\x7A\x61\x53\x79\x42\x74\x56\x41\x5A\x78\x67\x36\x4C\x67\x43\x31\x4B\x6E\x35\x6B\x30\x66\x6A\x31\x78\x46\x70\x64\x30\x75\x4B\x53\x36\x46\x51\x4E\x6F", "\x6E\x65\x77\x71\x7A\x69\x6E\x67\x6F\x2E\x66\x69\x72\x65\x62\x61\x73\x65\x61\x70\x70\x2E\x63\x6F\x6D", "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6E\x65\x77\x71\x7A\x69\x6E\x67\x6F\x2E\x66\x69\x72\x65\x62\x61\x73\x65\x69\x6F\x2E\x63\x6F\x6D", "\x6E\x65\x77\x71\x7A\x69\x6E\x67\x6F", "\x6E\x65\x77\x71\x7A\x69\x6E\x67\x6F\x2E\x61\x70\x70\x73\x70\x6F\x74\x2E\x63\x6F\x6D", "\x32\x35\x35\x33\x39\x32\x37\x33\x38\x31\x39\x32", "\x69\x6E\x69\x74\x69\x61\x6C\x69\x7A\x65\x41\x70\x70", "\x68\x72\x65\x66", "\x6C\x6F\x63\x61\x74\x69\x6F\x6E", "\x3F\x71\x3D", "\x69\x6E\x64\x65\x78\x4F\x66", "\x73\x75\x62\x73\x74\x72", "\x68\x69\x64\x65", "\x23\x6C\x6F\x61\x64\x69\x6E\x67\x5F\x70\x61\x67\x65", "\x23\x6E\x61\x6D\x65\x5F\x70\x61\x67\x65", "\x23\x70\x61\x67\x65\x5F\x67\x69\x76\x65\x5F\x70\x6F\x6C\x6C", "\x23\x70\x61\x67\x65\x5F\x71\x75\x65\x73\x74\x69\x6F\x6E\x65\x72", "\x73\x68\x6F\x77", "\x23\x65\x72\x72\x6F\x72\x5F\x70\x61\x67\x65", "\x70\x75\x73\x68", "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x62\x75\x64\x64\x79\x6D\x65\x74\x65\x72\x2E\x63\x6F\x6D\x2F\x63\x72\x65\x61\x74\x65\x2E\x68\x74\x6D\x6C", "\x6C\x65\x6E\x67\x74\x68", "\x63\x6F\x64\x65", "\x6D\x65\x73\x73\x61\x67\x65", "\x63\x61\x74\x63\x68", "\x73\x69\x67\x6E\x49\x6E\x41\x6E\x6F\x6E\x79\x6D\x6F\x75\x73\x6C\x79", "\x61\x75\x74\x68", "\x75\x69\x64", "\x76\x61\x6C", "\x74\x68\x65\x6E", "\x76\x61\x6C\x75\x65", "\x6F\x6E\x63\x65", "\x2F\x75\x73\x65\x72\x73\x2F", "\x2F\x71\x75\x69\x7A\x65\x73\x5F\x67\x69\x76\x65\x6E\x2F", "\x2F\x73\x63\x6F\x72\x65", "\x72\x65\x66", "\x64\x61\x74\x61\x62\x61\x73\x65", "\x2F\x73\x74\x61\x74\x75\x73", "\x2F\x71\x75\x69\x7A\x5F\x63\x72\x65\x61\x74\x65\x64\x5F\x69\x64", "\x6F\x6E\x41\x75\x74\x68\x53\x74\x61\x74\x65\x43\x68\x61\x6E\x67\x65\x64", "\x2F\x71\x75\x69\x7A\x65\x73\x2F", "\x63\x68\x69\x6C\x64", "\x71\x75\x65\x73\x74\x69\x6F\x6E\x73", "\x63\x6F\x75\x6E\x74\x72\x79", "\x55\x4B", "\x6C\x61\x6E\x67\x75\x61\x67\x65", "\x45\x4E", "\x61\x6E\x73\x77\x65\x72\x65\x72\x73", "\x4E\x6F\x20\x6F\x6E\x65\x20\x68\x61\x73\x20\x67\x69\x76\x65\x6E\x20\x74\x68\x69\x73\x20\x71\x75\x69\x7A\x20\x79\x65\x74\x2E", "\x74\x65\x78\x74", "\x2E\x6E\x6F\x74\x65\x5F\x66\x6F\x72\x5F\x73\x63\x6F\x72\x65\x62\x6F\x61\x72\x64", "\x46\x52"
...
// and on, and on, and on
```

Then it opened up into some firebase initialization calls and function calls.

There was a ton of initialization logic and a ton of random other UI related logic.

I went back into the web UI to figure out what function was called on button click:

luckily... they left it in plain sight in the onclick attribute.

```html
<span class="option_text" id="option_1" onclick="option_clicked(1)">Beer</span>
```

So I went back to the source and looked for `option_clicked(1)`.

{{< progressive-image class="bordered-figure" src="img/posts/quiz_highscores/option_clicked.png" >}}

Hoorah!!  Looks like the button here sends some sort of information to firebase - I went through and started tracing the logic in the function `send_vote_to_firebase`.

```javascript
function send_vote_to_firebase(_0x932cx39, _0x932cx30) {
    var _0x932cx3a = {};
    _0x932cx3a[_0xb463[156] + userID + _0xb463[33] + pollID + _0xb463[157] + _0x932cx39] = _0x932cx30;
    var _0x932cx3b = firebase[_0xb463[36]]()[_0xb463[35]]();
    _0x932cx3b[_0xb463[127]](_0x932cx3a, function(_0x932cx14) {
      if(_0x932cx14){}
    })
}
```

This was actually a red herring that I won't discuss anymore.

Luckily, there was another function right below it - `send_score_to_firebase`.

It looked as though I had struck gold!

```javascript
function send_score_to_firebase(score) {
    var _0x932cx3a = {};
    _0x932cx3a[_0xb463[158] + pollID + _0xb463[159] + userID + _0xb463[160]] = answerer_name;
    _0x932cx3a[_0xb463[158] + pollID + _0xb463[159] + userID + _0xb463[34]] = score;
    var _0x932cx3b = firebase[_0xb463[36]]()[_0xb463[35]]();
    _0x932cx3b[_0xb463[127]](_0x932cx3a, function(_0x932cx14) {
        if (_0x932cx14) {} else {}
    })
}
```

I quickly figured out what all of this code evaluated to by extracting the indexed chunks from the mega array at the beginning - `_0xb463` - and started popping my own variable names in.

I was left with:

```javascript
function send_score_to_firebase(score) {
  result = {"quizes/" + pollID + "/answerers/"+ userID + "/name": "luke", "quizes/" + pollID+ "/answerers/ " + userID + "/score": score}
  var database = firebase.database().ref();
  database.update(result, function(e) {
    console.log(e);
  })
}
```

I tried running this in the console and it worked!!!

# Results

First I tried giving it numbers above the maximum possible score but I got things like:
```
⚠️ FIREBASE WARNING: update at / failed: permission_denied
```

Then I thought to myself:

Their security rules probably look something like this:

```javascript
allow write if score < 10
```

By this logic decimal numbers in javascript would pass.

so... I tried the number `9.6969696969` and it worked!

This was really exciting!  Here are the highscores now.

{{< progressive-image class="bordered-figure short-figure" src="img/posts/quiz_highscores/highscores-after.png" >}}
