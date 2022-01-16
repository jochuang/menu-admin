/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/

var indentifier = import("./identifier.js");

"use strict";
//Global variables
var params = null;  		//Parameters
var colsEdi =null;
var newColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="butRowEdit(this);">' +
'<span class="glyphicon glyphicon-pencil" > </span>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowAcep(this);">' + 
'<span class="glyphicon glyphicon-ok" > </span>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowDelete(this);">' +
'<span class="glyphicon glyphicon-trash" > </span>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowCancel(this);">' + 
'<span class="glyphicon glyphicon-remove" > </span>'+
'</button>'+
  '</div>';
  //Case NOT Bootstrap
  var newColHtml2 = '<div class="btn-group pull-right">'+
  '<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="butRowEdit(this);">' +
  '<span class="glyphicon glyphicon-pencil" > ✎ </span>'+
  '</button>'+
  '<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowAcep(this);">' + 
  '<span class="glyphicon glyphicon-ok" > ✓ </span>'+
  '</button>'+
  '<button id="bElim" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowDelete(this);">' +
  '<span class="glyphicon glyphicon-trash" > X </span>'+
  '</button>'+
  '<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowCancel(this);">' + 
  '<span class="glyphicon glyphicon-remove" > → </span>'+
  '</button>'+
    '</div>';
var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>'; 
$.fn.SetEditable = function (options) {
  var defaults = {
      menu: options.menu,
      newMenu: options.newMenu,
      reviewChanges: options.reviewChanges,
      columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
      $addButton: null,        //Jquery object of "Add" button
      bootstrap: true,         //Indicates bootstrap is present.
      onEdit: function() {},   //Called after edition
      onBeforeDelete: function() {}, //Called before deletion
      onDelete: function() {}, //Called after deletion
      onAdd: function() {}     //Called when added a new row
  };
  params = $.extend(defaults, options);
  var $tabedi = this;   //Read reference to the current table.
  $tabedi.find('thead tr').append('<th name="buttons"></th>');  //Add empty column
  if (!params.bootstrap) {
    colEdicHtml = '<td name="buttons">'+newColHtml2+'</td>'; 
  }
  //Add column for buttons to all rows.
  $tabedi.find('tbody tr').append(colEdicHtml);
  //Process "addButton" parameter
  if (params.$addButton != null) {
      //There is parameter
      params.$addButton.click(function() {
          rowAddNew($tabedi.attr("id"));
      });
  }
  //Process "columnsEd" parameter
  if (params.columnsEd != null) {
      //Extract felds
      colsEdi = params.columnsEd.split(',');
  }
};
function IterarCamposEdit($cols, action) {
//Iterate through editable fields in a row
  var n = 0;
  $cols.each(function() {
      n++;
      if ($(this).attr('name')=='buttons') return;  //Exclude buttons column
      if (!IsEditable(n-1)) return;   //It's not editable
      action($(this));
  });
  
  function IsEditable(idx) {
  //Indicates if the passed column is set to be editable
      if (colsEdi==null) {  //was not defined
          return true;  //all are editable
      } else {  //there are fields filter
          for (var i = 0; i < colsEdi.length; i++) {
            if (idx == colsEdi[i]) return true;
          }
          return false;  //It was not found
      }
  }
}
function ModoEdicion($row) {
  if ($row.attr('id')=='editing') {
      return true;
  } else {
      return false;
  }
}
//Set buttons state
function SetButtonsNormal(but) {
  $(but).parent().find('#bAcep').hide();
  $(but).parent().find('#bCanc').hide();
  $(but).parent().find('#bEdit').show();
  $(but).parent().find('#bElim').hide();
  var $row = $(but).parents('tr');  //access the row
  $row.attr('id', '');  //remove brand
}
function SetButtonsEdit(but) {
  $(but).parent().find('#bAcep').show();
  $(but).parent().find('#bCanc').show();
  $(but).parent().find('#bEdit').hide();
  $(but).parent().find('#bElim').show();
  var $row = $(but).parents('tr');  //access the row
  $row.attr('id', 'editing');  //indicates that it is in edit
}
//Events functions
function butRowAcep(but) {
//Accept the edition changes
  var $row = $(but).parents('tr');  //access the row
  var $cols = $row.find('td');  //read fields
  if (!ModoEdicion($row)) return;  //It is already in editing
  
  //It is in edit. Editing has to be finished
  IterarCamposEdit($cols, function($td) {  //iterate through columns
    var cont = $td.find('input').val(); //read input content
    $td.html(cont);  //pin content and remove controls
  });
  var actionFlag = 'accept'; //set flag to accept
  const butAttr = getButtonAttributes(but)
  let dup = identifier(butAttr,actionFlag,params.menu,params.newMenu, params.reviewChanges);
  if (dup){
    return;
  }

  $row.attr('new','false')
  // iterate through the columns to make table cells not editable
  $cols.each(function() {
    $(this).attr("contenteditable","false")
  })
  SetButtonsNormal(but);
  params.onEdit($row);
}

