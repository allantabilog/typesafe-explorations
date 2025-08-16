function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function main() {
  const wave = "~~~";
  while (true) {
    for (let i = 0; i < 20; i++) {
      console.clear();
      console.log(" ".repeat(i) + wave);
      await sleep(100);
    }
  }
})();
