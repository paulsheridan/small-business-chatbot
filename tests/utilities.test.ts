import { isWeatherQuestion } from "../src/utilities";

describe("isWeatherQuestion", () => {
  it("should detect a weather-related question", () => {
    expect(isWeatherQuestion("What is the weather like today?")).toBe(true);
    expect(isWeatherQuestion("Is it sunny?")).toBe(true);
    expect(isWeatherQuestion("Can you fix my computer?")).toBe(false);
  });
});
