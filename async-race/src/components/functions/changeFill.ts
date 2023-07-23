function changeFillSize(string: string, color: string, width: number): string {
    return string.replace('fill', `fill=${color}`).replace('width', `width="${width}px"`);
}
export default changeFillSize;
