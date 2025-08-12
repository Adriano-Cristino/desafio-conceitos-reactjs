import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import api from "../services/api";

// Mock the api module
jest.mock("../services/api");

const mockedApi = api;

import App from "../App";

const wait = (amount = 0) => {
  return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0) => {
  await act(async () => {
    await wait(amount);
  });
};

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be able to add new repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    mockedApi.get.mockResolvedValue({ data: [] });
    mockedApi.post.mockResolvedValue({ 
      data: {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
      }
    });

    await actWait();

    fireEvent.click(getByText("Adicionar"));

    await actWait();

    expect(getByTestId("repository-list")).toContainElement(
      getByText("Desafio ReactJS")
    );
  });

  it("should be able to remove repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    mockedApi.get.mockResolvedValue({ 
      data: [
        {
          id: "123",
          url: "https://github.com/josepholiveira",
          title: "Desafio ReactJS",
          techs: ["React", "Node.js"],
        },
      ]
    });

    mockedApi.delete.mockResolvedValue({ data: {} });

    await actWait();

    fireEvent.click(getByText("Remover"));

    await actWait();

    expect(getByTestId("repository-list")).toBeEmpty();
  });
});
