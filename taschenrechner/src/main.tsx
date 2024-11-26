import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { ConfigProvider } from 'antd'
import { theming } from '../theming.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ConfigProvider theme={theming?.antDesignTheme} componentSize='large'>
      <App />
     </ConfigProvider>
  </React.StrictMode>,
);