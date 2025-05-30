import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlunoListPage from "../features/alunos/AlunoListPage";

describe("AlunoListPage", () => {
  it("renderiza título Alunos", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AlunoListPage />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Alunos/i)).toBeInTheDocument();
  });
}); 