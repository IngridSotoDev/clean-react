import axios from "axios";
import { faker } from "@faker-js/faker";
import { AxiosHttpClient } from "./axios-http-client";
import { HttpPostParams } from "data/protocols/http";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient();
};

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: {
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
});

describe("AxiosHttpClient", () => {
  test("should call axios with corret values", async () => {
    const request = mockPostRequest();
    const sut = makeSut();
    await sut.post(request);
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body);
  });
});
