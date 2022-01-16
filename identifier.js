// identifier function: create a common function to select correct food item from menu object and compare "display talbe food item" with "food item from menu object"
function identifier(butAttr,actionFlag,menu,newMenu,reviewChanges){

    let matchFlag=false; // set flag for when menu item is matched
    let duplicateFlag=false;
    let addNewFlag="addNew";
    let newSource;
    let newSourceIndex;
    console.log(newMenu)
    
    newMenu[butAttr.cat].forEach(function(element, index) {       //change comparison to original data structure
        console.log(element.Name)
        console.log(butAttr.tdList[0].textContent)
        if (element.Name === butAttr.tdList[0].textContent){
            Object.entries(element.Price).forEach(function(priceOption){
                if (priceOption[0] === butAttr.tdList[1].textContent && butAttr.new === 'true'){
                    duplicateFlag = true;
                }else if(butAttr.new === 'true'){
                    addNewFlag = 'addSubCat'
                }
            })
            newSource = element
            newSourceIndex = index
            matchFlag=true;
            console.log("in new menu")
        }
    })

    if (duplicateFlag === true){
        return duplicateFlag;
    }

    if (butAttr.new === 'true'){
        addNewMenuItem(newSourceIndex,butAttr,addNewFlag,menu,newMenu,reviewChanges);
        return;
    }

    // check last column in review table to see if the row indicates "new"; set newItemFlag to be true
    let newItemFlag = false;
    if (document.getElementById(`badge-id-${butAttr.subcat_id}`)!= null && document.getElementById(`badge-id-${butAttr.subcat_id}`).textContent === "New"){
        newItemFlag = true;
    }

    // Select correct subcategory (given food item with multiple subcategories)
    Object.entries(newSource.Price).forEach(function (priceOption, index){  // iterate through price map; each priceOption is a [Subcategory, Price] key-value pair
        console.log(butAttr.tdList[1].textContent)
        console.log(priceOption[0])
        console.log("In loop")
        
        if (butAttr.tdList[1].textContent === priceOption[0]){          // compare (subcategory of display table) to (subcategory of new menu item)
            let newPrice = priceOption[1]                               // price index denotes the index of the price map of the menu object

            switch (actionFlag) {
                
                case "accept":      // Check if edit values changed. If changed, call saveChanges function.
                    console.log("in accept")

                    if (newItemFlag === false) {

                    // find original menu price and set old price
                    // Select correct food item (by comparing food_id) from the menu object
                        var oldPrice;
                        menu[butAttr.cat].forEach(function(element, index) {       //change comparison to original data structure
                            if (element.Id === butAttr.id){                                
                                console.log("in original menu")
                                Object.entries(element.Price).forEach(function (priceOption, index){
                                    if (butAttr.tdList[1].textContent === priceOption[0]){
                                        oldPrice = priceOption[1]
                                        return;
                                    }
                                })
                            }
                        })
                        if (butAttr.tdList[2].textContent !== oldPrice){           // compare (price of display table) to (price of old menu item)
                            saveChanges(newSourceIndex,butAttr,oldPrice,menu,newMenu,reviewChanges)            // newSourceIndex: menu index in new menu, butAttr: button attributes, old Price: if available
                        } else {
                            // if new price equals old price, and shows up in the review table, remove the row
                        }
                        
                    } else {    // for editing price on new items, use new price because old price does not exist in menu
                        saveChanges(newSourceIndex,butAttr,newPrice,menu,newMenu,reviewChanges)

                    }
                    break;

                case "delete":
                    console.log("in delete")
                    deleteItem(newSourceIndex,butAttr,newItemFlag,menu,newMenu,reviewChanges)
                    break;
                    
                default:
                    console.log("Default. No cases met in identifier.")
            }
        }
    })
}

