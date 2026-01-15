// Sample JavaScript code with various issues for testing

// Security Issue: Hardcoded API key
const apiKey = "sk-1234567890abcdef";

// Security Issue: Using eval
function executeCode(userInput) {
  eval(userInput); // Dangerous!
}

// Performance Issue: Inefficient loop
function processArray(items) {
  let result = "";
  for (let i = 0; i < items.length; i++) {
    result += items[i] + ","; // String concatenation in loop
  }
  return result;
}

// Style Issue: Using var instead of const/let
var userName = "John Doe";

// Style Issue: Console statements
console.log("Debug message");

// Security Issue: Missing error handling in async function
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

// Performance Issue: Nested loops
function findDuplicates(arr1, arr2) {
  const duplicates = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        duplicates.push(arr1[i]);
      }
    }
  }
  return duplicates;
}

// Good practice example
const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000
};

export { processArray, findDuplicates, config };
