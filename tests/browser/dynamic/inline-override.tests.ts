import {multiline} from '../../support/test-utils';
import type {StyleExpectations} from '../globals';

async function loadBasicPage() {
    await loadTestPage({
        '/': multiline(
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '</head>',
            '<body>',
            '    <span style="color: red;">Inline style override</span>',
            '</body>',
            '</html>',
        ),
    });
}

async function expectStyles(styles: StyleExpectations) {
    expectPageStyles(expect, styles);
}

describe('Inline style override', () => {
    it('should override inline style', async () => {
        await loadBasicPage();

        await expectStyles(['span', 'color', 'rgb(255, 26, 26)']);
    });

    it('should watch for inline style change', async () => {
        await loadBasicPage();

        await expectStyles(['span', 'color', 'rgb(255, 26, 26)']);

        await expect(evaluateScript(async () => {
            const span = document.querySelector('span');
            span.style.color = 'green';
            await new Promise((resolve) => setTimeout(resolve));
            return getComputedStyle(span).color;
        })).resolves.toBe('rgb(114, 255, 114)');
    });
});
