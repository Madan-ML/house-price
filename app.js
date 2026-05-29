const form = document.querySelector("#price-form");
const priceOutput = document.querySelector("#price-output");
const confidenceOutput = document.querySelector("#confidence-output");
const breakdownList = document.querySelector("#breakdown-list");

const locationSettings = {
  rural: {
    label: "Rural",
    basePrice: 90000,
    pricePerSquareFoot: 105,
  },
  suburban: {
    label: "Suburban",
    basePrice: 145000,
    pricePerSquareFoot: 155,
  },
  city: {
    label: "City center",
    basePrice: 220000,
    pricePerSquareFoot: 235,
  },
  premium: {
    label: "Premium neighborhood",
    basePrice: 310000,
    pricePerSquareFoot: 325,
  },
};

function getFormNumber(formData, name) {
  return Number(formData.get(name));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function predictPrice(values) {
  const location = locationSettings[values.location];
  const areaValue = values.area * location.pricePerSquareFoot;
  const bedroomValue = values.bedrooms * 18000;
  const bathroomValue = values.bathrooms * 14000;
  const parkingValue = values.parking * 9000;
  const ageDiscount = Math.min(values.age * 2500, 95000);

  const estimatedPrice =
    location.basePrice +
    areaValue +
    bedroomValue +
    bathroomValue +
    parkingValue -
    ageDiscount;

  return {
    estimatedPrice: Math.max(50000, estimatedPrice),
    breakdown: [
      ["Location baseline", location.basePrice],
      ["Square footage", areaValue],
      ["Bedrooms", bedroomValue],
      ["Bathrooms", bathroomValue],
      ["Parking", parkingValue],
      ["Age adjustment", -ageDiscount],
    ],
  };
}

function renderPrediction(result) {
  priceOutput.textContent = formatMoney(result.estimatedPrice);
  confidenceOutput.textContent =
    "Demo estimate based on weighted features, not real market data.";

  breakdownList.innerHTML = "";
  result.breakdown.forEach(([label, value]) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const amount = document.createElement("strong");

    name.textContent = label;
    amount.textContent = formatMoney(value);

    item.append(name, amount);
    breakdownList.append(item);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const values = {
    location: formData.get("location"),
    area: getFormNumber(formData, "area"),
    bedrooms: getFormNumber(formData, "bedrooms"),
    bathrooms: getFormNumber(formData, "bathrooms"),
    age: getFormNumber(formData, "age"),
    parking: getFormNumber(formData, "parking"),
  };

  renderPrediction(predictPrice(values));
}

form.addEventListener("submit", handleSubmit);
form.requestSubmit();
