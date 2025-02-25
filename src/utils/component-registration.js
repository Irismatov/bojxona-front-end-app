import {
    Row, Col
} from "ant-design-vue"

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
const antComponentRegistration = (app) => {
    const antComponents = [
        Row, Col
    ]
    antComponents.forEach(component => {
        app.component(component.name, component)
    })
}
export function registerComponents(app) {
    antComponentRegistration(app)
    customComponentRegistration(app)
}