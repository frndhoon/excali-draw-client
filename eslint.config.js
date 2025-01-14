import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import airbnb from 'eslint-config-airbnb';

export default [
  // ESLint 기본 추천 규칙 적용
  eslint.configs.recommended,

  // Airbnb 스타일 가이드 규칙 적용
  airbnb,

  // Prettier 규칙과 충돌하는 ESLint 규칙 비활성화
  prettier,

  {
    // JavaScript와 JSX 파일에 적용할 규칙 설정
    files: ['**/*.{js,jsx}'],

    // 사용할 플러그인 설정
    plugins: {
      react, // React 관련 규칙
      'react-hooks': reactHooks, // React Hooks 관련 규칙
    },

    // 세부 규칙 설정
    rules: {
      // React 17+ 버전에서는 import React 구문이 불필요하므로 비활성화
      'react/react-in-jsx-scope': 'off',

      // .js와 .jsx 파일 모두에서 JSX 문법 허용
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

      // Prettier 규칙 위반시 에러 표시
      'prettier/prettier': 'error',
    },

    // React 설정
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
  },
];
