

//for undo and redo

const undobutton = document.getElementById('undo-btn');
const redobutton = document.getElementById('redo-btn');


//for theme change
const themeBtn = document.getElementById('theme-toggle');

//for canvas 
const canvasground = document.getElementById('drawing-board');


//for toolbox

const handtool = document.getElementById('cursor');
const alltools = document.querySelectorAll('#toolbar > button, .shape-grp > button, .brush-grp > button, #text-grp > button');


//for pop up mernus
const shapesbutton = document.getElementById('shapes-icon');
const shapesmenu = document.getElementById('shapes-popup');

const brushbutton = document.getElementById('brush');
const brushmenu = document.querySelector('.brush-popup');

const textbutton = document.getElementById('text');
const textmenu = document.querySelector('.text-popup');

const allmenus = [shapesmenu, brushmenu, textmenu];

//for image and eraser tool
const eraserbutton = document.getElementById('eraser');
const imagebutton = document.getElementById('image');

// for brush size and color and style
const sizeSlider = document.querySelector('.brush-popup input[type="range"]');
const sizeNumber = document.getElementById('brush-size');
const colorPicker = document.querySelector('.brush-popup input[type="color"]');

const brushStyle = document.getElementById('brush-styles');


// Sync the slider and number box together
sizeSlider.addEventListener('input', () => {
    sizeNumber.value = sizeSlider.value;
updateErasercursor()    ;
}); 


sizeNumber.addEventListener('input', () => { sizeSlider.value = sizeNumber.value; 
updateErasercursor()    ;
});





//theme change feature 

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle( 'dark-theme');
    const icon = themeBtn.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.className = 'ph ph-sun';
    } else {
        icon.className = 'ph ph-moon';
    }               
});






//closing the menu
function closeallMenus() {
    allmenus.forEach(menu => 
        
        {
        menu.classList.remove('show-popup');
    });
}

//tools features are here 

handtool.addEventListener('click', () => 
    {alltools.forEach(tool => {
        tool.classList.remove('selected-tool');
    });

    handtool.classList.add('selected-tool');
    canvasground.style.cursor = "grab";

    closeallMenus();
    console.log("Hand tool selected!");
});






    //shape button is  h ere

    shapesbutton.addEventListener('click', () => {alltools.forEach(tool => tool.classList.remove('selected-tool'));

    shapesbutton.classList.add('selected-tool');
    canvasground.style.cursor = "crosshair";

const isOpen = shapesmenu.classList.contains('show-popup');

closeallMenus();

if (!isOpen) {
        shapesmenu.classList.add('show-popup');
    }
});



//brush is here 

brushbutton.addEventListener('click', () => {alltools.forEach(tool => tool.classList.remove('selected-tool'));

  brushbutton.classList.add('selected-tool');
    selectedTool = "brush";
    canvasground.style.cursor = "crosshair";


const isOpen = brushmenu.classList.contains('show-popup');

closeallMenus();

if (!isOpen) {
        brushmenu.classList.add('show-popup');
    }
});


//text tool is here 



textbutton.addEventListener('click', () => {alltools.forEach(tool => tool.classList.remove('selected-tool'));


    selectedTool = "text";
    canvasground.style.cursor = "text";


    textbutton.classList.add('selected-tool');  
    const isOpen = textmenu.classList.contains('show-popup');

    closeallMenus();

    if (!isOpen) {
        textmenu.classList.add('show-popup');
    }
});




//for eraser

eraserbutton.addEventListener('click', () => {
    alltools.forEach(tool => tool.classList.remove('selected-tool'));
    eraserbutton.classList.add('selected-tool');

    selectedTool = "eraser";

    closeallMenus();

    updateErasercursor()    ;


    console.log("Eraser tool selected!");

});

//image tool ke liye 

imagebutton.addEventListener('click', () => {
    alltools.forEach(tool => tool.classList.remove('selected-tool'));
    imagebutton.classList.add('selected-tool');

    selectedTool = "image";

    closeallMenus();

    canvasground.style.cursor = "crosshair"
;

    const randomImageUrl = "https://picsum.photos/200/200?random=" + Math.random();

    console.log("Image tool selected!");


    console.log("Random Image URL:" + randomImageUrl);

});



//adding drawing features in shapes


const ctx = canvasground.getContext('2d');



let isDrawing = false;
let selectedTool = "circle";
let prevMouseX, prevMouseY;
let snapshot;
let undoArray = [];
let historyIndex = -1;
let isPanning = false;
let panX = 0, panY = 0;
let startPanX = 0, startPanY = 0;



