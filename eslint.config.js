import compat from 'eslint-plugin-compat';

export default [{
    ...compat.configs['flat/recommended'],
    files: ['client/scripts/**/*.js'],
    settings: { polyfills: ['ResizeObserver', 'PointerEvent'] },
}];
