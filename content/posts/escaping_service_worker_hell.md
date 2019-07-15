---
title: "Escaping Service Worker Hell"
date: 2019-07-14T12:32:08-07:00
draft: true
toc: false
images:
tags:
  - javascript
  - pwa
---

Service workers allow web developers to run custom logic around web requests.
Caching, offline mode, and resource mutation are all use cases of the service worker.

The most common use of a service worker is the caching of resources.
This is implemented using the caches api that is available in both the browser and service worker context.

# What is service worker hell?
Service worker hell is when you get yourself into a state where all resources are cached indefinitely and the web developer cannot update the webpage.

Let's look at the following service worker and see if we can spot the problem.

```

```

# Existing Safeguards

# How You Can Still Lock Yourself Out

# The Fix
