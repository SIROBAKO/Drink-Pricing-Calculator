const regex = /^[0-9,]*$/;

window.onload = function () {
    const peopleElements = document.querySelectorAll('input[id*="people"]');
    const placeElements = document.querySelectorAll('input[id*="price"]');
    const percentElements = document.querySelectorAll('input[id*="percent"]');
    const closeElements = document.querySelectorAll('[id^="close"]');
    const explainElements = document.querySelectorAll('#result-field > div');
    const modeDivs = document.querySelectorAll('#input-field > div:not(#default)');
    const drinkPriceElement = document.getElementById('drink-price');
    const selectConsole = document.getElementById('mode-select');
    const totalPriceInput = document.getElementById('total-price');
    const snackPriceInput = document.getElementById('snack-price');
    const drinkPriceInput = document.getElementById('drink-price');

    // 숫자 입력 이벤트 핸들러 함수
    function handleNumberInput(event, element, maxValue = Infinity) {
        const inputValue = element.value.replace(/,/g, '');
        const numberValue = parseInt(inputValue);

        if (event.key === "Backspace" && inputValue === "") {
            return;
        }

        if (!regex.test(inputValue)) {
            alert("숫자만 입력해주세요.");
            element.value = '';
        } else if (!isNaN(numberValue) && numberValue <= maxValue) {
            element.value = numberValue.toLocaleString();
        } else {
            alert(`값은 ${maxValue} 이하여야 합니다.`);
            element.value = maxValue.toLocaleString();
        }
    }

    // 닫기 버튼 클릭 이벤트 핸들러 함수
    function handleCloseButtonClick() {
        const closeId = this.id.replace("close-", "");
        modeDivs.forEach(div => {
            if (div.id === closeId) {
                div.style.display = 'none';
            }
        });

        const allHidden = Array.from(modeDivs).every(div => div.style.display === 'none');
        if (allHidden) {
            selectConsole.value = 'default';
        }
    }

    // 콘솔 선택 이벤트 핸들러 함수
    function handleSelectConsoleChange() {
        const selectedMode = this.value;

        modeDivs.forEach(div => {
            div.style.display = (div.id === selectedMode || selectedMode === "mixed-mode") ? 'block' : 'none';
        });

        explainElements.forEach(explain => {
            explain.style.display = explain.id.includes(selectedMode) ? 'block' : 'none';
        });
    }

    // 음료 가격 입력 이벤트 핸들러 함수
    function handleDrinkPriceInput() {
        const drinkPrice = parseInt(this.value.replace(/[^0-9]/g, ''));

        if (drinkPrice > parseInt(totalPriceInput.value.replace(/[^0-9]/g, ''))) {
            alert("총가격보다 술값이 많습니다.")
            this.value = totalPriceInput.value.toLocaleString();
        } else if (!isNaN(drinkPrice)) {
            snackPriceInput.value = (parseInt(totalPriceInput.value.replace(/[^0-9]/g, '')) - drinkPrice).toLocaleString();
        }
    }

    function handleSnackPriceInput() {
        const snackPrice = parseInt(this.value.replace(/[^0-9]/g, ''));

        if (snackPrice > parseInt(totalPriceInput.value.replace(/[^0-9]/g, ''))) {
            alert("총가격보다 안주값이 많습니다.")
            this.value = totalPriceInput.value.toLocaleString();
        } else if (!isNaN(snackPrice)) {
            drinkPriceInput.value = (parseInt(totalPriceInput.value.replace(/[^0-9]/g, '')) - snackPrice).toLocaleString();
        }
    }

    // 각 입력 요소에 대한 이벤트 리스너 등록
    function addEventListeners() {
        peopleElements.forEach(element => {
            element.addEventListener('keyup', event => handleNumberInput(event, element));
        });

        placeElements.forEach(element => {
            element.addEventListener('keyup', event => handleNumberInput(event, element));
        });

        percentElements.forEach(element => {
            element.addEventListener('keyup', event => handleNumberInput(event, element, 999));
        });

        closeElements.forEach(element => {
            element.addEventListener('click', handleCloseButtonClick);
        });

        selectConsole.addEventListener('change', handleSelectConsoleChange);

        drinkPriceElement.addEventListener('keyup', handleDrinkPriceInput);
        snackPriceInput.addEventListener('keyup', handleSnackPriceInput);
    }

    // 초기화
    addEventListeners();
};

let countItsOnPrice = 1;
let countLateArrivalPeople = 1;

