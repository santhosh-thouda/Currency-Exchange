const dropList = document.querySelectorAll(".drop-list select"),
      fromCurrency = document.querySelector(".from select"),
      toCurrency = document.querySelector(".to select"),
      getButton = document.querySelector("form button"),
      exchangeIcon = document.querySelector(".drop-list .icon"),
      fromFlag = document.querySelector(".from img"),
      toFlag = document.querySelector(".to img");

dropList.forEach((select, i) => {
    for (let currency_code in country_code) {
        let selected = (i === 0 && currency_code === "USD") || (i === 1 && currency_code === "INR") ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        select.insertAdjacentHTML("beforeend", optionTag);
    }

    select.addEventListener("change", (e) => {
        updateFlag(e.target, i === 0 ? fromFlag : toFlag);
    });
});

function updateFlag(element, flagImg) {
    let currencyCode = element.value;
    let countryCode = country_code[currencyCode];

    if (countryCode) {
        flagImg.src = `https://flagcdn.com/w40/${countryCode}.png`;
    } else {
        flagImg.src = "https://via.placeholder.com/40"; // Placeholder for missing flags
    }
}

// Swap Currencies on Click
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
    getExchangeRate();
});

// Fetch Exchange Rate
function getExchangeRate() {
    let amount = document.querySelector(".amount input"),
        amountVal = amount.value;
    
    if (amountVal === "" || amountVal === "0") {
        amount.value = "1";
        amountVal = 1;
    }

    let apiKey = "cd346ded3fc84978717427e2"; // Replace with actual API key
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            if (!exchangeRate) {
                alert("Exchange rate not found. Try again!");
                return;
            }
            document.querySelector(".exchange-rate").innerText = `${amountVal} ${fromCurrency.value} = ${(amountVal * exchangeRate).toFixed(2)} ${toCurrency.value}`;
        })
        .catch(() => {
            alert("Error fetching exchange rate. Try again!");
        });
}

// Initial Flag Setup
updateFlag(fromCurrency, fromFlag);
updateFlag(toCurrency, toFlag);

getButton.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});
