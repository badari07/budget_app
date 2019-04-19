//Budget controler
var budgetControler=(function(){

    class Expenses {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
        calcpercentage(totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            }
            else {
                this.percentage = -1;
            }
        }
        getpercentage() {
            return this.percentage;
        }
    }



    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    var calculateTotal =function(type){
       var sum=0;
        data.allItems[type].forEach(cur =>
            sum+=cur.value);
        data.totals[type]=sum;
    };


    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        persentage:-1
    }

    return {
        addItem:function(type,des,val){
            var newItem,Id;
            if (data.allItems[type].length>0){
            Id= data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id=0;
            }
            if(type==='exp'){
                    newItem=new Expenses(Id,des,val);
            } else if(type==='inc'){
                    newItem=new Income(Id,des,val);
            }

        data.allItems[type].push(newItem);
        return newItem;

        },

        deleteItem:function(type,id){  

             var ids, index;

             ids = data.allItems[type].map( current => 
                  current.id);

             index = ids.indexOf(id);

             if (index !== -1) {
                 data.allItems[type].splice(index, 1);
             }      

        },
        
        calculateBudget:function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget= data.totals.inc -data.totals.exp;

            if(data.totals.inc>0){
            data.persentage= Math.round((data.totals.exp / data.totals.inc)*100);
            } else{
                data.persentage = -1;
            }

        },

        calculatePercentages:function(){
            data.allItems.exp.forEach(cur =>
                cur.calcpercentage(data.totals.inc));

        },

        getpercentage:function(){
              var allper=data.allItems.exp.map(cur =>
                   cur.getpercentage());
              
              return allper;
        },


        getBudget:function(){

             return {
                 budget:data.budget,
                 totalInc:data.totals.inc,
                 totalExp:data.totals.exp,
                 percentage:data.persentage
             }
        },

        testing:function(){
            return data;
        }
    }
            

    
 
})();


//UI controler
var UIControler= (function(){


    var DomStrings={
        inputType: '.add__type',
        inputDiscription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLab: '.budget__value',
        incomeBudgetLab: '.budget__income--value',
        expenseBudgetLab: '.budget__expenses--value',
        percentageLab: '.budget__expenses--percentage',
        container: '.container',
        expencepercLab: '.item__percentage',
        dateLab: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

     var nodeListFoeEach = function (list, callback) {
         for (var i = 0; i < list.length; i++) {
             callback(list[i], i)
         }
     };


    return {
        getInput: function(){

            return {
                type: document.querySelector(DomStrings.inputType).value,
                discription :document.querySelector(DomStrings.inputDiscription).value,
                value : parseFloat( document.querySelector(DomStrings.inputValue).value)
        
            }
        },

        addListItem: function(obj,type ){

            var html,newHtml,element;

            if (type === 'inc') {
                element = DomStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element=DomStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber( obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem:function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields:function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DomStrings.inputDiscription + ', ' + DomStrings.inputValue);

            fieldsArr = Array.from(fields);

            fieldsArr.forEach(current => 
                current.value = "");

            fieldsArr[0].focus();

        },

        displayBudget:function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DomStrings.budgetLab).textContent= formatNumber( obj.budget, type);
            document.querySelector(DomStrings.incomeBudgetLab).textContent = formatNumber( obj.totalInc, 'inc');
            document.querySelector(DomStrings.expenseBudgetLab).textContent = formatNumber( obj.totalExp,'exp');
            if(obj.percentage > 0){
                document.querySelector(DomStrings.percentageLab).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DomStrings.percentageLab).textContent = '---'

            }

        },

        displayPercentages:function(percentage){

                var fields= document.querySelectorAll(DomStrings.expencepercLab);

               
                nodeListFoeEach(fields,function(current,index){
                    if(percentage[index]>0){
                        current.textContent =percentage[index] + '%';

                    }else{
                        current.textContent='---';
                    }

                });



        },

        displayMonth:function(){
            var now,year,month;
            now = new Date();

            months=['jan','feb','mar','apr','may','jun','july','aug','sep','oct','nov','dec'];
            month=now.getMonth();
            year=now.getFullYear();

            document.querySelector(DomStrings.dateLab).textContent= months[month] +','+ ' '+  year;


        },

        changeType:function(){

            var field=document.querySelectorAll(DomStrings.inputType + ',' + DomStrings.inputDiscription + ','+ DomStrings.inputValue);

            nodeListFoeEach(field,function(cur){
                cur.classList.toggle('red-focus');
            });


            document.querySelector(DomStrings.inputButton).classList.toggle('red');

        },


        getDomstrings: function(){
            return DomStrings;
        }


    }


})();



//Globel app controler
var controler=(function(bud,uic){


    var budgetUpdate= function(){
        bud.calculateBudget();
        var budget= bud.getBudget();
        uic.displayBudget(budget);

    };

    var updatePercentages= function(){

        bud.calculatePercentages();
        var percentages= bud.getpercentage();
        uic.displayPercentages(percentages);
    };

    var cntrlAddItiem=function(){
        var input,newItem;
         
        input= uic.getInput();

        if(input.discription !="" && !isNaN(input.value) && input.value >0){
        newItem =  bud.addItem(input.type,input.discription,input.value);
        uic.addListItem(newItem,input.type);
        uic.clearFields();
        budgetUpdate();
        updatePercentages();

        }

    };


    var cntrlDelItiem= function(event){
        var itemId,spliId,type,Id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        spliId=itemId.split('-');
        type=spliId[0];
        Id=parseInt(spliId[1]);
        bud.deleteItem(type,Id);

        uic.deleteListItem(itemId);
        budgetUpdate();
        updatePercentages();

    };


    var setupEventListeners=function(){

            var Dom = uic.getDomstrings();

            document.querySelector(Dom.inputButton).addEventListener('click', cntrlAddItiem);

            document.querySelector(Dom.container).addEventListener('click',cntrlDelItiem);

            document.querySelector(Dom.inputType).addEventListener('change',uic.changeType);


            document.addEventListener('keypress', function (event) {


                if (event.keyCode === 13 || event.which === 13) {
                    cntrlAddItiem();
                }
            });

    }


    return {
        init:function(){
             uic.displayBudget({
                    budget: 0,
                     totalInc: 0,
                     totalExp: 0,
                     percentage:-1
             });
            setupEventListeners();
            uic.displayMonth();
        }
    }

   

})(budgetControler,UIControler);

controler.init()