import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios';
import Cookie from 'js-cookie'
import {normalizeParams} from "@/utils/public.ts";

const isProd = import.meta.env.MODE === 'production';
const baseMap: Record<string, string> = {
    '/identityApi': import.meta.env.VITE_IDENTITY_API,
    '/groupApi': import.meta.env.VITE_GROUP_API,
    '/agentApi': import.meta.env.VITE_AGENT_API,
};

const instance:AxiosInstance = axios.create({
    baseURL:'',
    timeout:60000,
})


// post请求头
axios.defaults.headers.Accept = 'application/json'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'




// 请求拦截器
instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (isProd && config.url) {
            const matchedPrefix = Object.keys(baseMap).find(prefix =>
                config.url!.startsWith(prefix)
            );

            if (matchedPrefix) {
                const base = baseMap[matchedPrefix];
                config.baseURL = base;
                config.url = config.url.replace(matchedPrefix, ''); // 去掉前缀
            }
        }


        const token = Cookie.get('token')
        if(token){
            config.headers['authorization'] = `Bearer ${token}`
        }

        // 可以在此处添加请求头，例如 token
        const date = new Date().valueOf(); // 时间戳
        if (config.method === 'post') {
            if (config.data instanceof FormData) {
                config.data.append('timeStamp', date.toString())
            } else {
                config.data = {
                    ...config.data,
                    timeStamp: date,
                };
            }
        } else if (config.method === 'get') {
            config.params = {
                timeStamp: date,
                ...config.params,
            };
        }
        return config;
    },
    (error) => {
        // 请求错误处理
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    async (response: AxiosResponse) => {
        // 这里可以处理响应数据
        if (response.status === 200) {
            if (response.data.code === 403) {
                console.log(response.data.code)
            }
            return response;
        }
        return Promise.reject(response);
    },
    (error) => {
        // 错误处理（例如统一提示错误信息）
        if (error.response) {
            // 服务器返回的错误
            switch (error.response.status) {
                case 401:
                    // 未登陆，跳转到登录页等操作
                    window.location.href = `https://www.orientalsky.speedpower.net.cn/manage/agent/login?redirect=${encodeURIComponent(window.location.href)}`;
                    break;
                case 403:
                    // 权限不足
                    break;
                case 500:
                    // 服务器错误
                    break;
                default:
                    break;
            }
        } else if (error.request) {
            // 请求发出后没有收到响应
            console.error('Network error or no response received');
        } else {
            // 其他错误
            console.error('Error', error.message);
        }
        return Promise.reject(error);
    }
);

// 请求方法封装
function get<D, T = unknown>(url: string, params?: T , config?: AxiosRequestConfig): Promise<D> {
    return instance
    .get<D>(url, {
        params: normalizeParams(params),
        ...config
    },)
    .then((response) => response.data)
    .catch((error) => {
        console.error(error)
        throw error
    })
}

function post<D, T = unknown>(url: string, params?: T): Promise<D> {
    return instance
    .post(url, normalizeParams(params))
    .then((response) => response.data as D)
    .catch((error) => {
        console.error(error)
        throw error
    })
}

function axiosFormData<D>(url: string, formData: FormData,methods:'get'|'post'|'patch'='post'): Promise<D> {
    return instance[methods](url, formData)
    .then((response) => response.data as D)
    .catch((error) => {
        console.error(error)
        throw error
    })
}

function patch<D, T = unknown>(url: string, params?: T): Promise<D> {
    return instance
    .patch(url, normalizeParams(params))
    .then((response) => response.data as D)
    .catch((error) => {
        console.error(error)
        throw error
    })
}

function del<D, T = unknown>(url: string, params?: T): Promise<D> {
    return instance
    .delete(url, { data: normalizeParams(params) })
    .then((response) => response.data as D)
    .catch((error) => {
        console.error(error)
        throw error
    })
}

function put<D, T = unknown>(url: string, params?: T): Promise<D> {
    return instance
    .put<D>(url, normalizeParams(params))
    .then((response) => response.data)
    .catch((error) => {
        console.error(error);
        throw error;
    });
}

export default {get, post, axiosFormData, patch, del, put};


