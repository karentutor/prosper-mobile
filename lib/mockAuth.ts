export const DEFAULT_EMAIL = "test@test.com";
export const DEFAULT_PASSWORD = "test1234";

type MockCreds = { email: string; password: string };

let creds: MockCreds = {
  email: DEFAULT_EMAIL,
  password: DEFAULT_PASSWORD,
};

export function getMockCredentials(): MockCreds {
  return creds;
}

export function setMockCredentials(email: string, password: string) {
  creds = {
    email: email.trim().toLowerCase(),
    password,
  };
}