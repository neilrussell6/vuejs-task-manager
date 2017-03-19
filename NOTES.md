service worker - activate - corner case fix
-------------------------------------------

Fixes a corner case in which the app doesn't return the latest data.
You can reproduce the corner case by commenting out the line below and
then doing the following steps:

 1) Load app for first time so that the initial New York City data is
    shown
 2) Press the refresh button on the app
 3) Go offline
 4) Reload the app. You expect to see the newer data, but you actually
    see the initial data. This happens because the service worker is
    not yet activated. The code below essentially lets you activate
    the service worker faster.
