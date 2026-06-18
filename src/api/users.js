const usersEndpoint = `${process.env.API_URL}/users`;

export async function fetchUsers() {
  const response = await fetch(usersEndpoint);

  if (!response.ok) {
    throw new Error("Unable to fetch users");
  }

  const data = await response.json();
  return data.users ?? [];
}

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

export async function deleteUser(id) {
  const response = await fetch(`${usersEndpoint}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete user");
  }

  return response.json();
}