function deleteItem(newSourceIndex,butAttr,newItemFlag,menu,newMenu,reviewChanges){
    alert("About to delete: "+ butAttr.tdList[0].textContent +" " + butAttr.tdList[1].textContent)
    console.log(reviewChanges)

    // find out if food item has more than one subcategory
    if (Object.keys(newMenu[butAttr.cat][newSourceIndex].Price).length > 1){                    // If more than one, delete subcategory-price key-value pair. 
        delete newMenu[butAttr.cat][newSourceIndex].Price[butAttr.tdList[1].textContent]        // delete a key-value pair: delete object["key"]
                                                                                                // subcategory = butAttr.tdList[1].textContent or Object.keys(newMenu[category][newSourceIndex].Price)[priceIndex]
        console.log(newMenu)

    } else {                                                // If just one, delete whole food item
        newMenu[butAttr.cat].splice(newSourceIndex, 1)      // changes the contents of an array by removing or replacing existing elements and/or adding new elements: splice(start, deleteCount, item1)
        
        console.log(newMenu)
    }

    if (reviewChanges.show === false) {
        displayReviewHeader(menu,newMenu,reviewChanges)
        reviewChanges.show = true
    };

    // if item is a new menu item, remove it from review table
    if (newItemFlag){
        document.getElementById(butAttr.subcat_id).remove()

        // feature add: if there is only one row in review table, remove review table section
        // document.querySelector(".div-review").remove()
        // document.querySelector(".div-sub-can").remove()
        return;
    }

    // if food item already exists in "review menu changes", remove it
    if (document.getElementById(butAttr.subcat_id) != null){
        document.getElementById(`newval-${butAttr.subcat_id}`).innerText = 'N/A (Item Deleted)'
        document.getElementById(`badge-id-${butAttr.subcat_id}`).innerText = 'Deleted'
    } else {
        let deleteRow = `<tr id = ${butAttr.subcat_id}>
                            <td>${butAttr.tdList[0].textContent}</td>
                            <td>${butAttr.cat}</td>
                            <td>${butAttr.tdList[1].textContent}</td>
                            <td>${butAttr.tdList[2].textContent}</td>
                            <td>N/A (Item Deleted)</td>
                            <td>${butAttr.tdList[3].textContent}</td>
                            <td><span class = "badge">Deleted</span></td>
                        </tr>`
        // butAttr.tdList[2].textContent will store old price info because new price will be updated

        document.getElementById("summary-table-body").innerHTML += deleteRow
    }
}

function saveChanges(newSourceIndex,butAttr,oldPrice,menu,newMenu,reviewChanges){
    
    alert("New data is: "+ butAttr.tdList[2].textContent + ". Source data is: "+ oldPrice + ".\nData structure updated with new changes!")
    console.log(reviewChanges)

    newMenu[butAttr.cat][newSourceIndex].Price[butAttr.tdList[1].textContent] = butAttr.tdList[2].textContent      // set new price to the copy of the data structure (newMenu). Source[0] is the subcateogry of original data structure

    // display menu changes on screen
    if (reviewChanges.show === false) {
        displayReviewHeader(menu,newMenu,reviewChanges)
        reviewChanges.show = true
    };
    // Implement logic to overwrite menu changes to the food item with same name and same subcategory
    if (document.getElementById(butAttr.subcat_id) != null) {
        document.getElementById(`newval-${butAttr.subcat_id}`).innerText = butAttr.tdList[2].textContent;
        
    }else{
        let updatedRow = `<tr id = ${butAttr.subcat_id}>
                        <td>${butAttr.tdList[0].textContent}</td>
                        <td>${butAttr.cat}</td>
                        <td>${butAttr.tdList[1].textContent}</td>
                        <td>${oldPrice}</td>
                        <td id=newval-${butAttr.subcat_id}>${butAttr.tdList[2].textContent}</td>
                        <td>${butAttr.tdList[3].textContent}</td>
                        <td><span class = "badge" id=badge-id-${butAttr.subcat_id}>Updated</span></td>
                    </tr>`
        
        document.getElementById("summary-table-body").innerHTML += updatedRow
    }
};

