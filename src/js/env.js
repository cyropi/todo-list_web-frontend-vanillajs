const isLocal = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';


export const ENV =
{
    API_URL: isLocal ? "http://localhost:3000"
                     : "https://api.com"
};
