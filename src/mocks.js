import { faker } from '@faker-js/faker';

export function generateUser() {
  return {
    ip: faker.internet.ip(),
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    location: faker.address.city(),
    jobArea: faker.name.jobArea(),
    company: faker.company.name(),
    jobTitle: faker.name.jobTitle(),
  };
}

export function generateLogEntry(user) {
  return {
    ...user,
    id: faker.string.uuid(),
    timestamp: faker.date.recent().toISOString(),
  };
}
