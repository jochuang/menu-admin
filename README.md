# Menu Admin
Menu Admin is a web application that allows for modification, addition, and deletion of menu items for a separate restaurant application. Menu Admin provides a front-end UI for restaurant owners to easily manage menu changes. The application deploys changes to a restaurant menu through an AWS event driven architecture. This serverless architecture allows two applications to integrate through a deployment pipeline, which can be replicated for different use cases.

### Table of Contents
   * [How To Use](#how-to-use)
   * [Architecture Design](#architecture-design)
   * [Tech Stack](#tech-stack)
   * [Documentation](#documentation)

## How To Use <a name="how-to-use"></a>
In this short turtorial, you will be able to make changes on Menu Admin and see changes reflected on a Restaurant Menu.
Restaurant Menu [insert restaurant menu url] is a testing environment that is built to mimic the menu page of a restaurant's website.
Check out the Restaurant Menu to see what it looks like before making any changes.

To interact with Menu Admin, go to [insert index.html url]. There are three actions that can be done on Menu Admin:

1. Modification
To edit a menu item, click on [insert pencil button] to edit. Once in edit mode, you can modify the menu item price. To confirm changes, click on [insert check button]. To cancel changes, click on the [trash button]. The changes will automatically be recorded at the buttom, under "Review Menu Changes" section.
2. Deletion
To remove a menu item, first click on [insert pencil button] to enter into edit mode. Once in edit mode, click on [insert trash button] to delete a menu item. The deletion will automatically be recorded at the buttom, under "Review Menu Changes" section.
3. Addition
To add a new menu item, click on the a collapsible category banner, the menu items in the selected category and [add new item button] will appear. Click on [add new item], and fill out name, subcategory (optional), price, and description (optional) for the new menu item. The addition will be recorded at the buttom, under "Review Menu Changes" section.

Finally, check "Review Menu Changes", if you are satified with all changes, click [submit button] for commit changes to the restaurant menu page. If you want to restore Menu Admin to default settings, click [rest button].

Please allow 5 minutes for changes to reflect on Restaurant Menu. Check out the Restaurant Menu again to see the updates you've made.

## Architecture Design <a name="architecture-design"></a>

S3 bucket: hosts Menu Admin and generates an event that triggers Lambda.
[insert architecture diagram]
Lambda: once instigated, it will triger CodeBuild.
CodeBuild: fetches credentials from parameter store, pulls the restaurant webapp code source, overwrites menu file, compiles & deploys to Firebase hosted restaurant webapp, and commit & push to Bitbucket code source.
 

## Tech Stack <a name="tech-stack"></a>
This web application was built using JavaScript, HTML, and CSS. The application is hosted on AWS S3 and deploys changes to a separate application vis Lambda, CodeBuild, Bitbucket, and Firebase.