function displayReviewHeader(menu,newMenu,reviewChanges){
    //generate Review Header
    var t = document.createTextNode("Review Menu Changes");
    document.getElementById("header-review-changes").appendChild(t);

    var newHeader = `<tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Old Price</th>
                    <th>New Price</th>
                    <th>Description</th>
                <tr>`
    document.getElementById("summary-table-head").innerHTML += newHeader

    // Create "Submit" Button
    var btnSubmit = document.createElement('button');
    btnSubmit.className = "btn btn-success";
    btnSubmit.id = "btn-Submit"
    btnSubmit.innerHTML += `<span class="glyphicon glyphicon-saved"></span>&ensp;Submit`;

    // Create "Reset" Button
    var btnReset = document.createElement('button');
    btnReset.className = "btn btn-warning";
    btnReset.id ="btn-Reset";
    btnReset.innerHTML += `<span class="glyphicon glyphicon-refresh"></span>&ensp;Reset`;

    document.querySelector(".div-sub-can").appendChild(btnSubmit);
    document.querySelector(".div-sub-can").appendChild(btnReset);
    document.getElementById("btn-Submit").addEventListener("click",function(){submitMenu(menu,newMenu,reviewChanges)});
    document.getElementById("btn-Reset").addEventListener("click",function(){resetMenu(menu,newMenu,reviewChanges)});
}

function resetMenu(menu,newMenu,reviewChanges){
    alert("clicked")
    newMenu = _.cloneDeep(menu);
    document.querySelector(".div-menu").remove()
    document.querySelector(".div-review").remove()
    document.querySelector(".div-sub-can").remove()
    reviewChanges.show = false;
    load(menu, newMenu, reviewChanges);
}

function submitMenu(menu,newMenu,reviewChanges){
    alert("Ready to Submit")
    // var tempFile = "menu_temp.js"
    // tempFile.open("w");  //open file with write access
    // tempFile.writeIn(newMenu)
    // tempFile.close()

    fetch('https://menuadmin-demo.s3.amazonaws.com/menu.js', {
        method: 'PUT',
        headers: {
            // 'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/javascript'
            // 's3:x-amz-acl': 'bucket-owner-full-control'
        },
        body: "export var menu = "+JSON.stringify(newMenu)
        // body: JSON.stringify(newMenu)

    })
    .then(() => {
        alert("Submit successful");
        console.log(reviewChanges)
        window.location.href = window.location.href
        // resetMenu(menu,newMenu,reviewChanges);
    })
    .catch((err) => {
        console.log(err)
        alert("failed")})

}

function addNewMenuItem(newSourceIndex,butAttr,addNewFlag,menu,newMenu,reviewChanges){

    // same food item; adding a subcategory in price option
    console.log(addNewFlag)
    if (addNewFlag === "addNew"){
        let newMenuItem = {Name: butAttr.tdList[0].textContent,
            Price: {[butAttr.tdList[1].textContent]:butAttr.tdList[2].textContent},
            Description: butAttr.tdList[3].textContent,
            Id: butAttr.id};
        newMenu[butAttr.cat].push(newMenuItem)

    } else if(addNewFlag === "addSubCat"){
        newMenu[butAttr.cat][newSourceIndex].Price[butAttr.tdList[1].textContent] = butAttr.tdList[2].textContent        // adding new subcategories to newMenu
    }

    console.log(newMenu[butAttr.cat])

    if (reviewChanges.show === false) {
        displayReviewHeader(menu,newMenu,reviewChanges)
        reviewChanges.show = true
    };
    console.log(reviewChanges)
    let newRow = `<tr id = ${butAttr.subcat_id}>
                        <td>${butAttr.tdList[0].textContent}</td>
                        <td>${butAttr.cat}</td>
                        <td>${butAttr.tdList[1].textContent}</td>
                        <td></td>
                        <td id=newval-${butAttr.subcat_id}>${butAttr.tdList[2].textContent}</td>
                        <td>${butAttr.tdList[3].textContent}</td>
                        <td><span class = "badge" id=badge-id-${butAttr.subcat_id}>New</span></td>
                    </tr>`

    document.getElementById("summary-table-body").innerHTML += newRow    
}