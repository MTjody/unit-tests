import * as React from "react";
import { render } from "@testing-library/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

describe("MUI AutoComplete", () => {
  describe("Combo box", () => {
    it("should render an input field", () => {
      const { container, getByLabelText, debug } = render(
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={top10Films}
          renderInput={(params) => <TextField {...params} label="Movie" />}
        />
      );
      const res = getByLabelText("Movie");
      // Uncomment to see the DOM printout of the input
      // debug(res);
      expect(container).toBeVisible();
      expect(res).toBeVisible();
    });
  });
});

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
