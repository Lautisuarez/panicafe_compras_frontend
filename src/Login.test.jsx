import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./Login";

describe("Login", () => {
  it("renders login form", () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <Login onSuccesLogin={() => {}} />
        </MemoryRouter>
      </ChakraProvider>
    );
    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
  });
});
