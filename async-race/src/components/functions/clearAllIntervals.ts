const BIG_NUMBER = 99999;

function clearAllIntervals(): void {
  for (let i = 1; i < BIG_NUMBER; i += 1) {
    clearInterval(i);
  }
}
export default clearAllIntervals;
