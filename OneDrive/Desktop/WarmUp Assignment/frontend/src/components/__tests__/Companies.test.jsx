import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Companies from "../../pages/Companies"; // <- corrected path (two levels up to /pages)
import api from "../../api"; // <- corrected path (two levels up to /api)

vi.mock("../../api"); // mock the correct module

test("loads companies list", async () => {
  api.get.mockResolvedValueOnce({
    data: {
      rows: [
        { id: 1, company_name: "Acme Corp", city: "Mumbai", state: "MH", country: "India", logo_url: null }
      ],
      totalPages: 1
    }
  });

  render(
    <BrowserRouter>
      <Companies />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });
});
