

export const summarizeDiff = (diff: string): string  =>{
    const lines = diff.split('\n');
    const added = lines.filter(line => line.startsWith('+') && !line.startsWith('+++'));
    const removed = lines.filter(line => line.startsWith('-') && !line.startsWith('---'));
    const filesChanged = lines.filter(line => line.startsWith('+++')).length;

    return `
            - Files changed: ${filesChanged}
            - Lines added: ${added}
            - Lines removed: ${removed}
        `;
}