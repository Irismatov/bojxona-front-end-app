const customComponentRegistration = (app) => {
    const customComponents = import.meta.glob('@/components/global/*.vue', { eager: true });
    Object.entries(customComponents).forEach(([path, definition]) => {
        const componentName = path
            .split('/')
            .pop()
            .replace('.vue', '')
            .replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase());

        app.component(componentName, definition.default);
    });
}

export function registerComponents(app) {
    customComponentRegistration(app)
}