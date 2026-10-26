import { resolveCompatibility } from './compatibility.js';

const profile = resolveCompatibility();
const polyfills = [profile.resizeObserver && 'ResizeObserver', profile.pointerEvents && 'Pointer Events', profile.domMethods && 'DOM methods'].filter(Boolean);
console.log(`Browserslist: ${profile.browsers.length} browser versions; ${profile.targets.join(', ')}`);
console.log(`DOM polyfills: ${polyfills.join(', ') || 'none needed'}`);