function butRowCancel(but) {
//Reject edit changes
  var $row = $(but).parents('tr');  //access the row
  var $cols = $row.find('td');  //read fields
  if (!ModoEdicion($row)) return;  //It is already in editing
  //It is in edit. Editing has to be finished
  IterarCamposEdit($cols, function($td) {  //iterate through columns
      var cont = $td.find('div').html(); //read content from div
      $td.html(cont);  //pin content and remove controls
  });
  SetButtonsNormal(but);
}
function butRowEdit(but) {  
  //Start the edition mode for a row.
  var $row = $(but).parents('tr');  //access the row
  var $cols = $row.find('td');  //read fields
  if (ModoEdicion($row)) return;  //It is already in editing
  //change into edit mode
  var focused=false;  //flag
  IterarCamposEdit($cols, function($td) {  //iterate through columns
      var cont = $td.html(); //read content
      $td.attr("contenteditable", true)
      
      //Save previous content in a hide <div>
      // var div  = '<div style="display: none;">' + cont + '</div>';  
      // var input= '<input class="form-control input-sm"  value="' + cont + '">';
      // $td.html(div + input);  //Set new content
      //Set focus to first column
      // if (!focused) {
      //   $td.find('input').focus();
      //   focused = true;
      // }
  });
  SetButtonsEdit(but);
}
function butRowDelete(but) {  //Delete the current row
  var $row = $(but).parents('tr');  //access the row
  var actionFlag = 'delete';  //set flag to delete
  const butAttr = getButtonAttributes(but)
  // perform action before deletion
  params.onBeforeDelete(identifier(butAttr,actionFlag,params.menu,params.newMenu,params.reviewChanges));

  params.onBeforeDelete($row);
  $row.remove();
  params.onDelete();
}
//Functions that can be called directly
function rowAddNew(tabId, initValues=[]) {  
  /* Add a new row to a editable table. 
   Parameters: 
    tabId       -> Id for the editable table.
    initValues  -> Optional. Array containing the initial value for the 
                   new row.
  */
  var $tab_en_edic = $("#"+tabId);  //Table to edit
  var $rows = $tab_en_edic.find('tbody tr');
  //if ($rows.length==0) {
      //There are no rows of data. You have to create them complete
      var $row = $tab_en_edic.find('thead tr');  //header
      var $cols = $row.find('th');  //read fields

      //[if needed] assign food_id and subcat_id to new row
      var lastRow = $tab_en_edic.find('tr:last');
      var lastRowCatId = lastRow.attr("food_id").toString().substring(0,1)  // CatId is currently assumed to be single digit 0-9. Warning for >10 categories
      var lastRowFoodId = lastRow.attr("food_id").toString().substring(1)
      var newRowFoodId = lastRowCatId + (parseInt(lastRowFoodId) + 1)  // increment last row food_id by 1 and concatenate it with last row cat_id     
      
      //build html
      var htmlDat = '';
      var i = 0;
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {  // find the button column
              htmlDat = htmlDat + colEdicHtml;    // aggregate bottons
          } else {                                // if it's a non-button column
              if (i<initValues.length) {          // and if column index (iterable) is less than initValues
                htmlDat = htmlDat + `<td contenteditable="true">${initValues[i]}</td>`;
              } else {                            // edge case for when they are less initValues than # columns
                htmlDat = htmlDat + '<td contenteditable="true"></td>';
              }
          }
          i++;
      });
      $tab_en_edic.find('tbody').append(`<tr new='true' food_id= ${newRowFoodId} subcat_id=${newRowFoodId+0}>${htmlDat}</tr>`);
  /*} else {
      //There are other rows, we can clone the last row, to copy the buttons
      var $lastRow = $tab_en_edic.find('tr:last');
      $lastRow.clone().appendTo($lastRow.parent());  
      $lastRow = $tab_en_edic.find('tr:last');
      var $cols = $lastRow.find('td');  //read fields
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //Es columna de botones
          } else {
              $(this).html('');  //clean content
          }
      });
  }*/
  params.onAdd();
}
function rowAddNewAndEdit(tabId, initValues=[]) {
/* Add a new row an set edition mode */  
  rowAddNew(tabId, initValues);
  var $lastRow = $('#'+tabId + ' tr:last');
  butRowEdit($lastRow.find('#bEdit'));  //Pass a button reference
}
function TableToCSV(tabId, separator) {  //Convert table to CSV
  var datFil = '';
  var tmp = '';
  var $tab_en_edic = $("#" + tabId);  //Table source
  $tab_en_edic.find('tbody tr').each(function() {
      //Finish the edit if it exists
      if (ModoEdicion($(this))) {
          $(this).find('#bAcep').click();  //acepta edición
      }
      var $cols = $(this).find('td');  //read fields
      datFil = '';
      $cols.each(function() {
          if ($(this).attr('name')=='buttons') {
              //It's column of buttons
          } else {
              datFil = datFil + $(this).html() + separator;
          }
      });
      if (datFil!='') {
          datFil = datFil.substr(0, datFil.length-separator.length); 
      }
      tmp = tmp + datFil + '\n';
  });
  return tmp;
}
function TableToJson(tabId) {   //Convert table to JSON
  var json = '{';
  var otArr = [];
  var tbl2 = $('#'+tabId+' tr').each(function(i) {        
     var x = $(this).children();
     var itArr = [];
     x.each(function() {
        itArr.push('"' + $(this).text() + '"');
     });
     otArr.push('"' + i + '": [' + itArr.join(',') + ']');
  })
  json += otArr.join(",") + '}'
  return json;
}

function getButtonAttributes(but){
  // find food_id, subcat_id, and cat to identify food item that edited
  const butAttr = {
    id: $(but).parents('tr').attr("food_id"),
    subcat_id: $(but).parents('tr').attr("subcat_id"),
    cat: $(but).parents('table').parent().prev().text(),
    tdList: $(but).parents('tr').children(),  // retrieve a set of td values [0]: Name, [1]: Subcategory, [2]: Price, [3]: Description
    new: $(but).parents('tr').attr('new')
  }
  return butAttr
}