 // Budget Controller
var budgetController = (function(){
    
    var Expense, Income, calculateTotal, data;

     Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

     Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

     calculateTotal =  function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
            data.totals[type] = sum;
        });
    } ;
     
     data = {
        
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },

        budget: 0,
        percentage: -1
    };

    return {
        addNewItem:function(type, des, val){
            var newItem, ID;
            // Create new id
            if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                ID = 0;
            }

            // Create new item depending on 'exp' or 'inc' type.
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else{
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
           data.allItems[type].push(newItem);

           // return the new element
           return newItem;
        },

        deleteItem: function(type, id){
             var ids = data.allItems[type].map(function(current){
                return current.id;
             });

             console.log(ids);
             index = ids.indexOf(id);

             if (index !== -1 ){
                data.allItems[type].splice(index,1); // arrguments(position to begin, no of items to be deleted)
             }
        },

        calculateBudget:function(){
            // calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget: income - expenses
            //console.log(data);
            data.budget = data.totals.inc - data.totals.exp;
            //console.log('this is budget'+ data.budget);

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/ data.totals.inc)* 100);
            }
            else{
                data.percentage = -1;
            }
            

        },

        getBudget: function(){
            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

})();



// UI Controller
var UIController = (function(){

    var DOMStrings = {
        inpuType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'  

    };
    // some code
    return {
        getinput: function () {
            return {
                 type:document.querySelector(DOMStrings.inpuType).value, // Wiil be either 'income' or 'expense'.
            description :document.querySelector(DOMStrings.inputDescription).value,
             value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
            
        },

        addListItem: function(obj, type){
                var html, newHtml,htmlElement, htmlContainer, htmlDiv; 
                // Create html string with placeholder text.
                if (type === 'inc'){
                    htmlElement = DOMStrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div '+
               'class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">'+
             '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }
               else if (type === 'exp'){
                htmlElement = DOMStrings.expensesContainer; 
                html  =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    
               }

                //Replace the placeholder text with some actual data.
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);
                htmlDiv = document.createElement("div");
                htmlDiv.innerHTML = newHtml;
                //Insert the html into the DOM
                //htmlContainer = document.querySelector(htmlElement);
                
                document.querySelector(htmlElement).insertAdjacentElement('beforeend', htmlDiv);
                 

        },

        clearFields: function(){
                var fields, fieldsArr;
                fields = document.querySelectorAll(DOMStrings.inputDescription+", "+ DOMStrings.inputValue); // Will return nodelist of all input tags content of respective classes
                 fieldsArr = Array.prototype.slice.call(fields);
                 fieldsArr.forEach(function(current, index, array) {
                    
                     current.value = ""; // assigns the value of the input field of the current html class value to empty string
                     
                 });

                 fieldsArr[0].focus();
                 
        },


        displayBudget: function(obj){
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
                

                if (obj.percentage > 0){
                    document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage+ '%';
                }
                else {
                    document.querySelector(DOMStrings.percentageLabel).textContent = '---';
                }

        },

        deleteListItem: function(selectorID){
                var el;
                el = document.getElementById(selectorID)
             el.parentNode.removeChild(el);
        },

        getDOMStrings: function(){ // This variable is created to push the DOMStrings variable into public context.
            return DOMStrings;
        }
    };
})();


// Global app controller

var controller = (function(bdgtctrl, UICtrl){ // Creating an IIFE with arguments  
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
                
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){

        // Calaculate the budget
        bdgtctrl.calculateBudget();

        // Return the budget

        var budget = bdgtctrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function () {
        var item, newItem;
            
        // get the filled input data
        input = UICtrl.getinput(); 

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // add the item to the budget controller 
        newItem = bdgtctrl.addNewItem(input.type, input.description, input.value);
        //add the item to the UI

        UICtrl.addListItem(newItem,input.type);

        // Clear the fields
        UICtrl.clearFields();

        // Calculate the budget
            updateBudget();
        // Display the budget on the UI
        }  
        
};
var ctrlDeleteItem = function(event){
    var itemID, splitID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);
    if (itemID){
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // delete the item from the data structure
        bdgtctrl.deleteItem(type, ID );
        // Delete the Item from the Ui
        UICtrl.deleteListItem(itemID); 

        // update and show the new budget
        updateBudget();

        }
};

  return {
      init: function(){
        console.log('Application has Started.');
        UICtrl.displayBudget({
            budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: 0
        });
        setupEventListeners();
      }


  };
})(budgetController, UIController);

controller.init(); 
//console.log("This is item description: "+controller. );
