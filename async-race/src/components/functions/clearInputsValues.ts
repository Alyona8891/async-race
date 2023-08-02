const DEFAULT_COLOR = '#000000';

function clearInputsValues(targetElement: HTMLElement): void {
  const parent = (targetElement as HTMLElement).closest('div');
  const input = parent?.querySelectorAll('input');
  input?.forEach((el) => {
    const newEl = el;
    if (newEl && !(newEl.getAttribute('type') === 'color')) {
      newEl.value = '';
    } else if (newEl && newEl.getAttribute('type') === 'color') {
      newEl.value = DEFAULT_COLOR;
    }
  });
}
export default clearInputsValues;
