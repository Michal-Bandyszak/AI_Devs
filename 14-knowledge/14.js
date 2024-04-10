import { getTask, sendAnswer } from "../api/api_connection.js";
import { invoke } from "../services/langchain.js";

const fetchCurrencyRates = async function (currency) {
  try {
    const response = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${currency}?format=json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch currency rates for ${currency}. HTTP status: ${response.status}`);
    }
    const data = await response.json();
    return data.rates[0].mid;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error; // Propagate the error for handling in the caller
  }
};

const fetchCountryPopulation = async function (countryName) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch population data for ${countryName}. HTTP status: ${response.status}`);
    }
    const data = await response.json();
    return data[0].population;
  } catch (error) {
    console.error("Error fetching country population:", error);
    throw error; // Propagate the error for handling in the caller
  }
};

const choice = async function () {
  try {
    const task = await getTask("knowledge");
    const answer = await invoke(
      task.question,
      "Based on the question choose one of the categories: currency, population, other."
    );
    console.log(answer);

    switch (answer) {
      case "currency":
        const currency = await invoke(
          `${task.question} `,
          "What currency is inside the question? Answer in 1 word ex. eur, pln, usd"
        );
        const currencyBase = await fetchCurrencyRates(currency);
        await sendAnswer({ answer: currencyBase });
        break;

      case "population":
        const country = await invoke(
          `${task.question} `,
          "What country is inside the question? Answer in 1 word ex. Poland, Germany"
        );
        const populationBase = await fetchCountryPopulation(country);
        await sendAnswer({ answer: populationBase });
        break;

      default:
        const ans = await invoke(
          task.question,
          "Answer the question in a straight way, withoud additional information."
        );
        await sendAnswer({ answer: ans });
    }
  } catch (error) {
    console.error("Error in choice function:", error);
  }
};

choice();
