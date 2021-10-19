const { hostname } = require("os");
const { resolve, parse } = require("path");
const { readdirSync } = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin-next");
const WebpackMiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackCopyPlugin = require("copy-webpack-plugin");
const WebpackESLintPlugin = require("eslint-webpack-plugin");
const { name, version } = require("./package.json");

module.exports = ( env, options )=>{

	const IS_DEV = options.mode === "development";

	const SOURCE_PATH = resolve(__dirname, "source");
	const TEST_PATH = resolve(__dirname, "page-source");
	const BUILD_PATH = resolve(__dirname, "docs");

	const HOST = hostname().toLowerCase();

	const server = {
		allowedHosts: "all",
		client: {
			webSocketURL: {
				hostname: HOST
			},
			logging: "none"
		},
		compress: false,
		devMiddleware: {
			publicPath: "/",
			writeToDisk: true
		},
		historyApiFallback: true,
		host: HOST,
		hot: true,
		https: false,
		open: true,
		static: {
			directory: BUILD_PATH,
		}
	};

	const entries = {
		"index": "./source/index.js",
		"page-source": "./page-source/index.js"
	};

	const plugins = [
		new WebpackShellPlugin({
			onBeforeBuild: {
				scripts: [`rm -rf ${ BUILD_PATH }`],
				blocking: true,
				parallel: false
			},
			onBuildExit: {
				scripts: [`touch ${ BUILD_PATH }/.${ version }`],
				blocking: true,
				parallel: false
			}
		}),
		new WebpackCopyPlugin({
			patterns: [
				{ from: "page-source/assets/images", to: "./" },
				{ from: "page-source/assets/vendors", to: "./" }
			]
		}),
		new WebpackMiniCssExtractPlugin(),
		new HTMLWebpackPlugin({
			publicPath: "./",
			title: name,
			filename: "index.html",
			template: resolve(__dirname, "page-source/index.html"),
			meta: {
				viewport: "width=device-width, initial-scale=1"
			},
			excludeChunks: ["index"],
			minify: false,
			xhtml: true
		}),
		new WebpackESLintPlugin()
	];

	// if( IS_DEV ){

	// 	Object.assign(entries, {
	// 		test: "./test/test.js"
	// 	});

	// 	plugins.push(
	// 		new HTMLWebpackPlugin({
	// 			publicPath: "./",
	// 			title: name,
	// 			filename: "index.html",
	// 			template: resolve(__dirname, "test/index.html"),
	// 			chunks: ["test"]
	// 		})
	// 	);

	// }

	return {
		mode: options.mode,
		entry: entries,
		output: {
			path: BUILD_PATH,
			publicPath: "./",
			filename: "[name].js",
			assetModuleFilename: "[hash][ext][query]",
			library: {
				type: "umd",
				name: "Threadizer"
			}
		},
		resolve: {
			extensions: [".js", ".json"],
			alias: {
				"~": __dirname,
				"@": SOURCE_PATH,
				"†": TEST_PATH
			},
			fallback: {
				path: require.resolve("path-browserify")
			}
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules|worker/,
					use: [
						"babel-loader"
					]
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: [
						WebpackMiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								esModule: false
							}
						},
						"sass-loader"
					]
				},
				{
					test: /\.woff2/,
					type: "asset/resource"
				}
			]
		},
		target: "web",
		devServer: IS_DEV ? server : undefined,
		devtool: IS_DEV ? "source-map" : false,
		optimization: {
			minimize: !IS_DEV
		},
		plugins
	};

};
