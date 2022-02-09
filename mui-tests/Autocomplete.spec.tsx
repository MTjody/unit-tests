import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getAllByRole, render } from "@testing-library/react";
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
      expect(options[0].innerHTML).not.toBe(options[1].innerHTML);
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
      userEvent.type(getByLabelText("Movie"), "Return of Jar-Jar");
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
            label="Movies"
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
    });
    it("should add a chip once a value from the list has been selected", () => {
      const { getAllByRole, getByLabelText } = render(multipleValues);
      const textInput = getByLabelText("Movies");
      userEvent.type(textInput, "The Godfather");
      userEvent.keyboard("{ArrowDown}");
      userEvent.keyboard("{enter}");
      const chips = getAllByRole("button").filter(hasTagIndex);
      expect(chips.length).toBe(2);
    });
    it("should remove a chip if clicked", () => {
      const { getAllByRole, getByLabelText, getAllByTestId } =
        render(multipleValues);
      const textInput = getByLabelText("Movies");
      userEvent.type(textInput, "The Godfather");
      userEvent.keyboard("{ArrowDown}");
      userEvent.keyboard("{enter}");
      const cancelIcons = getAllByTestId("CancelIcon");
      userEvent.click(cancelIcons[0]);
      const remainingChips = getAllByRole("button").filter(hasTagIndex);
      expect(remainingChips.length).toBe(1);
    });
    it("should remove all chips if clear button is clicked", () => {
      const { getByTitle, getAllByRole, getByLabelText, debug } =
        render(multipleValues);
      const textInput = getByLabelText("Movies");
      userEvent.type(textInput, "The Godfather");
      userEvent.keyboard("{ArrowDown}");
      userEvent.keyboard("{enter}");
      const clearButton = getByTitle("Clear");
      userEvent.click(clearButton);
      const chips = getAllByRole("button").filter(hasTagIndex);
      expect(chips.length).toBe(0);
    });
  });
});
