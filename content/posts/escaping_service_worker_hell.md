---
date: "2019-07-14T12:32:08-07:00"
draft: true
images: null
tags:
- javascript
- pwa
title: Escaping Service Worker Hell
toc: false
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

Service Worker hell is when the Service Worker caches the entire web page and all other resources.
This results in developers being effectively "locked out" from pushing code.

# The Fix
You need to uninstall all of the existing service workers the next time users visit.
So how do you do this when the entire page is cached?  

Chrome 54 implemented a change forcing service workers to use a max-age of 0 in all caching.
You'll need to take advantage of this attribute to unregister the service worker.

Update the path of the original service worker on your server to serve a patched service worker.
This can be a bit of a pain when serving resources prepended with their content hash.


# Kill All Old Service Workers
The safest way to ensure that no values persist in the cache is to force all service workers to unregister.
```

```

Thanks for reading my short article.
