// interceptors for request
axios.interceptors.request.use(function (config) {
    // before reqeust
    if(config.headers){
		config.headers['Cache-Control'] = 'no-cache'
	}
    return config;
}, function (error) {
	console.error(error);
    return Promise.reject(error);
});

// interceptors for response
axios.interceptors.response.use(function (response) {
	return response.data;
}, function (error) {
	console.error(error);
    return Promise.reject(error);
});