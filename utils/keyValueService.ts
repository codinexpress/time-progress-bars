const API_BASE_URL = "https://keyvalue.immanuel.co/api/KeyVal";

/**
 * Fetches a new application key.
 * Note: In this project, the app key is provided, so this function might be for completeness
 * or future use if keys can expire or need to be dynamically fetched.
 */
export const getAppKey = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/GetAppKey`);
  if (!response.ok) {
    throw new Error(`Error fetching app key: ${response.statusText}`);
  }
  const appKey = await response.text();
  // The response text might be quoted, e.g., ""3cg7aby9""
  return appKey.replace(/"/g, "");
};

/**
 * Retrieves a value for a given app key and key.
 * @param appKey The application key.
 * @param key The key for the value to retrieve.
 * @returns The retrieved value as a string, or null if not found or error.
 */
export const getValue = async (appKey: string, key: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetValue/${appKey}/${key}`);
    if (!response.ok) {
      if (response.status === 404) { // Key not found might return 404
        return null;
      }
      console.error(`Error getting value for key "${key}": ${response.statusText}`);
      return null;
    }
    const value = await response.text();
    // Values might also be quoted or be "null" as a string
    if (value === "null") {
        return null;
    }
    return value.replace(/"/g, "");
  } catch (error) {
    console.error(`Exception when getting value for key "${key}":`, error);
    return null;
  }
};

/**
 * Updates or creates a value for a given app key and key.
 * @param appKey The application key.
 * @param key The key for the value to update/create. Max length 64.
 * @param value The value to store. Max length 1024.
 * @returns True if the update was successful, false otherwise.
 */
export const updateValue = async (appKey: string, key: string, value: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/UpdateValue/${appKey}/${key}/${value}`, {
      method: 'POST',
      headers: {
        // Content-Type might not be strictly necessary for this API if it only uses URL params
        // 'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ value }) // Body might not be needed if value is in URL
    });
    if (!response.ok) {
      console.error(`Error updating value for key "${key}": ${response.statusText}`);
      return false;
    }
    // Assuming a successful POST returns a 2xx status.
    // The API documentation doesn't specify the success response body,
    // so we'll rely on the status code.
    return response.ok;
  } catch (error) {
    console.error(`Exception when updating value for key "${key}":`, error);
    return false;
  }
};
