# Menu Admin
<a href="https://menu-admin-demo.s3.amazonaws.com/index.html">Menu Admin</a> is a web application that allows for modification, addition, and deletion of menu items for a separate restaurant application. Menu Admin provides a front-end UI for restaurant owners to easily manage menu changes. The application deploys changes to a restaurant menu through an AWS event driven architecture. This serverless architecture allows two applications to integrate through a deployment pipeline, which can be replicated for different use cases.

### Table of Contents
   * [How To Use](#how-to-use)
   * [Architecture Design](#architecture-design)
   * [Tech Stack](#tech-stack)
<!--    * [Documentation](#documentation) -->

## How To Use <a name="how-to-use"></a>
In this short turtorial, you will be able to make changes on Menu Admin and see changes reflected on a Restaurant Menu.
Restaurant Menu is a testing environment that is built to mimic the menu page of a restaurant's website.
Check out <a href="https://restaurant-menu-b0d4c.web.app">Restaurant Menu</a> to see what it looks like before making any changes.

To interact with Menu Admin, check out <a href="https://menu-admin-demo.s3.amazonaws.com/index.html">Menu Admin</a>. There are 3 actions that can be done on Menu Admin:
<ul>
<li><b>Modification:  </b>
To edit a menu item, click on <img src="/icons/icon-edit.PNG" width=25> to edit. Once in edit mode, you can modify the menu item price. To confirm changes, click on <img src="/icons/icon-check.PNG" width=25>. To cancel changes, click on <img src="/icons/icon-cancel.PNG" width=25>. The changes will automatically be recorded at the buttom, under "Review Menu Changes" section.</li>
<li><b>Deletion:  </b>
To remove a menu item, first click on <img src="/icons/icon-edit.PNG" width=25> to enter into edit mode. Once in edit mode, click on <img src="/icons/icon-trash.PNG" width=25> to delete a menu item. The deletion will automatically be recorded at the buttom, under "Review Menu Changes" section.</li>
<li><b>Addition:  </b>
To add a new menu item, click on the a collapsible category banner, the menu items in the selected category and "Add New Item" button will appear. Click <img src="/icons/icon-add-new.PNG" width=100>, and fill out name, subcategory (optional), price, and description (optional) for the new menu item. The addition will be recorded at the buttom, under "Review Menu Changes" section.</li>
</ul>

Finally, check "Review Menu Changes", if you are satified with all changes, click <img src="/icons/icon-submit.PNG" width=60> for commit changes to the restaurant menu page. If you want to restore Menu Admin to default settings, click <img src="/icons/icon-reset.PNG" width=60>.  

Please allow 5 minutes for changes to reflect on Restaurant Menu. Check out <a href="https://restaurant-menu-b0d4c.web.app">Restaurant Menu</a> again to see the updates you've made.

## Architecture Design <a name="architecture-design"></a>

<p align="center">
<img src="/images/admin-portal-diagram.png" alt="architecture-diagram">
</p>

<ul>
<li><b>S3 bucket:</b> hosts Menu Admin and generates an event that triggers Lambda.</li>
<li><b>Lambda:</b> once instigated, it will triger CodeBuild.</li>
<li><b>CodeBuild:</b> fetches credentials from parameter store, pulls the restaurant webapp code source, overwrites menu file, compiles & deploys to Firebase hosted restaurant webapp, and commit & push to Bitbucket code source.</li>
</ul>

## Tech Stack <a name="tech-stack"></a>
This web application was built using JavaScript, HTML, and CSS. The application is hosted on AWS S3 and deploys changes to a separate application vis Lambda, CodeBuild, Bitbucket, and Firebase.

