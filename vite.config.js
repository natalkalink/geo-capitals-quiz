import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@data': path.resolve(__dirname, './src/data'),
			'@assets': path.resolve(__dirname, './src/assets'),
		},
	},
});