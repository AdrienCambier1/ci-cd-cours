const usersEndpoint = `${process.env.API_URL}/users`;

/**
 * @typedef {object} UserInput
 * @property {string} lastName - User last name.
 * @property {string} firstName - User first name.
 * @property {string} email - User email address.
 * @property {string} birthDate - User birth date in YYYY-MM-DD format.
 * @property {string} city - User city.
 * @property {string} postalCode - User French postal code.
 */

/**
 * @typedef {object} ApiUser
 * @property {number} id - User database identifier.
 * @property {string} last_name - User last name as stored by the API.
 * @property {string} first_name - User first name as stored by the API.
 * @property {string} email - User email address.
 * @property {string} birthdate - User birth date in YYYY-MM-DD format.
 * @property {string} city - User city.
 * @property {string} postal_code - User French postal code.
 */

/**
 * Fetches all users from the configured API.
 *
 * @returns {Promise<ApiUser[]>} The list of users returned by the API.
 * @throws {Error} When the API response is not successful.
 */
export async function fetchUsers() {
  const response = await fetch(usersEndpoint);

  if (!response.ok) {
    throw new Error("Unable to fetch users");
  }

  const data = await response.json();
  return data.users ?? [];
}

/**
 * Creates a user through the API.
 *
 * @param {UserInput} user - User data validated by the form.
 * @returns {Promise<ApiUser>} The user returned by the API after creation.
 * @throws {Error} When the API response is not successful.
 */
export async function createUser(user) {
  const response = await fetch(usersEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Unable to create user");
  }

  const data = await response.json();
  return data.user;
}

/**
 * Updates an existing user through the API.
 *
 * @param {object} payload - Update payload.
 * @param {number|string} payload.id - Identifier of the user to update.
 * @param {UserInput} payload.user - Updated user data.
 * @returns {Promise<ApiUser>} The updated user returned by the API.
 * @throws {Error} When the API response is not successful.
 */
export async function updateUser({ id, user }) {
  const response = await fetch(`${usersEndpoint}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Unable to update user");
  }

  const data = await response.json();
  return data.user;
}

/**
 * Deletes a user through the API.
 *
 * @param {number|string} id - Identifier of the user to delete.
 * @returns {Promise<{message: string}>} The API deletion confirmation.
 * @throws {Error} When the API response is not successful.
 */
export async function deleteUser(id) {
  const response = await fetch(`${usersEndpoint}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete user");
  }

  return response.json();
}
