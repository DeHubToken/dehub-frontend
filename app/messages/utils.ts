import { faker } from "@faker-js/faker";

export const messages = Array.from({ length: 50 }).map((_, index) => ({
  id: index + faker.string.uuid(),
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
  isPro: faker.datatype.boolean(),
  message: faker.lorem.sentence(),
  lastOnline: faker.date.recent(),
  isOnline: faker.datatype.boolean(),
  messages: Array.from({ length: faker.number.int({ min: 0, max: 100 }) }).map((_, index) => ({
    id: index + faker.string.uuid(),
    message: faker.lorem.sentence(),
    isSent: faker.datatype.boolean(),
    date: faker.date.recent(),
    author: faker.datatype.boolean() ? "me" : faker.internet.userName(),
    avatar: faker.image.avatar()
  }))
}));

export type TMessage = (typeof messages)[0];

export const SocketEvent = {
  disconnect: "disconnect",
  connect: "connect",
  connection: "connection",
  ping: "ping",
  pong: "pong",
  createAndStart: "createAndStart",
  sendMessage: "sendMessage",
  onCreateChat:'onCreateChat',
  reConnect: "reConnect"
};
