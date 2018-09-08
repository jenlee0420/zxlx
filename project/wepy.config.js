const path = require('path');
const getLessVariables = require('./config/get-less-var')
var prod = process.env.NODE_ENV === 'production'
var lessVarPath = path.join(__dirname, 'src/styles/var.less')
module.exports = {
    wpyExt: '.wpy',
    build: {
        web: {
            htmlTemplate: path.join('src', 'index.template.html'),
            htmlOutput: path.join('web', 'index.html'),
            jsOutput: path.join('web', 'index.js')
        }
    },
    resolve: {
        alias: {
            counter: path.join(__dirname, 'src/components/counter'),
            '@': path.join(__dirname, 'src'),
            '@@': path.join(__dirname, 'src/components')
        },
        modules: ['node_modules']
    },
    eslint: false,
    compilers: {
        less: {
            compress: true,
            globalVars: getLessVariables(lessVarPath)
        },
        sass: {
          outputStyle: 'compressed'
        },
        babel: {
            sourceMap: true,
            presets: [
                'env'
            ],
            plugins: [
                'transform-class-properties',
                'transform-decorators-legacy',
                'transform-object-rest-spread',
                'transform-export-extensions',
            ]
        }
    },
    plugins: {
        /*'webpack-spritesmith': new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './src/images/icons'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './dist/sprites/sprite.png'),
                css: path.resolve(__dirname, './dist/sprites/sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: '/sprites/sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        })*/
    },
    appConfig: {
        noPromiseAPI: ['createSelectorQuery']
    }
}

if (prod) {

    delete module.exports.compilers.babel.sourcesMap;
    // 压缩sass
    module.exports.compilers['sass'] = {outputStyle: 'compressed'}

    // 压缩less
    module.exports.compilers['less'] = {compress: true}

    // 压缩js
    module.exports.plugins = {
        uglifyjs: {
            filter: /\.js$/,
            config: {}
        },
        imagemin: {
            filter: /\.(jpg|png|jpeg)$/,
            config: {
                jpg: {
                    quality: 80
                },
                png: {
                    quality: 80
                }
            }
        }
    }
}
