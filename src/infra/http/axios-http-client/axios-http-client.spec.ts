import axios from "axios";

import { mockPostRequest } from "@/data/test";

import { mockAxios } from "@/infra/test";

import { AxiosHttpClient } from "./axios-http-client";

jest.mock("axios");

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: jest.Mocked<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();

  return { sut, mockedAxios };
};

describe("AxiosHttpClient", () => {
  test("should call axios with corret values", async () => {
    const request = mockPostRequest();
    const { sut, mockedAxios } = makeSut();
    await sut.post(request);
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body);
  });

  test("should return the correct statusCode and body", () => {
    const { sut, mockedAxios } = makeSut();
    const promise = sut.post(mockPostRequest());
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value);
  });
});
