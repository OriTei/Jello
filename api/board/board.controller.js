const boardService = require('./board.service.js')

const logger = require('../../services/logger.service')

async function getBoards(req, res) {
  const { userId } = req.query
  try {
    logger.debug('Getting Boards')
    console.log(userId)
    const boards = await boardService.query()
    res.json(boards)
  } catch (err) {
    logger.error('Failed to get boards', err)
    res
      .status(500)
      .send({ err: `Failed to get boards for user with id ${userId}` })
  }
}

async function getBoardById(req, res) {
  try {
    const boardId = req.params.id
    const board = await boardService.getById(boardId)

    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

async function getBoardMsgs(req, res) {
  console.log(req)
}

async function addBoard(req, res) {
  const { loggedinUser } = req

  try {
    const board = req.body
    const addedBoard = await boardService.add(board)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

async function updateBoard(req, res) {
  try {
    const board = req.body
    const updatedBoard = await boardService.update(board)
    return res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })
  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id
    await boardService.remove(boardId)
    res.send()
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}

async function updateBoardMsg(req, res) {
  const { loggedinUser } = req
  try {
    const boardId = req.params.id
    const { msgId } = req.params
    const msg = {
      id: msgId,
      txt: req.body.txt,
      by: loggedinUser,
    }
    const updatedMsg = await boardService.updateBoardMsg(msg, boardId)
    return res.json(updatedMsg)
  } catch (err) {
    console.log(err, 'cannot update board message right now')
  }
}
async function addBoardMsg(req, res) {
  const { loggedinUser } = req
  try {
    const boardId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await boardService.addBoardMsg(boardId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })
  }
}

async function removeBoardMsg(req, res) {
  try {
    const boardId = req.params.id
    const { msgId } = req.params

    const removedId = await boardService.removeBoardMsg(boardId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board msg', err)
    res.status(500).send({ err: 'Failed to remove board msg' })
  }
}

module.exports = {
  getBoards,
  getBoardMsgs,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addBoardMsg,
  removeBoardMsg,
  updateBoardMsg,
}