const calculateTotalPrice = () => {

    const modeSelect = document.getElementById('mode-select');

    const selectedMode = modeSelect.value;

    // 선택된 모드에 따라 처리
    switch (selectedMode) {
        case 'default':
            calculateDefaultMode();
            break;
        case 'its-on':
            calculateItsOnMode();
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
const closeExplain = () => {
    const explainElements = document.querySelectorAll('[id*="explain"]');
    explainElements.forEach(element => {
        element.style.display = 'none';
    });
}

const validateInput = (inputElement, regex, maxValue) => {
    let inputValue = inputElement.value;
    const numberValue = parseInt(inputValue.replace(/,/g, ""));

    if (!regex.test(inputValue)) {
        if (!isNaN(numberValue)) {
            alert("숫자만 입력해주세요.");
            inputElement.value = numberValue.toLocaleString();
        } else {
            alert("숫자만 입력해주세요.");
            inputElement.value = "";
        }
    } else if (numberValue > maxValue) {
        alert(`최대값은 ${maxValue}입니다.`);
        inputElement.value = maxValue.toLocaleString();
    } else {
        inputElement.value = numberValue.toLocaleString();
    }
}

const addItsOnPrice = () => {
    const countItsOnPrice = document.querySelectorAll('[id^="its-on-price-"]').length + 1;

    const itsOnElement = document.getElementById('its-on');

    const itsOnPriceInput = document.createElement('input');
    itsOnPriceInput.setAttribute('id', `its-on-price-${countItsOnPrice}`);
    itsOnPriceInput.setAttribute('placeholder', `예: ${(countItsOnPrice - 1) * 10000 + 30000}원`);
    itsOnPriceInput.addEventListener('keyup', () => validateInput(itsOnPriceInput, regex));

    itsOnElement.insertBefore(itsOnPriceInput, itsOnElement.children[itsOnElement.children.length - 1]);

}

const addLateArrivalPeople = () => {
    const countLateArrivalPeople = document.querySelectorAll('[id^="late-people-"]').length + 1;

    const lateArrivalElement = document.getElementById('late-arrival');
    const hrElement = document.createElement('hr');

    const labelElement1 = document.createElement('label');
    labelElement1.setAttribute('for', `late-people-${countLateArrivalPeople}`);
    labelElement1.textContent = '늦게온 인원수';

    const inputElement1 = document.createElement('input');
    inputElement1.setAttribute('id', `late-people-${countLateArrivalPeople}`);
    inputElement1.setAttribute('placeholder', `예: ${countLateArrivalPeople}명`);

    const labelElement2 = document.createElement('label');
    labelElement2.setAttribute('for', `late-percent-${countLateArrivalPeople}`);
    labelElement2.textContent = '할당 %';

    const inputElement2 = document.createElement('input');
    inputElement2.setAttribute('id', `late-percent-${countLateArrivalPeople}`);
    inputElement2.setAttribute('placeholder', `예: ${(countLateArrivalPeople - 1) * 10 + 40}%`);
    inputElement2.addEventListener('keyup', () => validateInput(inputElement2, regex, 999));

    const lastChild = lateArrivalElement.lastElementChild;
    lateArrivalElement.insertBefore(inputElement2, lastChild);
    lateArrivalElement.insertBefore(labelElement2, inputElement2);
    lateArrivalElement.insertBefore(inputElement1, labelElement2);
    lateArrivalElement.insertBefore(labelElement1, inputElement1);
    lateArrivalElement.insertBefore(hrElement, labelElement1);
}

function isNanAlert(elements) {
    for (const element of elements) {
        if (element.value.trim() === '') {
            element.focus();
            alert("값을 입력하세요.");
            return false;
        }
    }
    return true;
}

function extractIntegerValue(inputElement) {
    const value = inputElement.value.replace(/[^0-9]/g, '');
    return value ? parseInt(value) : 0;
}


const calculateDefaultMode = () => {
    const totalPeopleInput = document.getElementById('total-people');
    const totalPriceInput = document.getElementById('total-price');

    const elements = [totalPeopleInput, totalPriceInput];

    if (!isNanAlert(elements)) {
        return;
    }

    const totalPeople = extractIntegerValue(totalPeopleInput);
    const totalPrice = extractIntegerValue(totalPriceInput);

    const amountPerPerson = Math.round(totalPrice / totalPeople);

    displayResults(totalPeople, totalPrice, amountPerPerson);
};

function displayResults(totalPeople, totalPrice, amountPerPerson) {
    const resultField = document.getElementById('calculator-result');
    resultField.innerHTML = `<p>총 인원 : ${totalPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>총 금액 : ${totalPrice.toLocaleString()} 원</p>`;
    resultField.innerHTML += `<p></p><hr/><p></p>`;
    resultField.innerHTML += `<p><br />1인당 ${amountPerPerson.toLocaleString()} 원을 지불해야 합니다.</p>`;
    resultField.style.display = 'block'
    resultField.scrollIntoView()
    closeExplain();
}


const calculateNoAlcoholMode = () => {

    const totalPeopleInput = document.getElementById('total-people');
    const totalPriceInput = document.getElementById('total-price');
    const nonDrinkPeopleInput = document.getElementById('non-drink-price');
    const drinkPriceInput = document.getElementById('drink-price');
    const snackPriceInput = document.getElementById('snack-price');

    const elements = [totalPeopleInput, totalPriceInput, nonDrinkPeopleInput, drinkPriceInput, snackPriceInput];

    if (!isNanAlert(elements)) {
        return;
    }


    const totalPeople = extractIntegerValue(totalPeopleInput);
    const nonDrinkPeople = extractIntegerValue(nonDrinkPeopleInput);
    const totalPrice = extractIntegerValue(totalPriceInput);
    const drinkPrice = extractIntegerValue(drinkPriceInput);
    const snackPrice = extractIntegerValue(snackPriceInput);
    const drinkPeople = totalPeople - nonDrinkPeople;


    if (totalPeople <= nonDrinkPeople) {
        nonDrinkPeopleInput.focus();
        alert("술 안마신 인원수를 체크해주세요");
        return;
    }
    if (totalPrice !== snackPrice + drinkPrice) {
        drinkPriceInput.focus();
        alert("값 입력이 올바르지 않습니다.");
        return;
    }


    const drinkCostPerPerson = drinkPeople === 0 ? 0 : drinkPrice / drinkPeople;
    const snackCostPerPerson = snackPrice / totalPeople;

    const drinkPeoplePrice = Math.round(drinkCostPerPerson + snackCostPerPerson).toLocaleString();
    const nonDrinkPeoplePrice = Math.round(snackCostPerPerson).toLocaleString();

    displayResultsWithDrinkNonDrink(totalPeople, totalPrice, snackPrice, drinkPrice, drinkPeople, drinkPeoplePrice, nonDrinkPeople, nonDrinkPeoplePrice);
};

function displayResultsWithDrinkNonDrink(totalPeople, totalPrice, snackPrice, drinkPrice, drinkPeople, drinkPeoplePrice, nonDrinkPeople, nonDrinkPeoplePrice) {
    const resultField = document.getElementById('calculator-result');
    resultField.innerHTML = `<p>총 인원 : ${totalPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>총 금액 : ${totalPrice.toLocaleString()} 원</p>`;
    resultField.innerHTML += `<p>안주값 : ${snackPrice.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>술값 : ${drinkPrice.toLocaleString()} 원</p>`;
    resultField.innerHTML += `<p></p><hr/><p></p>`;
    resultField.innerHTML += `<p>음주인원 : ${drinkPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>음주인원 1인당 ${drinkPeoplePrice.toLocaleString()} 원을 지불해야 합니다.</p>`;
    resultField.innerHTML += `<p><br />술찌인원 : ${nonDrinkPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>술찌인원 1인당 ${nonDrinkPeoplePrice.toLocaleString()} 원을 지불해야 합니다.</p>`;
    resultField.style.display = 'block'
    resultField.scrollIntoView()
    closeExplain();
}


const calculateItsOnMode = () => {
    const totalPeopleInput = document.getElementById('total-people');
    const totalPriceInput = document.getElementById('total-price');
    const itsOnPriceInputs = document.querySelectorAll('[id^=its-on-price]');

    const elements = [totalPeopleInput, totalPriceInput];
    const itsOnInputs = getValidInputs(itsOnPriceInputs);

    if (!isNanAlert(elements)) {
        return;
    }

    if (itsOnInputs.length === 0) {
        document.getElementById("its-on-price-1").focus();
        alert("값을 입력해주세요");
        return;
    }

    const totalPeople = extractIntegerValue(totalPeopleInput);
    const totalPrice = extractIntegerValue(totalPriceInput);
    const itsOnPeople = itsOnInputs.length;

    let totalItsOnPrice = 0;
    itsOnInputs.forEach(input => {
        totalItsOnPrice += extractIntegerValue(input);
    });

    if (totalPrice < totalItsOnPrice) {
        alert("멋쟁이가 너무 많이 내는 거 같은데요?");
        return;
    }

    const paymentPeople = totalPeople - itsOnPeople;
    const additionalPayment = Math.round((totalPrice - totalItsOnPrice) / paymentPeople);

    displayItsOnResults(totalPeople, totalPrice, itsOnPeople, totalItsOnPrice, paymentPeople, additionalPayment);
};

const getValidInputs = (inputs) => {
    return Array.from(inputs).filter(input => input.value !== '' && parseFloat(input.value) !== 0);
};

const displayItsOnResults = (totalPeople, totalPrice, itsOnPeople, totalItsOnPrice, paymentPeople, additionalPayment) => {
    const resultField = document.getElementById('calculator-result');
    resultField.innerHTML = `<p>총 인원 : ${totalPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>총 금액 : ${totalPrice.toLocaleString()} 원</p>`;
    resultField.innerHTML += `<p>멋쟁이 : ${itsOnPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>선지불 금액 : ${totalItsOnPrice.toLocaleString()} 원</p>`;
    resultField.innerHTML += `<p></p><hr/><p></p>`;
    resultField.innerHTML += `<p>정산 인원 : ${paymentPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>1인당 ${additionalPayment.toLocaleString()} 원을 지불해야 합니다.</p>`;
    resultField.style.display = 'block';
    resultField.scrollIntoView();
    closeExplain();
};


const calculateLateArrivalMode = () => {
    const totalPeopleInput = document.getElementById('total-people');
    const totalPriceInput = document.getElementById('total-price');
    const latePeopleInputs = document.querySelectorAll('[id^=late-people]');
    const latePercentInputs = document.querySelectorAll('[id^=late-percent]');

    const elements = [totalPeopleInput, totalPriceInput];
    const latePeople = getValidInputs(latePeopleInputs);
    const latePercent = getValidInputs(latePercentInputs);

    if (!isNanAlert(elements)) {
        return;
    }

    if (latePeople.length !== latePercent.length) {
        alert("값을 제대로 입력해주세요");
        return;
    }

    const totalPeople = extractIntegerValue(totalPeopleInput);
    const totalPrice = extractIntegerValue(totalPriceInput);

    let latePeopleCount = 0;
    latePeople.forEach(input => {
        latePeopleCount += extractIntegerValue(input);
    });

    if (latePeopleCount >= totalPeople) {
        alert("늦게온 인원이 전체인원과 같거나 더 많습니다.");
        return;
    }

    let nonLatePeople = totalPeople - latePeople.length;

    let tempDenominator = nonLatePeople;
    for (let i = 0; i < latePeople.length; i++) {
        tempDenominator += extractIntegerValue(latePeople[i]) * parseFloat(latePercent[i].value) / 100;
    }

    let tempTotalPayment = totalPrice / tempDenominator;

    displayLateArrivalResults(totalPeople, totalPrice, latePeople, latePercent, nonLatePeople, tempTotalPayment);
};

const displayLateArrivalResults = (totalPeople, totalPrice, latePeople, latePercent, nonLatePeople, tempTotalPayment) => {
    const resultField = document.getElementById('calculator-result');
    resultField.innerHTML = `<p>총 인원 : ${totalPeople.toLocaleString()} 명</p>`;
    resultField.innerHTML += `<p>총 금액 : ${totalPrice.toLocaleString()} 원</p>`;

    latePeople.forEach((input, i) => {
        resultField.innerHTML += `<p>${parseFloat(latePercent[i].value).toLocaleString()}% 할당그룹 인원 : ${extractIntegerValue(input).toLocaleString()} 명</p>`;
    });

    resultField.innerHTML += `<p></p><hr/><p></p>`;

    latePeople.forEach((input, i) => {
        let tempPayment = Math.round(tempTotalPayment * parseFloat(latePercent[i].value) / 100);
        resultField.innerHTML += `<p>${parseFloat(latePercent[i].value).toLocaleString()}% 할당그룹 ${extractIntegerValue(input).toLocaleString()} 명은 ${tempPayment.toLocaleString()} 원을 지불해야 합니다.</p>`;
    });

    resultField.innerHTML += `<p><br />기본그룹 ${nonLatePeople.toLocaleString()} 명은 ${Math.round(tempTotalPayment).toLocaleString()} 원을 지불해야 합니다.</p>`;
    resultField.style.display = 'block';
    resultField.scrollIntoView();
    closeExplain();
};

const calculateMixedMode = () => {
    // 실효성 및 복잡성으로 구현을 연기합니다.
};


