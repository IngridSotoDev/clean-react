import axios from "axios";
import { faker } from "@faker-js/faker";
import { AxiosHttpClient } from "./axios-http-client";
import { HttpPostParams } from "data/protocols/http";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosResult = {
  data: {
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
  status: faker.datatype.number(),
};

mockedAxios.post.mockResolvedValue(mockedAxiosResult);

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

  test("should return the correct statusCode and body", async () => {
    const sut = makeSut();
    const response = await sut.post(mockPostRequest());
    expect(response).toEqual({
      statusCode: mockedAxiosResult.status,
      body: mockedAxiosResult.data,
    });
  });
});
