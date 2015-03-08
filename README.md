# ng-contentLoader
Small angular module which let you load your page's content on the fly.

# How does it work?
You register your content in your views, contentLoader does the rest.
It parses the view when its loaded, then process a request on the given URL to get the content.

**IMPORTANT:** In order to get the module to work, **you have to set up a server.**
contentLoader cannot guess where and how to retrieve your content. You have to tell it what to do.

Basically, if you set the module to work with `http://www.mywebsite.com/content`, it will make a `GET` request like this one:
`http://www.mywebsite.com/content?payload=contentID1,contentID2,...`

You do understand now that you have to make up and running a webservice that will handle the request.

The module expect a JSON result formatted like this:

```
{
    "contentID1": "Your content matching contentID1",
    "contentID2": "Your content matching contentID2",
    ...
}
```

# How to use it?
Simple! Start by adding `contentLoader` to your module's dependencies:

`angular.module('myModule', ['contentLoader']);`

Then a service is made available through your entire app: `$contentLoader`.

Inject it in your controllers or logics, configure it (see next section) and you're good to go.

In your views, all you have to do now is to register your content thanks to the `content-loader` attribute.

**IMPORTANT:** contentLoader have a special container which is hidden during the request.

This is intended to avoid ugly or white pages. It let you show a loader for example.

You can turn any component into a contentLoader's container by simply adding the `content-loader-container` class to it.

Here is an example:

```
<!-- The container will be hidden while the content will be loading -->
<div class="content-loader-container">
  <!-- The content-loader attribute represents the content's id which will be used in the request payload -->
  <p content-loader="myAwesomeContentIdentfier"></p>
</div>
```

# Configuration
If you want to configure it once and for all, do it in your application's `run()` function.

```
angular
    .module('myModule', ['contentLoader'])
    .run(run);
    
// Dependency injection
run.$inject = ['$contentLoader'];
        
/**
  * Provides the run configuration for the application.
  * @name run
  * @function
  */
  function run($contentLoader) {
    $contentLoader.setURL('http://www.yourURL.com');
  }
```

If you want to execute a function right after the content has been loaded and before it is shown (to hide the loader for example), you can use the `setFinalCallback` function:

```
$contentLoader.setFinalCallback(
  function() {
    $('#myLoader').hide();
  }
);
```

Again, if you want to configure the call back once and for all, do it in the run function.

But if you want to change the contentLoader's behavior on every page, just configure it in your controllers or logics.

# What if I want a special behavior on a single content, not all of them?
contentLoader is aware of this situation you may have.
And it provides a really simple solution for it!

Add the attribute `content-ready` on your component.

If we take the previous example:

```
<!-- The container will be hidden while the content will be loading -->
<div class="content-loader-container">
  <!-- The content-loader attribute represents the content's id which will be used in the request payload -->
  <p content-loader="myAwesomeContentIdentfier" content-ready="processAction()"></p>
</div>
```

**IMPORTANT:** In order to make your callback work, you have to tell contentLoader on which scope the callback depends.
To configure it, just inject $scope and $contentLoader in your controller, and call the `setScope` method:

`$contentLoader.setScope($scope);`

# So, it loads my content when my page is loaded. What if I want to load it after?
Again, contentLoader provides the right solution for you.

If you want to, let's say, refresh your content at some point without having to reload the entire page,
just call the `forceFetch()` method:

`$contentLoader.forceFetch();`

# Example
A fully working example will come soon, brace yourselves!

# Trouble?
If you have any request or bug, please open an issue, I'll take a look at it ASAP ;)
