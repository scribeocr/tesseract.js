import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import webpackConfig from './webpack.config.prod.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiler = webpack(webpackConfig);
const app = express();

app.use(cors());
app.use(middleware(compiler, { publicPath: '/dist', writeToDisk: true }));

// These headers are required to measure memory within the benchmark code.
// If they are problematic within other contexts they can be removed.
app.use(express.static(path.resolve(__dirname, '..'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  },
}));

export default app.listen(3000, () => {
  console.log('Server is running on the port no. 3000');
});
