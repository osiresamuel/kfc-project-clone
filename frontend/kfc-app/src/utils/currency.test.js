import { formatPrice, getPriceAmount } from "./currency";

test("formats prices as UGX without converting the amount", () => {
  expect(formatPrice("₹479.05")).toBe("UGX 479.05");
  expect(formatPrice("UGX 479.05")).toBe("UGX 479.05");
  expect(formatPrice(5)).toBe("UGX 5");
});

test("reads numeric amounts from stored prices", () => {
  expect(getPriceAmount("₹479.05")).toBe(479.05);
  expect(getPriceAmount("UGX 479.05")).toBe(479.05);
});
