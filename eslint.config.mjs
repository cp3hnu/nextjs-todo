import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    name: "import-sort",
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error", // 对 import 进行排序
      "simple-import-sort/exports": "error", // 对 export 进行排序（可选）
      "import/first": "error", // import 语句必须位于文件的顶部
      "import/newline-after-import": "error", // import 语句后必须换行
      "import/no-duplicates": "error", // 禁止出现重复的 import
    },
  },
];

export default eslintConfig;
