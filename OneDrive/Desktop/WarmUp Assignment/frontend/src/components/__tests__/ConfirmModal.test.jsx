import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "../ConfirmModal"; // <- corrected path (was "../components/ConfirmModal")

test("ConfirmModal triggers confirm and cancel", () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  render(
    <ConfirmModal
      open={true}
      title="Delete?"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );

  fireEvent.click(screen.getByText("Cancel"));
  expect(onCancel).toHaveBeenCalled();

  fireEvent.click(screen.getByText("Confirm"));
  expect(onConfirm).toHaveBeenCalled();
});
