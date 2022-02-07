import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getAllByRole, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top10Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
];

describe("MUI AutoComplete", () => {
  describe("Combo box", () => {
    const comboBox = (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top10Films}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    );
    it("should render an input field", () => {
      const { container, getByLabelText, debug } = render(comboBox);
      const res = getByLabelText("Movie");
      // Uncomment to see the DOM printout of the input
      // debug(res);
      expect(container).toBeVisible();
      expect(res).toBeVisible();
    });
    it("should allow focus and typing on the text input", () => {
      const { getByLabelText } = render(comboBox);
      const textInput = getByLabelText("Movie");

      userEvent.click(textInput);
      expect(textInput).toHaveFocus();
      // I usually don't write 'magic strings' but if I extract
      // to constant it breaks my fancy color theme ¯\_(ツ)_/¯
      userEvent.type(textInput, "Some movie name");
      expect(textInput).toHaveValue("Some movie name");
    });
    it("should show the list of movies on focus", () => {
      const { getByLabelText, container } = render(comboBox);
      userEvent.click(getByLabelText("Movie"));

      const options = getAllByRole(container, "option");
      expect(options.length).toBe(top10Films.length);
    });
    it("should filter the list of movies according to the input", () => {
      const { getByLabelText, container } = render(comboBox);
      // We can safely skip the click and focus assertion since the other test already checked it.
      userEvent.type(getByLabelText("Movie"), "The Godfather");
      const options = getAllByRole(container, "option");
      expect(options.length).toBe(2);
      options.forEach((o) => {
        expect(o.innerHTML).toContain("The Godfather");
      });
    });
    it("should ignore case when filtering", () => {
      const { getByLabelText, container } = render(comboBox);
      userEvent.type(getByLabelText("Movie"), "ThE GoDfAtHER");
      const options = getAllByRole(container, "option");
      expect(options.length).toBe(2);
      options.forEach((o) => {
        expect(o.innerHTML).toContain("The Godfather");
      });
    });
    it("should let the user know if there were no matches", () => {
      const { getByLabelText, container } = render(comboBox);
      const textInput = getByLabelText("Movie");
      userEvent.type(textInput, "Return of Jar-Jar");
      expect(() => getAllByRole(container, "option")).toThrow();
    });
  });
  describe("Multiple Values", () => {
    const hasTagIndex = (chip: HTMLElement) =>
      chip.getAttribute("data-tag-index") !== null;
    const multipleValues = (
      <Autocomplete
        multiple
        id="tags-standard"
        options={top10Films}
        getOptionLabel={(option) => option.label}
        defaultValue={[top10Films[0]]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Multiple values"
            placeholder="Favorites"
          />
        )}
      />
    );
    it("should render the input containing a chip with the default value", () => {
      const { getByText, getAllByRole } = render(multipleValues);
      // This is one way to do it, if you know what you're targeting
      const muiChip = getByText(top10Films[0].label);
      expect(muiChip).toBeVisible();
      // Better way to find multiple chips
      const buttons = getAllByRole("button");
      const chips = buttons.filter(hasTagIndex);
      expect(chips.length).toBe(1);
      /**
       * <div
      class="MuiButtonBase-root MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-deletable MuiChip-deletableColorDefault MuiChip-filledDefault MuiAutocomplete-tag MuiAutocomplete-tagSizeMedium css-1k430x0-MuiButtonBase-root-MuiChip-root"
      data-tag-index="0"
      role="button"
      tabindex="-1"
    >
      <span
        class="MuiChip-label MuiChip-labelMedium css-6od3lo-MuiChip-label"
      >
        The Shawshank Redemption
      </span>
      <svg
        aria-hidden="true"
        class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiChip-deleteIcon MuiChip-deleteIconMedium MuiChip-deleteIconColorDefault MuiChip-deleteIconOutlinedColorDefault css-i4bv87-MuiSvgIcon-root"
        data-testid="CancelIcon"
        focusable="false"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
        />
      </svg>
    </div>

      at node_modules/@testing-library/react/dist/pure.js:108:29
          at Array.forEach (<anonymous>)

  console.log
    <button
      aria-label="Open"
      class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-popupIndicator css-qzbt6i-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator"
      tabindex="-1"
      title="Open"
      type="button"
    >
      <svg
        aria-hidden="true"
        class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
        data-testid="ArrowDropDownIcon"
        focusable="false"
        viewBox="0 0 24 24"
      >
        <path
          d="M7 10l5 5 5-5z"
        />
      </svg>
      <span
        class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"
      />
    </button>
       */
    });
  });
});
