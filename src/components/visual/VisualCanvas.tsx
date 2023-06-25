import styles from "@/styles/components/visual/VisualCanvas.module.scss";
import {useEffect, useRef, useState} from "react";
import {useContent} from "@/hooks/ContentHook";
import {type Vector2} from "@/util/types";
import {convertToVector, drawComponent, drawComponentOutline, isMouseOverComponent} from "@/util/component";
import {useSettings} from "@/hooks/SettingsHook";


export default function VisualCanvas() {
    const [dragging, setDragging] = useState<string | undefined>();
    const [draggingOffset, setDraggingOffset] = useState<Vector2 | undefined>(); // The offset of the cursor from the bottom left of the component
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {selectedComponent, setSelectedComponent, images, setData, data} = useContent();
    const {items} = useSettings();
    const {debugFramesEnabled} = useSettings();

    /**
     * Draw all components on the canvas.
     */
    function drawComponents() {
        if (!data) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        // Ensure the canvas has been initialized (has a height and width)
        if (!canvas.height || !canvas.width) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (debugFramesEnabled) {
            // Draw a crosshair in the center of the canvas
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineTo(canvas.width / 2, canvas.height);
            context.moveTo(0, canvas.height / 2);
            context.lineTo(canvas.width, canvas.height / 2);
            context.strokeStyle = "red";
            context.stroke();
        }


        // Draw components
        data.components.forEach((component) => {
            // Draw the component
            drawComponent(component, canvas, images, items);
            drawComponentOutline(component, canvas, images, selectedComponent === component.id);
        });
    }

    /**
     * Handles the mouse down event.
     *
     * @param event The mouse event.
     */
    function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const canvas = canvasRef.current;
        if (!canvas || !data) {
            return;
        }

        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;
        const mouseVector: Vector2 = [mouseX, mouseY];

        // Loop through components and check if the mouse is inside one
        for (const component of data.components) {
            if (!isMouseOverComponent(component, canvas, mouseVector, images)) {
                continue;
            }

            // Enable dragging
            setDragging(component.id);
            setDraggingOffset([0, 0]);

            setSelectedComponent(component.id);
            return;
        }

        // Disable dragging
        setDragging(undefined);
        setSelectedComponent(undefined);
    }

    /**
     * Handles the mouse up event.
     *
     */
    function handleMouseUp() {
        if (!dragging) {
            return;
        }

        // Disable dragging
        setDragging(undefined);
    }

    /**
     * Handles the mouse move event.
     *
     * @param event The mouse event.
     */
    function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (!dragging || !data || !draggingOffset) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const mouseX = event.nativeEvent.offsetX - draggingOffset[0];
        const mouseY = event.nativeEvent.offsetY - draggingOffset[1];
        const component = data.components.find((component) => component.id === dragging);
        if (!component) {
            return;
        }

        const newVector = convertToVector(canvas, [mouseX, mouseY]);

        // Update component offset
        component.offset = [newVector[0], newVector[1], component.offset[2]];

        // Update data
        setData(currentData => {
            if (!currentData) {
                return currentData;
            }

            return {
                ...currentData,
                components: [
                    ...currentData.components.filter((c) => c.id !== component.id),
                    component
                ]
            };
        });

        drawComponents();
    }

    /**
     * Handles the mouse out event.
     *
     */
    function handleMouseOut() {
        // Disable dragging
        setDragging(undefined);
    }


    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        const minecraftiaFont = new FontFace(
            'Minecraftia',
            'url(/assets/Minecraft-Regular.ttf)'
        );

        minecraftiaFont.load().then((font) => {
            // Add font to document
            document.fonts.add(font);

            // Fix blurry canvas (add height and width attributes)
            canvas.height = canvas.offsetHeight;
            canvas.width = canvas.offsetWidth;

            // Set font
            context.font = "20px Minecraftia";
            context.fillStyle = "white";
            context.textAlign = "start";

            // Draw components
            drawComponents();

            console.log(`Canvas initialized with width ${canvas.width} and height ${canvas.height}`);
        }).catch(console.error);
    }, [canvasRef, canvasRef.current]);

    // Load the window resize event
    useEffect(() => {
        function handleResize() {
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }

            // Fix blurry canvas (add height and width attributes)
            canvas.height = canvas.offsetHeight;
            canvas.width = canvas.offsetWidth;

            drawComponents();
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    // Redraw components when data changes
    useEffect(() => {
        drawComponents();
    }, [data, selectedComponent, debugFramesEnabled]);

    return (
        <div className={styles.visualCanvas}>
            {
                data ? (
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onMouseOut={handleMouseOut}
                    />
                ) : (
                    <h1>
                        Loading...
                    </h1>
                )
            }
        </div>
    )
}