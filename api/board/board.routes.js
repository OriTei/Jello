const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getBoardMsgs,
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addBoardMsg,
  removeBoardMsg,
  updateBoardMsg,
} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:id', getBoardById)
router.post('/', addBoard)
router.put('/:id', updateBoard)
router.delete('/:id', removeBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)
router.get('/:id/msg', getBoardMsgs)
router.post('/:id/msg', addBoardMsg)
router.put('/:id/msg/:msgId', updateBoardMsg)
router.delete('/:id/msg/:msgId', removeBoardMsg)

module.exports = router
