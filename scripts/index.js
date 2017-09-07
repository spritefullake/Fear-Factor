import "../stylesheets/index.scss";
const dragdealer = require("dragdealer");

var fearsBox = document.getElementsByClassName("fears-box")[0],
    fearsList = document.getElementsByClassName("fears-list")[0],
    fearBar = document.getElementsByClassName("fear-bar")[0],
    btnAddFear = document.getElementsByClassName("add-fear")[0],
    btnSortFear = document.getElementsByClassName("sort-fear")[0];

//set localStorage if it hasn't been set 
//already
if(localStorage.getItem("fears") == null){
  localStorage.setItem("fears",JSON.stringify([{"text":"Sample Fear","time":Date.now()}]));
  fillFears();
}
else{
  fillFears();
}

//note, when I use 'add' in a function name
//it refers to localStorage or another data object
//when I use 'fill' in a function name
//it refers to the DOM/view

function fillFears(){
  var storage = window.localStorage;
  if(storage.getItem("fears")){
    var fears = JSON.parse(storage.getItem("fears"));
    for(var i of fears){
      fillFear(i);
    }
  }
}

//adds a fear to localStorage
//localStorage.getItem("fears") is a 
//list of objects [{},{}]
function addFear(item){
  var fears = JSON.parse(window.localStorage.getItem("fears"));
  fears.push(item);
  
  window.localStorage.setItem("fears",JSON.stringify(fears));
  console.log("fear ",item, " added to localStorage.fears");
}
function updateFear(oldIndex,newItem){
  var fears = JSON.parse(window.localStorage.getItem("fears"));
  
  fears[oldIndex] = newItem;
  window.localStorage.setItem("fears",JSON.stringify(fears));
  console.log("Fear updated");
}
function updateInFear(oldIndex,updateTo){
  var fears = JSON.parse(window.localStorage.getItem("fears")),
      fear = fears[oldIndex];
  for(i of Object.keys(fear)){
    for(j of Object.keys(updateTo)){
      if(i == j){
        fear[i] = updateTo[j];
      }
    }
  }


  
  fears[oldIndex] = fear;
  window.localStorage.setItem("fears",JSON.stringify(fears));
  console.log("Fear updated in");
}

  
  function deleteFear(index){
    var fears = JSON.parse(window.localStorage.getItem("fears"));
    
    fears.splice(index,1);
    window.localStorage.setItem("fears",JSON.stringify(fears));
    console.log("Deleted fear");
  }
//takes an object
//and adds a filled fearComponent to
//the .fearsList
function fillFear(item){
  
  var fear = fearComponent(item);
  
  //make the fear divs slideable
  var slideBox = document.createElement("div");
  slideBox.classList.add("dragdealer");
  slideBox.appendChild(fear);
  

  
  var slider = new dragdealer(slideBox,{
    steps: 3,
    x: 0.5,
    loose: true
  });
  
  
  //actually fill fear here:
  fearsList.appendChild(slideBox);
  //reflow to activate sliders
  slider.reflow();
  
}

var fearActions = {"edit-fear" : editFear, "remove-fear": removeFear}

function fearComponent(fearData){
  var holder = document.createElement("div"),
      inputEdit = document.createElement("input"),
      text = document.createElement("p"),
      actionsHolder = document.createElement("div");
  
  var time = fearData.time;

  //events to holder

  holder.className += " holder handle";
  
  //allows editing mode 
  inputEdit.className += " input-edit col-7";
  
  //holds the fear text
  text.textContent = fearData.text;
  text.className += " fear-text";
  
  //holds actions like edit, delete, time
  actionsHolder.className += " actions-holder";
  actionsHolder.innerHTML = "<div class='time-fear'><i class='fa fa-clock-o' aria-hidden='true'></i></div><div  class='edit-fear'><i class='fa fa-pencil '  aria-hidden='true'></i></div><div class='remove-fear'><i class='fa fa-trash-o' aria-hidden='true'></i></div>"
  
  
  
  
  holder.appendChild(inputEdit);
  holder.appendChild(text);
  holder.appendChild(actionsHolder);

  actionsHolder.addEventListener("click",function actionsHandler(e){
    var classes = e.target.parentNode.className.split(" ");

    for(var c of classes){
      if(c.indexOf("-fear") != -1){
        fearActions[c](e.target.parentNode);
      }
    }
  });

  return holder;
}


//events

//fire whenever I want to add a fear
function eventAddFear(val){
  if(val != ""){
    var newFear = {"text" : val,"time" : Date.now()};
    addFear(newFear);
    fillFear(newFear);
    console.log("New fear added ",newFear);
  }
}


//input handling
//both desktop and mobile

//'click' covers both tap and click
btnAddFear.addEventListener("click",function clickAddFear(){
  eventAddFear(fearBar.value);
});

btnSortFear.addEventListener("click",function clickSortFear(){
  
});

fearBar.addEventListener("keydown",function enterAddFear(e){
  if(e.which == 13){
    eventAddFear(fearBar.value);
  }
});

function editFear(elem){
  var holder = elem.closest(".holder"),
      text = holder.querySelector(".fear-text"),
      editor = holder.querySelector(".input-edit"),
      index = Array.prototype.indexOf.call(fearsList.children,holder.parentNode);
  
  //hide the text and show the editor
  editor.value = text.textContent;
  text.style.display = "none";
  editor.style.display = "inline";
  editor.focus();
  
  editor.addEventListener("keydown",function editDone(e){
    if(e.which == 13){
      //updating data
      updateInFear(index,{"text" : editor.value});
      
      //hide the editor and show the text
      editor.blur();
      editor.style.display = "none";
      text.style.display = "inline";
      text.textContent = editor.value;
    }
  });
}
function removeFear(elem){
  var holder = elem.closest(".holder"),
      text = holder.querySelector(".fear-text"),
      editor = holder.querySelector(".input-edit"),
      index = Array.prototype.indexOf.call(fearsList.children,holder.parentNode);
  
  deleteFear(index);
  fearsList.removeChild(holder.parentNode);
}

function boxSlide(elem,x,y){
  elem.style.left = x;
  elem.style.top = y;
}

//style helpers
