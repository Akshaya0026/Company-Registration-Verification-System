import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditCompany from "../EditCompany";
import { vi } from "vitest";

// --- Mock useParams so the component thinks id = "1"
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
  };
});

// --- Mock API module
vi.mock("../../api", async () => {
  return {
    default: {
      get: vi.fn().mockResolvedValue({
        data: {
          id: 1,
          company_name: "X",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          website: "",
        },
      }),
    },
    uploadCompany: vi.fn().mockResolvedValue({}),
  };
});

test("loads and submits edit form (calls uploadCompany)", async () => {
  const { uploadCompany } = await import("../../api");

  render(
    <BrowserRouter>
      <EditCompany />
    </BrowserRouter>
  );

  // waits until company data loads and input appears
  await waitFor(() =>
    expect(screen.getByLabelText(/Company name/i)).toBeInTheDocument()
  );

  // change name
  fireEvent.change(screen.getByLabelText(/Company name/i), {
    target: { value: "Edited Co" },
  });

  // click update button
  fireEvent.click(screen.getByRole("button", { name: /update company/i }));

  // expect uploadCompany to have been called
  await waitFor(() => expect(uploadCompany).toHaveBeenCalled());
});
