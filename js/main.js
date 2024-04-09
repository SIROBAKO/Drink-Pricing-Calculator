window.onload = function() {
    const peopleElements = document.querySelectorAll('input[id*="people"]');

    const placeElements = document.querySelectorAll('input[id*="price"]');

    const closeElements = document.querySelectorAll('[id^="close"]');

    const modeDivs = document.querySelectorAll('#input-field > div');

    const drinkPriceElement = document.getElementById('drink-price');
    
    const selcetConsole = document.getElementById('mode-select');
    // const snackPriceElement = document.getElementById('snack-price');

    var regex = /^[0-9,]*$/;

    // 각 요소에 대해 이벤트 리스너를 추가합니다.
    peopleElements.forEach(element => {
        element.addEventListener('keyup', function(event) {
            if (event.key === "Backspace" && this.value === "") {
                return;
            }
            if (!regex.test(this.value)) {
                var numberValue = parseInt(this.value.replace(/,/g, ""), 10);
                if (!isNaN(numberValue)) {
                 
                    this.value = numberValue.toLocaleString();
                } else {
                
                    this.value = "";
                }
                alert("숫자만 입력해주세요.");
            }
        });
    });

    placeElements.forEach(element => {
        element.addEventListener('keyup', function(event) {

            if (event.key === "Backspace" && this.value === "") {
                return;
            }
    
            var numberValue = parseInt(this.value.replace(/,/g, ""));

            if (!regex.test(this.value)) {
                if (!isNaN(numberValue)) {
                    this.value = numberValue.toLocaleString();
                } else {
                    this.value = "";
                }
                alert("숫자만 입력해주세요.");
            }else{
                this.value = numberValue.toLocaleString();
            }
        });
    });
   
    closeElements.forEach(element => {
        element.addEventListener('click', function() {
            closeId = this.id.replace("close-","")
            modeDivs.forEach(function(div) {
                if (div.id === closeId) {
                    div.style.display = 'none';
                }
            });

            const modeDivsArray = Array.from(modeDivs);


            const allHidden = modeDivsArray.every(div => div.style.display === 'none');
    
            if (allHidden) {
                selcetConsole.value = 'default';
            }
        });

       
    });

    selcetConsole.addEventListener('change', function() {
        var selectedMode = this.value;
       
        modeDivs.forEach(function(div) {
            if (div.id === selectedMode || selectedMode==="mixed-mode") {
                div.style.display = 'block';
            }else {
                div.style.display = 'none';
            }
        });

    });



    drinkPriceElement.addEventListener('keyup', function(event){

        if (event.key === "Backspace" && this.value === "") {
            return;
        }
        const totalPriceInput = document.getElementById('total-price');
        const totalPrice = parseInt(totalPriceInput.value.replace(/[^0-9]/g, ''));
        const drinkPriceInput = document.getElementById('drink-price');
        const drinkPrice = parseInt(drinkPriceInput.value.replace(/[^0-9]/g, ''));
        const snackPriceInput = document.getElementById('snack-price');

        if(drinkPrice > totalPrice){
            alert("총가격보다 술값이 많습니다.")
            return;
        }else if(!isNaN(totalPrice)){
            snackPriceInput.value = (totalPrice - drinkPrice).toLocaleString();
        }
    })
}


let countDrinksPrice = 1;
let countNonDrinkPrice = 1;
const calculateTotalPrice = () => {
 
    const modeSelect = document.getElementById('mode-select');

    const selectedMode = modeSelect.value;

    // 선택된 모드에 따라 처리
    switch(selectedMode) {
        case 'default':
            calculateDefaultMode();
            break;
        case 'drinks':
            calculateDrinksMode();
            break;
        case 'no-alcohol':
            calculateNoAlcoholMode();
            break;
        case 'late-arrival':
            calculateLateArrivalMode();
            break;
        case 'mixed-mode':
            calculateMixedMode();
            break;
        default:
            console.error('잘못된 모드 선택');
    }
};

const addDrinksPrice = () => {
    countDrinksPrice++
    const drinksElement = document.getElementById('drinks');

    const itsOnPriceInput = document.createElement('input');
    itsOnPriceInput.setAttribute('id', 'its-on-price-' + countDrinksPrice );
    itsOnPriceInput.setAttribute('placeholder', `예: ${(countDrinksPrice-1) * 10000 + 30000}원` );


    const lastChild = drinksElement.children[drinksElement.children.length - 1];
    drinksElement.insertBefore(itsOnPriceInput, lastChild);
}

const addNonDrinkPrice = () => {
    countNonDrinkPrice++
    const drinksElement = document.getElementById('drinks');

    const itsOnPriceInput = document.createElement('input');
    itsOnPriceInput.setAttribute('id', 'its-on-price-' + countDrinksPrice );
    itsOnPriceInput.setAttribute('placeholder', `예: ${(countDrinksPrice-1) * 10000 + 30000}원` );


    const lastChild = drinksElement.children[drinksElement.children.length - 1];
    drinksElement.insertBefore(itsOnPriceInput, lastChild);
}

