# 项目静态资源管理系统

一个现代化的项目静态资源管理系统，用于管理和维护项目中的图标资源。使用 Vue 3 + TypeScript + Element Plus 构建，提供直观的用户界面和完善的资源管理功能。

## 功能特性

- 📁 项目管理
  - 创建、编辑、删除项目
  - 设置项目存储根目录
  - 项目列表查看和搜索
- 🖼️ 图标管理
  - 上传和更新图标
  - 图标版本历史记录
  - 支持图标回滚
  - 图标预览和删除
- 🎨 现代化UI
  - 响应式设计
  - 暗色主题支持
  - 友好的用户交互
- 🛠️ 开发体验
  - TypeScript 类型支持
  - 模拟数据支持
  - 代码规范和格式化

## 技术栈

- 前端框架：Vue 3
- 开发语言：TypeScript
- UI 组件库：Element Plus
- 构建工具：Vite
- 路由：Vue Router
- HTTP 客户端：Axios
- 样式解决方案：UnoCSS + SCSS
- 开发工具：
  - ESLint (代码检查)
  - Prettier (代码格式化)
  - MSW (API 模拟)

## 开发环境要求

- Node.js >= 18
- pnpm >= 9.15.0

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/ruancong/projects-icons-manager.git
cd projects-icons-manager
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 项目结构

```
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口和 Mock 数据
│   ├── components/        # 公共组件
│   ├── composables/       # 组合式函数
│   ├── pages/             # 页面组件
│   ├── styles/            # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── .env                   # 环境变量
├── .eslintrc.json        # ESLint 配置
├── .prettierrc.json      # Prettier 配置
├── tsconfig.json         # TypeScript 配置
├── uno.config.ts         # UnoCSS 配置
└── vite.config.ts        # Vite 配置
```

## 环境变量配置

项目支持以下环境变量配置：

- `VITE_BASE_URL`: 应用的基础URL
- `VITE_API_BASE_URL`: API的基础URL
- `NODE_ENV`: 运行环境（development/production）

## 开发规范

- 遵循 TypeScript 类型定义规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 组件和函数使用组合式API（Composition API）
- 使用 UnoCSS 进行样式开发

 