const updateErasercursor = () => {
    if (selectedTool === "eraser") {
        const size = sizeSlider.value;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="none" stroke="#a0a0a0" stroke-width="1.5"/></svg>`;
        const cursorUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        
        canvasground.style.cursor = `url('${cursorUrl}') ${size/2} ${size/2}, crosshair`;
        
    }
}




const restoreCanvas = (dataurl) => {
    const img = new Image();
    img.src = dataurl;
    img.onload = () => {


ctx.globalCompositeOperation = "source-over";

        ctx.clearRect(0, 0, canvasground.width, canvasground.height);
     ctx.drawImage(img, 0, 0, canvasground.width, canvasground.height);
    };
}

const saveState = () => {
    if (historyIndex !== undoArray.length - 1) {
        undoArray.splice(historyIndex + 1);
    }
    const currentData = canvasground.toDataURL();   undoArray.push(currentData);
    historyIndex++;
    
    localStorage.setItem('canvasHistory', JSON.stringify(undoArray));
    localStorage.setItem('historyIndex', historyIndex);
}

window.addEventListener('load', () => {
    canvasground.width = canvasground.offsetWidth;
    
    
    canvasground.height = canvasground.offsetHeight;

    





    const savedHistory = JSON.parse(localStorage.getItem('canvasHistory'));
    const savedIndex = localStorage.getItem('historyIndex');

    if (savedHistory && savedHistory.length > 0) {
        undoArray = savedHistory;
        historyIndex = parseInt(savedIndex);
        restoreCanvas(undoArray[historyIndex]); 
    } else {
        saveState(); 
    }
});



undobutton.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        restoreCanvas(undoArray[historyIndex]);
     localStorage.setItem('historyIndex', historyIndex);
    }
});



redobutton.addEventListener('click', () => {
    if (historyIndex < undoArray.length - 1) { 
        historyIndex++;
        restoreCanvas(undoArray[historyIndex]);
        localStorage.setItem('historyIndex', historyIndex);
    }
});



//features for shape menu

const shapeButtons = document.querySelectorAll('#shapes-popup .sub-tools');

shapeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => 
        {

        selectedTool = e.currentTarget.innerText.trim().toLowerCase();
        
        console.log("Shape changed to: " + selectedTool);
        canvasground.style.cursor = "crosshair";

        closeallMenus();
    });
});

 //helper for drawing on canvas

//rectangle
const drawRect = (e) => {
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
//circle
const drawCircle = (e) => {
    ctx.beginPath();
let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));

    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

//triangle 

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); 
    ctx.lineTo(e.offsetX, e.offsetY);   
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); 
    ctx.closePath();
    ctx.stroke();
}
const drawArrow = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); 
    ctx.lineTo(e.offsetX, e.offsetY);
    const headlen = 15;
   const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX);

    ctx.lineTo(e.offsetX - headlen * Math.cos(angle - Math.PI / 6), e.offsetY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(e.offsetX, e.offsetY);



    ctx.lineTo(e.offsetX - headlen * Math.cos(angle + Math.PI / 6), e.offsetY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}


const drawStar = (e) => {
    let rot = Math.PI / 2 * 3;
    let x = prevMouseX;
    let y = prevMouseY;
    let step = Math.PI / 5;
    
    let outerRadius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    let innerRadius = outerRadius / 2;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.stroke();
}


const addText = (e) => 
    {
        const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "typing-box";
    textInput.placeholder = "Type and press Enter...";


    textInput.style.position = "fixed";
    textInput.style.left = e.clientX + "px";
    textInput.style.top = e.clientY + "px";
    textInput.style.zIndex = 1000;


    textInput.style.background = "transparent";
    textInput.style.outline = "none";
    textInput.style.border = "2px solid #007AFF";
    textInput.style.borderRadius = "4px";
    textInput.style.padding = "4px 8px";


    let fontSize = sizeSlider.value * 3;
    textInput.style.font = `${fontSize}px Arial`; 
    textInput.style.color = colorPicker.value;


    document.body.appendChild(textInput);
    textInput.focus();

    textInput.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Enter") {
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = colorPicker.value; 
            ctx.textBaseline = "top";


            ctx.fillText(textInput.value, e.offsetX, e.offsetY);

saveState();
            document.body.removeChild(textInput);
        }
    });
}
const textSubTools = document.querySelectorAll('.text-popup .sub-brush');

textSubTools.forEach(btn => {
    btn.addEventListener('click', (e) => {
        
        selectedTool = e.currentTarget.innerText.trim().toLowerCase();
        
        console.log("Writing tool changed to: " + selectedTool);
        canvasground.style.cursor = "crosshair"; 
        closeallMenus();
    });
});

const stampRandomImage = async (e) => { 
    
    
    const randomImageUrl = `https://picsum.photos/300/300?random=${Math.random()}`;
    console.log("Fetching new random image from: " + randomImageUrl);
    
    try {
        const response = await fetch(randomImageUrl); 
        const blob = await response.blob();
        const safeUrl = URL.createObjectURL(blob);
        const imgObj = new Image();
        
        imgObj.onload = () => {
            const size = imgObj.width;
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(imgObj, e.offsetX - size / 2, e.offsetY - size / 2, size, size);
            saveState();
            URL.revokeObjectURL(safeUrl);
        }; 
        imgObj.src = safeUrl;
    } catch (error) {
        console.error("image failed to load", error);
    }
}




//start drawing 

const startDraw = (e) => {
  

canvasground.setPointerCapture(e.pointerId);

    if (handtool.classList.contains('selected-tool')) {
        
        
        isPanning = true;
        startPanX = e.clientX - panX;
        startPanY = e.clientY - panY;
        canvasground.style.cursor = "grabbing";

        return; 
    }

    




if (selectedTool === "text") {
        addText(e);
        return; 
    }

if (selectedTool === "image") {
        stampRandomImage(e);
        return;
}


    isDrawing = true;
    if (selectedTool !== "eraser") {
canvasground.style.cursor = "crosshair";

    }
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;

    ctx.beginPath();
    ctx.lineWidth = sizeSlider.value;
    ctx.strokeStyle = colorPicker.value;

    ctx.globalCompositeOperation = "source-over";

    if (selectedTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"; 
        ctx.lineWidth = sizeSlider.value; 
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([]);
    }

else if (selectedTool === "pencil") {
        ctx.lineWidth = 1;          
        ctx.lineCap = "butt";       
        ctx.setLineDash([]);        
    } 
    else if (selectedTool === "pen") {
        ctx.lineWidth = 2;          
        ctx.lineCap = "round";      
        ctx.lineJoin = "round";
        ctx.setLineDash([]);        
    } 
    else  if (selectedTool === "brush") {
        
        ctx.lineWidth = sizeSlider.value;

 ctx.lineCap="round";
 ctx.lineJoin = "round";   

if (brushStyle.value === "dashed") {
        
        ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 3]);
    } else if (brushStyle.value === "dotted") {
        ctx.setLineDash([1, ctx.lineWidth * 2]);
    } 
    
    else {
        
        ctx.setLineDash([]);
    }
    }

    else {
        ctx.lineWidth = sizeSlider.value;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
         ctx.setLineDash([]);
    }
    snapshot = ctx.getImageData(0, 0, canvasground.width, canvasground.height);
}


