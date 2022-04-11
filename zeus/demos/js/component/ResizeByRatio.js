/**
 * config = {
 *  ratios: {
 *      x:,
 *      y:
 *  },
 *  callbacks: []
 * }
 */
class ResizeByRatio {
    #data;
    #callbacks;
    constructor(config) {
        this.#data = {
            ratios: {
                x: 16,
                y: 9
            }
        };

        if(config.ratios && config.ratios.x){
            this.#data.ratios.x = config.ratios.x;
        }

        if(config.ratios && config.ratios.y){
            this.#data.ratios.y = config.ratios.y;
        }

        if(config.callbacks){
            this.#callbacks = config.callbacks;
        }

        this.listenWindowResize();
    }
    onResize(){
        console.log('resize');
        
        if(this.#callbacks){
            this.#callbacks.forEach(callback => {
                callback(this.calculate());       
            });
        }
    }
    #calculateByWidth(){
        let clientWidth = document.documentElement.clientWidth;
        let calHeight = parseInt(clientWidth / this.#data.ratios.x * this.#data.ratios.y);
        return {width: clientWidth, height: calHeight};
    }
    #calculateByHeight(){
        let clientHeight = document.documentElement.clientHeight;
        let calWidth = parseInt(clientHeight / this.#data.ratios.y * this.#data.ratios.x);
        return {width: calWidth, height: clientHeight};
    }
    calculate(){
        let width, height;
        let sizesByWidth = this.#calculateByWidth();
        let sizesByHeight = this.#calculateByHeight();

        if(sizesByWidth.height > sizesByHeight.height){
            width = sizesByHeight.width;
            height = sizesByHeight.height;
        }else{
            width = sizesByWidth.width;
            height = sizesByWidth.height;
        }
        return {width: width, height: height};
    }
    listenWindowResize(){
        window.addEventListener('resize', this.onResize.bind(this));
    }
    setRatios(x, y){
        
        if(x){
            this.#data.ratios.x = x;
        }

        if(y){
            this.#data.ratios.y = y;
        }
    }
}