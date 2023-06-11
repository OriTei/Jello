const fs = require('fs')
const gBoards = require('../data/board.json')
module.exports = {
  query,
  getById,
  remove,
  save,
}

const PAGE_SIZE = 100

function query(filterBy = { txt: '', price: 0 }, paging = {}) {
  let { pageIdx, PAGE_SIZE } = paging

  const regex = new RegExp(filterBy.txt, 'i')
  var boards = gBoards.filter((board) => regex.test(board.name))
  if (filterBy.price) {
    boards = boards.filter((board) => {
      return board.price < filterBy.price
    })
  }

  if (pageIdx >= Math.ceil(boards.length / PAGE_SIZE)) {
    pageIdx = 0
  }
  if (pageIdx <= 0) {
    pageIdx = Math.ceil(boards.length / PAGE_SIZE) - 1
  }
  let startFrom = pageIdx * PAGE_SIZE
  boards = boards.slice(startFrom, startFrom + PAGE_SIZE)

  return Promise.resolve(boards)
}

function getById(boardId) {
  const board = gBoards.find((board) => board._id === boardId)
  if (!board) return Promise.reject('Unknonwn board')
  return Promise.resolve(board)
}

function remove(boardId, loggedinUser) {
  const idx = gBoards.findIndex((board) => board._id === boardId)
  if (idx === -1) return Promise.reject('Unknonwn board')
  //   if (gBoards[idx].owner._id !== loggedinUser._id)
  //     return Promise.reject('Not your board')

  gBoards.splice(idx, 1)
  return _saveBoardsToFile()
}

function save(board, loggedinUser) {
  var savedBoard
  if (board._id) {
    savedBoard = gBoards.find((currBoard) => currBoard._id === board._id)
    if (!savedBoard) return Promise.reject('Unknonwn board')
    // if (savedBoard.owner._id !== loggedinUser._id)
    // return Promise.reject('Not your board')

    savedBoard.name = board.name
    savedBoard.price = board.price
    savedBoard.labels = board.labels
    savedBoard.createdAt = board.createdAt
    savedBoard.inStock = board.inStock
  } else {
    savedBoard = {
      _id: _makeId(),
      owner: loggedinUser,
      name: board.name,
      price: board.price,
      labels: board.labels,
      createdAt: Date.now(),
      inStock: true,
    }
    gBoards.push(savedBoard)
  }
  return _saveBoardsToFile().then(() => {
    return savedBoard
  })
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveBoardsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gBoards, null, 2)

    fs.writeFile('data/board.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
