export const getPriceAmount = (price) => {
  const amount = String(price).replace(/[^0-9.-]/g, "");
  if (!amount || !Number.isFinite(Number(amount))) {
    throw new Error(`Invalid price: ${price}`);
  }
  return Number(amount);
};

export const formatPrice = (price) => {
  const amount = String(price).trim().replace(/^[^\d-]*/, "").replace(/,/g, "");
  if (!amount || !Number.isFinite(Number(amount))) {
    throw new Error(`Invalid price: ${price}`);
  }
  return `UGX ${amount}`;
};
