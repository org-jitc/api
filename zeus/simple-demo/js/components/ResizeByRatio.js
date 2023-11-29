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

        if(config.rootId != null){
            this.root = document.querySelector(`#${config.rootId}`);
        }else if(config.root != null){
            this.root = config.root;
        }else{
            this.root = document.documentElement;
        }

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
        
        if(this.#callbacks){
            this.#callbacks.forEach(callback => {
                callback(this.calculate());       
            });
        }
    }
    #calculateByWidth(){
        let clientWidth = this.root.clientWidth;
        let calHeight = parseInt(clientWidth / this.#data.ratios.x * this.#data.ratios.y);
        return {width: clientWidth, height: calHeight};
    }
    #calculateByHeight(){
        let clientHeight = this.root.clientHeight;
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
        return {width: sizesByWidth.width, height: sizesByHeight.height};
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