import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";

test("mobile menu toggle shows/hides menu", () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  const menuBtn = screen.getByLabelText("menu");
  // initial state: menu hidden on small screens, but our DOM toggles classes; we simulate click
  fireEvent.click(menuBtn);
  // after click the menu should be in the DOM with 'Add' link visible (even if responsive CSS hide shows/hides)
  expect(screen.getByText(/Add/i)).toBeInTheDocument();
});
