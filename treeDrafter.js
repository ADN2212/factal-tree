(function treeDrafter() {
  
  let dfsBtn = document.getElementById("dfs-btn");
  let bfsBtn = document.getElementById("bfs-btn");
  let counter = document.getElementById("counter");
  let plane = document.getElementById("plane");
  let planeContext = plane.getContext("2d");
  let levelNumber = document.getElementById("level-number")
  let colorChoocer = document.getElementById("color-choocer")


  const CONVERTER = (Math.PI / 180);//Para transformar a radianes 
  let level = 0;
  const radius = 20
  const large = 80
  let currentRadius = radius
  let currentLarge = large

  let pointsArray = []
  //Punto inicial (base del tronco) a mitad de la pantalla.
  let initailPoint = {
    x: plane.width / 2,
    y: plane.height,
    level: level
  }

  planeContext.strokeStyle = "green"
  planeContext.lineWidth = currentRadius



  //Para que empieze desde la parte mas alta del tronco.
  //initailPoint.y = initailPoint.y - currentLarge

  dfsBtn.addEventListener('click', () => {
    //console.log('Trazando en profundidad')

    resetVariables()
    //calculatePoints(parseInt(levelNumber.value), initailPoint)

    drawLine(
      initailPoint,
      {
        x: initailPoint.x,
        y: initailPoint.y - large
      }
    )

    calculatePoints(parseInt(levelNumber.value), {
      x: initailPoint.x,
      y: initailPoint.y - large
    })

    let i = 0;
    let intId = setInterval(() => {
      let currentPoint = pointsArray[i]
      if (i < pointsArray.length - 1) {
        if (currentPoint.lp) {
          drawLine(currentPoint, currentPoint.lp)
          counter.value = parseInt(counter.value) + 1
        }
        if (currentPoint.rp) {
          drawLine(currentPoint, currentPoint.rp)
          counter.value = parseInt(counter.value) + 1
        }
      } else {
        clearInterval(intId)
      }
      i += 1
    }, 100)
  }
  )

  bfsBtn.addEventListener('click', () => {
    //console.log('Trazando a lo ancho')
    resetVariables()

    drawLine(
      initailPoint,
      {
        x: initailPoint.x,
        y: initailPoint.y - large
      }
    )

    let levelNum = parseInt(levelNumber.value)

    calculatePoints(levelNum, {
      level: 0,
      x: initailPoint.x,
      y: initailPoint.y - large
    })

    let currentLevel = 0;
    let nodesAtCurrentLevel;
    let leftNode;
    let rigthNode;

    let intId = setInterval(() => {
      //Filtrar los nodos que estan en el nivel actual:
      nodesAtCurrentLevel = pointsArray.filter(node => node.level === currentLevel)
      //Si no hay nodos en el nivel actual es porque ya se sobrepasaron todos los niveles del arbol:
      //console.log(nodesAtCurrentLevel)
      if (nodesAtCurrentLevel.length === 0) {
        console.log("Stoped at level " + currentLevel)
        counter.value = parseInt(counter.value) - 1//Esto no beberia ser asi.
        clearInterval(intId)
        return
      }
      //De lo contrario trazamos todas las ramas que salen del nivel actual:
      for (let node of nodesAtCurrentLevel) {
        leftNode = node.lp
        rigthNode = node.rp
        if (leftNode) {
          drawLine(node, leftNode)
        }
        if (rigthNode) {
          drawLine(node, rigthNode)
        }
      }
      counter.value = parseInt(counter.value) + Math.pow(2, currentLevel)
      currentLevel += 1//pasamos al siguiente nivel.
    }, 500)
  })

  colorChoocer.addEventListener("change", () => {
    let selectedColor = colorChoocer.value
    console.log(`Cambió a ${selectedColor}.`)

    if (selectedColor === "verde") {
      planeContext.strokeStyle = "green"
    }

    if (selectedColor === "rojo") {
      planeContext.strokeStyle = "red"
    }

    if (selectedColor === "azul") {
      planeContext.strokeStyle = "blue"
    }

    if (selectedColor === "purpura") {
      planeContext.strokeStyle = "purple"
    }
  })

  function calculatePoints(times, basePoint) {

    pointsArray.push(basePoint)

    if (times === 0) {
      currentRadius = currentRadius * 2
      currentLarge = currentRadius * 4
      return
    }

    let cuurentPointIndex = pointsArray.indexOf(basePoint)
    let points = calculateNextPointsCoords(basePoint, 90, cuurentPointIndex)
    level += 1

    for (let p of points) {
      currentRadius = currentRadius / 2
      p.level = level
      p.r = currentRadius
      currentLarge = currentRadius * 4
      calculatePoints(times - 1, p)
    }

    currentRadius = currentRadius * 2
    currentLarge = currentRadius * 4
    level -= 1
    return

  }

  function drawLine(point1, point2) {
    //console.log(`Dibujando linea con radio = ${c} y largo = ${currentLarge}`)
    planeContext.lineWidth = point2.r
    planeContext.beginPath();
    planeContext.moveTo(point1.x, point1.y)
    planeContext.lineTo(point2.x, point2.y)
    planeContext.stroke()
  }

  function calculateNextPointsCoords(basePoint, angle) {

    let leftAngle = (3 / 2) * angle
    let rigthAngle = (1 / 2) * angle

    let rigthPoint = {
      x: basePoint.x + Math.cos(CONVERTER * rigthAngle) * currentLarge,
      y: (basePoint.y - Math.sin(CONVERTER * rigthAngle) * currentLarge) - currentLarge
    }

    let leftPoint = {
      x: basePoint.x + Math.cos(CONVERTER * leftAngle) * currentLarge,
      y: (basePoint.y - Math.sin(CONVERTER * leftAngle) * currentLarge) - currentLarge
    }

    //Como los JONs son valores por referencia esto no esta haciendo que se use memoria de mas.
    basePoint.lp = leftPoint
    basePoint.rp = rigthPoint

    return [leftPoint, rigthPoint]

  }

  function resetVariables() {
    //Devolver la variables a sus estados iniciales:
    planeContext.lineWidth = radius
    currentLarge = large
    currentRadius = radius
    initailPoint.rp = undefined
    initailPoint.lp = undefined
    pointsArray = []
    //Borrar lo dibujado antes de empezar a dibujar otra vez.
    planeContext.clearRect(0, 0, plane.width, plane.height)
    counter.value = 1
  }

})()