import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddCompany from "../AddCompany";
import * as api from "../../api";
import { vi } from "vitest";

vi.mock("../../api", () => ({
  uploadCompany: vi.fn().mockResolvedValue({ data: {} }),
}));

test("submits form when valid and calls uploadCompany", async () => {
  render(
    <BrowserRouter>
      <AddCompany />
    </BrowserRouter>
  );

  // fill required
  fireEvent.change(screen.getByLabelText(/Company name/i), { target: { value: "My Test Co" } });
  fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "India" } });
  fireEvent.change(screen.getByLabelText(/Postal code/i), { target: { value: "400001" } });

  const uploadSpy = (await import("../../api")).uploadCompany;

  fireEvent.click(screen.getByRole("button", { name: /save company/i }));

  await waitFor(() => expect(uploadSpy).toHaveBeenCalled());
});
