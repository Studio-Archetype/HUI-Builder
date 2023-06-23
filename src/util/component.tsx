import {
    BoundingBox2,
    HoloUIButtonData,
    HoloUIComponent,
    HoloUIDecorationData,
    HoloUIItemIcon,
    HoloUITextIcon,
    HoloUITextImageIcon,
    HoloUIToggleData,
    ImageData,
    MCItem,
    Vector2
} from "@/util/types";

const offsetValueX = 7;
const offsetValueY = 5;

const itemHeight = 24;
const itemWidth = 24;

/**
 * Draws text on a canvas, with the center of the text at the vector.
 *
 * @param canvas the canvas
 * @param text the text
 * @param vector the vector
 */
export default function drawText(canvas: HTMLCanvasElement, text: string, vector: Vector2) {
    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }

    const canvasVector = convertToCanvasLocation(canvas, vector);
    const x = canvasVector[0];
    const y = canvasVector[1];

    context.fillText(text, x, y);
}

/**
 * Draws an image on a canvas, with the center of the image at the vector.
 *
 * @param canvas the canvas
 * @param image the image
 * @param vector the vector
 * @param width the width
 * @param height the height
 */
export function drawImage(canvas: HTMLCanvasElement, image: string, vector: Vector2, width?: number, height?: number) {
    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }

    const canvasVector = convertToCanvasLocation(canvas, vector);
    const x = canvasVector[0];
    const y = canvasVector[1];
    const imageElement = new Image();
    imageElement.src = image;

    imageElement.onload = () => {
        const imageWidth = width || imageElement.width;
        const imageHeight = height || imageElement.height;

        context.drawImage(imageElement, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
    }
}


/**
 * Converts a vector to a canvas location. ([0,0] and [-7, -5] is bottom left)
 *
 * @param canvas the canvas
 * @param vector the vector
 */
export function convertToCanvasLocation(canvas: HTMLCanvasElement, vector: Vector2): Vector2 {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const x = (vector[0] + offsetValueX) / (offsetValueX * 2) * canvasWidth;
    const y = (vector[1] + offsetValueY) / (offsetValueY * 2) * canvasHeight;

    return [x, y];
}

/**
 * Converts a canvas location to a vector. ([0,0] and [-7, -5] is bottom left)
 *
 * @param canvas the canvas
 * @param vector the vector
 * @returns the vector
 */
export function convertToVector(canvas: HTMLCanvasElement, vector: Vector2): Vector2 {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const x = (vector[0] / canvasWidth) * (offsetValueX * 2) - offsetValueX;
    const y = (vector[1] / canvasHeight) * (offsetValueY * 2) - offsetValueY;

    return [x, y];
}

/**
 * Gets the bounding box of a text.
 *
 * @param canvas the canvas
 * @param vector the vector
 * @param width the width
 * @param height the height
 */
export function getTextBoundingBox(canvas: HTMLCanvasElement, vector: Vector2, width: number, height: number): BoundingBox2 {
    const canvasVector = convertToCanvasLocation(canvas, vector);
    const x = canvasVector[0];
    const y = canvasVector[1];

    return {
        min: [x, y - height],
        max: [x + width, y]
    };
}

/**
 * Gets the bounding box of an image.
 *
 * @param canvas the canvas
 * @param vector the vector
 * @param width the width
 * @param height the height
 */
export function getImageBoundingBox(canvas: HTMLCanvasElement, vector: Vector2, width: number, height: number): BoundingBox2 {
    const canvasVector = convertToCanvasLocation(canvas, vector);
    const x = canvasVector[0];
    const y = canvasVector[1];

    const minX = Math.min(x - width / 2, x + width / 2);
    const maxX = Math.max(x - width / 2, x + width / 2);
    const minY = Math.min(y - height / 2, y + height / 2);
    const maxY = Math.max(y - height / 2, y + height / 2);

    return {
        min: [minX, minY],
        max: [maxX, maxY]
    };
}

/**
 * Checks if the mouse is in a bounding box of a component.
 *
 * @param component the component
 * @param canvas the canvas
 * @param mouseVector the mouse vector
 * @param images the images
 */
