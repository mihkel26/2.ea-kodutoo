let playerName


/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.mistakes = 0
  this.combo = 0
  this.points = 0
  this.rightGuess = true;

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))
  },

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.points / 50)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter !== this.word.left.charAt(0)) {
      this.points = this.points*0.8
      this.mistakes += 1
      this.guessedWords = 0
      this.rightGuess = false
      //console.log(this.points)
      //console.log(this.mistakes)
      this.word.Draw()

      if (this.mistakes > 4) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.textAlign = 'center'
        this.ctx.font = '100px Arial'
        this.ctx.fillText("punktid: " + Math.round(typer.points),this.canvas.width / 2, 300)

        this.ctx.textAlign = 'center'
        this.ctx.font = '100px Courier'
        this.ctx.fillStyle = "red";
        this.ctx.fillText("Mäng läbi! Vajuta x, et alustada uuesti", this.canvas.width / 2, this.canvas.height / 2)
        if (letter === "x") {
          location.reload();
        }       

      }
      
    }

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()
      //console.log(this.points)

      if (this.word.left.length === 0) {
        this.guessedWords += 1
        
        if (this.guessedWords == 5){
          this.points = this.points*1.5
          this.guessedWords = 0

        }else{
          this.points += 10

        }

        this.generateWord()
      }

      this.word.Draw()
    }

    
  }
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.rightGuess) {
      this.ctx.fillStyle = 'black'
    } else {
      this.ctx.fillStyle = 'red'
    }

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)

    
	  this.ctx.textAlign = 'center'
    this.ctx.font = '100px Arial'
    this.ctx.fillText("punktid: " + Math.round(typer.points),this.canvas.width / 3, 300)
    
    this.ctx.textAlign = 'center'
    this.ctx.font = '100px Arial'
	  this.ctx.fillText("Vigu: " + Math.round(typer.mistakes),this.canvas.width / 1.5, 300)
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
    
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}


function startGame () {
  playerName = document.getElementById('playerName').value
  let x = document.getElementById("frontPage");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  const typer = new TYPER()
  window.typer = typer
}

window.onload = function () {
  startButton = document.getElementById('startButton')
  startButton.addEventListener('click', startGame)
}
