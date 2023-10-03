import path from 'path';
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 根据包名解析拼接包路径
export const resolvePkgPath = (pkgName, isDist) => {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  }
  return `${pkgPath}/${pkgName}`;
};

// 获取 package.json 对象
export const getPkgJson = pkgName => {
  // ...包路径
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const pkgJsonStr = fs.readFileSync(path, 'utf-8');
  return JSON.parse(pkgJsonStr);
};

// 获取基础 rollup 插件
export const getBaseRollupPlugins = ({ typescript = {} } = {}) => {
  return [cjs(), ts(typescript)];
};