const calculateDefaultMode = () => {
    const totalPeopleInput = document.getElementById('total-people');
    const totalPeople = parseInt(totalPeopleInput.value.replace(/[^0-9]/g, '')); 
    
    const totalPriceInput = document.getElementById('total-price');
    const totalPrice = parseInt(totalPriceInput.value.replace(/[^0-9]/g, ''));

    if (isNaN(totalPeople) || isNaN(totalPrice)) {
        alert("올바른 값을 입력하세요.");
        return;
    }
    
    const amountPerPerson = Math.round(totalPrice / totalPeople);
    
    const resultField = document.getElementById('result-field');
    resultField.innerHTML = `<p> 인원당 ${amountPerPerson.toLocaleString()} 원을 지불해야 합니다.</p>`;
};



const calculateNoAlcoholMode = () => {
    
    const nonDrinkPeopleInput = document.getElementById('non-drink-price');
    const nonDrinkPeople = parseInt(nonDrinkPeopleInput.value.replace(/[^0-9]/g, '')); 
    
    
    const drinkPriceInput = document.getElementById('drink-price');
    const drinkPrice = parseInt(drinkPriceInput.value.replace(/[^0-9]/g, '')); 
    
    
    const snackPriceInput = document.getElementById('snack-price');
    const snackPrice = parseInt(snackPriceInput.value.replace(/[^0-9]/g, ''));
    
    if (isNaN(nonDrinkPeople) || isNaN(drinkPrice) || isNaN(snackPrice)) {
        alert("올바른 값을 입력하세요.");
        return;
    }
    
    const totalPeopleInput = document.getElementById('total-people');
    const totalPeople = parseInt(totalPeopleInput.value.replace(/[^0-9]/g, '')); 
    const drinkPeople = totalPeople - nonDrinkPeople;
    
    
    const drinkCostPerPerson = drinkPeople === 0 ? 0 : drinkPrice / drinkPeople;
    const snackCostPerPerson = snackPrice / totalPeople;
    
    const drinkPeoplePrice = Math.round(drinkCostPerPerson + snackCostPerPerson).toLocaleString();
    const nonDrinkPeoplePrice = Math.round(snackCostPerPerson).toLocaleString();
    
    const resultField = document.getElementById('result-field');
    resultField.innerHTML = `<p>술을 마신 인원은 인원당 ${drinkPeoplePrice } 원을, 술을 마시지 않은 인원은 인원당 ${nonDrinkPeoplePrice} 원을 지불해야 합니다.</p>`;
};
const calculateDrinksMode = () => {

    const totalPeopleInput = document.getElementById('total-people');
    const totalPriceInput = document.getElementById('total-price');
    const itsOnPriceInputs = document.querySelectorAll('[id^=its-on-price]');
    const additionalPaymentPriceInput = document.getElementById('additional-payment-price');


    const totalPeople = parseInt(totalPeopleInput.value);
    const totalPrice = parseInt(totalPriceInput.value.replace(/[^0-9]/g, ''));
    const additionalPaymentPriceChecked = additionalPaymentPriceInput.checked;


    let totalItsOnPrice = 0;
    itsOnPriceInputs.forEach(input => {
        totalItsOnPrice += parseInt(input.value.replace(/[^0-9]/g, ''));
    });

    let itsOnPricePerPerson, additionalPayment;
    const resultField = document.getElementById('result-field');
    if (!additionalPaymentPriceChecked) {
        itsOnPricePerPerson = totalItsOnPrice;
        additionalPayment = Math.round((totalPrice - totalItsOnPrice) / (totalPeople - itsOnPriceInputs.length));
        resultField.innerHTML = `<p>멋쟁이 ${itsOnPriceInputs.length}분이 ${totalItsOnPrice}원을 내준 덕분에<br>나머지 인원은 ${additionalPayment}원만 지불하면 됩니다.</p>`;
    } else {
        additionalPayment = Math.round((totalPrice - totalItsOnPrice) / totalPeople);
        resultField.innerHTML = `<p>멋쟁이 ${itsOnPriceInputs.length}분이 ${totalItsOnPrice}원을 내줬지만 배응망덕한 나머지 인원 덕분에 멋쟁이 포함 모두 ${additionalPayment}원씩 지불하면 됩니다.</p>`;
    }

   
};


const calculateLateArrivalMode = () => {
    // 나는 늦게왔자나 모드의 계산 로직을 구현하세요
};

const calculateMixedMode = () => {
    // 종합 모드의 계산 로직을 구현하세요
};
