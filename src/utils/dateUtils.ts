// Utility functions for date handling with testing support

export const getCurrentMonth = (): number => {
  // Check if we're in test mode
  const testMonth = import.meta.env.VITE_TEST_MONTH;
  if (testMonth) {
    return parseInt(testMonth);
  }
  return new Date().getMonth() + 1;
};

export const getCurrentYear = (): number => {
  // Check if we're in test mode
  const testYear = import.meta.env.VITE_TEST_YEAR;
  if (testYear) {
    return parseInt(testYear);
  }
  return new Date().getFullYear();
};

export const getCurrentDate = (): Date => {
  const testMonth = import.meta.env.VITE_TEST_MONTH;
  const testYear = import.meta.env.VITE_TEST_YEAR;
  
  if (testMonth && testYear) {
    return new Date(parseInt(testYear), parseInt(testMonth) - 1, 1);
  }
  
  return new Date();
};
