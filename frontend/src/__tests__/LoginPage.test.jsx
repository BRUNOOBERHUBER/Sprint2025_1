import { render, screen } from "@testing-library/react";
import LoginPage from "../features/auth/LoginPage";
import { BrowserRouter } from "react-router-dom";

describe("LoginPage", () => {
  it("renderiza campos de usuário e senha", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('********')).toBeInTheDocument();
  });
}); 