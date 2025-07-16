// This file declares TypeScript modules for importing image assets like .png, .jpg, .svg, etc.
// It prevents "Cannot find module" errors when importing images into TypeScript files.
// These declarations tell TypeScript to treat image imports as string URLs (resolved by the bundler).

declare module "*.jpg" {
    const value: string;
    export default value;
}

declare module "*.jpeg" {
    const value: string;
    export default value;
}

declare module "*.svg" {
    const value: string;
    export default value;
}

declare module "*.png" {
    const value: string;
    export default value;
}
