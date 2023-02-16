import { faker } from "@faker-js/faker";

import { RemoveAuthentication } from "./remote-authentication";
import { HttpPostClientSpy } from "../../test/mock-http-client";

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
    await sut.auth();

    expect(httpPostClientSpy.url).toBe(url);
  });
});
