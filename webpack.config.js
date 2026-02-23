const path = require('path')

module.exports = {
    entry: {
        'files-integration': path.join(__dirname, 'src', 'files-integration.js'),
    },
    output: {
        path: path.join(__dirname, 'js'),
        filename: 'guitartabviewer-[name].js',
        clean: false,
    },
    module: { rules: [] },
    externals: {
        // N'externalisons RIEN — webpack va tout bundler
        // (les modules @nextcloud/* sont petits, ça passe)
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            string_decoder: false,
            stream:         false,
            buffer:         false,
            util:           false,
            assert:         false,
        },
    },
    optimization: { minimize: true },
}
