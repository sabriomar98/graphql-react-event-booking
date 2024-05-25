import APP from "./app";

const port = process.env.SERVER_PORT || 4000 as any;
const host = process.env.SERVER_HOST || 'localhost';




// Function to recursively log routes
function logRoutes(stack: any, parentPath = '') {
    stack.forEach((layer: any) => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            const path = parentPath + layer.route.path;
            console.log(`${methods} ${path}`);
        } else if (layer.name === 'router' || layer.name === 'bound dispatch') {
            // If the layer is a router, recursively log its routes
            const newPath = parentPath + (layer.regexp.source === '^\\/?$' ? '' : layer.regexp.source.replace('\\/?$', '').replace('(?:', '').replace('/^', '').replace('(?=\\/|$)', ''));
            logRoutes(layer.handle.stack, newPath);
        } else if (layer.name === 'mount') {
            // For app.use mounted paths
            const newPath = parentPath + (layer.regexp.source.replace('\\/?$', '').replace('(?:', '').replace('/^', '').replace('(?=\\/|$)', ''));
            logRoutes(layer.handle.stack, newPath);
        }
    });
}


APP.listen(port, host, () => {
    console.log(`Server gateway is running at http://${host}:${port}`);
    // Log out all routes
    console.log('\n\nDefined routes:\n------------------------------');
    logRoutes(APP._router.stack);
    console.log('------------------------------\n\n');
});