export function isMouseOverComponent(component: HoloUIComponent, canvas: HTMLCanvasElement, mouseVector: Vector2, images: ImageData[]): boolean {
    let icon = component.data.type === 'button' || component.data.type === 'decoration' ?
        (component.data as (HoloUIDecorationData | HoloUIButtonData)).icon :
        (component.data as HoloUIToggleData).trueIcon;
    if (!icon) {
        return false;
    }

    const componentVector: Vector2 = [component.offset[0], component.offset[1]];
    if (icon.type === 'textImage') {
        // Get the width and height of the image
        const imagePath = (icon as HoloUITextImageIcon).path; // Basically the id of the image
        // Ensure the image exists
        if (!imagePath) {
            return false;
        }

        const image = images.find(image => image.id === imagePath);
        if (!image) {
            return false;
        }

        // Get the image from the image manager
        const imgBase64 = image.base64;
        const img = new Image();

        img.src = imgBase64;

        // Get the width and height of the image
        const width = img.width;
        const height = img.height;

        // Get the bounding box of the image
        const boundingBox = getImageBoundingBox(canvas, componentVector, width, height);

        // Check if the mouse is in the bounding box
        return isMouseInBoundingBox(boundingBox, mouseVector);
    }

    if (icon.type === 'item') {
        const boundingBox = getImageBoundingBox(canvas, componentVector, itemWidth, itemHeight);

        return isMouseInBoundingBox(boundingBox, mouseVector);
    }


    // Assume text, as it is the only type left
    const text = (icon as HoloUITextIcon).text;
    if (!text) {
        return false;
    }

    const context = canvas.getContext('2d');
    if (!context) {
        return false;
    }

    const textMetrics = context.measureText(text);
    const width = textMetrics.width;
    const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const boundingBox = getTextBoundingBox(canvas, componentVector, width, height);

    // Draw bounding box
    context.beginPath();
    context.rect(boundingBox.min[0], boundingBox.min[1], boundingBox.max[0] - boundingBox.min[0], boundingBox.max[1] - boundingBox.min[1]);
    context.stroke();

    return isMouseInBoundingBox(boundingBox, mouseVector);
}

/**
 * Checks if the mouse is in a bounding box.
 *
 * @param boundingBox  the bounding box
 * @param mouseVector the mouse vector
 */
