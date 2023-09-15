export const validateAge = (age: any) => {
  if (
    age === null ||
    (typeof age === "number" && Number.isInteger(age) && age >= 1 && age <= 18)
  ) {
    return true;
  }
  return false;
};
