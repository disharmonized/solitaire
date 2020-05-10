export function runSeries<T>(tests: T[], testBody: (test: T) => void): void {
  for (const [i, test] of tests.entries()) {
    it(`case #${i + 1}`, function() {
      testBody(test);
    });
  }
}
