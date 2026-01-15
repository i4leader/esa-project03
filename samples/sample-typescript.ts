// Sample TypeScript code with various issues for testing

// Security Issue: Hardcoded secret
const SECRET_KEY = "my-secret-key-12345";

// Security Issue: Using Function constructor
function createDynamicFunction(code: string) {
  return new Function(code); // Dangerous!
}

// Performance Issue: Inefficient array operations
function filterAndMap(items: number[]): string[] {
  let result: string[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i] > 0) {
      result = result.concat([items[i].toString()]); // Inefficient
    }
  }
  return result;
}

// Style Issue: Using var
var globalCounter = 0;

// Style Issue: Console statements
console.log("Debug info");
console.error("Error occurred");

// Security Issue: Missing error handling
async function fetchUserData(userId: string): Promise<any> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// Type safety issue: Using 'any'
function processData(data: any): any {
  return data.value;
}

// Performance Issue: Unnecessary re-renders (React-like)
interface Props {
  items: string[];
}

function Component({ items }: Props) {
  // Missing memoization
  const processedItems = items.map(item => item.toUpperCase());
  return processedItems;
}

// Good practice example
interface Config {
  apiUrl: string;
  timeout: number;
}

const getConfig = (): Config => ({
  apiUrl: process.env.API_URL || '',
  timeout: 5000
});

export { filterAndMap, Component, getConfig };
