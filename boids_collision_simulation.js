// This file expects a 'canvas' HTML element with id 'glcanvas'.

function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl'); // Initialize the GL context.

    // If we don't have a GL context, give up now.
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Set clear color to white, fully opaque.
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Clear the color buffer with specified clear color.
    gl.clear(gl.COLOR_BUFFER_BIT);
}

window.onload = main;