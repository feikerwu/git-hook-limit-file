# 用于文件大小校验的 git-hook

### usage

```bash
npm install husky execa
```

在 package.json 上添加

```json
{
  "limit": {
    "size": 5, // 文件大小限制
    "reg": "(png|jpe?g|gif)$" // 要限制的文件类型
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run limit" // 跑这个脚本的位置
    }
  }
}
```
