import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import './index.css'
import App from './App.tsx'
import {createTheme, ThemeProvider} from "@mui/material";
import {Provider} from 'react-redux'
import {store} from '@/store/index.ts'
import "@/assets/iconfont/iconfont.css"
import '@/i18n/index.tsx'

const theme = createTheme({
    components: {
        // 核心修复点：精确覆盖输入框
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '16px', // 根元素字体
                },
                input: {
                    fontSize: '16px', // 输入框内部字体
                },
            },
        },
        MuiFormHelperText:{
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    marginLeft: 0,
                    marginRight: 0
                },
            },
        },
        // 标签字体
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '16px',
                },
            },
        },
        // 覆盖 Select 输入框的字体
        MuiSelect: {
            styleOverrides: {
                select: { // 直接控制选择框的文本
                    fontSize: '16px',
                    '&.MuiInput-input': {
                        fontSize: '16px', // 明确指定输入部分
                    },
                },
            },
        },
        // 覆盖下拉菜单中的选项字体
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '16px', // 下拉选项字体
                    '&.Mui-selected': { // 选中状态的选项
                        fontSize: '16px',
                    },
                    '&.MuiListSubheader-root':{
                        fontsize: '14px',
                    },
                    '&.MuiMenuItem-root':{
                        fontSize: '16px',
                        'em':{
                            fontSize: '16px',

                        }
                    }
                },
            },
        },
        // 日历弹窗字体
        MuiDateCalendar: {
            styleOverrides: {
                root: {
                    '& .MuiTypography-root': {
                        fontSize: '16px', // 标题和星期
                    },
                    '& .MuiPickersDay-root': {
                        fontSize: '16px', // 日期按钮
                    },
                    '.MuiPickersCalendarHeader-label':{
                        fontSize: '16px', // 日期按钮
                    }
                },
            },
        },
        // 备用方案：通过 TextField 覆盖
        MuiPickersInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '16px', // 日期按钮
                },
            },
        },
    },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter basename={import.meta.env.VITE_BASE}>
          <ThemeProvider theme={theme}>
              <Provider store={store}>
                  <App />
              </Provider>
          </ThemeProvider>
      </BrowserRouter>
  </StrictMode>,
)