export function isMouseInBoundingBox(boundingBox: BoundingBox2, mouseVector: Vector2): boolean {
    const x = mouseVector[0];
    const y = mouseVector[1];

    const minX = boundingBox.min[0];
    const maxX = boundingBox.max[0];
    const minY = boundingBox.min[1];
    const maxY = boundingBox.max[1];

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

/**
 * Draws a component on a canvas.
 *
 * @param component the component to draw
 * @param canvas the canvas to draw on
 * @param images the images to use
 * @param items the items to use
 */
export function drawComponent(component: HoloUIComponent, canvas: HTMLCanvasElement, images: ImageData[], items: MCItem[]): void {
    let icon = component.data.type === 'button' || component.data.type === 'decoration' ?
        (component.data as (HoloUIDecorationData | HoloUIButtonData)).icon :
        (component.data as HoloUIToggleData).trueIcon;
    if (!icon) {
        return;
    }

    // Get the offset
    const offset: Vector2 = [component.offset[0], component.offset[1]];

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    if (icon.type === 'textImage') {
        const imagePath = (icon as HoloUITextImageIcon).path; // Basically the id of the image
        // Ensure the image exists
        if (!imagePath) {
            return;
        }

        const image = images.find(image => image.id === imagePath);
        if (!image) {
            return;
        }

        // Get the image from the image manager
        const imgBase64 = image.base64;

        // Draw the image on the canvas
        drawImage(
            canvas,
            imgBase64,
            offset,
            itemWidth,
            itemHeight
        );
        return;
    }

    if (icon.type === 'item') {
        if (!items) {
            return;
        }

        const item = (icon as HoloUIItemIcon).item;
        const itemInfo = items.find(itemInfo => itemInfo.name === item);
        if (!itemInfo) {
            return;
        }

        const imgTexture = itemInfo.texture;
        // Ensure the image exists
        if (!imgTexture) {
            return;
        }

        // Draw the image on the canvas
        drawImage(
            canvas,
            imgTexture,
            offset,
            itemWidth,
            itemHeight
        );
        return;
    }

    // Assume text, as it is the only type left
    const text = (icon as HoloUITextIcon).text;

    // Draw the text on the canvas
    drawText(
        canvas,
        text,
        offset
    );
}

/**
 * Draws the outline of a component on a canvas.
 *
 * @param component the component to draw
 * @param canvas the canvas to draw on
 * @param images the images to use
 * @param isSelected whether the component is selected
 */
export function drawComponentOutline(component: HoloUIComponent, canvas: HTMLCanvasElement, images: ImageData[], isSelected: boolean): void {
    let icon = component.data.type === 'button' || component.data.type === 'decoration' ?
        (component.data as (HoloUIDecorationData | HoloUIButtonData)).icon :
        (component.data as HoloUIToggleData).trueIcon;
    if (!icon) {
        return;
    }

    // Get the offset
    const offset: Vector2 = [component.offset[0], component.offset[1]];

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    if (icon.type === 'textImage') {
        const imagePath = (icon as HoloUITextImageIcon).path; // Basically the id of the image
        // Ensure the image exists
        if (!imagePath) {
            return;
        }

        const image = images.find(image => image.id === imagePath);
        if (!image) {
            return;
        }

        // Get the image from the image manager
        const imgBase64 = image.base64;
        const img = new Image();

        img.src = imgBase64;

        // Get the width and height of the image
        const width = img.width;
        const height = img.height;
        // Get the bounding box of the image
        const boundingBox = getImageBoundingBox(canvas, offset, width, height);

        // Draw bounding box (Green if selected, red if not)
        ctx.strokeStyle = isSelected ? 'green' : 'white';
        ctx.beginPath();
        ctx.rect(boundingBox.min[0], boundingBox.min[1], boundingBox.max[0] - boundingBox.min[0], boundingBox.max[1] - boundingBox.min[1]);
        ctx.stroke();

        // Draw the component id left above the component
        drawComponentName(boundingBox, canvas, component.id);
        return;
    }

    if (icon.type === 'item') {
        const boundingBox = getImageBoundingBox(canvas, offset, itemWidth, itemHeight);

        // Draw bounding box (Green if selected, red if not)
        ctx.strokeStyle = isSelected ? 'green' : 'white';
        ctx.beginPath();
        ctx.rect(boundingBox.min[0], boundingBox.min[1], boundingBox.max[0] - boundingBox.min[0], boundingBox.max[1] - boundingBox.min[1]);
        ctx.stroke();

        // Draw the component id left above the component
        drawComponentName(boundingBox, canvas, component.id);
        return;
    }

    // Assume text, as it is the only type left
    const text = (icon as HoloUITextIcon).text;
    if (!text) {
        return;
    }

    const textMetrics = ctx.measureText(text);
    const width = textMetrics.width;
    const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    // Get the bounding box of the text
    const boundingBox = getTextBoundingBox(canvas, offset, width, height);

    // Draw bounding box (Green if selected, red if not)
    ctx.strokeStyle = isSelected ? 'green' : 'white';
    ctx.beginPath();
    ctx.rect(boundingBox.min[0], boundingBox.min[1], boundingBox.max[0] - boundingBox.min[0], boundingBox.max[1] - boundingBox.min[1]);
    ctx.stroke();

    // Draw the component id left above the component
    drawComponentName(boundingBox, canvas, component.id);
}

export function drawComponentName(boundingBox: BoundingBox2, canvas: HTMLCanvasElement, name: string): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    const maxWith = boundingBox.max[0] - boundingBox.min[0] + 40;

    // Make sure the text doesn't go far outside the component (Otherwise it will be hard to read with multiple components)
    if (ctx.measureText(name).width > maxWith) {
        while (ctx.measureText(name).width > maxWith) {
            name = name.substring(0, name.length - 1);
        }
    }


    // Draw the component id left above the component
    ctx.fillStyle = 'white';
    ctx.font = '10px Minecraftia';
    ctx.fillText(name, boundingBox.min[0], boundingBox.min[1] - 5);
    ctx.font = '20px Minecraftia';
}