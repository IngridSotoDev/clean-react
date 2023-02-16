import { faker } from "@faker-js/faker";

import { RemoveAuthentication } from "./remote-authentication";

import { HttpPostClientSpy } from "data/test/mock-http-client";
import { HttpStatusCode } from "data/protocols/http/http-response";

import { mockAuthentication } from "domain/test/mock-authentication";
import { InvalidCredentialsError } from "domain/errors/invalid-credentials-error";

type SutTypes = {
  sut: RemoveAuthentication;
  httpPostClientSpy: HttpPostClientSpy;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy();
  const sut = new RemoveAuthentication(url, httpPostClientSpy);

  return {
    sut,
    httpPostClientSpy,
  };
};

describe("RemoteAuthentication", () => {
  test("should call HttpPostClient with correct URL", async () => {
    const url = faker.internet.url();
    const { httpPostClientSpy, sut } = makeSut(url);
    await sut.auth(mockAuthentication());

    expect(httpPostClientSpy.url).toBe(url);
  });

  test("should call HttpPostClient with correct body", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    const authenticationParams = mockAuthentication();
    await sut.auth(authenticationParams);

    expect(httpPostClientSpy.body).toEqual(authenticationParams);
  });

  test("should throw InvalidCredentials if HttpPostClient returns 401", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
    };

    const response = await sut.auth(mockAuthentication());

    expect(response).rejects.toThrow(new InvalidCredentialsError());
  });
});
