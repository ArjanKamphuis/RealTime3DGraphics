class CubeTexture {
    constructor(gl, source) {
        this.gl = gl;
        this.glTexture = gl.createTexture();

        if (source) {
            this.loadCubeFaces(source);
        }
    }
    
    loadCubeFaces(source) {
        const { gl, glTexture } = this;
        const directions = ['POSITIVE', 'NEGATIVE'];
        const axis = ['X', 'Y', 'Z'];

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        for (let j = 0; j < axis.length; j++) {
            for (let i = 0; i < directions.length; i++) {
                const target = gl[`TEXTURE_CUBE_MAP_${directions[i]}_${axis[j]}`];
                const url = `${source}${directions[i].toLowerCase()}-${axis[j].toLowerCase()}.png`;
                this.loadCubemapFace(target, url);
            }
        }

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

    loadCubemapFace(target, url) {
        const { gl, glTexture } = this;
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 512;
        const height = 512;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;

        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
        
        const image = new Image();
        image.src = url;
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);
            gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }
    }
}