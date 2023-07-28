function changeElementsDisabling(selector: string, boolean: boolean): void {
  const elementsArr = document.querySelectorAll(selector);
  elementsArr.forEach((el) => {
    const newEl = el as HTMLButtonElement | HTMLInputElement;
    if (newEl instanceof HTMLInputElement && newEl.getAttribute('type') !== 'color') {
      newEl.value = '';
    }
    newEl.disabled = boolean;
  });
}
export default changeElementsDisabling;
