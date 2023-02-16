import { faker } from "@faker-js/faker";

import { RemoveAuthentication } from "./remote-authentication";

import { HttpPostClientSpy } from "data/test/mock-http-client";
import { HttpStatusCode } from "data/protocols/http/http-response";

import { AccountModel } from "domain/models/account-model";
import { UnexpectedError } from "domain/errors/unexpected-error";
import { AuthenticationParams } from "domain/usecases/authentication";
import { mockAccountModel, mockAuthentication } from "domain/test/mock-account";
import { InvalidCredentialsError } from "domain/errors/invalid-credentials-error";

type SutTypes = {
  sut: RemoveAuthentication;
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AuthenticationParams,
    AccountModel
  >();
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

  test("should throw InvalidCredentialsError if HttpPostClient returns 401", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
    };

    const response = sut.auth(mockAuthentication());

    await expect(response).rejects.toThrow(new InvalidCredentialsError());
  });

  test("should throw UnexpectedError if HttpPostClient returns 400", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const response = sut.auth(mockAuthentication());

    await expect(response).rejects.toThrow(new UnexpectedError());
  });

  test("should throw UnexpectedError if HttpPostClient returns 500", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const response = sut.auth(mockAuthentication());

    await expect(response).rejects.toThrow(new UnexpectedError());
  });

  test("should throw UnexpectedError if HttpPostClient returns 404", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const response = sut.auth(mockAuthentication());

    expect(response).rejects.toThrow(new UnexpectedError());
  });

  test("should return an AccountModel if HttpPostClient returns 200", async () => {
    const { httpPostClientSpy, sut } = makeSut();
    const httpResult = mockAccountModel();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const account = await sut.auth(mockAuthentication());

    expect(account).toEqual(httpResult);
  });
});
