const apiUrl = "https://api.example.test";
const userFixture = {
  id: 1,
  last_name: "Dupont",
  first_name: "Jean",
  email: "jean.dupont@example.com",
  birthdate: "2000-01-15",
  city: "Paris",
  postal_code: "75001",
};

async function loadUsersApi() {
  jest.resetModules();
  process.env.API_URL = apiUrl;
  return import("./users");
}

function mockFetchResponse(body, ok = true) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(body),
    }),
  );
}

describe("users api", () => {
  afterEach(() => {
    delete globalThis.fetch;
    delete process.env.API_URL;
  });

  it("fetches users from the configured API url", async () => {
    const { fetchUsers } = await loadUsersApi();
    mockFetchResponse({ users: [userFixture] });

    await expect(fetchUsers()).resolves.toEqual([userFixture]);

    expect(globalThis.fetch).toHaveBeenCalledWith(`${apiUrl}/users`);
  });

  it("returns an empty list when the API response has no users field", async () => {
    const { fetchUsers } = await loadUsersApi();
    mockFetchResponse({});

    await expect(fetchUsers()).resolves.toEqual([]);
  });

  it("throws when users cannot be fetched", async () => {
    const { fetchUsers } = await loadUsersApi();
    mockFetchResponse({}, false);

    await expect(fetchUsers()).rejects.toThrow("Unable to fetch users");
  });

  it("creates a user with a POST request", async () => {
    const { createUser } = await loadUsersApi();
    mockFetchResponse({ user: userFixture });

    await expect(createUser(userFixture)).resolves.toEqual(userFixture);

    expect(globalThis.fetch).toHaveBeenCalledWith(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userFixture),
    });
  });

  it("throws when a user cannot be created", async () => {
    const { createUser } = await loadUsersApi();
    mockFetchResponse({}, false);

    await expect(createUser(userFixture)).rejects.toThrow(
      "Unable to create user",
    );
  });

  it("updates a user with a PATCH request", async () => {
    const { updateUser } = await loadUsersApi();
    mockFetchResponse({ user: userFixture });

    await expect(
      updateUser({ id: userFixture.id, user: userFixture }),
    ).resolves.toEqual(userFixture);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${apiUrl}/users/${userFixture.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFixture),
      },
    );
  });

  it("throws when a user cannot be updated", async () => {
    const { updateUser } = await loadUsersApi();
    mockFetchResponse({}, false);

    await expect(
      updateUser({ id: userFixture.id, user: userFixture }),
    ).rejects.toThrow("Unable to update user");
  });

  it("deletes a user with a DELETE request", async () => {
    const { deleteUser } = await loadUsersApi();
    mockFetchResponse({ success: true });

    await expect(deleteUser(userFixture.id)).resolves.toEqual({
      success: true,
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${apiUrl}/users/${userFixture.id}`,
      { method: "DELETE" },
    );
  });

  it("throws when a user cannot be deleted", async () => {
    const { deleteUser } = await loadUsersApi();
    mockFetchResponse({}, false);

    await expect(deleteUser(userFixture.id)).rejects.toThrow(
      "Unable to delete user",
    );
  });
});
