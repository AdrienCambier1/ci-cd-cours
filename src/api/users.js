const usersUrl = "http://localhost:8000/users";

export async function fetchUsers() {
  const response = await fetch(usersUrl);

  if (!response.ok) {
    throw new Error("Unable to fetch users");
  }

  const data = await response.json();
  return data.users ?? [];
}

export async function createUser(user) {
  const response = await fetch(usersUrl, {
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
  const response = await fetch(`${usersUrl}/${id}`, {
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
