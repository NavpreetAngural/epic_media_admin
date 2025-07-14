import axios from 'axios';

// 👇 Create a loader element once and reuse
let loaderElement = document.createElement('div');
loaderElement.id = 'global-loader';
loaderElement.style.position = 'absolute';  // changed from fixed
loaderElement.style.top = '0';
loaderElement.style.left = '0';
loaderElement.style.width = '100%';
loaderElement.style.height = '100%';
loaderElement.style.background = 'rgba(255, 255, 255, 0.6)';
loaderElement.style.zIndex = '9999';
loaderElement.style.display = 'flex';
loaderElement.style.justifyContent = 'center';
loaderElement.style.alignItems = 'center';
loaderElement.style.fontSize = '24px';
loaderElement.innerHTML = `<div class="spinner"></div>`;
loaderElement.style.display = 'none'; // initially hidden
const container = document.getElementById('content-area');
if (container) {
  container.style.position = 'relative'; // parent ko relative position
  loaderElement.style.position = 'absolute'; // loader ko absolute
  container.appendChild(loaderElement);
}

// 👇 CSS for the spinner
const style = document.createElement('style');
style.innerHTML = `
  .spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #1890ff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// 👇 Functions to show/hide loader
let requestCount = 0;
const showLoader = () => {
  requestCount++;
  loaderElement.style.display = 'flex';
};

const hideLoader = () => {
  requestCount--;
  if (requestCount <= 0) {
    loaderElement.style.display = 'none';
    requestCount = 0;
  }
};

const axiosInstance = axios.create({
  baseURL: 'https://epic-media-backend.onrender.com/api'
});

axiosInstance.interceptors.request.use(
  (config) => {
    showLoader();
    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

export default axiosInstance;