const drawing = (e) => 
    
    {


        if (isPanning) {
        panX = e.clientX - startPanX;
        panY = e.clientY - startPanY;
        
        canvasground.style.transform = `translate(${panX}px, ${panY}px)`;
        return;
    }








    if (!isDrawing) return;



if  ( selectedTool ==="brush" || selectedTool === "pencil" || selectedTool === "pen"  || selectedTool === "eraser" ) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return ; 
}


    ctx.putImageData(snapshot, 0, 0);
    if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    } else if (selectedTool === "line") {
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if (selectedTool === "arrow") { 
        drawArrow(e);

    } 
    
else if (selectedTool === "star") { 
        drawStar(e);
}




    }

const stopDraw = (e) => 
    {




    if (e && e.pointerId) {
        canvasground.releasePointerCapture(e.pointerId);
    }
    if (isPanning) {

        isPanning = false;
        canvasground.style.cursor = "grab";
        return;
    }


        if (isDrawing) {
    isDrawing = false;
    saveState();
        }




    if (handtool.classList.contains('selected-tool')) {
        canvasground.style.cursor = "grab";

    } else  if (selectedTool === "eraser") {
        updateErasercursor()    ;

    }

    else {
        canvasground.style.cursor = "crosshair";
    }

    }

    canvasground.addEventListener('pointerdown', startDraw);
              canvasground.addEventListener('pointermove', drawing);
canvasground.addEventListener('pointerup', stopDraw);





