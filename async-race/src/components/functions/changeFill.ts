function changeFill(string: string, color: string): string {
    return string.replace('fill', `fill=${color}`);
}
export default changeFill;
