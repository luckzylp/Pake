import { describe, it, expect } from "vitest";

/**
 * Tests for the GNOME button-layout parsing logic.
 * This mirrors the Rust `parse_button_layout()` function behavior.
 * Format: "left_buttons:right_buttons"
 * If "close" appears before the colon, buttons are on the left.
 */
function parseButtonLayout(layout) {
  const colonPos = layout.indexOf(":");
  if (colonPos !== -1) {
    const leftPart = layout.substring(0, colonPos);
    if (leftPart.includes("close")) {
      return "left";
    }
  }
  return "right";
}

describe("GNOME button-layout parsing", () => {
  it("detects left-side buttons when close is before colon", () => {
    expect(parseButtonLayout("close,minimize,maximize:")).toBe("left");
  });

  it("detects left-side buttons with different order", () => {
    expect(parseButtonLayout("minimize,close,maximize:")).toBe("left");
  });

  it("detects right-side buttons when close is after colon", () => {
    expect(parseButtonLayout(":minimize,maximize,close")).toBe("right");
  });

  it("detects right-side buttons with menu prefix", () => {
    expect(parseButtonLayout("appmenu:minimize,maximize,close")).toBe("right");
  });

  it("detects left when close is split across colon (close on left)", () => {
    expect(parseButtonLayout("close:maximize")).toBe("left");
  });

  it("defaults to right on empty string", () => {
    expect(parseButtonLayout("")).toBe("right");
  });

  it("defaults to right when no colon present", () => {
    expect(parseButtonLayout("minimize,maximize,close")).toBe("right");
  });

  it("defaults to right when only colon present", () => {
    expect(parseButtonLayout(":")).toBe("right");
  });
});
