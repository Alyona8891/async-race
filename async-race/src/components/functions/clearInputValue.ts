function clearInputValue(targetElement: HTMLElement): void {
    const parent = (targetElement as HTMLElement).closest('div');
    const input = parent?.querySelectorAll('input');
    input?.forEach((el) => {
        const newEl = el;
        if (newEl && !(newEl.getAttribute('type') === 'color')) {
            newEl.value = '';
        } else if (newEl && newEl.getAttribute('type') === 'color') {
            newEl.value = '#000000';
        }
    });
}
export default clearInputValue;
