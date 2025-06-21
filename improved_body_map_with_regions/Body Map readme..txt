# Meridian Mastery — Body Map Module

This file outlines the structure, behavior, and design implementation required to build the interactive body map for the Meridian Mastery app.

---

## 🔹 Default Behavior

- When the user selects **"Body Map"** from the home screen:
  - Load the **side view full-body model** (`side_full.png`) by default.
  - Display the **logo** in the top-left corner (tap to return home).
  - Stack **vertical meridian selector buttons** (styled per approved UI) on the **right side** of the model.

---

## 🔹 Meridian Selection

- When a user selects a meridian from the vertical menu:
  - Automatically load the correct full-body view (side or front) that contains that meridian's mapped points.
    - Example: **Large Intestine → side view**
    - Example: **Stomach → front view**
  - Replace meridian buttons with:
    - **Back button** (top-right corner) to return to the meridian selector.
  - Display the selected meridian’s **line path** (connecting all points in order) and **individual points**.
    - Line and points should use the meridian’s **approved Five Element color**.
    - All points must be drawn in **numerical order** from the JSON file (e.g., LI1 → LI20).

---

## 🔹 Point Interaction

- When a user **taps a point**:
  - Automatically **zoom in to a 200x200 px area** centered on that point (adjustable if needed for better visibility).
  - Display a **flashcard below** the body model showing:
    - Point name
    - Location
    - Meridian
    - Description (if provided)
    - All visual elements already approved in the existing flashcard component.
  - Include a **"Close Card"** or "X" button so the user can:
    - Hide the flashcard
    - Tap a new point in the current meridian

---

## 🔹 Styling Requirements

- The body model must **blend into the background** (transparent or matched color scheme).
- Maintain mobile responsiveness and clarity when multiple points are near each other.
- Prioritize clean, intuitive visuals — avoid clutter.

---

## 🔹 Navigation Summary

| Button        | Location    | Function                           |
|---------------|-------------|------------------------------------|
| Home Logo     | Top-Left    | Return to App Home Screen          |
| Back Button   | Top-Right   | Return to Meridian Selector View   |

---

## 🔹 Data Integration

- Use per-meridian JSON files (e.g., `large_intestine.json`, `stomach.json`) located in the `/data/` directory.
- All points are stored as normalized `x`, `y` percentages relative to the full image resolution.
- Use `meridian` and `id` fields to determine line connection order.

---

## 🔹 Developer Notes

- If anything is unclear, ask questions before implementation.
- Do not alter image aspect ratios — full-body models are pixel-aligned to pressure point mappings.
- Only show region zooming by point tap (no region buttons are used anymore).
- Flashcard data must support scrolling on smaller screens.

